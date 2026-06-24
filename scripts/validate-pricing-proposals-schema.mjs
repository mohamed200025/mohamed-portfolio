#!/usr/bin/env node
/**
 * Validates public.pricing_proposals columns against buildProposalRecord() fields.
 * Uses DATABASE_URL (information_schema) and/or Supabase REST column probe.
 */

import { readFileSync, existsSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import { createClient } from "@supabase/supabase-js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");

const BUILD_PROPOSAL_RECORD_COLUMNS = [
  "proposal_id",
  "status",
  "client_name",
  "client_full_name",
  "phone",
  "phone_number",
  "email",
  "company_name",
  "country",
  "project_name",
  "project_description",
  "category_id",
  "industry_id",
  "target_audience",
  "selected_services",
  "optional_features",
  "number_of_pages",
  "complexity_level",
  "complexity_score",
  "timeline",
  "estimated_duration",
  "currency",
  "price_breakdown",
  "subtotal",
  "final_price",
  "pdf_storage_path",
  "pdf_public_url",
  "client_metadata",
];

function loadEnvLocal() {
  const envPath = resolve(root, ".env.local");
  if (!existsSync(envPath)) return {};
  const vars = {};
  for (const line of readFileSync(envPath, "utf8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    vars[trimmed.slice(0, eq)] = trimmed.slice(eq + 1).replace(/^["']|["']$/g, "");
  }
  return vars;
}

async function validateViaPg(databaseUrl) {
  let pg;
  try {
    pg = await import("pg");
  } catch {
    return null;
  }

  const client = new pg.default.Client({
    connectionString: databaseUrl,
    ssl: { rejectUnauthorized: false },
  });

  try {
    await client.connect();
    const { rows } = await client.query(
      `select column_name, data_type, udt_name
       from information_schema.columns
       where table_schema = 'public' and table_name = 'pricing_proposals'
       order by ordinal_position`,
    );
    const columnSet = new Set(rows.map((r) => r.column_name));
    const missing = BUILD_PROPOSAL_RECORD_COLUMNS.filter((c) => !columnSet.has(c));
    const present = BUILD_PROPOSAL_RECORD_COLUMNS.filter((c) => columnSet.has(c));
    return { source: "information_schema", rows, present, missing, ok: missing.length === 0 };
  } finally {
    await client.end();
  }
}

async function validateViaSupabase(url, anon) {
  const supabase = createClient(url, anon, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const missing = [];
  const present = [];

  for (const col of BUILD_PROPOSAL_RECORD_COLUMNS) {
    const r = await supabase.from("pricing_proposals").select(col).limit(0);
    if (r.error?.code === "42703" || r.error?.code === "PGRST204") {
      missing.push(col);
    } else {
      present.push(col);
    }
  }

  return { source: "postgrest", present, missing, ok: missing.length === 0 };
}

async function main() {
  const env = { ...process.env, ...loadEnvLocal() };
  const databaseUrl = env.DATABASE_URL || env.SUPABASE_DB_URL;
  const url = env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  console.log("=== pricing_proposals schema validation ===\n");
  console.log("Fields required by buildProposalRecord():");
  console.log(`  ${BUILD_PROPOSAL_RECORD_COLUMNS.join(", ")}\n`);

  let result = null;

  if (databaseUrl) {
    result = await validateViaPg(databaseUrl);
    if (result) {
      console.log("Source: information_schema (DATABASE_URL)");
      console.log("Present:", result.present.join(", ") || "(none)");
      if (result.missing.length) {
        console.log("Missing:", result.missing.join(", "));
      }
      console.log(result.ok ? "\nPASS: All buildProposalRecord columns exist." : "\nFAIL: Missing columns.");
    }
  }

  if (url && anon) {
    const rest = await validateViaSupabase(url, anon);
    console.log("\nSource: PostgREST (anon key)");
    console.log("Present:", rest.present.join(", ") || "(none)");
    if (rest.missing.length) {
      console.log("Missing:", rest.missing.join(", "));
    }
    console.log(rest.ok ? "PASS: PostgREST exposes all columns." : "FAIL: PostgREST missing columns (reload schema cache).");

    if (!result) result = rest;
    else if (!rest.ok) result = { ...result, postgrestOk: false };
    else result = { ...result, postgrestOk: true };
  }

  if (!result) {
    console.error("Set DATABASE_URL or Supabase URL/anon key in .env.local");
    process.exit(1);
  }

  process.exit(result.ok && result.postgrestOk !== false ? 0 : 1);
}

main();

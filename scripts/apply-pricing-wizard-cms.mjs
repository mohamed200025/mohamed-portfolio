#!/usr/bin/env node
/**
 * Applies wizard pricing CMS migrations.
 * Set DATABASE_URL in .env.local, then: node scripts/apply-pricing-wizard-cms.mjs
 */

import { readFileSync, existsSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");

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

async function main() {
  const env = { ...process.env, ...loadEnvLocal() };
  const databaseUrl = env.DATABASE_URL || env.SUPABASE_DB_URL;
  const files = ["supabase/migrations/20250624_pricing_wizard_cms.sql"];

  if (!databaseUrl) {
    console.log("DATABASE_URL not set. Apply manually in Supabase SQL Editor:");
    for (const f of files) console.log(`  ${f}`);
    process.exit(0);
  }

  const pg = await import("pg");
  const client = new pg.default.Client({
    connectionString: databaseUrl,
    ssl: { rejectUnauthorized: false },
  });

  await client.connect();
  for (const file of files) {
    const sql = readFileSync(resolve(root, file), "utf8");
    console.log("Applying", file);
    await client.query(sql);
  }
  await client.end();
  console.log("Wizard pricing CMS migration applied.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

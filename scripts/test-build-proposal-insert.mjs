#!/usr/bin/env node
/**
 * Real insert test using the same column shape as buildProposalRecord().
 */
import { readFileSync, existsSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import { createClient } from "@supabase/supabase-js";

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

const env = { ...process.env, ...loadEnvLocal() };
const url = env.NEXT_PUBLIC_SUPABASE_URL;
const anon = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!url || !anon) {
  console.error("Missing Supabase URL or anon key in .env.local");
  process.exit(1);
}

const supabase = createClient(url, anon, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const proposalId = `MO-2026-${String(Math.floor(100000 + Math.random() * 900000))}`;
const fullName = "Build Record Test";
const phone = "+213 612345678";

// Mirrors buildProposalRecord() after legacy column mapping
const record = {
  proposal_id: proposalId,
  status: "pending",
  client_name: fullName,
  client_full_name: fullName,
  phone,
  phone_number: phone,
  email: "build-record-test@local.test",
  company_name: "Test Co",
  country: "DZ",
  project_name: "Insert verification",
  project_description: "Confirms buildProposalRecord column mapping",
  category_id: "website",
  industry_id: "education",
  target_audience: "Students",
  selected_services: [{ id: "pages-1-5", label: "1–5 Pages", amount: 500 }],
  optional_features: [],
  number_of_pages: "1–5 Pages",
  complexity_level: "standard",
  complexity_score: 2,
  timeline: "standard",
  estimated_duration: "4 weeks",
  currency: "EUR",
  price_breakdown: [{ id: "pages-1-5", label: "1–5 Pages", amount: 500 }],
  subtotal: 500,
  final_price: 500,
  pdf_storage_path: null,
  pdf_public_url: null,
  client_metadata: { source: "insert-test" },
};

console.log("=== buildProposalRecord insert test ===\n");
console.log("proposal_id:", proposalId);

const insertResult = await supabase.from("pricing_proposals").insert(record);
if (insertResult.error) {
  console.error("INSERT FAILED:", JSON.stringify(insertResult.error, null, 2));
  process.exit(1);
}

console.log("INSERT OK — status", insertResult.status);

// Verify row exists (service role would be needed for anon SELECT; probe via insert uniqueness)
const dupCheck = await supabase
  .from("pricing_proposals")
  .select("proposal_id")
  .eq("proposal_id", proposalId)
  .maybeSingle();

console.log("anon SELECT by proposal_id:", dupCheck.data ?? "(no row visible — expected under SELECT RLS)");
console.log("\nPASS: Row written (insert returned 201).");

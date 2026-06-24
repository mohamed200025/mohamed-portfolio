#!/usr/bin/env node
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

console.log("=== Supabase pricing_proposals diagnostic ===\n");
console.log("1. Environment");
console.log("   NEXT_PUBLIC_SUPABASE_URL:", url ? `${url.slice(0, 36)}...` : "MISSING");
console.log("   NEXT_PUBLIC_SUPABASE_ANON_KEY:", anon ? `present (len=${anon.length})` : "MISSING");
console.log("   SUPABASE_SERVICE_ROLE_KEY:", env.SUPABASE_SERVICE_ROLE_KEY ? "present" : "missing");

if (!url || !anon) {
  console.error("\nFAIL: Supabase URL or anon key not loaded.");
  process.exit(1);
}

const supabase = createClient(url, anon, {
  auth: { persistSession: false, autoRefreshToken: false },
  db: { schema: "public" },
});

console.log("\n2. Column probe — SELECT each expected column");
const expectedColumns = [
  "id", "proposal_id", "status", "client_full_name", "phone_number", "email",
  "company_name", "country", "project_name", "project_description", "category_id",
  "industry_id", "target_audience", "selected_services", "optional_features",
  "number_of_pages", "complexity_level", "complexity_score", "timeline",
  "estimated_duration", "currency", "price_breakdown", "subtotal", "final_price",
  "pdf_storage_path", "pdf_public_url", "client_metadata", "read", "created_at",
];
const missing = [];
const present = [];
for (const col of expectedColumns) {
  const r = await supabase.from("pricing_proposals").select(col).limit(0);
  if (r.error?.code === "42703" || r.error?.message?.includes("column")) {
    missing.push(col);
  } else if (r.error?.code === "PGRST204") {
    missing.push(`${col} (PGRST204)`);
  } else {
    present.push(col);
  }
}
console.log("   present:", present.join(", ") || "(none)");
console.log("   missing/unknown:", missing.join(", ") || "(none)");

console.log("\n3. Table public.pricing_proposals — SELECT");
const selectResult = await supabase.from("pricing_proposals").select("id").limit(1);
console.log("   data:", selectResult.data);
console.log("   error:", selectResult.error ? JSON.stringify(selectResult.error, null, 2) : null);

console.log("\n4a. INSERT with only columns present in remote schema");
const minimalRecord = {
  proposal_id: `MO-2026-${String(Math.floor(100000 + Math.random() * 900000))}`,
  status: "pending",
  email: "diag@test.local",
  project_name: "Diagnostic",
  project_description: "Minimal schema test",
  selected_services: [],
  optional_features: [],
  timeline: "standard",
  estimated_duration: "4 weeks",
  currency: "EUR",
  subtotal: 0,
  final_price: 0,
};
const minimalInsert = await supabase
  .from("pricing_proposals")
  .insert(minimalRecord)
  .select("id, proposal_id")
  .single();
console.log("   data:", minimalInsert.data);
console.log("   error:", minimalInsert.error ? JSON.stringify(minimalInsert.error, null, 2) : null);
if (minimalInsert.data?.id) {
  await supabase.from("pricing_proposals").delete().eq("id", minimalInsert.data.id);
}

console.log("\n4b. INSERT with full app payload (includes client_full_name)");
const testRecord = {
  proposal_id: `MO-2026-${String(Math.floor(100000 + Math.random() * 900000))}`,
  status: "pending",
  client_full_name: "Diagnostic Test",
  email: "diag@test.local",
  project_name: "Diagnostic",
  project_description: "Schema test",
  selected_services: [],
  optional_features: [],
  price_breakdown: [],
  subtotal: 0,
  final_price: 0,
  client_metadata: {},
};

const insertResult = await supabase
  .from("pricing_proposals")
  .insert(testRecord)
  .select("id, proposal_id")
  .single();

console.log("   data:", insertResult.data);
console.log("   error:", insertResult.error ? JSON.stringify(insertResult.error, null, 2) : null);

if (insertResult.data?.id) {
  const del = await supabase.from("pricing_proposals").delete().eq("id", insertResult.data.id);
  console.log("\n5. Cleanup delete error:", del.error ? JSON.stringify(del.error, null, 2) : null);
}

console.log("\n6. Storage bucket proposal-pdfs — list");
const bucket = await supabase.storage.from("proposal-pdfs").list("proposals", { limit: 1 });
console.log("   data:", bucket.data);
console.log("   error:", bucket.error ? JSON.stringify(bucket.error, null, 2) : null);

if (selectResult.error?.code === "PGRST205") {
  console.log("\n>>> DIAGNOSIS: Table not in PostgREST schema cache (PGRST205).");
  console.log(">>> Run supabase/migrations/20250619_pricing_proposals.sql in SQL Editor,");
  console.log(">>> then reload schema: Settings → API → Reload schema (or wait ~1 min).");
}

if (insertResult.error) {
  console.log("\n>>> INSERT FAILED — see error above.");
  process.exit(1);
}

console.log("\nOK: Insert succeeded. Integration appears healthy.");

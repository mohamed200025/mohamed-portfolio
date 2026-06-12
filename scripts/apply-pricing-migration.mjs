#!/usr/bin/env node
/**
 * Applies pricing tables migration to Supabase.
 *
 * Option A (recommended): Supabase Dashboard → SQL Editor → paste contents of:
 *   supabase/migrations/20250614_create_pricing_tables.sql
 *
 * Option B: Set DATABASE_URL in .env.local (Project Settings → Database → Connection string)
 *   then run: npm run migrate:pricing
 */

import { readFileSync, existsSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");
const migrationPath = resolve(root, "supabase/migrations/20250614_create_pricing_tables.sql");

function loadEnvLocal() {
  const envPath = resolve(root, ".env.local");
  if (!existsSync(envPath)) return {};
  const vars = {};
  for (const line of readFileSync(envPath, "utf8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    vars[trimmed.slice(0, eq)] = trimmed.slice(eq + 1);
  }
  return vars;
}

async function main() {
  const sql = readFileSync(migrationPath, "utf8");
  const env = { ...process.env, ...loadEnvLocal() };
  const databaseUrl = env.DATABASE_URL || env.SUPABASE_DB_URL;

  console.log("Pricing migration file:", migrationPath);

  if (!databaseUrl) {
    console.log("\nDATABASE_URL not set. Apply manually in Supabase SQL Editor:");
    console.log("  1. Open https://supabase.com/dashboard/project/_/sql");
    console.log("  2. Paste the SQL from the migration file above");
    console.log("  3. Click Run\n");
    process.exit(0);
  }

  let pg;
  try {
    pg = await import("pg");
  } catch {
    console.error("Install pg to run migrations locally: npm install --save-dev pg");
    process.exit(1);
  }

  const client = new pg.default.Client({ connectionString: databaseUrl, ssl: { rejectUnauthorized: false } });
  try {
    await client.connect();
    await client.query(sql);
    console.log("Pricing migration applied successfully.");
  } catch (err) {
    console.error("Migration failed:", err.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

main();

#!/usr/bin/env node
/**
 * Applies analytics_visits migration to Supabase.
 *
 * Set DATABASE_URL in .env.local (Project Settings → Database → Connection string)
 * then run: npm run migrate:analytics
 */

import { readFileSync, existsSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");
const migrationPath = resolve(root, "supabase/migrations/20250617_analytics_visits.sql");

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

  console.log("Analytics migration file:", migrationPath);

  if (!databaseUrl) {
    console.error("\nDATABASE_URL not set in .env.local or environment.");
    console.error("Add your Supabase connection string from:");
    console.error("  Project Settings → Database → Connection string (URI)");
    process.exit(1);
  }

  let pg;
  try {
    pg = await import("pg");
  } catch {
    console.error("Install pg: npm install --save-dev pg");
    process.exit(1);
  }

  const client = new pg.default.Client({
    connectionString: databaseUrl,
    ssl: { rejectUnauthorized: false },
  });

  try {
    await client.connect();
    await client.query(sql);
    console.log("Migration applied successfully.");

    const table = await client.query(`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns
      WHERE table_schema = 'public' AND table_name = 'analytics_visits'
      ORDER BY ordinal_position
    `);
    console.log("\nTable schema (analytics_visits):");
    console.table(table.rows);

    const policies = await client.query(`
      SELECT polname, polcmd, pg_get_expr(polqual, polrelid) AS using_expr,
             pg_get_expr(polwithcheck, polrelid) AS with_check
      FROM pg_policy
      WHERE polrelid = 'public.analytics_visits'::regclass
    `);
    console.log("\nRLS policies:");
    console.table(policies.rows);
  } catch (err) {
    console.error("Migration failed:", err.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

main();

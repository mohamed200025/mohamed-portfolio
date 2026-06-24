import { createClient as createSupabaseClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Anonymous Supabase client for public portfolio reads and unauthenticated API writes.
 * Never reads auth cookies — avoids 401/PGRST303 when a stale admin JWT is present.
 */
export function createPublicClient(): SupabaseClient {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false,
      },
    }
  );
}

/**
 * Supabase client for browser use.
 * Uses the anon key (public). Real security is RLS in Postgres.
 *
 * Lazy-initialized to avoid build-time errors during static export.
 * The client is only created when first accessed in the browser.
 */
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let _supabase: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient {
  if (_supabase) return _supabase;

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    // During static build or when env vars are missing,
    // create a dummy client that will fail gracefully
    if (typeof window === "undefined") {
      // Server/build time — return a placeholder that won't be used
      return createClient("http://localhost:54321", "placeholder-key", {
        auth: { persistSession: false },
      });
    }
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY environment variables"
    );
  }

  _supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  });

  return _supabase;
}

// For convenience — but always use getSupabase() in components
export const supabase = typeof window !== "undefined"
  ? getSupabase()
  : (null as unknown as SupabaseClient);

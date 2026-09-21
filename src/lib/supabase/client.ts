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
    // When env vars are missing (static export, preview, demo mode),
    // provide a graceful fallback client that never throws in browser
    _supabase = createClient(
      "https://placeholder-fintara.supabase.co",
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.dummy",
      {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
        },
      }
    );
    return _supabase;
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

// For convenience — always safe to access in components
export const supabase = typeof window !== "undefined"
  ? getSupabase()
  : (null as unknown as SupabaseClient);

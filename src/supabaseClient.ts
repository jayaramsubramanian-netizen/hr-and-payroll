import { createClient, SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Missing Supabase environment variables. Please check your .env.local file.",
  );
}

// Singleton instance
let supabaseInstance: SupabaseClient | null = null;

/**
 * Get the single Supabase client instance
 * This prevents multiple GoTrueClient instances
 */
export const getSupabaseClient = (): SupabaseClient => {
  if (!supabaseInstance) {
    supabaseInstance = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        storage: window.localStorage,
        storageKey: "avlm-erp-auth",
      },
      db: {
        schema: "public",
      },
      global: {
        headers: {
          "x-application-name": "AVLM-ERP",
        },
      },
    });
  }

  return supabaseInstance;
};

// Export the singleton instance
export const supabase = getSupabaseClient();

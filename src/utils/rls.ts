import { supabase } from "../supabaseClient";

/**
 * Set the current user ID in the database session for RLS policies
 * This must be called after authentication before any queries
 */
export async function setUserContextForRLS(userId: string): Promise<void> {
  try {
    await supabase.rpc("set_current_user_context", { user_id: userId });
  } catch (error) {
    console.error("Failed to set RLS context:", error);
  }
}

/**
 * Clear the user context (call on logout)
 */
export async function clearUserContextForRLS(): Promise<void> {
  try {
    await supabase.rpc("clear_current_user_context");
  } catch (error) {
    console.error("Failed to clear RLS context:", error);
  }
}

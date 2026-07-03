import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { SupabaseClient } from "@supabase/supabase-js";

/**
 * Cookie-aware Supabase client for server components, route handlers and
 * server actions. Carries the logged-in admin's session so RLS authorises
 * catalog + storage writes. Returns null when Supabase env is not set.
 */
export async function getSupabaseServerClient(): Promise<SupabaseClient | null> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;

  const cookieStore = await cookies();
  return createServerClient(url, key, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        } catch {
          // called from a server component where cookies are read-only — safe to ignore
        }
      },
    },
  });
}

/** Current logged-in user (or null). */
export async function getCurrentUser() {
  const sb = await getSupabaseServerClient();
  if (!sb) return null;
  const { data } = await sb.auth.getUser();
  return data.user ?? null;
}

/** True when the logged-in user's email is in the admins allowlist. */
export async function isCurrentUserAdmin(): Promise<boolean> {
  const sb = await getSupabaseServerClient();
  if (!sb) return false;
  const { data, error } = await sb.rpc("is_admin");
  if (error) return false;
  return data === true;
}

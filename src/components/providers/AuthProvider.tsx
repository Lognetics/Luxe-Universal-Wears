"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { getSupabase, isSupabaseConfigured } from "@/lib/supabase/client";

type AuthUser = { id: string; email: string; name?: string };

type AuthContextValue = {
  user: AuthUser | null;
  loading: boolean;
  configured: boolean;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signUp: (email: string, password: string, name: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const configured = isSupabaseConfigured();

  useEffect(() => {
    const supabase = getSupabase();
    if (!supabase) {
      // Demo mode: restore a locally-stored demo user if present.
      try {
        const demo = localStorage.getItem("luxe.demoUser");
        if (demo) setUser(JSON.parse(demo));
      } catch {
        /* ignore */
      }
      setLoading(false);
      return;
    }
    supabase.auth.getSession().then(({ data }) => {
      const u = data.session?.user;
      if (u) setUser({ id: u.id, email: u.email ?? "", name: u.user_metadata?.name });
      setLoading(false);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      const u = session?.user;
      setUser(u ? { id: u.id, email: u.email ?? "", name: u.user_metadata?.name } : null);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  const signIn = useCallback<AuthContextValue["signIn"]>(async (email, password) => {
    const supabase = getSupabase();
    if (!supabase) {
      const demo = { id: "demo", email, name: email.split("@")[0] };
      localStorage.setItem("luxe.demoUser", JSON.stringify(demo));
      setUser(demo);
      return { error: null };
    }
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error: error?.message ?? null };
  }, []);

  const signUp = useCallback<AuthContextValue["signUp"]>(async (email, password, name) => {
    const supabase = getSupabase();
    if (!supabase) {
      const demo = { id: "demo", email, name };
      localStorage.setItem("luxe.demoUser", JSON.stringify(demo));
      setUser(demo);
      return { error: null };
    }
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name } },
    });
    return { error: error?.message ?? null };
  }, []);

  const signOut = useCallback(async () => {
    const supabase = getSupabase();
    if (supabase) await supabase.auth.signOut();
    localStorage.removeItem("luxe.demoUser");
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({ user, loading, configured, signIn, signUp, signOut }),
    [user, loading, configured, signIn, signUp, signOut]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

"use client";

import { useActionState } from "react";
import { adminLogin } from "@/app/admin/actions";

export default function AdminLogin() {
  const [state, formAction, pending] = useActionState(adminLogin, null);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-ink,#0f1720)] px-4">
      <form action={formAction} className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-xl">
        <h1 className="font-serif text-2xl font-semibold text-ink">Luxe Admin</h1>
        <p className="mt-1 text-sm text-neutral-500">Sign in to manage the store.</p>

        <label className="mt-6 block text-sm font-medium text-neutral-700">Password</label>
        <input
          type="password"
          name="password"
          required
          autoFocus
          className="mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-[var(--color-blue,#0098d8)]"
          placeholder="••••••••"
        />

        {state?.error && <p className="mt-4 text-sm text-red-600">{state.error}</p>}

        <button
          type="submit"
          disabled={pending}
          className="mt-6 w-full rounded-lg bg-[var(--color-blue,#0098d8)] py-2.5 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-60"
        >
          {pending ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </div>
  );
}

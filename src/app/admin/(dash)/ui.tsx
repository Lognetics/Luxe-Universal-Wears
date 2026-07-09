"use client";

import { useState, useTransition } from "react";
import { publishToLive } from "../publish";
import { adminLogout } from "../actions";

export function LogoutButton() {
  return (
    <form action={adminLogout}>
      <button
        type="submit"
        className="text-xs font-medium text-neutral-500 underline hover:text-neutral-800"
      >
        Sign out
      </button>
    </form>
  );
}

export function PublishButton() {
  const [pending, start] = useTransition();
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  return (
    <div className="flex items-center gap-3">
      <button
        disabled={pending}
        onClick={() =>
          start(async () => {
            setMsg(null);
            setErr(null);
            try {
              const r = await publishToLive();
              setMsg(`Published ${r.products} products — the live site will update in ~1–2 min.`);
            } catch (e) {
              setErr(e instanceof Error ? e.message : "Publish failed.");
            }
          })
        }
        className="rounded-lg bg-ink px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-60"
      >
        {pending ? "Publishing…" : "Publish to live site"}
      </button>
      {msg && <span className="text-sm text-green-600">{msg}</span>}
      {err && <span className="text-sm text-red-600">{err}</span>}
    </div>
  );
}

"use client";

import { useState, useTransition } from "react";
import { publishToLive, seedNeticsFromSupabase } from "../publish";
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
    <div className="flex flex-wrap items-center gap-3">
      <button
        disabled={pending}
        onClick={() =>
          start(async () => {
            setMsg(null);
            setErr(null);
            try {
              await publishToLive();
              setMsg("Refreshed. The live site now reads the NETICS catalogue again.");
            } catch (e) {
              setErr(e instanceof Error ? e.message : "Publish failed.");
            }
          })
        }
        className="rounded-lg bg-ink px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-60"
      >
        {pending ? "Refreshing…" : "Refresh the live site now"}
      </button>
      {msg && <span className="text-sm text-green-600">{msg}</span>}
      {err && <span className="text-sm text-red-600">{err}</span>}
    </div>
  );
}

export function SeedButton() {
  const [pending, start] = useTransition();
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  return (
    <div className="flex flex-wrap items-center gap-3">
      <button
        disabled={pending}
        onClick={() => {
          if (
            !window.confirm(
              "Send every product in the old Supabase catalogue to NETICS? This replaces what NETICS holds for this shop."
            )
          )
            return;
          start(async () => {
            setMsg(null);
            setErr(null);
            try {
              const r = await seedNeticsFromSupabase();
              if (r.pushed) {
                setMsg(`Sent to NETICS: ${r.created} new, ${r.updated} updated. Now press Publish from NETICS.`);
              } else {
                setErr(`NETICS did not take the catalogue: ${r.reason}.`);
              }
            } catch (e) {
              setErr(e instanceof Error ? e.message : "The move failed.");
            }
          });
        }}
        className="rounded-lg border border-neutral-300 bg-white px-4 py-2 text-sm font-semibold text-neutral-800 transition hover:bg-neutral-50 disabled:opacity-60"
      >
        {pending ? "Sending…" : "Send the old catalogue to NETICS"}
      </button>
      {msg && <span className="text-sm text-green-600">{msg}</span>}
      {err && <span className="text-sm text-red-600">{err}</span>}
    </div>
  );
}

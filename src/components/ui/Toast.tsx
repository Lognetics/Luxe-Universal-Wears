"use client";

import { Check } from "lucide-react";
import { useStore } from "@/components/providers/StoreProvider";

export function Toast() {
  const { toast } = useStore();
  return (
    <div
      aria-live="polite"
      className={`fixed bottom-6 left-1/2 z-[100] -translate-x-1/2 transition-all duration-300 ${
        toast ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0 pointer-events-none"
      }`}
    >
      {toast && (
        <div className="flex items-center gap-3 bg-ink px-6 py-3.5 text-ivory shadow-card">
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue text-ink">
            <Check size={13} strokeWidth={3} />
          </span>
          <span className="text-sm tracking-wide">{toast}</span>
        </div>
      )}
    </div>
  );
}

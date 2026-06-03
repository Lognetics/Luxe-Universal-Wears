"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, X } from "lucide-react";
import { searchProducts } from "@/lib/catalog";
import { formatNaira } from "@/lib/format";

export function SearchOverlay({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [query, setQuery] = useState("");
  const results = useMemo(() => searchProducts(query).slice(0, 6), [query]);

  useEffect(() => {
    if (!open) setQuery("");
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  return (
    <div
      className={`fixed inset-0 z-[95] transition-all duration-300 ${
        open ? "opacity-100" : "pointer-events-none opacity-0"
      }`}
    >
      <div className="absolute inset-0 bg-ink/50 backdrop-blur-sm" onClick={onClose} />
      <div
        className={`relative mx-auto mt-0 w-full bg-ivory shadow-card transition-transform duration-300 ${
          open ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <div className="mx-auto max-w-3xl px-6 py-8">
          <div className="flex items-center gap-3 border-b border-ink/30 pb-3">
            <Search size={22} className="text-stone" />
            <input
              autoFocus={open}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search for suits, sneakers, watches…"
              className="flex-1 bg-transparent font-serif text-2xl text-ink outline-none placeholder:text-mist"
            />
            <button onClick={onClose} aria-label="Close search" className="text-stone hover:text-ink">
              <X size={24} />
            </button>
          </div>

          {query && (
            <div className="mt-6">
              {results.length === 0 ? (
                <p className="text-stone">No results for &ldquo;{query}&rdquo;.</p>
              ) : (
                <div className="grid gap-2">
                  {results.map((p) => (
                    <Link
                      key={p.id}
                      href={`/product/${p.slug}`}
                      onClick={onClose}
                      className="flex items-center gap-4 rounded-sm p-2 transition hover:bg-cream"
                    >
                      <div className="relative h-16 w-12 shrink-0 overflow-hidden bg-cream">
                        <Image src={p.images[0]} alt={p.name} fill sizes="48px" className="object-cover" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-ink">{p.name}</p>
                        <p className="text-xs text-mist">{p.categoryName}</p>
                      </div>
                      <span className="text-sm">{formatNaira(p.price)}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )}
          {!query && (
            <div className="mt-6 flex flex-wrap gap-2">
              {["Suits", "Tuxedo", "Sneakers", "Loafers", "Polo", "Slides"].map((t) => (
                <button
                  key={t}
                  onClick={() => setQuery(t)}
                  className="border border-sand px-4 py-1.5 text-xs uppercase tracking-wider text-stone transition hover:border-ink hover:text-ink"
                >
                  {t}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

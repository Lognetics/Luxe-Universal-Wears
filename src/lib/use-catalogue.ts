"use client";

import { useEffect, useState } from "react";
import type { Category, Product } from "@/lib/types";

/**
 * The catalogue for components that run in the browser (bag, wishlist,
 * account, outfit builder, search). One request per page load, shared by
 * every component on the page and kept for a few minutes; the server side
 * of that request is NETICS through the same tagged cache the pages use.
 */

type Snapshot = { products: Product[]; categories: Category[] };

const KEEP_MS = 5 * 60 * 1000;
let cached: { at: number; snapshot: Snapshot } | null = null;
let inflight: Promise<Snapshot> | null = null;

function fresh(): Snapshot | null {
  return cached && Date.now() - cached.at < KEEP_MS ? cached.snapshot : null;
}

async function load(): Promise<Snapshot> {
  const have = fresh();
  if (have) return have;
  if (!inflight) {
    inflight = fetch("/api/catalogue", { cache: "no-store" })
      .then((res) => {
        if (!res.ok) throw new Error(`catalogue answered ${res.status}`);
        return res.json() as Promise<Snapshot>;
      })
      .then((snapshot) => {
        cached = { at: Date.now(), snapshot };
        return snapshot;
      })
      .finally(() => {
        inflight = null;
      });
  }
  return inflight;
}

export function useCatalogue(): { products: Product[]; categories: Category[]; ready: boolean } {
  const [snapshot, setSnapshot] = useState<Snapshot | null>(fresh);

  useEffect(() => {
    let alive = true;
    if (!fresh()) {
      load()
        .then((next) => {
          if (alive) setSnapshot(next);
        })
        .catch(() => {
          // A failed request must not leave the page waiting forever; an
          // empty catalogue renders the same "nothing here yet" states.
          if (alive) setSnapshot({ products: [], categories: [] });
        });
    }
    return () => {
      alive = false;
    };
  }, []);

  return {
    products: snapshot?.products ?? [],
    categories: snapshot?.categories ?? [],
    ready: snapshot !== null,
  };
}

/**
 * The bag's own id, kept in this browser until its order is paid. The
 * checkout sends it (hashed with the bag and details) as the NETICS
 * Idempotency-Key, so one bag is one order however many times Pay Online is
 * pressed, in however many tabs.
 */

const KEY = "luxe-bag-id";

function fresh(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") return crypto.randomUUID();
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}-${Math.random().toString(36).slice(2)}`;
}

export function bagId(): string {
  try {
    const kept = window.localStorage.getItem(KEY);
    if (kept) return kept;
    const made = fresh();
    window.localStorage.setItem(KEY, made);
    return made;
  } catch {
    return fresh();
  }
}

/** A new id: the bag's order was closed by the Luxe team, start another. */
export function renewBagId(): string {
  try {
    window.localStorage.removeItem(KEY);
  } catch {
    // Storage blocked: bagId() makes a fresh id anyway.
  }
  return bagId();
}

/** The bag was paid for: the next bag is a new order. */
export function forgetBagId(): void {
  try {
    window.localStorage.removeItem(KEY);
  } catch {
    // Nothing kept, nothing to forget.
  }
}

import "server-only";

import type { Product } from "@/lib/types";

/**
 * Keeps the NETICS concierge's catalogue in step with this site.
 *
 * Every product save, delete and publish in the admin panel is pushed to
 * NETICS through its public API, so the concierge recommends the right
 * items at the right prices and can link a customer to the exact product
 * page and picture. A nightly feed (`/api/netics/products`) is the safety
 * net if a push ever fails.
 *
 * Needs NETICS_API_KEY (server only, minted in the NETICS console under
 * API & Webhooks with the write:products scope). Without it, pushes are
 * skipped silently and the site behaves exactly as before.
 */

const SITE_ORIGIN = (process.env.NEXT_PUBLIC_SITE_URL?.trim() || "https://www.luxeuniversalwears.com").replace(
  /\/+$/,
  ""
);
const API_BASE = (
  process.env.NEXT_PUBLIC_NETICS_API_BASE?.trim() || "https://business.neticsai.com"
).replace(/\/+$/, "");

export type NeticsProduct = {
  name: string;
  sku: string;
  category: string;
  description: string;
  price: number;
  url: string;
  image: string;
  in_stock: boolean;
};

export function absoluteUrl(path: string | null | undefined): string {
  if (!path) return "";
  if (/^https?:\/\//i.test(path)) return path;
  return `${SITE_ORIGIN}${path.startsWith("/") ? path : `/${path}`}`;
}

export function productPageUrl(slug: string): string {
  return `${SITE_ORIGIN}/product/${slug}`;
}

/** One product as NETICS understands it: name, price, page, picture, stock. */
export function toNeticsProduct(product: Product): NeticsProduct {
  const details: string[] = [];
  if (product.description) details.push(product.description.trim());
  if (product.fabric) details.push(`Fabric: ${product.fabric}`);
  if (product.colors?.length) details.push(`Colours: ${product.colors.join(", ")}`);
  if (product.sizes?.length) details.push(`Sizes: ${product.sizes.join(", ")}`);
  if (product.comparePrice && product.comparePrice > product.price) {
    details.push(`Was NGN ${product.comparePrice.toLocaleString("en-NG")}, now on offer.`);
  }
  if (product.tags?.length) details.push(`Tags: ${product.tags.join(", ")}`);
  return {
    name: product.name,
    sku: product.sku || "",
    category: product.categoryName || product.category || "",
    description: details.join("\n").slice(0, 4000),
    price: product.price,
    url: productPageUrl(product.slug),
    image: absoluteUrl(product.images?.[0]),
    in_stock: (product.stock ?? 0) > 0,
  };
}

export type SyncResult =
  | { pushed: true; created: number; updated: number; out_of_stock: number }
  | { pushed: false; reason: string };

/**
 * Push products to NETICS. `replace` means "this is the whole catalogue"
 * (anything missing goes out of stock there); `merge` touches only what is
 * sent. Never throws: a NETICS hiccup must not block the admin panel.
 */
export async function pushProductsToNetics(
  products: NeticsProduct[],
  mode: "merge" | "replace"
): Promise<SyncResult> {
  const key = process.env.NETICS_API_KEY?.trim();
  if (!key) return { pushed: false, reason: "NETICS_API_KEY is not configured" };
  if (products.length === 0) return { pushed: false, reason: "nothing to push" };
  try {
    const res = await fetch(`${API_BASE}/api/public/v1/products/sync`, {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({ mode, products }),
      cache: "no-store",
    });
    if (!res.ok) {
      const text = (await res.text()).slice(0, 300);
      console.error(`[netics] product sync failed: ${res.status} ${text}`);
      return { pushed: false, reason: `NETICS answered ${res.status}` };
    }
    const data = (await res.json()) as { created: number; updated: number; out_of_stock: number };
    return { pushed: true, ...data };
  } catch (error) {
    console.error("[netics] product sync error", error);
    return { pushed: false, reason: "NETICS could not be reached" };
  }
}

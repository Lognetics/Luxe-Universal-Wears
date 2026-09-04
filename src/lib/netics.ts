import "server-only";

import type { Product } from "@/lib/types";

/**
 * NETICS is the catalogue.
 *
 * Products are managed in the NETICS console (Products) and this site renders
 * from them: `fetchNeticsCatalogue` reads the public products API and
 * `catalogueFromNetics` turns the list back into the shape the storefront was
 * built on. Publishing writes that list to src/data/products.json and
 * redeploys, so the storefront itself stays static and fast, and NETICS tells
 * the site to republish (the `catalogue.updated` webhook) whenever something
 * changes.
 *
 * `toNeticsProduct` remains for the one-time seed (Supabase to NETICS) and for
 * the nightly feed NETICS reads as a safety net.
 *
 * Needs NETICS_API_KEY (server only, minted in the NETICS console under
 * API & Webhooks with the read:products and write:products scopes).
 */

const SITE_ORIGIN = (process.env.NEXT_PUBLIC_SITE_URL?.trim() || "https://www.luxeuniversalwears.com").replace(
  /\/+$/,
  ""
);
const API_BASE = (
  process.env.NEXT_PUBLIC_NETICS_API_BASE?.trim() || "https://business.neticsai.com"
).replace(/\/+$/, "");

/** One product as this site sends it to NETICS. */
export type NeticsProduct = {
  name: string;
  sku: string;
  category: string;
  description: string;
  price: number;
  url: string;
  image: string;
  in_stock: boolean;
  stock_level?: number | null;
  slug?: string;
  compare_price?: number | null;
  images?: string[];
  options?: Record<string, string[]>;
  tags?: string[];
  badges?: string[];
  details?: Record<string, string>;
};

/** One product as NETICS returns it. */
export type NeticsCatalogueProduct = {
  id: string;
  name: string;
  slug: string;
  sku: string;
  category: string;
  description: string;
  price: number;
  compare_price: number | null;
  url: string;
  image_url: string;
  images: string[];
  options: Record<string, string[]>;
  tags: string[];
  badges: string[];
  details: Record<string, string>;
  in_stock: boolean;
  stock_level: number | null;
  is_active: boolean;
  created_at: string | null;
  updated_at: string | null;
};

export type CategoryLookup = { slug: string; name: string; group: string };

export function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/['’`]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function absoluteUrl(path: string | null | undefined): string {
  if (!path) return "";
  if (/^https?:\/\//i.test(path)) return path;
  return `${SITE_ORIGIN}${path.startsWith("/") ? path : `/${path}`}`;
}

export function productPageUrl(slug: string): string {
  return `${SITE_ORIGIN}/product/${slug}`;
}

/** A picture on this very site comes back as its static path; others stay absolute. */
export function siteRelative(url: string): string {
  return url.startsWith(`${SITE_ORIGIN}/`) ? url.slice(SITE_ORIGIN.length) : url;
}

/** One product as NETICS understands it: every field the storefront has. */
export function toNeticsProduct(product: Product): NeticsProduct {
  const badges: string[] = [];
  if (product.isNew) badges.push("new");
  if (product.isBestSeller) badges.push("best_seller");
  if (product.isFeatured) badges.push("featured");
  if (product.comparePrice && product.comparePrice > product.price) badges.push("sale");

  const details: Record<string, string> = {};
  if (product.brand) details.brand = product.brand;
  if (product.fabric) details.fabric = product.fabric;
  if (product.care) details.care = product.care;
  if (product.subcategory) details.subcategory = product.subcategory;
  if (product.group) details.group = product.group;
  if (product.category) details.category_slug = product.category;
  if (product.rating) details.rating = String(product.rating);
  if (product.reviews) details.reviews = String(product.reviews);
  if (product.createdIndex) details.created_index = String(product.createdIndex);

  const options: Record<string, string[]> = {};
  if (product.colors?.length) options.colours = product.colors;
  if (product.sizes?.length) options.sizes = product.sizes;

  const stock = Math.max(0, Number(product.stock ?? 0));
  return {
    name: product.name,
    sku: product.sku || "",
    category: product.categoryName || product.category || "",
    description: (product.description || "").trim().slice(0, 4000),
    price: product.price,
    url: productPageUrl(product.slug),
    image: absoluteUrl(product.images?.[0]),
    in_stock: stock > 0,
    stock_level: stock,
    slug: product.slug,
    compare_price: product.comparePrice ?? null,
    images: (product.images ?? []).map(absoluteUrl).filter(Boolean),
    options,
    tags: product.tags ?? [],
    badges,
    details,
  };
}

/** The whole active catalogue as NETICS has it right now. Throws when it cannot. */
export async function fetchNeticsCatalogue(): Promise<NeticsCatalogueProduct[]> {
  const key = process.env.NETICS_API_KEY?.trim();
  if (!key) throw new Error("NETICS_API_KEY is not configured on the server.");
  const res = await fetch(`${API_BASE}/api/public/v1/products?limit=2000`, {
    headers: { Authorization: `Bearer ${key}` },
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`NETICS answered ${res.status} when asked for the catalogue.`);
  const items = (await res.json()) as NeticsCatalogueProduct[];
  return Array.isArray(items) ? items : [];
}

/** One NETICS product back in the storefront's shape. */
export function fromNeticsProduct(
  item: NeticsCatalogueProduct,
  categories: CategoryLookup[],
  fallbackIndex: number
): Product {
  const details = item.details ?? {};
  const options = item.options ?? {};
  const badges = new Set(item.badges ?? []);
  const wantedCategory = details.category_slug || "";
  const category =
    categories.find((c) => c.slug === wantedCategory) ??
    categories.find((c) => c.name.toLowerCase() === (item.category || "").trim().toLowerCase()) ??
    categories.find((c) => c.slug === slugify(item.category || ""));
  const categorySlug = category?.slug ?? (slugify(item.category || "") || "uncategorised");
  const images = (item.images?.length ? item.images : item.image_url ? [item.image_url] : []).map(
    siteRelative
  );
  const slug = item.slug || slugify(item.name) || item.id;
  const price = Number(item.price) || 0;
  const comparePrice =
    item.compare_price != null && Number(item.compare_price) > price ? Number(item.compare_price) : null;

  return {
    id: slug,
    slug,
    name: item.name,
    category: categorySlug,
    categoryName: category?.name ?? (item.category || "Uncategorised"),
    group: details.group || category?.group || "Clothing",
    subcategory: details.subcategory ?? "",
    brand: details.brand || "Luxe Universal",
    price,
    comparePrice,
    currency: "NGN",
    colors: options.colours ?? options.colors ?? options.colour ?? [],
    sizes: options.sizes ?? options.size ?? [],
    description: item.description ?? "",
    fabric: details.fabric ?? "",
    care: details.care ?? "",
    tags: item.tags ?? [],
    images,
    rating: Number(details.rating) || 4.5,
    reviews: Number(details.reviews) || 0,
    stock: item.in_stock ? (item.stock_level ?? 12) : 0,
    sku: item.sku ?? "",
    isNew: badges.has("new"),
    isBestSeller: badges.has("best_seller"),
    isFeatured: badges.has("featured"),
    createdIndex: Number(details.created_index) || fallbackIndex,
  };
}

/** The site's product list from NETICS, in the order the shop has always shown it. */
export function catalogueFromNetics(
  items: NeticsCatalogueProduct[],
  categories: CategoryLookup[]
): Product[] {
  const ordered = items
    .filter((item) => item.is_active)
    .sort(
      (a, b) =>
        (a.created_at ?? "").localeCompare(b.created_at ?? "") || a.name.localeCompare(b.name)
    );
  // A product carries its original position (created_index) through NETICS;
  // one added there gets the next position, so it still counts as newest.
  const known = ordered.map((item) => Number(item.details?.created_index) || 0);
  let next = Math.max(0, ...known);
  return ordered
    .map((item) => fromNeticsProduct(item, categories, ++next))
    .sort((a, b) => a.createdIndex - b.createdIndex);
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

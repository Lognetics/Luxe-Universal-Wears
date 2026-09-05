import "server-only";

import categoriesData from "@/data/categories.json";
import productsData from "@/data/products.json";
import type { NeticsCatalogueProduct } from "@/lib/netics";
import { catalogueFromNetics, categoriesFor } from "@/lib/netics-catalogue.mjs";
import type { Category, Product } from "@/lib/types";

/**
 * NETICS is the database this shop reads from.
 *
 * Every page asks `loadCatalogue()` for the products. The answer comes from
 * NETICS's public products API through Next's data cache, tagged so the
 * NETICS `catalogue.updated` webhook can clear it the moment something
 * changes, and refreshed on its own every few minutes regardless. No build,
 * no commit: a product saved in the NETICS console is on the next page view.
 *
 * The files in src/data are the fallback for a build or a request that
 * cannot reach NETICS (no key locally, an outage), so the shop never renders
 * empty. `source` says which one answered.
 */

export const CATALOGUE_TAG = "catalogue";
const REVALIDATE_SECONDS = 300;
const API_BASE = (
  process.env.NEXT_PUBLIC_NETICS_API_BASE?.trim() || "https://business.neticsai.com"
).replace(/\/+$/, "");

export type CatalogueSource = "netics" | "committed";
export type Catalogue = { products: Product[]; categories: Category[]; source: CatalogueSource };

async function fetchProducts(): Promise<NeticsCatalogueProduct[]> {
  const key = process.env.NETICS_API_KEY?.trim();
  if (!key) throw new Error("NETICS_API_KEY is not configured");
  const res = await fetch(`${API_BASE}/api/public/v1/products?limit=2000`, {
    headers: { Authorization: `Bearer ${key}` },
    next: { revalidate: REVALIDATE_SECONDS, tags: [CATALOGUE_TAG] },
  });
  if (!res.ok) throw new Error(`NETICS answered ${res.status}`);
  const items = (await res.json()) as NeticsCatalogueProduct[];
  if (!Array.isArray(items) || items.length === 0) throw new Error("NETICS returned no products");
  return items;
}

/** Categories are still curated in this site's admin (Supabase); the committed file is the fallback. */
async function fetchCategories(): Promise<Category[]> {
  const fallback = (categoriesData as Category[]).map((category) => ({ ...category, count: 0 }));
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  if (!url || !key) return fallback;
  try {
    const res = await fetch(
      `${url.replace(/\/+$/, "")}/rest/v1/categories?select=*&order=created_at.asc`,
      {
        headers: { apikey: key, Authorization: `Bearer ${key}` },
        next: { revalidate: REVALIDATE_SECONDS, tags: [CATALOGUE_TAG] },
      }
    );
    if (!res.ok) throw new Error(`Supabase answered ${res.status}`);
    const rows = (await res.json()) as Record<string, unknown>[];
    if (!rows.length) return fallback;
    return rows.map((r) => ({
      slug: String(r.slug),
      name: String(r.name),
      group: String(r.group ?? "Clothing"),
      subcategories: Array.isArray(r.subcategories) ? r.subcategories.map(String) : [],
      count: 0,
      image: typeof r.image === "string" ? r.image : null,
    }));
  } catch (error) {
    console.warn(
      "[catalogue] categories from the committed file:",
      error instanceof Error ? error.message : error
    );
    return fallback;
  }
}

export async function loadCatalogue(): Promise<Catalogue> {
  try {
    const [items, base] = await Promise.all([fetchProducts(), fetchCategories()]);
    const products = catalogueFromNetics(items, base);
    return { products, categories: categoriesFor(products, base), source: "netics" };
  } catch (error) {
    console.warn(
      "[catalogue] serving the committed catalogue:",
      error instanceof Error ? error.message : error
    );
    return {
      products: productsData as Product[],
      categories: categoriesData as Category[],
      source: "committed",
    };
  }
}

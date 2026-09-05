// @ts-check
/**
 * Pull the catalogue from NETICS into the build.
 *
 * Runs as `prebuild`, so every Vercel build starts by asking NETICS for the
 * whole product list and writing src/data/products.json and categories.json
 * before Next.js renders a page. The committed copies of those files are
 * the fallback: when NETICS_API_KEY is missing (a local build, a preview) or
 * NETICS cannot be reached, the build goes ahead with whatever was committed
 * and says so, rather than shipping an empty shop.
 *
 * Categories are still curated in this site's admin (Supabase); they are
 * read here through Supabase's REST API with the service key, falling back
 * to the committed categories.json.
 */

import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { catalogueFromNetics, categoriesFor } from "../src/lib/netics-catalogue.mjs";

const here = path.dirname(fileURLToPath(import.meta.url));
const DATA = path.join(here, "..", "src", "data");
const API_BASE = (
  process.env.NEXT_PUBLIC_NETICS_API_BASE?.trim() || "https://business.neticsai.com"
).replace(/\/+$/, "");

/** @param {string} name */
async function committed(name) {
  return JSON.parse(await readFile(path.join(DATA, name), "utf8"));
}

async function fetchProducts() {
  const key = process.env.NETICS_API_KEY?.trim();
  if (!key) throw new Error("NETICS_API_KEY is not set");
  const res = await fetch(`${API_BASE}/api/public/v1/products?limit=2000`, {
    headers: { Authorization: `Bearer ${key}` },
  });
  if (!res.ok) throw new Error(`NETICS answered ${res.status}`);
  const items = await res.json();
  if (!Array.isArray(items) || items.length === 0) throw new Error("NETICS returned no products");
  return items;
}

async function fetchCategories() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  /** @type {import("../src/lib/types").Category[]} */
  const fallback = await committed("categories.json");
  if (!url || !key) return fallback;
  try {
    const res = await fetch(`${url.replace(/\/+$/, "")}/rest/v1/categories?select=*&order=created_at.asc`, {
      headers: { apikey: key, Authorization: `Bearer ${key}` },
    });
    if (!res.ok) throw new Error(`Supabase answered ${res.status}`);
    /** @type {Record<string, unknown>[]} */
    const rows = await res.json();
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
    console.warn(`[catalogue] categories from the committed file: ${error instanceof Error ? error.message : error}`);
    return fallback;
  }
}

async function main() {
  try {
    const [items, baseCategories] = await Promise.all([fetchProducts(), fetchCategories()]);
    const products = catalogueFromNetics(items, baseCategories);
    const categories = categoriesFor(products, baseCategories);
    await writeFile(path.join(DATA, "products.json"), JSON.stringify(products, null, 2) + "\n");
    await writeFile(path.join(DATA, "categories.json"), JSON.stringify(categories, null, 2) + "\n");
    // Where this build's catalogue came from; the public feed reports it, so
    // "did the last build pull from NETICS?" is one request, not a log hunt.
    await writeFile(
      path.join(DATA, "catalogue-meta.json"),
      JSON.stringify(
        { source: "netics", pulled_at: new Date().toISOString(), products: products.length },
        null,
        2
      ) + "\n"
    );
    console.log(`[catalogue] ${products.length} products and ${categories.length} categories pulled from NETICS`);
  } catch (error) {
    const committedProducts = await committed("products.json");
    console.warn(
      `[catalogue] building with the committed catalogue (${committedProducts.length} products): ${
        error instanceof Error ? error.message : error
      }`
    );
  }
}

await main();

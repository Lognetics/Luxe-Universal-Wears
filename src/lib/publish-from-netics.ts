import "server-only";

import categoriesData from "@/data/categories.json";
import { catalogueFromNetics, fetchNeticsCatalogue } from "@/lib/netics";
import { rowToCategory } from "@/lib/supabase/mappers";
import { getServiceSupabase } from "@/lib/supabase/server";
import type { Category } from "@/lib/types";

/**
 * Publish the NETICS catalogue to the live site.
 *
 * Reads every product from NETICS, shelves it under this site's categories,
 * and commits products.json and categories.json to GitHub, which redeploys
 * the site on Vercel. A commit is only made when the content actually
 * changed, so a burst of saves in NETICS costs one build, not ten.
 *
 * Called from the admin dashboard and from the NETICS `catalogue.updated`
 * webhook, both after their own checks; this module trusts its caller.
 */

const REPO = process.env.GITHUB_REPO || "Lognetics/Luxe-Universal-Wears";
const BRANCH = process.env.GITHUB_BRANCH || "main";
const BASE = "src/data";

export type PublishResult = { products: number; categories: number; changed: boolean };

function githubHeaders(): Record<string, string> {
  const token = process.env.GITHUB_TOKEN;
  if (!token) throw new Error("GITHUB_TOKEN is not configured on the server.");
  return {
    Authorization: `Bearer ${token}`,
    Accept: "application/vnd.github+json",
    "Content-Type": "application/json",
  };
}

async function currentFile(pathInRepo: string): Promise<{ sha?: string; content?: string }> {
  const api = `https://api.github.com/repos/${REPO}/contents/${pathInRepo}?ref=${BRANCH}`;
  const res = await fetch(api, { headers: githubHeaders(), cache: "no-store" });
  if (!res.ok) return {};
  const body = (await res.json()) as { sha?: string; content?: string; encoding?: string };
  const content =
    body.content && body.encoding === "base64"
      ? Buffer.from(body.content.replace(/\n/g, ""), "base64").toString("utf8")
      : undefined;
  return { sha: body.sha, content };
}

/** Write one file to the repo. Returns false when it already held this content. */
async function updateFile(pathInRepo: string, contentString: string, message: string): Promise<boolean> {
  const { sha, content } = await currentFile(pathInRepo);
  if (content === contentString) return false;
  const res = await fetch(`https://api.github.com/repos/${REPO}/contents/${pathInRepo}`, {
    method: "PUT",
    headers: githubHeaders(),
    body: JSON.stringify({
      message,
      content: Buffer.from(contentString).toString("base64"),
      branch: BRANCH,
      sha,
    }),
  });
  if (!res.ok) throw new Error(`GitHub update failed for ${pathInRepo}: ${await res.text()}`);
  return true;
}

/** Categories are still curated here: Supabase first, the published file as fallback. */
async function loadCategories(): Promise<Category[]> {
  const sb = getServiceSupabase();
  if (sb) {
    const { data, error } = await sb.from("categories").select("*").order("created_at", { ascending: true });
    if (!error && data?.length) return data.map((row) => rowToCategory(row as Record<string, unknown>, 0));
  }
  return (categoriesData as Category[]).map((category) => ({ ...category, count: 0 }));
}

export async function publishFromNetics(): Promise<PublishResult> {
  const [items, baseCategories] = await Promise.all([fetchNeticsCatalogue(), loadCategories()]);
  if (items.length === 0) {
    throw new Error("NETICS returned an empty catalogue, so nothing was published.");
  }
  const products = catalogueFromNetics(items, baseCategories);

  const counts = new Map<string, number>();
  for (const product of products) counts.set(product.category, (counts.get(product.category) ?? 0) + 1);

  const categories: Category[] = baseCategories.map((category) => ({
    ...category,
    count: counts.get(category.slug) ?? 0,
    image: category.image ?? products.find((p) => p.category === category.slug)?.images[0] ?? null,
  }));
  // A category NETICS knows that this site has not curated yet still gets a
  // shelf, so a product never disappears for want of a category row.
  for (const product of products) {
    if (categories.some((category) => category.slug === product.category)) continue;
    categories.push({
      slug: product.category,
      name: product.categoryName,
      group: product.group,
      subcategories: [],
      count: counts.get(product.category) ?? 0,
      image: product.images[0] ?? null,
    });
  }

  const stamp = new Date().toISOString();
  const changedProducts = await updateFile(
    `${BASE}/products.json`,
    JSON.stringify(products, null, 2),
    `netics: publish catalogue (${products.length} products) ${stamp}`
  );
  const changedCategories = await updateFile(
    `${BASE}/categories.json`,
    JSON.stringify(categories, null, 2),
    `netics: publish categories ${stamp}`
  );
  return {
    products: products.length,
    categories: categories.length,
    changed: changedProducts || changedCategories,
  };
}

"use server";

import { getServiceSupabase } from "@/lib/supabase/server";
import { isAdminRequest } from "@/lib/admin/auth";
import { rowToProduct, rowToCategory } from "@/lib/supabase/mappers";

const REPO = process.env.GITHUB_REPO || "Lognetics/Luxe-Universal-Wears";
const BRANCH = process.env.GITHUB_BRANCH || "main";
const BASE = "src/data";

async function ghUpdateFile(pathInRepo: string, contentString: string, message: string) {
  const token = process.env.GITHUB_TOKEN;
  if (!token) throw new Error("GITHUB_TOKEN is not configured on the server.");
  const api = `https://api.github.com/repos/${REPO}/contents/${pathInRepo}`;
  const headers = {
    Authorization: `Bearer ${token}`,
    Accept: "application/vnd.github+json",
    "Content-Type": "application/json",
  };

  // current file sha (needed to update an existing file)
  let sha: string | undefined;
  const head = await fetch(`${api}?ref=${BRANCH}`, { headers, cache: "no-store" });
  if (head.ok) sha = (await head.json()).sha;

  const body = {
    message,
    content: Buffer.from(contentString).toString("base64"),
    branch: BRANCH,
    sha,
  };
  const res = await fetch(api, { method: "PUT", headers, body: JSON.stringify(body) });
  if (!res.ok) throw new Error(`GitHub update failed for ${pathInRepo}: ${await res.text()}`);
}

/**
 * Publish the current Supabase catalog to the live site: regenerate
 * products.json + categories.json and commit them to GitHub, which triggers
 * an automatic Vercel redeploy. Returns product/category counts.
 */
export async function publishToLive() {
  if (!(await isAdminRequest())) throw new Error("Not authorised.");
  const sb = getServiceSupabase();
  if (!sb) throw new Error("Server is missing SUPABASE_SERVICE_ROLE_KEY.");

  const { data: prodRows, error: pErr } = await sb
    .from("products")
    .select("*")
    .order("created_index", { ascending: true });
  if (pErr) throw new Error(pErr.message);

  const { data: catRows, error: cErr } = await sb
    .from("categories")
    .select("*")
    .order("created_at", { ascending: true });
  if (cErr) throw new Error(cErr.message);

  const products = (prodRows ?? []).map(rowToProduct);
  const counts = new Map<string, number>();
  for (const p of products) counts.set(p.category, (counts.get(p.category) ?? 0) + 1);

  const categories = (catRows ?? []).map((r) => {
    const c = rowToCategory(r, counts.get(r.slug as string) ?? 0);
    const first = products.find((p) => p.category === c.slug);
    return { ...c, image: c.image ?? first?.images[0] ?? null };
  });

  const stamp = new Date().toISOString();
  await ghUpdateFile(`${BASE}/products.json`, JSON.stringify(products, null, 2), `admin: publish catalog (${products.length} products) ${stamp}`);
  await ghUpdateFile(`${BASE}/categories.json`, JSON.stringify(categories, null, 2), `admin: publish categories ${stamp}`);

  return { products: products.length, categories: categories.length };
}

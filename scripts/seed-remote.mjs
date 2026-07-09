// Seeds the catalog over HTTPS (PostgREST), authenticated as the admin so
// RLS admin-write policies allow it. No direct DB connection needed.
// Usage: node scripts/seed-remote.mjs <adminEmail> <adminPassword>
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createClient } from "@supabase/supabase-js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");

// load .env.local
const envPath = path.join(root, ".env.local");
if (fs.existsSync(envPath)) {
  for (const line of fs.readFileSync(envPath, "utf8").split("\n")) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/i);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
  }
}

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const email = process.argv[2] || (process.env.ADMIN_EMAILS || "").split(",")[0].trim();
const password = process.argv[3] || process.env.ADMIN_PASSWORD;

if (!url || !key) { console.error("Missing Supabase URL/key in .env.local"); process.exit(1); }
if (!email || !password) { console.error("Usage: node scripts/seed-remote.mjs <email> <password>"); process.exit(1); }

const sb = createClient(url, key, { auth: { persistSession: false } });

const products = JSON.parse(fs.readFileSync(path.join(root, "src/data/products.json"), "utf8"));
const categories = JSON.parse(fs.readFileSync(path.join(root, "src/data/categories.json"), "utf8"));

const catRows = categories.map((c, i) => ({
  slug: c.slug, name: c.name, group: c.group,
  subcategories: c.subcategories ?? [], image: c.image ?? null, sort_order: i,
}));
const prodRows = products.map((p) => ({
  id: p.id, slug: p.slug, name: p.name, category: p.category, category_name: p.categoryName,
  group: p.group, subcategory: p.subcategory ?? "", brand: p.brand ?? "Luxe Universal",
  price: p.price, compare_price: p.comparePrice ?? null, currency: p.currency ?? "NGN",
  colors: p.colors ?? [], sizes: p.sizes ?? [], description: p.description ?? "",
  fabric: p.fabric ?? "", care: p.care ?? "", tags: p.tags ?? [], images: p.images ?? [],
  rating: p.rating ?? 4.5, reviews: p.reviews ?? 0, stock: p.stock ?? 0, sku: p.sku ?? "",
  is_new: !!p.isNew, is_best_seller: !!p.isBestSeller, is_featured: !!p.isFeatured,
  created_index: p.createdIndex ?? 0,
}));

async function main() {
  const { error: authErr } = await sb.auth.signInWithPassword({ email, password });
  if (authErr) { console.error("Sign-in failed:", authErr.message); process.exit(2); }
  console.log("Signed in as", email);

  const { error: cErr } = await sb.from("categories").upsert(catRows, { onConflict: "slug" });
  if (cErr) { console.error("Category seed failed:", cErr.message); process.exit(3); }
  console.log(`Seeded ${catRows.length} categories.`);

  const size = 50;
  for (let i = 0; i < prodRows.length; i += size) {
    const chunk = prodRows.slice(i, i + size);
    const { error } = await sb.from("products").upsert(chunk, { onConflict: "id" });
    if (error) { console.error(`Product seed failed at ${i}:`, error.message); process.exit(4); }
    console.log(`Seeded products ${i + 1}-${i + chunk.length}`);
  }

  const { count } = await sb.from("products").select("id", { count: "exact", head: true });
  console.log(`Done. Product rows in DB: ${count}`);
}
main();

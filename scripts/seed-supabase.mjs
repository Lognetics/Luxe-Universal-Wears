// Seeds Supabase catalog tables from the corrected local JSON.
// Usage:
//   NEXT_PUBLIC_SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... node scripts/seed-supabase.mjs
// Idempotent: upserts categories then products by primary key.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createClient } from "@supabase/supabase-js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const dataDir = path.join(root, "src", "data");

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}
const sb = createClient(url, key, { auth: { persistSession: false } });

const products = JSON.parse(fs.readFileSync(path.join(dataDir, "products.json"), "utf8"));
const categories = JSON.parse(fs.readFileSync(path.join(dataDir, "categories.json"), "utf8"));

const catRows = categories.map((c, i) => ({
  slug: c.slug,
  name: c.name,
  group: c.group,
  subcategories: c.subcategories ?? [],
  image: c.image ?? null,
  sort_order: i,
}));

const prodRows = products.map((p) => ({
  id: p.id,
  slug: p.slug,
  name: p.name,
  category: p.category,
  category_name: p.categoryName,
  group: p.group,
  subcategory: p.subcategory ?? "",
  brand: p.brand ?? "Luxe Universal",
  price: p.price,
  compare_price: p.comparePrice ?? null,
  currency: p.currency ?? "NGN",
  colors: p.colors ?? [],
  sizes: p.sizes ?? [],
  description: p.description ?? "",
  fabric: p.fabric ?? "",
  care: p.care ?? "",
  tags: p.tags ?? [],
  images: p.images ?? [],
  rating: p.rating ?? 4.5,
  reviews: p.reviews ?? 0,
  stock: p.stock ?? 0,
  sku: p.sku ?? "",
  is_new: !!p.isNew,
  is_best_seller: !!p.isBestSeller,
  is_featured: !!p.isFeatured,
  created_index: p.createdIndex ?? 0,
}));

async function main() {
  const { error: cErr } = await sb.from("categories").upsert(catRows, { onConflict: "slug" });
  if (cErr) throw cErr;
  console.log(`Seeded ${catRows.length} categories.`);

  // chunk products to keep payloads small
  const size = 100;
  for (let i = 0; i < prodRows.length; i += size) {
    const chunk = prodRows.slice(i, i + size);
    const { error } = await sb.from("products").upsert(chunk, { onConflict: "id" });
    if (error) throw error;
    console.log(`Seeded products ${i + 1}-${i + chunk.length}`);
  }
  console.log(`Done: ${prodRows.length} products.`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

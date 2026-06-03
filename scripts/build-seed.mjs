// Generates supabase/seed.sql (categories + products) from the local catalog JSON.
// Run: node scripts/build-seed.mjs
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const dataDir = path.join(root, "src", "data");

const products = JSON.parse(fs.readFileSync(path.join(dataDir, "products.json"), "utf8"));
const categories = JSON.parse(fs.readFileSync(path.join(dataDir, "categories.json"), "utf8"));

const q = (v) => (v === null || v === undefined ? "null" : `'${String(v).replace(/'/g, "''")}'`);
const arr = (a) =>
  a && a.length ? `array[${a.map((x) => `'${String(x).replace(/'/g, "''")}'`).join(",")}]::text[]` : `'{}'::text[]`;
const num = (v) => (v === null || v === undefined ? "null" : Number(v));
const bool = (v) => (v ? "true" : "false");

let sql = `-- Auto-generated seed data for Luxe Universal Wears. Do not edit by hand.\n-- Regenerate with: node scripts/build-seed.mjs\n\n`;

sql += `insert into public.categories (slug, name, "group", subcategories, image) values\n`;
sql += categories
  .map((c) => `  (${q(c.slug)}, ${q(c.name)}, ${q(c.group)}, ${arr(c.subcategories)}, ${q(c.image)})`)
  .join(",\n");
sql += `\non conflict (slug) do update set name=excluded.name, "group"=excluded."group", subcategories=excluded.subcategories, image=excluded.image;\n\n`;

sql += `insert into public.products (id, slug, name, category, category_name, "group", subcategory, brand, price, compare_price, currency, colors, sizes, description, fabric, care, tags, images, rating, reviews, stock, sku, is_new, is_best_seller, is_featured, created_index) values\n`;
sql += products
  .map(
    (p) =>
      `  (${q(p.id)}, ${q(p.slug)}, ${q(p.name)}, ${q(p.category)}, ${q(p.categoryName)}, ${q(p.group)}, ${q(p.subcategory)}, ${q(p.brand)}, ${num(p.price)}, ${num(p.comparePrice)}, ${q(p.currency)}, ${arr(p.colors)}, ${arr(p.sizes)}, ${q(p.description)}, ${q(p.fabric)}, ${q(p.care)}, ${arr(p.tags)}, ${arr(p.images)}, ${num(p.rating)}, ${num(p.reviews)}, ${num(p.stock)}, ${q(p.sku)}, ${bool(p.isNew)}, ${bool(p.isBestSeller)}, ${bool(p.isFeatured)}, ${num(p.createdIndex)})`
  )
  .join(",\n");
sql += `\non conflict (id) do update set price=excluded.price, stock=excluded.stock, name=excluded.name;\n`;

fs.writeFileSync(path.join(root, "supabase", "seed.sql"), sql);
console.log(`Wrote supabase/seed.sql (${categories.length} categories, ${products.length} products).`);

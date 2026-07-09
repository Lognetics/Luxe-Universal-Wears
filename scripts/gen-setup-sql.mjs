// Generates supabase/setup.sql: schema + admin allowlist + full catalog seed,
// as one script to paste into the Supabase SQL Editor.
// Run: node scripts/gen-setup-sql.mjs
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const mig = (f) => fs.readFileSync(path.join(root, "supabase/migrations", f), "utf8");
const products = JSON.parse(fs.readFileSync(path.join(root, "src/data/products.json"), "utf8"));
const categories = JSON.parse(fs.readFileSync(path.join(root, "src/data/categories.json"), "utf8"));

const ADMIN_EMAIL = process.argv[2] || "lognetics@gmail.com";

const q = (s) => `'${String(s ?? "").replace(/'/g, "''")}'`;
const arr = (a) =>
  a && a.length ? `ARRAY[${a.map((x) => q(x)).join(",")}]::text[]` : `ARRAY[]::text[]`;
const num = (n) => (n === null || n === undefined || n === "" ? "null" : Number(n));
const bool = (b) => (b ? "true" : "false");

let out = "";
out += "-- ============================================================\n";
out += "-- Luxe Universal Wears — one-shot Supabase setup\n";
out += "-- Paste this whole file into the Supabase SQL Editor and Run.\n";
out += "-- Safe to run more than once (idempotent upserts).\n";
out += "-- ============================================================\n\n";
out += 'create extension if not exists pgcrypto;\n\n';
out += mig("0001_init.sql") + "\n\n";
out += mig("0002_storage_and_admin.sql") + "\n\n";

out += "-- ---------- Admin allowlist ----------\n";
out += `insert into public.admins(email) values (${q(ADMIN_EMAIL.toLowerCase())}) on conflict (email) do nothing;\n\n`;

out += "-- ---------- Categories ----------\n";
categories.forEach((c, i) => {
  out += `insert into public.categories (slug,name,"group",subcategories,image,sort_order) values (${q(c.slug)},${q(c.name)},${q(c.group)},${arr(c.subcategories)},${c.image ? q(c.image) : "null"},${i}) on conflict (slug) do update set name=excluded.name,"group"=excluded."group",subcategories=excluded.subcategories,image=excluded.image,sort_order=excluded.sort_order;\n`;
});
out += "\n-- ---------- Products ----------\n";
const cols = `id,slug,name,category,category_name,"group",subcategory,brand,price,compare_price,currency,colors,sizes,description,fabric,care,tags,images,rating,reviews,stock,sku,is_new,is_best_seller,is_featured,created_index`;
const upd = cols
  .split(",")
  .filter((c) => c !== "id")
  .map((c) => `${c}=excluded.${c}`)
  .join(",");
for (const p of products) {
  const vals = [
    q(p.id), q(p.slug), q(p.name), q(p.category), q(p.categoryName), q(p.group),
    q(p.subcategory), q(p.brand), num(p.price), num(p.comparePrice), q(p.currency || "NGN"),
    arr(p.colors), arr(p.sizes), q(p.description), q(p.fabric), q(p.care), arr(p.tags),
    arr(p.images), num(p.rating), num(p.reviews), num(p.stock), q(p.sku),
    bool(p.isNew), bool(p.isBestSeller), bool(p.isFeatured), num(p.createdIndex),
  ].join(",");
  out += `insert into public.products (${cols}) values (${vals}) on conflict (id) do update set ${upd};\n`;
}

out += "\n-- Done. Now create your admin login user in Authentication → Users.\n";

const dest = path.join(root, "supabase", "setup.sql");
fs.writeFileSync(dest, out);
console.log(`Wrote ${dest}`);
console.log(`Size: ${(out.length / 1024).toFixed(0)} KB — ${products.length} products, ${categories.length} categories, admin=${ADMIN_EMAIL}`);

// One-shot Supabase setup over a direct Postgres connection.
//  1. runs the SQL migrations (schema, storage bucket, admin RLS)
//  2. registers admin email(s) from ADMIN_EMAILS
//  3. seeds all categories + products from src/data/*.json
//
// Reads config from luxe-app/.env.local (or the environment):
//   SUPABASE_DB_URL   = postgresql://...  (Dashboard > Settings > Database > Connection string / URI)
//   ADMIN_EMAILS      = comma-separated admin login emails
//
// Run:  node scripts/db-setup.mjs
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import pg from "pg";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");

// --- load .env.local (simple parser) ---
const envPath = path.join(root, ".env.local");
if (fs.existsSync(envPath)) {
  for (const line of fs.readFileSync(envPath, "utf8").split("\n")) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/i);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
  }
}

const DB_URL = process.env.SUPABASE_DB_URL;
const ADMIN_EMAILS = (process.env.ADMIN_EMAILS || "")
  .split(",").map((s) => s.trim().toLowerCase()).filter(Boolean);

if (!DB_URL) {
  console.error("Missing SUPABASE_DB_URL in .env.local");
  process.exit(1);
}

const migrations = ["0001_init.sql", "0002_storage_and_admin.sql"].map((f) =>
  fs.readFileSync(path.join(root, "supabase", "migrations", f), "utf8")
);

const products = JSON.parse(fs.readFileSync(path.join(root, "src/data/products.json"), "utf8"));
const categories = JSON.parse(fs.readFileSync(path.join(root, "src/data/categories.json"), "utf8"));

const client = new pg.Client({ connectionString: DB_URL, ssl: { rejectUnauthorized: false } });

async function run() {
  await client.connect();
  console.log("Connected. Running migrations…");
  for (const sql of migrations) await client.query(sql);
  console.log("Migrations applied.");

  if (ADMIN_EMAILS.length) {
    for (const email of ADMIN_EMAILS) {
      await client.query(
        "insert into public.admins(email) values ($1) on conflict (email) do nothing",
        [email]
      );
    }
    console.log("Admins registered:", ADMIN_EMAILS.join(", "));
  } else {
    console.warn("No ADMIN_EMAILS set — set it and re-run to grant admin access.");
  }

  // --- categories ---
  for (let i = 0; i < categories.length; i++) {
    const c = categories[i];
    await client.query(
      `insert into public.categories (slug,name,"group",subcategories,image,sort_order)
       values ($1,$2,$3,$4,$5,$6)
       on conflict (slug) do update set name=excluded.name,"group"=excluded."group",
         subcategories=excluded.subcategories,image=excluded.image,sort_order=excluded.sort_order`,
      [c.slug, c.name, c.group, c.subcategories ?? [], c.image ?? null, i]
    );
  }
  console.log(`Seeded ${categories.length} categories.`);

  // --- products ---
  const cols = [
    "id","slug","name","category","category_name","group","subcategory","brand","price",
    "compare_price","currency","colors","sizes","description","fabric","care","tags","images",
    "rating","reviews","stock","sku","is_new","is_best_seller","is_featured","created_index",
  ];
  const ph = cols.map((_, i) => `$${i + 1}`).join(",");
  const update = cols.filter((c) => c !== "id").map((c) => `"${c}"=excluded."${c}"`).join(",");
  const stmt = `insert into public.products (${cols.map((c) => `"${c}"`).join(",")})
    values (${ph}) on conflict (id) do update set ${update}`;

  for (const p of products) {
    await client.query(stmt, [
      p.id, p.slug, p.name, p.category, p.categoryName, p.group, p.subcategory ?? "",
      p.brand ?? "Luxe Universal", p.price, p.comparePrice ?? null, p.currency ?? "NGN",
      p.colors ?? [], p.sizes ?? [], p.description ?? "", p.fabric ?? "", p.care ?? "",
      p.tags ?? [], p.images ?? [], p.rating ?? 4.5, p.reviews ?? 0, p.stock ?? 0,
      p.sku ?? "", !!p.isNew, !!p.isBestSeller, !!p.isFeatured, p.createdIndex ?? 0,
    ]);
  }
  console.log(`Seeded ${products.length} products.`);

  const { rows } = await client.query(
    "select (select count(*) from public.products) as products, (select count(*) from public.categories) as categories, (select count(*) from public.admins) as admins"
  );
  console.log("DB now has:", rows[0]);
  await client.end();
  console.log("Done.");
}

run().catch(async (e) => {
  console.error("Setup failed:", e.message);
  try { await client.end(); } catch {}
  process.exit(1);
});

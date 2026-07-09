// Recreates the admin user via the GoTrue Admin API (bulletproof), then seeds
// the catalog via the service role (bypasses RLS). Finally verifies login.
// Reads .env.local. Run: node scripts/fix-and-seed.mjs
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createClient } from "@supabase/supabase-js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
for (const line of fs.readFileSync(path.join(root, ".env.local"), "utf8").split("\n")) {
  const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/i);
  if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
}

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const service = process.env.SUPABASE_SERVICE_ROLE_KEY;
const email = (process.env.ADMIN_EMAILS || "").split(",")[0].trim();
const password = process.env.ADMIN_PASSWORD || "Lognetics002@";

const admin = createClient(url, service, { auth: { persistSession: false, autoRefreshToken: false } });

async function recreateUser() {
  // find + delete any existing user with this email
  let page = 1;
  for (;;) {
    const { data, error } = await admin.auth.admin.listUsers({ page, perPage: 200 });
    if (error) throw new Error("listUsers: " + error.message);
    const match = data.users.filter((u) => (u.email || "").toLowerCase() === email.toLowerCase());
    for (const u of match) {
      await admin.auth.admin.deleteUser(u.id);
      console.log("Deleted existing user", u.id);
    }
    if (data.users.length < 200) break;
    page++;
  }
  const { data, error } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });
  if (error) throw new Error("createUser: " + error.message);
  console.log("Created admin user via Admin API:", data.user.id);
}

async function seed() {
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

  const { error: cErr } = await admin.from("categories").upsert(catRows, { onConflict: "slug" });
  if (cErr) throw new Error("categories: " + cErr.message);
  console.log(`Seeded ${catRows.length} categories.`);
  for (let i = 0; i < prodRows.length; i += 50) {
    const chunk = prodRows.slice(i, i + 50);
    const { error } = await admin.from("products").upsert(chunk, { onConflict: "id" });
    if (error) throw new Error(`products@${i}: ` + error.message);
    console.log(`Seeded products ${i + 1}-${i + chunk.length}`);
  }
}

async function verifyLogin() {
  const pub = createClient(url, anon, { auth: { persistSession: false } });
  const { data, error } = await pub.auth.signInWithPassword({ email, password });
  if (error) throw new Error("verify login FAILED: " + error.message);
  console.log("✅ Login verified for", data.user.email);
  const { data: isAdmin } = await pub.rpc("is_admin");
  console.log("is_admin() =>", isAdmin);
}

const run = async () => {
  await recreateUser();
  await seed();
  const { count } = await admin.from("products").select("id", { count: "exact", head: true });
  console.log("Products in DB:", count);
  await verifyLogin();
  console.log("DONE.");
};
run().catch((e) => { console.error("ERROR:", e.message); process.exit(1); });

// Adds the "Luxe Universal Wears Image" batch (66 products) to the catalog,
// pricing each from the screenshot-derived price map. Copies originals into
// public/products/<slug>.jpeg, appends to products.json, rebuilds categories.json.
// Run: node scripts/build-catalog-3.mjs
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const projectRoot = path.resolve(root, "..");
const imageSrcDir = path.join(projectRoot, "Luxe Universal Wears Image");
const imageOutDir = path.join(root, "public", "products");
const dataDir = path.join(root, "src", "data");

const existing = JSON.parse(fs.readFileSync(path.join(dataDir, "products.json"), "utf8"));
const items = JSON.parse(fs.readFileSync("/tmp/img_all.json", "utf8"));

// idx -> original filename
const map = {};
for (const line of fs.readFileSync("/tmp/img_map.tsv", "utf8").split("\n")) {
  const [idx, ...rest] = line.split("\t");
  if (idx && rest.length) map[idx] = rest.join("\t");
}

const slugify = (s) =>
  s.toLowerCase().replace(/['’`]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

// ---- price map derived from the WhatsApp price screenshots ----
function priceFor(o) {
  const t = `${o.type} ${o.subcategory} ${o.name}`.toLowerCase();
  const brand = (o.brand || "").toLowerCase();
  switch (o.category) {
    case "jeans": return 50000;
    case "t-shirts": return 35000;
    case "tuxedos": return 180000;
    case "jackets":
      return /harrington|blouson|ami/.test(t) || brand.includes("ami") ? 60000 : 50000; // denim jackets 50k
    case "shirts":
      return /camp|printed|short.?sleeve/.test(t) ? 40000 : 35000;
    case "slides":
      return brand.includes("loro piana") || /loafer|suede mule|suede loafer/.test(t) ? 100000 : 80000;
    case "casual-shoes":
      return brand.includes("ferragamo") ? 90000 : 100000;
    case "corporate-shoes":
      return /boot|chelsea|ankle/.test(t) ? 100000 : 90000; // oxford/monk/loafer 90k
    case "sneakers": return 70000;
    default: return 50000;
  }
}

const CATEGORY_META = {
  jeans: { name: "Jeans", group: "Clothing" },
  chinos: { name: "Chinos", group: "Clothing" },
  "t-shirts": { name: "T-Shirts", group: "Clothing" },
  "polo-shirts": { name: "Polo Shirts", group: "Clothing" },
  shirts: { name: "Shirts", group: "Clothing" },
  jackets: { name: "Jackets", group: "Clothing" },
  suits: { name: "Suits", group: "Suits" },
  blazers: { name: "Blazers", group: "Suits" },
  "double-breasted-suits": { name: "Double Breasted Suits", group: "Suits" },
  tuxedos: { name: "Tuxedos", group: "Suits" },
  sneakers: { name: "Sneakers", group: "Footwear" },
  "corporate-shoes": { name: "Corporate Shoes", group: "Footwear" },
  "casual-shoes": { name: "Casual Shoes", group: "Footwear" },
  slides: { name: "Slides & Sandals", group: "Footwear" },
  caps: { name: "Caps", group: "Accessories" },
  watches: { name: "Watches", group: "Accessories" },
  bangles: { name: "Bangles", group: "Accessories" },
  ties: { name: "Ties", group: "Accessories" },
  belts: { name: "Belts", group: "Accessories" },
};
const SUBS = JSON.parse(fs.readFileSync(path.join(dataDir, "categories.json"), "utf8"))
  .reduce((m, c) => ((m[c.slug] = c.subcategories), m), {});

const sizesFor = (cat) => {
  if (["corporate-shoes", "casual-shoes", "sneakers", "slides"].includes(cat))
    return ["40", "41", "42", "43", "44", "45", "46"];
  if (["watches", "bangles", "ties", "caps", "belts"].includes(cat)) return ["One Size"];
  return ["XS", "S", "M", "L", "XL", "XXL"];
};
const FABRIC = {
  jackets: "Premium cotton twill", suits: "Italian wool blend", tuxedos: "Wool with jacquard weave",
  jeans: "Premium stretch denim", shirts: "Cotton blend", "t-shirts": "Heavyweight cotton fleece",
  slides: "Moulded rubber / leather", "corporate-shoes": "Full-grain leather",
  "casual-shoes": "Premium suede / leather",
};

const usedSlugs = new Set(existing.map((p) => p.slug));
let maxIndex = existing.reduce((m, p) => Math.max(m, p.createdIndex || 0), 0);

const newProducts = [];
let missing = 0, i = 0;
for (const item of items) {
  const file = map[item.idx];
  if (!file) { console.warn(`no source file for idx ${item.idx}`); missing++; continue; }
  const src = path.join(imageSrcDir, file);
  if (!fs.existsSync(src)) { console.warn(`missing image: ${file}`); missing++; continue; }
  i += 1;
  let slug = slugify(item.name);
  while (usedSlugs.has(slug)) slug = `${slug}-${i}`;
  usedSlugs.add(slug);

  const outName = `${slug}.jpeg`;
  fs.copyFileSync(src, path.join(imageOutDir, outName));

  const price = priceFor(item);
  const seed = [...slug].reduce((a, c) => a + c.charCodeAt(0), 0);
  const onSale = seed % 4 === 0;
  const idx = maxIndex + i;

  newProducts.push({
    id: slug, slug, name: item.name,
    category: item.category,
    categoryName: CATEGORY_META[item.category]?.name ?? item.category,
    group: CATEGORY_META[item.category]?.group ?? "Clothing",
    subcategory: item.subcategory || "",
    brand: item.brand || "Luxe Universal",
    price,
    comparePrice: onSale ? Math.round((price * 1.25) / 1000) * 1000 : null,
    currency: "NGN",
    colors: item.colors || [],
    sizes: sizesFor(item.category),
    description: item.description || "",
    fabric: FABRIC[item.category] ?? "Premium materials",
    care: "Professional care recommended. Store away from direct sunlight.",
    tags: [item.category, ...(item.colors || []), item.brand].filter(Boolean).map((s) => String(s).toLowerCase()),
    images: [`/products/${outName}`],
    rating: Math.round((4.4 + ((seed % 6) / 10)) * 10) / 10,
    reviews: 6 + (seed % 90),
    stock: 5 + (seed % 25),
    sku: `LUW-${item.category.toUpperCase().slice(0, 3)}-${String(idx).padStart(3, "0")}`,
    isNew: true,
    isBestSeller: seed % 5 === 0,
    isFeatured: seed % 6 === 0,
    createdIndex: idx,
  });
}

const combined = [...existing.map((p) => ({ ...p, isNew: false })), ...newProducts];

const categories = Object.entries(CATEGORY_META).map(([slug, meta]) => {
  const inCat = combined.filter((p) => p.category === slug);
  return { slug, name: meta.name, group: meta.group, subcategories: SUBS[slug] ?? [], count: inCat.length, image: inCat[0]?.images[0] ?? null };
});

fs.writeFileSync(path.join(dataDir, "products.json"), JSON.stringify(combined, null, 2));
fs.writeFileSync(path.join(dataDir, "categories.json"), JSON.stringify(categories, null, 2));

// price histogram for review
const hist = {};
for (const p of newProducts) hist[`${p.category}:${p.price/1000}k`] = (hist[`${p.category}:${p.price/1000}k`] || 0) + 1;
console.log(`Batch 3 added: ${newProducts.length} products (missing sources: ${missing}).`);
console.log(`Total products: ${combined.length}.`);
console.log("New price breakdown:", JSON.stringify(hist, null, 0));

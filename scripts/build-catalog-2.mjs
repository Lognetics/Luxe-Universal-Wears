// Adds the "Luxe Product images 2" batch to the catalog.
// Reads existing src/data/products.json (batch 1) + catalog.raw.2.json (batch 2),
// copies batch-2 images into public/products, appends new products, and
// regenerates categories.json from the combined set.
// Run: node scripts/build-catalog-2.mjs
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const projectRoot = path.resolve(root, "..");
const imageSrcDir = path.join(projectRoot, "Luxe Product images 2");
const imageOutDir = path.join(root, "public", "products");
const dataDir = path.join(root, "src", "data");

fs.mkdirSync(imageOutDir, { recursive: true });

const existing = JSON.parse(fs.readFileSync(path.join(dataDir, "products.json"), "utf8"));
const raw = JSON.parse(fs.readFileSync(path.join(root, "catalog.raw.2.json"), "utf8"));

const slugify = (s) =>
  s.toLowerCase().replace(/[''`]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

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

// Category metadata (display order + subcategories for the mega menu) — mirrors batch 1.
const SUBS = {
  jeans: ["Slim Fit", "Regular Fit", "Skinny Fit", "Cargo", "Wide Leg", "Luxury Denim"],
  chinos: ["Formal Chinos", "Casual Chinos", "Cargo", "Joggers"],
  "t-shirts": ["Round Neck", "V Neck", "Graphic Tee", "Long Sleeve", "Premium Tees"],
  "polo-shirts": ["Luxury Polo", "Corporate Polo", "Quarter-Zip", "Long Sleeve"],
  shirts: ["Corporate Shirts", "Casual Shirts", "Pattern Shirts", "Co-Ord Sets"],
  jackets: ["Shirt Jacket", "Trucker Jacket", "Leather", "Overshirt"],
  suits: ["Single Breasted", "Two-Piece", "Three Piece", "Business Suits"],
  blazers: ["Corporate Blazers", "Smart Casual Blazers", "Single Breasted"],
  "double-breasted-suits": ["Classic", "Modern", "Peak Lapel"],
  tuxedos: ["Classic", "Double Breasted", "Jacquard"],
  sneakers: ["Luxury Sneakers", "Casual Sneakers", "Running"],
  "corporate-shoes": ["Oxford", "Derby", "Monk Strap", "Loafers"],
  "casual-shoes": ["Suede Loafer", "Boots", "Slip-On"],
  slides: ["Cross-Strap", "Double-Strap", "Mules", "Sandals"],
  caps: ["Baseball", "Fedora", "Flat Cap"],
  watches: ["Luxury", "Classic"],
  bangles: ["Gold", "Silver"],
  ties: ["Silk", "Knit"],
  belts: ["Leather", "Reversible"],
};

const PRICE_BASE = {
  jeans: 45000, chinos: 38000, "t-shirts": 22000, "polo-shirts": 32000, shirts: 35000,
  jackets: 65000, suits: 185000, blazers: 95000, "double-breasted-suits": 240000,
  tuxedos: 320000, sneakers: 78000, "corporate-shoes": 88000, "casual-shoes": 72000,
  slides: 42000, caps: 18000, watches: 250000, bangles: 28000, ties: 15000, belts: 25000,
};

const sizesFor = (cat) => {
  if (["corporate-shoes", "casual-shoes", "sneakers", "slides"].includes(cat))
    return ["40", "41", "42", "43", "44", "45", "46"];
  if (["watches", "bangles", "ties", "caps", "belts"].includes(cat)) return ["One Size"];
  return ["XS", "S", "M", "L", "XL", "XXL"];
};

const FABRIC = {
  jackets: "Premium leather / wool blend", suits: "Italian wool blend",
  blazers: "Wool-rich blend", tuxedos: "Wool with jacquard weave",
  chinos: "Stretch cotton twill", jeans: "Premium stretch denim",
  "polo-shirts": "Mercerised cotton knit", "t-shirts": "Combed cotton jersey",
  shirts: "Cotton blend", slides: "Genuine leather",
  "corporate-shoes": "Full-grain leather", "casual-shoes": "Premium suede",
  sneakers: "Premium leather / mesh", caps: "Felt / wool blend",
};

// Preserve existing slugs; continue createdIndex after the highest existing one.
const usedSlugs = new Set(existing.map((p) => p.slug));
let maxIndex = existing.reduce((m, p) => Math.max(m, p.createdIndex || 0), 0);

const newProducts = [];
let i = 0;
for (const item of raw) {
  i += 1;
  let slug = slugify(item.name);
  while (usedSlugs.has(slug)) slug = `${slug}-${i}`;
  usedSlugs.add(slug);

  const src = path.join(imageSrcDir, item.file);
  if (!fs.existsSync(src)) {
    console.warn(`!! missing source image, skipping: ${item.file}`);
    continue;
  }
  const outName = `${slug}.jpeg`;
  fs.copyFileSync(src, path.join(imageOutDir, outName));

  const base = PRICE_BASE[item.category] ?? 30000;
  const seed = [...slug].reduce((a, c) => a + c.charCodeAt(0), 0);
  const price = base + (seed % 7) * 1500;
  const onSale = seed % 3 === 0;
  const comparePrice = onSale ? Math.round((price * 1.25) / 1000) * 1000 : null;
  const rating = Math.round((4 + ((seed % 10) / 10) * 0.9) * 10) / 10;
  const idx = maxIndex + i;

  newProducts.push({
    id: slug,
    slug,
    name: item.name,
    category: item.category,
    categoryName: CATEGORY_META[item.category]?.name ?? item.category,
    group: CATEGORY_META[item.category]?.group ?? "Clothing",
    subcategory: item.subcategory || "",
    brand: item.brand || "Luxe Universal",
    price,
    comparePrice,
    currency: "NGN",
    colors: item.colors || [],
    sizes: sizesFor(item.category),
    description: item.description,
    fabric: FABRIC[item.category] ?? "Premium materials",
    care: "Professional care recommended. Store away from direct sunlight.",
    tags: item.tags || [],
    images: [`/products/${outName}`],
    rating,
    reviews: 8 + (seed % 120),
    stock: 4 + (seed % 30),
    sku: `LUW-${item.category.toUpperCase().slice(0, 3)}-${String(idx).padStart(3, "0")}`,
    isNew: true, // whole batch is newly added
    isBestSeller: seed % 4 === 0,
    isFeatured: seed % 5 === 0,
    createdIndex: idx,
  });
}

// Demote batch-1 "new" flags so the genuinely-new batch leads New Arrivals.
const combined = [...existing.map((p) => ({ ...p, isNew: false })), ...newProducts];

// Rebuild categories from the combined set.
const categories = Object.entries(CATEGORY_META).map(([slug, meta]) => {
  const inCat = combined.filter((p) => p.category === slug);
  return {
    slug,
    name: meta.name,
    group: meta.group,
    subcategories: SUBS[slug] ?? [],
    count: inCat.length,
    image: inCat[0]?.images[0] ?? null,
  };
});

fs.writeFileSync(path.join(dataDir, "products.json"), JSON.stringify(combined, null, 2));
fs.writeFileSync(path.join(dataDir, "categories.json"), JSON.stringify(categories, null, 2));

console.log(`Batch 2 added: ${newProducts.length} products.`);
console.log(`Total products: ${combined.length}.`);
console.log(`Populated categories: ${categories.filter((c) => c.count).length}.`);

// Generates the product + category data files and copies images into /public.
// Run: node scripts/build-catalog.mjs
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const projectRoot = path.resolve(root, "..");
const imageSrcDir = path.join(projectRoot, "Image Folder");
const imageOutDir = path.join(root, "public", "products");
const dataDir = path.join(root, "src", "data");

fs.mkdirSync(imageOutDir, { recursive: true });
fs.mkdirSync(dataDir, { recursive: true });

const raw = JSON.parse(fs.readFileSync(path.join(root, "catalog.raw.json"), "utf8"));

const slugify = (s) =>
  s
    .toLowerCase()
    .replace(/[''`]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

// ---- Category metadata (display order + grouping for the mega menu) ----
const CATEGORY_META = {
  jeans: { name: "Jeans", group: "Clothing", subs: ["Slim Fit", "Regular Fit", "Skinny Fit", "Luxury Denim"] },
  chinos: { name: "Chinos", group: "Clothing", subs: ["Formal Chinos", "Casual Chinos", "Wide Leg"] },
  "t-shirts": { name: "T-Shirts", group: "Clothing", subs: ["Round Neck", "V Neck", "Graphic Tee", "Premium Tees"] },
  "polo-shirts": { name: "Polo Shirts", group: "Clothing", subs: ["Luxury Polo", "Corporate Polo", "Quarter-Zip", "Striped"] },
  shirts: { name: "Shirts", group: "Clothing", subs: ["Corporate Shirts", "Casual Shirts", "Pattern Shirts", "Luxury Shirts"] },
  jackets: { name: "Jackets", group: "Clothing", subs: ["Shirt Jacket", "Trucker Jacket", "Harrington", "Corduroy", "Chore Jacket"] },
  suits: { name: "Suits", group: "Suits", subs: ["Single Breasted", "Two-Piece", "Three Piece", "Business Suits"] },
  blazers: { name: "Blazers", group: "Suits", subs: ["Corporate Blazers", "Smart Casual Blazers", "Single Breasted"] },
  "double-breasted-suits": { name: "Double Breasted Suits", group: "Suits", subs: ["Classic", "Modern"] },
  tuxedos: { name: "Tuxedos", group: "Suits", subs: ["Classic", "Double Breasted", "Jacquard"] },
  sneakers: { name: "Sneakers", group: "Footwear", subs: ["Luxury Sneakers", "Casual Sneakers"] },
  "corporate-shoes": { name: "Corporate Shoes", group: "Footwear", subs: ["Oxford", "Derby", "Monk Strap", "Loafers", "Tassel Loafer"] },
  "casual-shoes": { name: "Casual Shoes", group: "Footwear", subs: ["Suede Loafer", "Suede Boot", "Slip-On"] },
  slides: { name: "Slides & Sandals", group: "Footwear", subs: ["Cross-Strap", "Buckle Strap", "Sandals", "Mules"] },
  caps: { name: "Caps", group: "Accessories", subs: ["Baseball", "Flat Cap"] },
  watches: { name: "Watches", group: "Accessories", subs: ["Luxury", "Classic"] },
  bangles: { name: "Bangles", group: "Accessories", subs: ["Gold", "Silver"] },
  ties: { name: "Ties", group: "Accessories", subs: ["Silk", "Knit"] },
  belts: { name: "Belts", group: "Accessories", subs: ["Leather", "Reversible"] },
};

// Base price (NGN) per category, before per-item variation.
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
  jackets: "Premium wool / cotton blend", suits: "Italian wool blend",
  blazers: "Wool-rich tweed blend", tuxedos: "Wool with jacquard weave",
  chinos: "Stretch cotton twill", "polo-shirts": "Mercerised cotton knit",
  "t-shirts": "Combed cotton jersey", slides: "Genuine leather",
  "corporate-shoes": "Full-grain leather", "casual-shoes": "Premium suede",
};

const products = [];
const usedSlugs = new Set();
let i = 0;
for (const item of raw) {
  i += 1;
  let slug = slugify(item.name);
  while (usedSlugs.has(slug)) slug = `${slug}-${i}`;
  usedSlugs.add(slug);

  // Copy image -> public/products/<slug>.jpeg
  const src = path.join(imageSrcDir, item.file);
  const outName = `${slug}.jpeg`;
  fs.copyFileSync(src, path.join(imageOutDir, outName));

  const base = PRICE_BASE[item.category] ?? 30000;
  // deterministic variation from slug characters
  const seed = [...slug].reduce((a, c) => a + c.charCodeAt(0), 0);
  const variation = (seed % 7) * 1500;
  const price = base + variation;
  const onSale = seed % 3 === 0;
  const comparePrice = onSale ? Math.round((price * 1.25) / 1000) * 1000 : null;
  const rating = 4 + ((seed % 10) / 10) * 0.9; // 4.0 - 4.9
  const reviews = 8 + (seed % 120);
  const stock = 4 + (seed % 30);

  products.push({
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
    care: "Professional dry clean recommended. Store on a padded hanger away from direct sunlight.",
    tags: item.tags || [],
    images: [`/products/${outName}`],
    rating: Math.round(rating * 10) / 10,
    reviews,
    stock,
    sku: `LUW-${item.category.toUpperCase().slice(0, 3)}-${String(i).padStart(3, "0")}`,
    isNew: i > raw.length - 12, // last dozen = new arrivals
    isBestSeller: seed % 4 === 0,
    isFeatured: seed % 5 === 0,
    createdIndex: i,
  });
}

// ---- Build categories with counts + representative image ----
const categories = Object.entries(CATEGORY_META).map(([slug, meta]) => {
  const inCat = products.filter((p) => p.category === slug);
  return {
    slug,
    name: meta.name,
    group: meta.group,
    subcategories: meta.subs,
    count: inCat.length,
    image: inCat[0]?.images[0] ?? null,
  };
});

fs.writeFileSync(path.join(dataDir, "products.json"), JSON.stringify(products, null, 2));
fs.writeFileSync(path.join(dataDir, "categories.json"), JSON.stringify(categories, null, 2));

console.log(`Wrote ${products.length} products across ${categories.filter((c) => c.count).length} populated categories.`);
console.log(`Images copied to public/products/`);

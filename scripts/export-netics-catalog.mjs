import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const PRODUCTS_PER_BATCH = 100;
const sourcePath = path.resolve("src/data/products.json");
const outFlagIndex = process.argv.indexOf("--out");
if (outFlagIndex >= 0 && !process.argv[outFlagIndex + 1]) {
  throw new Error("--out requires a directory path.");
}
const outputDirectory = path.resolve(
  outFlagIndex >= 0 && process.argv[outFlagIndex + 1]
    ? process.argv[outFlagIndex + 1]
    : ".netics/onboarding",
);

const products = JSON.parse(await readFile(sourcePath, "utf8"));

if (!Array.isArray(products) || products.length === 0) {
  throw new Error("src/data/products.json must contain at least one product.");
}

const seenSlugs = new Set();
const seenSkus = new Set();
const validationErrors = [];

const items = products.map((product, index) => {
  const label = `product ${index + 1}`;
  if (!product.name?.trim()) validationErrors.push(`${label}: missing name`);
  if (!product.slug?.trim()) validationErrors.push(`${label}: missing slug`);
  if (!product.sku?.trim()) validationErrors.push(`${label}: missing SKU`);
  if (!Number.isFinite(product.price) || product.price <= 0) {
    validationErrors.push(`${label}: invalid price`);
  }
  if (!Number.isInteger(product.stock) || product.stock < 0) {
    validationErrors.push(`${label}: invalid stock`);
  }
  if (product.currency !== "NGN") validationErrors.push(`${label}: currency must be NGN`);
  if (seenSlugs.has(product.slug)) validationErrors.push(`${label}: duplicate slug ${product.slug}`);
  if (seenSkus.has(product.sku)) validationErrors.push(`${label}: duplicate SKU ${product.sku}`);
  seenSlugs.add(product.slug);
  seenSkus.add(product.sku);

  const detailLines = [
    product.description,
    product.brand ? `Brand: ${product.brand}.` : "",
    product.fabric ? `Fabric: ${product.fabric}.` : "",
    product.sizes?.length ? `Sizes: ${product.sizes.join(", ")}.` : "",
    product.colors?.length ? `Colours: ${product.colors.join(", ")}.` : "",
    product.care ? `Care: ${product.care}.` : "",
    `Product page: https://www.luxeuniversalwears.com/product/${product.slug}`,
  ].filter(Boolean);

  return {
    name: product.name.trim(),
    sku: product.sku.trim(),
    category: product.categoryName || product.category,
    description: detailLines.join("\n"),
    price: product.price,
    in_stock: product.stock > 0,
    stock_level: product.stock,
    source_slug: product.slug,
  };
});

if (validationErrors.length) {
  throw new Error(`Catalogue validation failed:\n- ${validationErrors.join("\n- ")}`);
}

await mkdir(outputDirectory, { recursive: true });

const batches = [];
for (let offset = 0; offset < items.length; offset += PRODUCTS_PER_BATCH) {
  const batchNumber = batches.length + 1;
  const batch = items.slice(offset, offset + PRODUCTS_PER_BATCH);
  const filename = `products-${String(batchNumber).padStart(3, "0")}.json`;
  await writeFile(
    path.join(outputDirectory, filename),
    `${JSON.stringify({ currency: "NGN", items: batch }, null, 2)}\n`,
    "utf8",
  );
  batches.push({ filename, count: batch.length });
}

const categories = Object.entries(
  items.reduce((counts, item) => {
    counts[item.category] = (counts[item.category] || 0) + 1;
    return counts;
  }, {}),
)
  .sort(([left], [right]) => left.localeCompare(right))
  .map(([name, count]) => ({ name, count }));

const summary = {
  source: "src/data/products.json",
  source_commit_required: true,
  currency: "NGN",
  total_products: items.length,
  in_stock_products: items.filter((item) => item.in_stock).length,
  categories,
  batches,
  warning:
    "Owner approval is required before importing. Prices and stock are a repository snapshot, not a live inventory feed.",
};

await writeFile(
  path.join(outputDirectory, "catalogue-summary.json"),
  `${JSON.stringify(summary, null, 2)}\n`,
  "utf8",
);

console.log(
  `Validated ${items.length} products and wrote ${batches.length} NETICS batches to ${outputDirectory}.`,
);
console.log("Do not import until the owner signs docs/netics/OWNER-SIGN-OFF.md.");

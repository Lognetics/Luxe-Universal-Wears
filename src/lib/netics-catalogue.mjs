// @ts-check
/**
 * The NETICS catalogue in this shop's own shape.
 *
 * Plain JavaScript on purpose: the build step (scripts/pull-catalogue.mjs)
 * runs it under Node before Next.js starts, and the app imports the same
 * functions at runtime, so there is exactly one mapping to keep right.
 *
 * @typedef {import("./types").Product} Product
 * @typedef {import("./types").Category} Category
 *
 * @typedef {Object} NeticsCatalogueProduct One product as NETICS returns it.
 * @property {string} id
 * @property {string} name
 * @property {string} slug
 * @property {string} sku
 * @property {string} category
 * @property {string} description
 * @property {number} price
 * @property {number | null} compare_price
 * @property {string} url
 * @property {string} image_url
 * @property {string[]} images
 * @property {Record<string, string[]>} options
 * @property {string[]} tags
 * @property {string[]} badges
 * @property {Record<string, string>} details
 * @property {boolean} in_stock
 * @property {number | null} stock_level
 * @property {boolean} is_active
 * @property {string | null} created_at
 * @property {string | null} updated_at
 *
 * @typedef {{ slug: string; name: string; group: string }} CategoryLookup
 */

export const SITE_ORIGIN = (
  process.env.NEXT_PUBLIC_SITE_URL?.trim() || "https://www.luxeuniversalwears.com"
).replace(/\/+$/, "");

/** @param {string} value */
export function slugify(value) {
  return value
    .toLowerCase()
    .replace(/['’`]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

/** A picture on this very site comes back as its static path; others stay absolute.
 * @param {string} url */
export function siteRelative(url) {
  return url.startsWith(`${SITE_ORIGIN}/`) ? url.slice(SITE_ORIGIN.length) : url;
}

/**
 * One NETICS product back in the storefront's shape.
 * @param {NeticsCatalogueProduct} item
 * @param {CategoryLookup[]} categories
 * @param {number} fallbackIndex
 * @returns {Product}
 */
export function fromNeticsProduct(item, categories, fallbackIndex) {
  const details = item.details ?? {};
  const options = item.options ?? {};
  const badges = new Set(item.badges ?? []);
  const wantedCategory = details.category_slug || "";
  const category =
    categories.find((c) => c.slug === wantedCategory) ??
    categories.find((c) => c.name.toLowerCase() === (item.category || "").trim().toLowerCase()) ??
    categories.find((c) => c.slug === slugify(item.category || ""));
  const categorySlug = category?.slug ?? (slugify(item.category || "") || "uncategorised");
  const images = (item.images?.length ? item.images : item.image_url ? [item.image_url] : []).map(
    siteRelative
  );
  const slug = item.slug || slugify(item.name) || item.id;
  const price = Number(item.price) || 0;
  const comparePrice =
    item.compare_price != null && Number(item.compare_price) > price ? Number(item.compare_price) : null;

  return {
    id: slug,
    slug,
    name: item.name,
    category: categorySlug,
    categoryName: category?.name ?? (item.category || "Uncategorised"),
    group: details.group || category?.group || "Clothing",
    subcategory: details.subcategory ?? "",
    brand: details.brand || "Luxe Universal",
    price,
    comparePrice,
    currency: "NGN",
    colors: options.colours ?? options.colors ?? options.colour ?? [],
    sizes: options.sizes ?? options.size ?? [],
    description: item.description ?? "",
    fabric: details.fabric ?? "",
    care: details.care ?? "",
    tags: item.tags ?? [],
    images,
    rating: Number(details.rating) || 4.5,
    reviews: Number(details.reviews) || 0,
    stock: item.in_stock ? (item.stock_level ?? 12) : 0,
    sku: item.sku ?? "",
    isNew: badges.has("new"),
    isBestSeller: badges.has("best_seller"),
    isFeatured: badges.has("featured"),
    createdIndex: Number(details.created_index) || fallbackIndex,
  };
}

/**
 * The site's product list from NETICS, in the order the shop has always shown it.
 * @param {NeticsCatalogueProduct[]} items
 * @param {CategoryLookup[]} categories
 * @returns {Product[]}
 */
export function catalogueFromNetics(items, categories) {
  const ordered = items
    .filter((item) => item.is_active)
    .sort(
      (a, b) =>
        (a.created_at ?? "").localeCompare(b.created_at ?? "") || a.name.localeCompare(b.name)
    );
  // A product carries its original position (created_index) through NETICS;
  // one added there gets the next position, so it still counts as newest.
  const known = ordered.map((item) => Number(item.details?.created_index) || 0);
  let next = Math.max(0, ...known);
  return ordered
    .map((item) => fromNeticsProduct(item, categories, ++next))
    .sort((a, b) => a.createdIndex - b.createdIndex);
}

/**
 * The shelves for these products: the curated categories with fresh counts
 * and cover pictures, plus a shelf for any category NETICS knows that this
 * site has not curated yet, so no product disappears for want of a row.
 * @param {Product[]} products
 * @param {Category[]} baseCategories
 * @returns {Category[]}
 */
export function categoriesFor(products, baseCategories) {
  /** @type {Map<string, number>} */
  const counts = new Map();
  for (const product of products) counts.set(product.category, (counts.get(product.category) ?? 0) + 1);
  /** @type {Category[]} */
  const categories = baseCategories.map((category) => ({
    ...category,
    count: counts.get(category.slug) ?? 0,
    image: category.image ?? products.find((p) => p.category === category.slug)?.images[0] ?? null,
  }));
  for (const product of products) {
    if (categories.some((category) => category.slug === product.category)) continue;
    categories.push({
      slug: product.category,
      name: product.categoryName,
      group: product.group,
      subcategories: [],
      count: counts.get(product.category) ?? 0,
      image: product.images[0] ?? null,
    });
  }
  return categories;
}

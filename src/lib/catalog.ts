import productsData from "@/data/products.json";
import categoriesData from "@/data/categories.json";
import type { Product, Category } from "./types";

export const products = productsData as Product[];
export const categories = categoriesData as Category[];

export const MENU_GROUPS = ["Clothing", "Suits", "Footwear", "Accessories"] as const;

export function getProduct(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getCategory(slug: string): Category | undefined {
  return categories.find((c) => c.slug === slug);
}

export function categoriesByGroup(group: string): Category[] {
  return categories.filter((c) => c.group === group);
}

export function populatedCategories(): Category[] {
  return categories.filter((c) => c.count > 0);
}

export function productsInCategory(slug: string): Product[] {
  return products.filter((p) => p.category === slug);
}

export function newArrivals(limit = 8): Product[] {
  return [...products].sort((a, b) => b.createdIndex - a.createdIndex).slice(0, limit);
}

export function bestSellers(limit = 8): Product[] {
  return products.filter((p) => p.isBestSeller).slice(0, limit);
}

export function featured(limit = 8): Product[] {
  return products.filter((p) => p.isFeatured).slice(0, limit);
}

export function onSale(limit = 8): Product[] {
  return products.filter((p) => p.comparePrice).slice(0, limit);
}

export function relatedProducts(product: Product, limit = 4): Product[] {
  const sameCat = products.filter((p) => p.category === product.category && p.id !== product.id);
  const sameGroup = products.filter(
    (p) => p.group === product.group && p.category !== product.category
  );
  return [...sameCat, ...sameGroup].slice(0, limit);
}

export function allColors(): string[] {
  const set = new Set<string>();
  products.forEach((p) => p.colors.forEach((c) => set.add(c)));
  return [...set].sort();
}

export function allBrands(): string[] {
  const set = new Set<string>();
  products.forEach((p) => set.add(p.brand));
  return [...set].sort();
}

export function allSizes(): string[] {
  return ["XS", "S", "M", "L", "XL", "XXL", "40", "41", "42", "43", "44", "45", "46", "One Size"];
}

export function priceRange(): { min: number; max: number } {
  const prices = products.map((p) => p.price);
  return { min: Math.min(...prices), max: Math.max(...prices) };
}

export function searchProducts(query: string): Product[] {
  const q = query.toLowerCase().trim();
  if (!q) return [];
  return products.filter(
    (p) =>
      p.name.toLowerCase().includes(q) ||
      p.categoryName.toLowerCase().includes(q) ||
      p.brand.toLowerCase().includes(q) ||
      p.tags.some((t) => t.includes(q))
  );
}

export type ShopFilters = {
  categories?: string[];
  sizes?: string[];
  colors?: string[];
  brands?: string[];
  maxPrice?: number;
  minPrice?: number;
  onSale?: boolean;
  sort?: string;
  query?: string;
};

export function filterProducts(filters: ShopFilters): Product[] {
  let result = [...products];
  const { categories: cats, sizes, colors, brands, maxPrice, minPrice, onSale: sale, sort, query } =
    filters;

  if (query) {
    const q = query.toLowerCase();
    result = result.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.categoryName.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.tags.some((t) => t.includes(q))
    );
  }
  if (cats?.length) result = result.filter((p) => cats.includes(p.category));
  if (sizes?.length) result = result.filter((p) => p.sizes.some((s) => sizes.includes(s)));
  if (colors?.length) result = result.filter((p) => p.colors.some((c) => colors.includes(c)));
  if (brands?.length) result = result.filter((p) => brands.includes(p.brand));
  if (typeof minPrice === "number") result = result.filter((p) => p.price >= minPrice);
  if (typeof maxPrice === "number") result = result.filter((p) => p.price <= maxPrice);
  if (sale) result = result.filter((p) => p.comparePrice);

  switch (sort) {
    case "price-asc":
      result.sort((a, b) => a.price - b.price);
      break;
    case "price-desc":
      result.sort((a, b) => b.price - a.price);
      break;
    case "rating":
      result.sort((a, b) => b.rating - a.rating);
      break;
    case "newest":
      result.sort((a, b) => b.createdIndex - a.createdIndex);
      break;
    default:
      result.sort((a, b) => Number(b.isBestSeller) - Number(a.isBestSeller));
  }
  return result;
}

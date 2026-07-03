import type { Product, Category } from "../types";

/** Convert a snake_case products row from Supabase into the app's Product type. */
export function rowToProduct(r: Record<string, unknown>): Product {
  return {
    id: r.id as string,
    slug: r.slug as string,
    name: r.name as string,
    category: r.category as string,
    categoryName: (r.category_name as string) ?? "",
    group: (r.group as string) ?? "Clothing",
    subcategory: (r.subcategory as string) ?? "",
    brand: (r.brand as string) ?? "Luxe Universal",
    price: (r.price as number) ?? 0,
    comparePrice: (r.compare_price as number | null) ?? null,
    currency: (r.currency as string) ?? "NGN",
    colors: (r.colors as string[]) ?? [],
    sizes: (r.sizes as string[]) ?? [],
    description: (r.description as string) ?? "",
    fabric: (r.fabric as string) ?? "",
    care: (r.care as string) ?? "",
    tags: (r.tags as string[]) ?? [],
    images: (r.images as string[]) ?? [],
    rating: Number(r.rating ?? 4.5),
    reviews: (r.reviews as number) ?? 0,
    stock: (r.stock as number) ?? 0,
    sku: (r.sku as string) ?? "",
    isNew: !!r.is_new,
    isBestSeller: !!r.is_best_seller,
    isFeatured: !!r.is_featured,
    createdIndex: (r.created_index as number) ?? 0,
  };
}

/** Convert an app Product into a snake_case row for Supabase writes. */
export function productToRow(p: Partial<Product>): Record<string, unknown> {
  const row: Record<string, unknown> = {};
  if (p.id !== undefined) row.id = p.id;
  if (p.slug !== undefined) row.slug = p.slug;
  if (p.name !== undefined) row.name = p.name;
  if (p.category !== undefined) row.category = p.category;
  if (p.categoryName !== undefined) row.category_name = p.categoryName;
  if (p.group !== undefined) row.group = p.group;
  if (p.subcategory !== undefined) row.subcategory = p.subcategory;
  if (p.brand !== undefined) row.brand = p.brand;
  if (p.price !== undefined) row.price = p.price;
  if (p.comparePrice !== undefined) row.compare_price = p.comparePrice;
  if (p.currency !== undefined) row.currency = p.currency;
  if (p.colors !== undefined) row.colors = p.colors;
  if (p.sizes !== undefined) row.sizes = p.sizes;
  if (p.description !== undefined) row.description = p.description;
  if (p.fabric !== undefined) row.fabric = p.fabric;
  if (p.care !== undefined) row.care = p.care;
  if (p.tags !== undefined) row.tags = p.tags;
  if (p.images !== undefined) row.images = p.images;
  if (p.rating !== undefined) row.rating = p.rating;
  if (p.reviews !== undefined) row.reviews = p.reviews;
  if (p.stock !== undefined) row.stock = p.stock;
  if (p.sku !== undefined) row.sku = p.sku;
  if (p.isNew !== undefined) row.is_new = p.isNew;
  if (p.isBestSeller !== undefined) row.is_best_seller = p.isBestSeller;
  if (p.isFeatured !== undefined) row.is_featured = p.isFeatured;
  if (p.createdIndex !== undefined) row.created_index = p.createdIndex;
  return row;
}

/** Convert a snake_case categories row into the app's Category type (count filled separately). */
export function rowToCategory(r: Record<string, unknown>, count = 0): Category {
  return {
    slug: r.slug as string,
    name: r.name as string,
    group: (r.group as string) ?? "Clothing",
    subcategories: (r.subcategories as string[]) ?? [],
    count,
    image: (r.image as string | null) ?? null,
  };
}

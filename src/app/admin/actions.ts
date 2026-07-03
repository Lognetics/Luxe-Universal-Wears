"use server";

import { revalidatePath } from "next/cache";
import { getSupabaseServerClient, isCurrentUserAdmin } from "@/lib/supabase/ssr";
import { productToRow } from "@/lib/supabase/mappers";
import type { Product } from "@/lib/types";

const slugify = (s: string) =>
  s.toLowerCase().replace(/['’`]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

async function requireAdmin() {
  const sb = await getSupabaseServerClient();
  if (!sb) throw new Error("Supabase is not configured.");
  if (!(await isCurrentUserAdmin())) throw new Error("Not authorised.");
  return sb;
}

export type SaveProductInput = Partial<Product> & { name: string; category: string };

/** Create or update a product. Returns the saved product id/slug. */
export async function saveProduct(input: SaveProductInput) {
  const sb = await requireAdmin();

  const isNew = !input.id;
  const slug = input.slug || slugify(input.name);
  const id = input.id || slug;

  // Resolve category display name + group from the categories table.
  const { data: cat } = await sb
    .from("categories")
    .select("name, \"group\"")
    .eq("slug", input.category)
    .maybeSingle();

  const row = productToRow({
    ...input,
    id,
    slug,
    categoryName: (cat?.name as string) ?? input.categoryName ?? input.category,
    group: (cat?.group as string) ?? input.group ?? "Clothing",
  });

  if (isNew) {
    // sensible defaults for a brand-new product
    row.currency ??= "NGN";
    row.rating ??= 4.6;
    row.reviews ??= 0;
    row.stock ??= 12;
    row.is_new ??= true;
    if (row.created_index == null) {
      const { data: max } = await sb
        .from("products")
        .select("created_index")
        .order("created_index", { ascending: false })
        .limit(1)
        .maybeSingle();
      row.created_index = ((max?.created_index as number) ?? 0) + 1;
    }
    row.sku ??= `LUW-${String(input.category).toUpperCase().slice(0, 3)}-${row.created_index}`;
  }

  const { error } = await sb.from("products").upsert(row, { onConflict: "id" });
  if (error) throw new Error(error.message);

  revalidatePath("/admin/products");
  revalidatePath(`/admin/products/${id}`);
  return { id, slug };
}

export async function deleteProduct(id: string) {
  const sb = await requireAdmin();
  const { error } = await sb.from("products").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/products");
}

export async function saveCategory(input: {
  slug?: string;
  name: string;
  group: string;
  subcategories?: string[];
  image?: string | null;
}) {
  const sb = await requireAdmin();
  const slug = input.slug || slugify(input.name);
  const { error } = await sb.from("categories").upsert(
    {
      slug,
      name: input.name,
      group: input.group,
      subcategories: input.subcategories ?? [],
      image: input.image ?? null,
    },
    { onConflict: "slug" }
  );
  if (error) throw new Error(error.message);
  revalidatePath("/admin/categories");
  return { slug };
}

export async function deleteCategory(slug: string) {
  const sb = await requireAdmin();
  const { count } = await sb
    .from("products")
    .select("id", { count: "exact", head: true })
    .eq("category", slug);
  if ((count ?? 0) > 0) throw new Error(`Category has ${count} products — move them first.`);
  const { error } = await sb.from("categories").delete().eq("slug", slug);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/categories");
}

/** Upload an image file to Supabase Storage and return its public URL. */
export async function uploadProductImage(formData: FormData): Promise<string> {
  const sb = await requireAdmin();
  const file = formData.get("file") as File | null;
  if (!file) throw new Error("No file provided.");
  const ext = (file.name.split(".").pop() || "jpg").toLowerCase();
  const path = `uploads/${Date.now()}-${Math.round(Math.random() * 1e6)}.${ext}`;
  const buffer = new Uint8Array(await file.arrayBuffer());
  const { error } = await sb.storage
    .from("product-images")
    .upload(path, buffer, { contentType: file.type || "image/jpeg", upsert: false });
  if (error) throw new Error(error.message);
  const { data } = sb.storage.from("product-images").getPublicUrl(path);
  return data.publicUrl;
}

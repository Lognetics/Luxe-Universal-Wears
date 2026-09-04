"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getServiceSupabase } from "@/lib/supabase/server";
import { fetchNeticsCatalogue, slugify } from "@/lib/netics";
import { isAdminRequest, setAdminCookie, clearAdminCookie, checkPassword } from "@/lib/admin/auth";

/**
 * Admin actions. Products are managed in NETICS now (see publish.ts for the
 * publish and the one-time move); what remains here is sign-in and the
 * categories, which this site still curates itself.
 */

/** Verify the admin cookie and return a service-role client for privileged writes. */
async function admin() {
  if (!(await isAdminRequest())) throw new Error("Not authorised. Please sign in again.");
  const sb = getServiceSupabase();
  if (!sb) throw new Error("Server is missing SUPABASE_SERVICE_ROLE_KEY.");
  return sb;
}

// ---------- auth ----------
export async function adminLogin(_prev: unknown, formData: FormData) {
  const password = String(formData.get("password") || "");
  if (!checkPassword(password)) return { error: "Incorrect password." };
  await setAdminCookie();
  redirect("/admin");
}

export async function adminLogout() {
  await clearAdminCookie();
  redirect("/admin/login");
}

// ---------- categories ----------
export async function saveCategory(input: {
  slug?: string;
  name: string;
  group: string;
  subcategories?: string[];
  image?: string | null;
}) {
  const sb = await admin();
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
  const sb = await admin();
  // The shelf must be empty in NETICS, where the products live now.
  const catalogue = await fetchNeticsCatalogue().catch(() => []);
  const { data: category } = await sb.from("categories").select("name").eq("slug", slug).maybeSingle();
  const name = String(category?.name ?? "").toLowerCase();
  const inUse = catalogue.filter(
    (p) =>
      p.is_active &&
      (p.details?.category_slug === slug || (name && (p.category || "").toLowerCase() === name))
  ).length;
  if (inUse > 0) throw new Error(`Category has ${inUse} products in NETICS. Move them first.`);
  const { error } = await sb.from("categories").delete().eq("slug", slug);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/categories");
}

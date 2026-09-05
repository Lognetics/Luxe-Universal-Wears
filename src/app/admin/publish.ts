"use server";

import { revalidatePath, updateTag } from "next/cache";
import { isAdminRequest } from "@/lib/admin/auth";
import { CATALOGUE_TAG } from "@/lib/catalogue-data";
import { pushProductsToNetics, toNeticsProduct, type SyncResult } from "@/lib/netics";
import { rowToProduct } from "@/lib/supabase/mappers";
import { getServiceSupabase } from "@/lib/supabase/server";

/**
 * Refresh now: drop the cached catalogue so the next page view reads NETICS
 * again. NETICS does this itself whenever the catalogue changes; the button
 * is for "I want to see it this second" and after editing categories.
 */
export async function publishToLive(): Promise<{ refreshed: true }> {
  if (!(await isAdminRequest())) throw new Error("Not authorised.");
  // A server action may use updateTag: the tag expires at once.
  updateTag(CATALOGUE_TAG);
  revalidatePath("/", "layout");
  return { refreshed: true };
}

/**
 * One-time move: send the Supabase catalogue to NETICS with every field
 * (pictures, colours, sizes, was-prices, labels, details, stock counts).
 * After this, products are edited in NETICS and Supabase is history.
 */
export async function seedNeticsFromSupabase(): Promise<SyncResult> {
  if (!(await isAdminRequest())) throw new Error("Not authorised.");
  const sb = getServiceSupabase();
  if (!sb) throw new Error("Server is missing SUPABASE_SERVICE_ROLE_KEY.");
  const { data, error } = await sb
    .from("products")
    .select("*")
    .order("created_index", { ascending: true });
  if (error) throw new Error(error.message);
  const products = (data ?? []).map((row) => toNeticsProduct(rowToProduct(row as Record<string, unknown>)));
  return pushProductsToNetics(products, "replace");
}

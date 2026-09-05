"use server";

import { isAdminRequest } from "@/lib/admin/auth";
import { pushProductsToNetics, toNeticsProduct, type SyncResult } from "@/lib/netics";
import { triggerRebuild, type RebuildResult } from "@/lib/rebuild";
import { rowToProduct } from "@/lib/supabase/mappers";
import { getServiceSupabase } from "@/lib/supabase/server";

/**
 * Publish now: ask Vercel to build the site again, which pulls the catalogue
 * from NETICS. NETICS triggers the same rebuild itself whenever the catalogue
 * changes; the button is for "I want to see it now" and after editing
 * categories.
 */
export async function publishToLive(): Promise<RebuildResult> {
  if (!(await isAdminRequest())) throw new Error("Not authorised.");
  return triggerRebuild("admin publish");
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

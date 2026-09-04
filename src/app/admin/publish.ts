"use server";

import { isAdminRequest } from "@/lib/admin/auth";
import { pushProductsToNetics, toNeticsProduct, type SyncResult } from "@/lib/netics";
import { publishFromNetics, type PublishResult } from "@/lib/publish-from-netics";
import { rowToProduct } from "@/lib/supabase/mappers";
import { getServiceSupabase } from "@/lib/supabase/server";

/**
 * Publish the NETICS catalogue to the live site now. NETICS also triggers
 * this itself whenever the catalogue changes; the button is for "I want to
 * see it now" and for the first publish after the move.
 */
export async function publishToLive(): Promise<PublishResult> {
  if (!(await isAdminRequest())) throw new Error("Not authorised.");
  return publishFromNetics();
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

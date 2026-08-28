import { NextResponse } from "next/server";
import { products } from "@/lib/catalog";
import { toNeticsProduct } from "@/lib/netics";

/**
 * The live catalogue as a feed for NETICS.
 *
 * NETICS reads this link every night (and on "Check now" in its console) so
 * the concierge stays in step with the site even if a push from the admin
 * panel was missed. Public by design: it carries nothing the storefront does
 * not already show.
 */
export const revalidate = 3600;

export function GET() {
  const items = products.map(toNeticsProduct);
  return NextResponse.json(
    { generated_at: new Date().toISOString(), count: items.length, products: items },
    { headers: { "Cache-Control": "public, max-age=3600" } }
  );
}

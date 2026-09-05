import { NextResponse } from "next/server";
import meta from "@/data/catalogue-meta.json";
import { products } from "@/lib/catalog";
import { toNeticsProduct } from "@/lib/netics";

/**
 * The live catalogue as a feed for NETICS.
 *
 * NETICS reads this link every night (and on "Check now" in its console) as
 * a safety net. Public by design: it carries nothing the storefront does not
 * already show. `catalogue_source` says whether the build that produced this
 * site pulled its catalogue from NETICS or fell back to the committed files.
 */
export const revalidate = 3600;

export function GET() {
  const items = products.map(toNeticsProduct);
  return NextResponse.json(
    {
      generated_at: new Date().toISOString(),
      catalogue_source: meta.source,
      catalogue_pulled_at: meta.pulled_at,
      count: items.length,
      products: items,
    },
    { headers: { "Cache-Control": "public, max-age=3600" } }
  );
}

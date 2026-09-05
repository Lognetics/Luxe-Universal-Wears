import { NextResponse } from "next/server";
import { loadCatalogue } from "@/lib/catalogue-data";
import { toNeticsProduct } from "@/lib/netics";

/**
 * The live catalogue as a feed for NETICS.
 *
 * NETICS reads this link every night (and on "Check now" in its console) as
 * a safety net. Public by design: it carries nothing the storefront does not
 * already show. `catalogue_source` says whether this answer was rendered from
 * NETICS or from the committed fallback files.
 */
export const dynamic = "force-dynamic";

export async function GET() {
  const { products, source } = await loadCatalogue();
  const items = products.map(toNeticsProduct);
  return NextResponse.json(
    {
      generated_at: new Date().toISOString(),
      catalogue_source: source,
      count: items.length,
      products: items,
    },
    { headers: { "Cache-Control": "public, max-age=300" } }
  );
}

import { NextResponse } from "next/server";
import { loadCatalogue } from "@/lib/catalogue-data";

/**
 * The catalogue for the browser-side parts of the shop (bag, wishlist,
 * search, outfit builder). Served through the same NETICS-backed cache the
 * pages use, so it changes when they do.
 */
export const dynamic = "force-dynamic";

export async function GET() {
  const { products, categories, source } = await loadCatalogue();
  return NextResponse.json(
    { products, categories, source },
    { headers: { "Cache-Control": "public, max-age=60, s-maxage=60, stale-while-revalidate=300" } }
  );
}

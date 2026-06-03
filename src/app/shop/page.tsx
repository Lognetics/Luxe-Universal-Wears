import Link from "next/link";
import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import {
  products,
  populatedCategories,
  allColors,
  allBrands,
  allSizes,
  priceRange,
} from "@/lib/catalog";
import { ShopClient } from "./ShopClient";

export const metadata: Metadata = {
  title: "Shop All — Luxe Universal Wears",
  description:
    "Browse the full Luxe Universal Wears collection of premium Nigerian menswear — suits, blazers, footwear and accessories crafted for the modern gentleman.",
};

function asString(v: string | string[] | undefined): string | undefined {
  return Array.isArray(v) ? v[0] : v;
}

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const sp = await searchParams;
  const group = asString(sp.group);
  const sort = asString(sp.sort);
  const sale = asString(sp.sale);
  const bestsellers = asString(sp.bestsellers);
  const q = asString(sp.q);
  const category = asString(sp.category);

  const { max } = priceRange();
  const priceMax = Math.ceil(max / 5000) * 5000;

  // Group acts as a pre-filter on the dataset passed to the client.
  let dataset = products;
  if (group) dataset = dataset.filter((p) => p.group === group);
  if (bestsellers) dataset = dataset.filter((p) => p.isBestSeller);

  const initialCategory = category ? [category] : [];

  const heading = group
    ? group === "Suits"
      ? "Suits & Tailoring"
      : group
    : bestsellers
      ? "Best Sellers"
      : sale
        ? "On Sale"
        : "Shop All";

  const subtitle = bestsellers
    ? "The pieces our clients return for, season after season."
    : sale
      ? "Considered reductions on signature Luxe pieces — while they last."
      : group
        ? `Explore our complete ${group.toLowerCase()} edit, tailored for the discerning Nigerian gentleman.`
        : "Every piece in the house. Filter by category, size, colour and more to find your next signature look.";

  return (
    <div className="bg-ivory pb-24">
      {/* Breadcrumb */}
      <Container className="pt-8">
        <nav className="flex items-center gap-2 text-[0.7rem] uppercase tracking-[0.18em] text-stone">
          <Link href="/" className="luxe-link-underline">
            Home
          </Link>
          <span className="text-mist">/</span>
          <span className="text-ink">{heading}</span>
        </nav>
      </Container>

      {/* Header */}
      <Container className="pb-10 pt-8">
        <div className="max-w-2xl">
          <p className="eyebrow mb-3">The Collection</p>
          <h1 className="text-4xl leading-[1.05] text-ink md:text-5xl">{heading}</h1>
          <p className="mt-4 text-stone leading-relaxed">{subtitle}</p>
        </div>
      </Container>

      <Container>
        <ShopClient
          products={dataset}
          populatedCats={populatedCategories()}
          allSizes={allSizes()}
          allColors={allColors()}
          allBrands={allBrands()}
          priceMax={priceMax}
          initial={{
            categories: initialCategory,
            onSale: Boolean(sale),
            sort: sort ?? "featured",
            query: q ?? "",
          }}
        />
      </Container>
    </div>
  );
}

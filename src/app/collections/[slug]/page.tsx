import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container, Divider } from "@/components/ui/Container";
import { ButtonLink } from "@/components/ui/Button";
import { ProductGrid } from "@/components/product/ProductGrid";
import { products } from "@/lib/catalog";

type Collection = {
  name: string;
  eyebrow: string;
  copy: string;
  categories: string[];
  image: string;
};

const COLLECTIONS: Record<string, Collection> = {
  corporate: {
    name: "The Corporate Edit",
    eyebrow: "Power Dressing",
    copy: "Command the boardroom. Sharp suiting, considered blazers and polished footwear engineered for the Nigerian executive who lets the work — and the wardrobe — speak.",
    categories: ["suits", "blazers", "corporate-shoes", "ties", "polo-shirts"],
    image: "/products/royal-cobalt-two-piece-suit.jpeg",
  },
  casual: {
    name: "The Casual Collection",
    eyebrow: "Off-Duty Luxury",
    copy: "Relaxed, never careless. Chinos, overshirts, premium tees and easy footwear that carry the Luxe standard into weekends, travel and everything in between.",
    categories: ["jeans", "chinos", "t-shirts", "polo-shirts", "jackets", "casual-shoes", "slides"],
    image: "/products/dune-beige-overshirt-co-ord.jpeg",
  },
  luxury: {
    name: "The Luxury Collection",
    eyebrow: "Black-Tie & Beyond",
    copy: "For the moments that matter most. Tuxedos, double-breasted tailoring and statement accessories cut from the finest materials for the gentleman who arrives, and is remembered.",
    categories: ["double-breasted-suits", "tuxedos", "watches", "bangles", "blazers"],
    image: "/products/noir-floral-jacquard-tuxedo.jpeg",
  },
};

export function generateStaticParams() {
  return Object.keys(COLLECTIONS).map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const collection = COLLECTIONS[slug];
  if (!collection) return { title: "Collection Not Found — Luxe Universal Wears" };
  return {
    title: `${collection.name} — Luxe Universal Wears`,
    description: collection.copy,
  };
}

export default async function CollectionPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const collection = COLLECTIONS[slug];
  if (!collection) notFound();

  const catSet = new Set(collection.categories);
  const items = products
    .filter((p) => catSet.has(p.category))
    .sort((a, b) => Number(b.isBestSeller) - Number(a.isBestSeller));

  return (
    <div className="bg-ivory pb-24">
      {/* Hero */}
      <section className="relative flex min-h-[60vh] items-center justify-center overflow-hidden bg-ink text-center">
        <Image
          src={collection.image}
          alt={collection.name}
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-55"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-ink/70 via-ink/30 to-ink/80" />
        <Container className="relative z-10 py-28">
          <p className="eyebrow !text-blue-soft mb-4">{collection.eyebrow}</p>
          <h1 className="mx-auto max-w-3xl text-5xl leading-[1] text-ivory md:text-7xl">
            {collection.name}
          </h1>
          <Divider className="my-8" />
          <p className="mx-auto max-w-2xl text-ivory/80 leading-relaxed">{collection.copy}</p>
        </Container>
      </section>

      {/* Breadcrumb */}
      <Container className="pt-8">
        <nav className="flex items-center gap-2 text-[0.7rem] uppercase tracking-[0.18em] text-stone">
          <Link href="/" className="luxe-link-underline">
            Home
          </Link>
          <span className="text-mist">/</span>
          <span className="text-stone">Collections</span>
          <span className="text-mist">/</span>
          <span className="text-ink">{collection.name}</span>
        </nav>
      </Container>

      {/* Products */}
      <Container className="pt-12">
        <div className="mb-8 flex items-baseline justify-between border-b border-sand pb-4">
          <p className="text-sm text-stone">
            <span className="font-medium text-ink">{items.length}</span>{" "}
            {items.length === 1 ? "piece" : "pieces"} in this collection
          </p>
          <Link
            href="/shop"
            className="text-[0.7rem] uppercase tracking-[0.15em] text-stone luxe-link-underline"
          >
            Shop all
          </Link>
        </div>

        {items.length > 0 ? (
          <ProductGrid products={items} priorityCount={4} />
        ) : (
          <div className="flex flex-col items-center justify-center border border-dashed border-sand bg-cream/40 px-6 py-28 text-center">
            <p className="eyebrow mb-3">Curating</p>
            <h2 className="font-serif text-3xl text-ink">This collection is arriving soon</h2>
            <p className="mt-4 max-w-md text-sm text-stone">
              We are finalising the pieces for {collection.name}. Explore the full house in the
              meantime.
            </p>
            <ButtonLink href="/shop" variant="primary" size="lg" className="mt-8">
              Browse The Collection
            </ButtonLink>
          </div>
        )}
      </Container>
    </div>
  );
}

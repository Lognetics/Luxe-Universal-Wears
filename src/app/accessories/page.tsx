import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { ArrowUpRight, Watch, Gem } from "lucide-react";
import { Container, SectionHeading, Divider } from "@/components/ui/Container";
import { ButtonLink } from "@/components/ui/Button";
import { ProductGrid } from "@/components/product/ProductGrid";
import { getCategory, products } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Accessories — Luxe Universal Wears",
  description:
    "The finishing touches that define the look. Discover curated watches, ties, bangles, caps and belts from Luxe Universal Wears.",
};

const ACCESSORY_SLUGS = ["watches", "ties", "bangles", "caps", "belts"];

const COPY: Record<string, string> = {
  watches: "Timepieces that mark the moment.",
  ties: "Silk and structure for the collar.",
  bangles: "Quiet metalwork, considered weight.",
  caps: "Relaxed headwear, refined finish.",
  belts: "Full-grain leather, lasting form.",
};

export default function AccessoriesPage() {
  const cats = ACCESSORY_SLUGS.map((slug) => getCategory(slug)).filter(
    (c): c is NonNullable<typeof c> => Boolean(c)
  );

  const accessoryProducts = products.filter(
    (p) => p.group === "Accessories" && p.stock > 0
  );

  return (
    <div className="bg-ivory pb-24">
      {/* Hero */}
      <section className="relative flex min-h-[52vh] items-center justify-center overflow-hidden bg-ink text-center">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,#2a2520,#14110f)]" />
        <Container className="relative z-10 py-28">
          <p className="eyebrow !text-blue-soft mb-4">Finishing Touches</p>
          <h1 className="mx-auto max-w-3xl text-5xl leading-[1] text-ivory md:text-7xl">
            The Accessories Atelier
          </h1>
          <Divider className="my-8" />
          <p className="mx-auto max-w-2xl text-ivory/80 leading-relaxed">
            The smallest details carry the greatest weight. A curated edit of timepieces, ties and
            leather goods — chosen to complete the Luxe gentleman&apos;s wardrobe.
          </p>
        </Container>
      </section>

      {/* Breadcrumb */}
      <Container className="pt-8">
        <nav className="flex items-center gap-2 text-[0.7rem] uppercase tracking-[0.18em] text-stone">
          <Link href="/" className="luxe-link-underline">
            Home
          </Link>
          <span className="text-mist">/</span>
          <span className="text-ink">Accessories</span>
        </nav>
      </Container>

      {/* Category cards */}
      <section className="pt-14">
        <Container>
          <SectionHeading
            align="left"
            eyebrow="Shop By Category"
            title="Explore The Edit"
            className="mb-10"
          />
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
            {cats.map((c) => (
              <Link
                key={c.slug}
                href={`/category/${c.slug}`}
                className="group relative flex aspect-[3/4] flex-col justify-end overflow-hidden border border-sand bg-cream p-5"
              >
                {c.image && (
                  <Image
                    src={c.image}
                    alt={c.name}
                    fill
                    sizes="(max-width:768px) 50vw, 20vw"
                    className="object-cover opacity-90 transition-transform duration-700 group-hover:scale-105"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/10 to-transparent" />
                <div className="relative z-10 text-ivory">
                  <h3 className="font-serif text-xl">{c.name}</h3>
                  <p className="mt-1 text-[0.7rem] text-ivory/70">{COPY[c.slug]}</p>
                  <span className="mt-3 inline-flex items-center gap-1 text-[0.65rem] uppercase tracking-[0.18em] text-blue-soft">
                    {c.count > 0 ? `${c.count} pieces` : "Coming soon"}
                    <ArrowUpRight size={12} />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </Container>
      </section>

      {/* In-stock accessory products, or editorial coming-soon */}
      <section className="pt-20">
        <Container>
          {accessoryProducts.length > 0 ? (
            <>
              <SectionHeading
                align="left"
                eyebrow="In Stock Now"
                title="Available To Order"
                className="mb-10"
              />
              <ProductGrid products={accessoryProducts} priorityCount={4} />
            </>
          ) : (
            <div className="grid items-center gap-10 border border-sand bg-cream/40 p-8 md:grid-cols-2 md:p-14">
              <div>
                <p className="eyebrow mb-3">Curated, Not Mass-Produced</p>
                <h2 className="text-3xl leading-tight text-ink md:text-4xl">
                  An accessories collection worth the wait
                </h2>
                <p className="mt-5 text-stone leading-relaxed">
                  We are sourcing each timepiece, tie and leather good by hand to meet the Luxe
                  standard. Join the list to be first to know when the full accessories collection
                  arrives.
                </p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <ButtonLink href="/shop" variant="primary" size="lg">
                    Shop The Wardrobe
                  </ButtonLink>
                  <ButtonLink href="/bespoke" variant="outline" size="lg">
                    Book A Stylist
                  </ButtonLink>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { icon: Watch, title: "Timepieces", text: "Classic & contemporary watches." },
                  { icon: Gem, title: "Fine Details", text: "Bangles, ties & leather goods." },
                ].map(({ icon: Icon, title, text }) => (
                  <div
                    key={title}
                    className="flex flex-col items-center border border-sand bg-paper p-6 text-center"
                  >
                    <span className="flex h-14 w-14 items-center justify-center rounded-full border border-blue/40 text-blue-deep">
                      <Icon size={22} strokeWidth={1.5} />
                    </span>
                    <h3 className="mt-4 font-serif text-lg text-ink">{title}</h3>
                    <p className="mt-1.5 text-xs text-stone">{text}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </Container>
      </section>
    </div>
  );
}

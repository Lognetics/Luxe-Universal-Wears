import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container, Divider } from "@/components/ui/Container";
import { ButtonLink } from "@/components/ui/Button";
import { ProductGrid } from "@/components/product/ProductGrid";
import { categories, getCategory, productsInCategory } from "@/lib/catalog";

export function generateStaticParams() {
  return categories.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const category = getCategory(slug);
  if (!category) return { title: "Category Not Found — Luxe Universal Wears" };
  return {
    title: `${category.name} — Luxe Universal Wears`,
    description: `Shop the Luxe Universal Wears ${category.name.toLowerCase()} collection — premium Nigerian menswear crafted for the modern gentleman.`,
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const category = getCategory(slug);
  if (!category) notFound();

  const items = productsInCategory(slug);
  const heroImage = items[0]?.images[0] ?? category.image ?? null;

  return (
    <div className="bg-ivory pb-24">
      {/* Hero */}
      <section className="relative flex min-h-[42vh] items-end overflow-hidden bg-ink">
        {heroImage ? (
          <Image
            src={heroImage}
            alt={category.name}
            fill
            priority
            sizes="100vw"
            className="object-cover opacity-60"
          />
        ) : (
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,#2a2520,#14110f)]" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-transparent" />
        <Container className="relative z-10 pb-12 pt-28">
          <p className="eyebrow !text-blue-soft mb-3">{category.group}</p>
          <h1 className="text-5xl leading-[1] text-ivory md:text-6xl">{category.name}</h1>
          <p className="mt-3 text-sm uppercase tracking-[0.2em] text-ivory/70">
            {category.count} {category.count === 1 ? "piece" : "pieces"}
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
          <Link href="/shop" className="luxe-link-underline">
            Shop
          </Link>
          <span className="text-mist">/</span>
          <span className="text-ink">{category.name}</span>
        </nav>
      </Container>

      {/* Subcategory pills */}
      {category.subcategories.length > 0 && (
        <Container className="pt-8">
          <div className="flex flex-wrap gap-2.5">
            {category.subcategories.map((s) => (
              <span
                key={s}
                className="rounded-full border border-sand bg-cream px-4 py-2 text-xs uppercase tracking-[0.12em] text-ink"
              >
                {s}
              </span>
            ))}
          </div>
        </Container>
      )}

      {/* Products */}
      <Container className="pt-12">
        {items.length > 0 ? (
          <ProductGrid products={items} priorityCount={4} />
        ) : (
          <div className="flex flex-col items-center justify-center border border-dashed border-sand bg-cream/40 px-6 py-28 text-center">
            <p className="eyebrow mb-3">Curating</p>
            <h2 className="font-serif text-3xl text-ink md:text-4xl">
              This collection is arriving soon
            </h2>
            <Divider className="my-7" />
            <p className="max-w-md text-sm text-stone leading-relaxed">
              Our atelier is putting the finishing touches on the {category.name.toLowerCase()}{" "}
              edit. In the meantime, explore the rest of the Luxe wardrobe.
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

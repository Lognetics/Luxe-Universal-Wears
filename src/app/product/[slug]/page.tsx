import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Star } from "lucide-react";
import { clsx } from "clsx";
import { Container, SectionHeading } from "@/components/ui/Container";
import { ProductRail } from "@/components/home/ProductRail";
import { products, getProduct, relatedProducts } from "@/lib/catalog";
import { formatNaira, discountPercent } from "@/lib/format";
import { ProductGallery } from "./ProductGallery";
import { ProductPurchase } from "./ProductPurchase";
import { ProductAccordion } from "./ProductAccordion";
import { FrequentlyBought } from "./FrequentlyBought";

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) return { title: "Product Not Found — Luxe Universal Wears" };
  return {
    title: `${product.name} — Luxe Universal Wears`,
    description: product.description,
    openGraph: {
      title: product.name,
      description: product.description,
      images: product.images,
    },
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();

  const discount = discountPercent(product.price, product.comparePrice);
  const related = relatedProducts(product, 8);
  const fbt = [product, ...related].slice(0, 3);

  return (
    <div className="bg-ivory pb-24">
      {/* Breadcrumb */}
      <Container className="pt-8">
        <nav className="flex flex-wrap items-center gap-2 text-[0.7rem] uppercase tracking-[0.18em] text-stone">
          <Link href="/" className="luxe-link-underline">
            Home
          </Link>
          <span className="text-mist">/</span>
          <Link href="/shop" className="luxe-link-underline">
            Shop
          </Link>
          <span className="text-mist">/</span>
          <Link href={`/category/${product.category}`} className="luxe-link-underline">
            {product.categoryName}
          </Link>
          <span className="text-mist">/</span>
          <span className="text-ink">{product.name}</span>
        </nav>
      </Container>

      {/* Main */}
      <Container className="pt-10">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
          <ProductGallery
            image={product.images[0]}
            alt={product.name}
            isNew={product.isNew}
            discount={discount}
          />

          <div>
            <p className="text-[0.7rem] uppercase tracking-[0.2em] text-blue-deep">{product.brand}</p>
            <h1 className="mt-2 text-3xl leading-[1.1] text-ink md:text-4xl">{product.name}</h1>

            {/* Rating */}
            <div className="mt-4 flex items-center gap-3">
              <span className="flex items-center gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    size={15}
                    className={clsx(
                      i < Math.round(product.rating) ? "fill-blue text-blue" : "text-sand"
                    )}
                  />
                ))}
              </span>
              <span className="text-sm text-stone">
                {product.rating.toFixed(1)} · {product.reviews} reviews
              </span>
            </div>

            {/* Price */}
            <div className="mt-5 flex items-baseline gap-3">
              <span className="text-2xl font-medium text-ink md:text-3xl">
                {formatNaira(product.price)}
              </span>
              {product.comparePrice && (
                <span className="text-lg text-mist line-through">
                  {formatNaira(product.comparePrice)}
                </span>
              )}
              {discount && (
                <span className="bg-wine/10 px-2.5 py-1 text-xs font-medium uppercase tracking-[0.1em] text-wine">
                  Save {discount}%
                </span>
              )}
            </div>

            <p className="mt-5 max-w-prose text-stone leading-relaxed">{product.description}</p>

            <ProductPurchase product={product} />
          </div>
        </div>
      </Container>

      {/* Details accordion */}
      <Container width="narrow" className="mt-20">
        <ProductAccordion
          items={[
            {
              title: "Description",
              content: (
                <div className="space-y-3">
                  <p>{product.description}</p>
                  <ul className="flex flex-wrap gap-2 pt-1">
                    {product.tags.map((t) => (
                      <li
                        key={t}
                        className="rounded-full border border-sand px-3 py-1 text-[0.7rem] uppercase tracking-[0.12em] text-stone"
                      >
                        {t}
                      </li>
                    ))}
                  </ul>
                </div>
              ),
            },
            {
              title: "Fabric & Care",
              content: (
                <div className="space-y-3">
                  <p>
                    <span className="font-medium text-ink">Fabric:</span> {product.fabric}
                  </p>
                  <p>
                    <span className="font-medium text-ink">Care:</span> {product.care}
                  </p>
                </div>
              ),
            },
            {
              title: "Delivery Information",
              content: (
                <div className="space-y-2">
                  <p>
                    Complimentary nationwide delivery on orders over ₦150,000. Abuja same-day and
                    next-day options available at checkout. Orders dispatch within 24–48 hours.
                  </p>
                  <p>
                    International shipping to West Africa, the UK, US and UAE with fully tracked
                    courier service.
                  </p>
                </div>
              ),
            },
            {
              title: "Return Policy",
              content: (
                <p>
                  Enjoy a 14-day return window on unworn pieces with original tags and packaging.
                  Bespoke and made-to-measure garments are final sale. Contact our concierge to
                  arrange a pickup or exchange.
                </p>
              ),
            },
          ]}
        />
      </Container>

      {/* Frequently bought together */}
      {fbt.length >= 2 && (
        <Container className="mt-20">
          <SectionHeading
            align="left"
            eyebrow="Complete The Look"
            title="Frequently Bought Together"
            className="mb-8"
          />
          <FrequentlyBought items={fbt} />
        </Container>
      )}

      {/* You may also like */}
      {related.length > 0 && (
        <Container className="mt-20">
          <SectionHeading
            align="left"
            eyebrow="Curated For You"
            title="You May Also Like"
            className="mb-10"
          />
          <ProductRail products={related} />
        </Container>
      )}
    </div>
  );
}

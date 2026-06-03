import type { Metadata } from "next";
import Image from "next/image";
import { Award, Calendar, Check, Crown, Sparkles, Users } from "lucide-react";
import { Container, SectionHeading, Divider } from "@/components/ui/Container";
import { ButtonLink } from "@/components/ui/Button";
import { ProductGrid } from "@/components/product/ProductGrid";
import { productsInCategory } from "@/lib/catalog";
import type { Product } from "@/lib/types";

export const metadata: Metadata = {
  title: "Wedding & Groom Collection | Luxe Universal Wears",
  description:
    "Tuxedos, double-breasted suits, fine shoes and accessories for the modern groom and his party — with bespoke styling from our Ikoyi atelier.",
};

function pick(cats: string[], limit: number): Product[] {
  const out: Product[] = [];
  for (const c of cats) {
    for (const p of productsInCategory(c)) {
      if (out.length >= limit) break;
      if (!out.some((x) => x.id === p.id)) out.push(p);
    }
  }
  return out.slice(0, limit);
}

const SERVICES = [
  {
    icon: Crown,
    title: "Groom Styling",
    desc: "A dedicated stylist guides you from first consultation to final fitting, building a look that feels unmistakably yours on the most photographed day of your life.",
  },
  {
    icon: Users,
    title: "Groomsmen Packages",
    desc: "Coordinated looks for your entire party, with group fittings, bulk pricing and a single point of contact to keep everyone cohesive and on schedule.",
  },
  {
    icon: Sparkles,
    title: "Bespoke Tailoring",
    desc: "Cut uniquely to your measurements in cloth chosen for the climate, with two to three fittings to ensure flawless drape from ceremony to last dance.",
  },
  {
    icon: Award,
    title: "Accessories & Finishing",
    desc: "Cufflinks, pocket squares, ties and boutonnières curated to your wedding palette — the details the camera loves and your guests remember.",
  },
];

const TIMELINE = [
  { step: "01", title: "Consultation", desc: "We discuss your vision, venue, palette and the role of every member of the party." },
  { step: "02", title: "Selection & Measure", desc: "Choose cloth and silhouette, then we take full measurements for groom and groomsmen." },
  { step: "03", title: "Fittings", desc: "Two to three fittings refine the cut until the drape is perfect on every figure." },
  { step: "04", title: "Final Pressing", desc: "Garments are pressed, accessorised and delivered ahead of the celebration." },
];

export default function WeddingPage() {
  const tuxedos = pick(["tuxedos", "blazers"], 4);
  const suits = pick(["suits", "blazers"], 4);
  const shoes = pick(["corporate-shoes", "casual-shoes"], 4);
  const accessories = pick(["polo-shirts", "jackets"], 4);

  return (
    <main className="bg-ivory">
      {/* Dramatic hero */}
      <section className="relative isolate flex min-h-[78vh] items-center overflow-hidden bg-ink text-ivory">
        <Image
          src="/products/noir-floral-jacquard-tuxedo.jpeg"
          alt="The Luxe groom"
          fill
          priority
          sizes="100vw"
          className="object-cover object-top opacity-55"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-ink/90 via-ink/55 to-transparent" />
        <Container className="relative py-24">
          <div className="max-w-xl">
            <p className="eyebrow !text-blue-soft mb-4">The Wedding Edit</p>
            <h1 className="text-4xl leading-[1.02] text-ivory sm:text-6xl md:text-7xl">
              For the Day You Will Never Forget
            </h1>
            <p className="mt-6 max-w-lg text-mist leading-relaxed">
              Impeccable tuxedos, commanding double-breasted suits and considered accessories for the
              modern groom and his party — finished by hand in our Ikoyi atelier.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <ButtonLink href="/bespoke#book" variant="gold" size="lg">
                Book Wedding Consultation
              </ButtonLink>
              <ButtonLink href="#collection" variant="outline" size="lg" className="border-ivory/60 text-ivory hover:bg-ivory hover:text-ink">
                Explore the Collection
              </ButtonLink>
            </div>
          </div>
        </Container>
      </section>

      {/* Intro */}
      <section className="py-16 sm:py-20" id="collection">
        <Container width="narrow" className="text-center">
          <p className="eyebrow mb-4">The Groom, Considered</p>
          <h2 className="text-3xl leading-tight text-ink sm:text-4xl">
            A wedding wardrobe is theatre. Every detail is amplified, every choice immortalised.
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-stone leading-relaxed">
            Our wedding service brings together the finest of our tailoring with the personal attention
            the occasion demands — so you and your party arrive looking, and feeling, extraordinary.
          </p>
          <Divider className="mt-8" />
        </Container>
      </section>

      {/* Product groups */}
      <ProductGroup id="tuxedos" eyebrow="The Statement" title="Tuxedos & Dinner Jackets" products={tuxedos} />
      <ProductGroup eyebrow="The Authority" title="Double-Breasted & Two-Piece Suits" products={suits} alt />
      <ProductGroup eyebrow="The Foundation" title="Wedding Shoes" products={shoes} />
      <ProductGroup eyebrow="The Finishing Touch" title="Accessories & Layers" products={accessories} alt />

      {/* Services */}
      <section className="border-t border-sand py-16 sm:py-20">
        <Container>
          <SectionHeading
            eyebrow="How We Help"
            title="A Service Worthy of the Occasion"
            description="From the groom's look to the entire party, we manage every detail with discretion and care."
            className="mb-14"
          />
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
            {SERVICES.map((s) => (
              <div key={s.title} className="flex gap-5 border border-sand bg-cream p-8">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center bg-ink text-blue">
                  <s.icon size={22} />
                </div>
                <div>
                  <h3 className="text-xl text-ink">{s.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-stone">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Timeline */}
      <section className="border-t border-sand bg-cream py-16 sm:py-20">
        <Container>
          <SectionHeading
            eyebrow="The Process"
            title="From First Fitting to Final Dance"
            description="Begin eight to twelve weeks ahead for a flawless, unhurried experience."
            className="mb-14"
          />
          <div className="grid grid-cols-1 gap-px overflow-hidden border border-sand bg-sand sm:grid-cols-2 lg:grid-cols-4">
            {TIMELINE.map((t) => (
              <div key={t.step} className="bg-ivory p-8">
                <span className="font-serif text-4xl text-blue">{t.step}</span>
                <h3 className="mt-4 text-xl text-ink">{t.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-stone">{t.desc}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Testimonial */}
      <section className="py-20 sm:py-24">
        <Container width="narrow" className="text-center">
          <Sparkles className="mx-auto text-blue" size={28} />
          <blockquote className="mt-6 font-serif text-2xl leading-snug text-ink sm:text-3xl md:text-4xl">
            &ldquo;Luxe dressed me and all six of my groomsmen. We looked like we belonged on a
            magazine cover — and the entire process was effortless. The fit was simply perfect.&rdquo;
          </blockquote>
          <p className="mt-6 text-[0.7rem] uppercase tracking-[0.2em] text-blue-deep">
            Emeka & Adaeze — Married in Lagos, December 2025
          </p>
        </Container>
      </section>

      {/* Book CTA */}
      <section className="bg-ink py-20 text-center text-ivory sm:py-24">
        <Container width="narrow">
          <Calendar className="mx-auto text-blue" size={30} />
          <h2 className="mt-5 text-3xl text-ivory sm:text-4xl md:text-5xl">Begin Your Fitting</h2>
          <p className="mx-auto mt-4 max-w-md text-mist leading-relaxed">
            Reserve a private consultation with a wedding stylist at our Ikoyi atelier and let us craft
            the look of your celebration.
          </p>
          <div className="mt-8 flex justify-center">
            <ButtonLink href="/bespoke#book" variant="gold" size="lg">
              Book Wedding Consultation
            </ButtonLink>
          </div>
        </Container>
      </section>
    </main>
  );
}

function ProductGroup({
  id,
  eyebrow,
  title,
  products: items,
  alt,
}: {
  id?: string;
  eyebrow: string;
  title: string;
  products: Product[];
  alt?: boolean;
}) {
  if (items.length === 0) return null;
  return (
    <section id={id} className={`border-t border-sand py-16 sm:py-20 ${alt ? "bg-cream" : ""}`}>
      <Container>
        <div className="mb-12 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="eyebrow mb-2">{eyebrow}</p>
            <h2 className="text-3xl text-ink sm:text-4xl">{title}</h2>
          </div>
          <span className="inline-flex items-center gap-2 text-sm text-stone">
            <Check size={15} className="text-blue-deep" /> Bespoke options available
          </span>
        </div>
        <ProductGrid products={items} />
      </Container>
    </section>
  );
}

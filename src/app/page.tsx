import Image from "next/image";
import Link from "next/link";
import {
  Scissors,
  ShieldCheck,
  Truck,
  RefreshCw,
  Gem,
  HeartHandshake,
} from "lucide-react";
import { Hero } from "@/components/home/Hero";
import { ProductRail } from "@/components/home/ProductRail";
import { Testimonials } from "@/components/home/Testimonials";
import { Container, SectionHeading, Divider } from "@/components/ui/Container";
import { ButtonLink } from "@/components/ui/Button";
import { newArrivals, bestSellers, populatedCategories, products } from "@/lib/catalog";

const COLLECTIONS = [
  {
    title: "Corporate",
    text: "Executive suits, blazers & ties.",
    href: "/collections/corporate",
    image: "/products/royal-cobalt-two-piece-suit.jpeg",
  },
  {
    title: "Casual",
    text: "Chinos, polos & relaxed layering.",
    href: "/collections/casual",
    image: "/products/dune-beige-overshirt-co-ord.jpeg",
  },
  {
    title: "Luxury",
    text: "Tuxedos, watches & statement pieces.",
    href: "/collections/luxury",
    image: "/products/noir-floral-jacquard-tuxedo.jpeg",
  },
];

const WHY = [
  { icon: Gem, title: "Premium Materials", text: "Only the finest fabrics & leathers." },
  { icon: Scissors, title: "Tailored Excellence", text: "Precision craftsmanship in every stitch." },
  { icon: ShieldCheck, title: "Secure Payments", text: "Paystack, Flutterwave, Stripe & PayPal." },
  { icon: Truck, title: "Fast Delivery", text: "Nationwide & international shipping." },
  { icon: RefreshCw, title: "Easy Returns", text: "14-day hassle-free returns policy." },
  { icon: HeartHandshake, title: "Customer Care", text: "Personal styling & dedicated support." },
];

export default function HomePage() {
  const arrivals = newArrivals(8);
  const sellers = bestSellers(8);
  const cats = populatedCategories();
  const gallery = products.slice(6, 12);

  return (
    <>
      <Hero />

      {/* Value strip */}
      <div className="border-b border-sand bg-cream">
        <Container className="grid grid-cols-2 gap-6 py-6 md:grid-cols-4">
          {[
            { t: "Bespoke Tailoring", s: "Made to measure" },
            { t: "Free Shipping", s: "Orders over ₦150k" },
            { t: "Secure Checkout", s: "Paystack & more" },
            { t: "Worldwide Delivery", s: "NG & international" },
          ].map((v) => (
            <div key={v.t} className="text-center">
              <p className="text-sm font-medium uppercase tracking-[0.12em] text-ink">{v.t}</p>
              <p className="text-xs text-mist">{v.s}</p>
            </div>
          ))}
        </Container>
      </div>

      {/* Featured categories */}
      <section className="py-20">
        <Container>
          <SectionHeading
            eyebrow="Shop By Category"
            title="Curated For The Modern Wardrobe"
            description="From boardroom to black-tie, explore collections crafted for every occasion."
          />
          <Divider className="my-8" />
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
            {cats.slice(0, 10).map((c) => (
              <Link key={c.slug} href={`/category/${c.slug}`} className="group relative overflow-hidden">
                <div className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-cream">
                  {c.image && (
                    <Image
                      src={c.image}
                      alt={c.name}
                      fill
                      sizes="(max-width:768px) 50vw, 20vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/75 via-ink/10 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-4 text-center text-ivory">
                    <h3 className="font-serif text-lg">{c.name}</h3>
                    <p className="text-[0.65rem] uppercase tracking-[0.2em] text-ivory/70">{c.count} pieces</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </Container>
      </section>

      {/* New arrivals */}
      <section className="bg-cream py-20">
        <Container>
          <div className="flex flex-col items-end justify-between gap-4 sm:flex-row">
            <SectionHeading
              align="left"
              eyebrow="Just In"
              title="New Arrivals"
              description="The latest pieces to land at Luxe — fresh from the atelier."
            />
            <ButtonLink href="/shop?sort=newest" variant="outline">View All</ButtonLink>
          </div>
          <div className="mt-10">
            <ProductRail products={arrivals} />
          </div>
        </Container>
      </section>

      {/* Luxury collections */}
      <section className="py-20">
        <Container>
          <SectionHeading eyebrow="Luxury Collections" title="Three Worlds, One Standard" />
          <Divider className="my-8" />
          <div className="grid gap-5 md:grid-cols-3">
            {COLLECTIONS.map((c) => (
              <Link key={c.title} href={c.href} className="group relative block aspect-[4/5] overflow-hidden rounded-2xl bg-ink">
                <Image
                  src={c.image}
                  alt={c.title}
                  fill
                  sizes="(max-width:768px) 100vw, 33vw"
                  className="object-cover opacity-90 transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/20 to-transparent" />
                <div className="absolute inset-0 flex flex-col items-center justify-end p-8 text-center text-ivory">
                  <p className="eyebrow !text-blue-soft">Collection</p>
                  <h3 className="mt-2 font-serif text-3xl">{c.title}</h3>
                  <p className="mt-1 text-sm text-ivory/75">{c.text}</p>
                  <span className="mt-4 border-b border-blue pb-1 text-[0.7rem] uppercase tracking-[0.2em] text-blue-soft opacity-0 transition group-hover:opacity-100">
                    Explore Collection
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </Container>
      </section>

      {/* Best sellers */}
      <section className="bg-ink py-20 text-ivory">
        <Container>
          <div className="text-center">
            <p className="eyebrow !text-blue-soft mb-3">Most Wanted</p>
            <h2 className="text-3xl text-ivory sm:text-4xl md:text-5xl">Best Sellers</h2>
            <p className="mx-auto mt-4 max-w-xl text-ivory/70">The pieces our clients can&apos;t stop wearing.</p>
          </div>
          <div className="mt-12">
            <ProductRail products={sellers} />
          </div>
        </Container>
      </section>

      {/* Bespoke */}
      <section className="py-20">
        <Container>
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-cream">
              <Image
                src="/products/cotswold-camel-houndstooth-blazer.jpeg"
                alt="Bespoke tailoring"
                fill
                sizes="(max-width:1024px) 100vw, 50vw"
                className="object-cover"
              />
              <div className="absolute bottom-5 left-5 bg-ivory/95 px-6 py-4">
                <p className="font-serif text-2xl text-ink">25+ Years</p>
                <p className="text-xs uppercase tracking-[0.15em] text-mist">Of Tailoring Heritage</p>
              </div>
            </div>
            <div>
              <p className="eyebrow mb-3">Bespoke Tailoring</p>
              <h2 className="text-4xl leading-tight text-ink md:text-5xl">Crafted Exclusively For You</h2>
              <p className="mt-5 text-stone leading-relaxed">
                Step into a world of made-to-measure luxury. Our master tailors translate your
                measurements, posture, and personal taste into garments that fit flawlessly and feel
                unmistakably yours.
              </p>
              <ul className="mt-8 grid grid-cols-2 gap-4">
                {["Custom Measurements", "Personal Styling", "Premium Fabrics", "Nationwide Delivery"].map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-ink">
                    <span className="h-1.5 w-1.5 rotate-45 bg-blue" /> {f}
                  </li>
                ))}
              </ul>
              <div className="mt-9">
                <ButtonLink href="/bespoke" variant="primary" size="lg">Book Appointment</ButtonLink>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Why choose us */}
      <section className="bg-cream py-20">
        <Container>
          <SectionHeading eyebrow="The Luxe Promise" title="Why Choose Luxe Universal Wears" />
          <Divider className="my-8" />
          <div className="grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-3">
            {WHY.map(({ icon: Icon, title, text }) => (
              <div key={title} className="flex flex-col items-center text-center">
                <span className="flex h-14 w-14 items-center justify-center rounded-full border border-blue/40 text-blue-deep">
                  <Icon size={22} strokeWidth={1.5} />
                </span>
                <h3 className="mt-4 font-serif text-xl text-ink">{title}</h3>
                <p className="mt-1.5 max-w-[14rem] text-sm text-stone">{text}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Testimonials */}
      <section className="py-20">
        <Container>
          <SectionHeading eyebrow="Client Stories" title="Words From Our Gentlemen" className="mb-12" />
          <Testimonials />
        </Container>
      </section>

      {/* Gallery */}
      <section className="pb-20">
        <Container width="wide">
          <SectionHeading eyebrow="@luxeuniversalwears" title="Follow The Look" description="Tag us to be featured. Luxury, lived in." />
          <div className="mt-10 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
            {gallery.map((p) => (
              <Link key={p.id} href={`/product/${p.slug}`} className="group relative aspect-square overflow-hidden rounded-2xl bg-cream">
                <Image
                  src={p.images[0]}
                  alt={p.name}
                  fill
                  sizes="(max-width:768px) 50vw, 16vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-ink/0 transition group-hover:bg-ink/40">
                  <span className="text-xs uppercase tracking-[0.2em] text-ivory opacity-0 transition group-hover:opacity-100">View</span>
                </div>
              </Link>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}

import Image from "next/image";
import type { Metadata } from "next";
import {
  Crown,
  Scissors,
  Gem,
  HeartHandshake,
  Award,
  Sparkles,
  Target,
  Eye,
  ArrowRight,
  MapPin,
} from "lucide-react";
import { Container, SectionHeading, Divider } from "@/components/ui/Container";
import { ButtonLink } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "About Us | Luxe Universal Wears",
  description:
    "Luxe Universal Wears — an Abuja luxury menswear house redefining how the modern African gentleman dresses, through bespoke craftsmanship and considered design.",
};

const VALUES = [
  {
    icon: Gem,
    title: "Uncompromising Quality",
    text: "From the mills we source to the final hand-stitch, we accept nothing less than excellence in every garment.",
  },
  {
    icon: Scissors,
    title: "Craftsmanship",
    text: "We honour the slow, deliberate art of tailoring — skills passed down and perfected over generations.",
  },
  {
    icon: HeartHandshake,
    title: "Client Devotion",
    text: "Every gentleman is known by name. We build wardrobes, and relationships, that last decades.",
  },
  {
    icon: Crown,
    title: "Quiet Confidence",
    text: "True luxury whispers. We design pieces that speak through fit and finish, never through logos.",
  },
  {
    icon: Sparkles,
    title: "Modern Heritage",
    text: "We blend Savile Row discipline with the colour and occasion of West African dressing.",
  },
  {
    icon: Award,
    title: "Integrity",
    text: "Honest pricing, honest timelines and honest advice — even when it means selling you less.",
  },
];

const STATS = [
  { value: "25+", label: "Years of Heritage" },
  { value: "12,000+", label: "Gentlemen Dressed" },
  { value: "40,000+", label: "Pieces Crafted" },
  { value: "30+", label: "Cities Delivered To" },
];

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative flex min-h-[80vh] items-center justify-center overflow-hidden bg-ink text-ivory">
        <Image
          src="/products/royal-cobalt-two-piece-suit.jpeg"
          alt="About Luxe Universal Wears"
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-50"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/55 to-ink/25" />
        <Container className="relative z-10 py-32 text-center">
          <p className="eyebrow !text-blue-soft mb-4 animate-fade-up">Our Story</p>
          <h1 className="mx-auto max-w-4xl text-5xl leading-[1.02] text-ivory animate-fade-up sm:text-6xl md:text-7xl">
            Redefining Luxury Fashion
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-ivory/80 leading-relaxed animate-fade-up">
            An Abuja house dressing the modern African gentleman with craftsmanship, character and an
            unwavering eye for detail.
          </p>
        </Container>
      </section>

      {/* Brand story */}
      <section className="py-20 md:py-28">
        <Container>
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
            <div className="relative aspect-[4/5] overflow-hidden bg-cream">
              <Image
                src="/products/cotswold-camel-houndstooth-blazer.jpeg"
                alt="The Luxe atelier in Abuja"
                fill
                sizes="(max-width:1024px) 100vw, 50vw"
                className="object-cover"
              />
              <div className="absolute bottom-5 left-5 bg-ivory/95 px-6 py-4">
                <p className="font-serif text-2xl text-ink">Est. 1998</p>
                <p className="text-xs uppercase tracking-[0.15em] text-mist">Abuja, Nigeria</p>
              </div>
            </div>
            <div>
              <p className="eyebrow mb-3">Our Story</p>
              <h2 className="text-4xl leading-tight text-ink md:text-5xl">From A Single Bench In Abuja</h2>
              <p className="mt-5 text-stone leading-relaxed">
                Luxe Universal Wears began in 1998 at a single tailor&apos;s bench in Abuja, founded
                on a simple conviction: that the African gentleman deserved clothing made to the
                world&apos;s highest standard, without ever leaving home. What started as bespoke
                commissions for a handful of clients has grown into one of Nigeria&apos;s most
                respected luxury menswear houses.
              </p>
              <p className="mt-5 text-stone leading-relaxed">
                A quarter-century on, our philosophy has not changed. We still cut every bespoke
                pattern by hand. We still know our clients by name. And we still believe that the
                finest garment is the one that makes its wearer feel entirely, effortlessly himself —
                whether he is closing a deal in Maitama or dancing at a wedding in Enugu.
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* Mission & Vision */}
      <section className="bg-cream py-20 md:py-24">
        <Container>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="bg-paper p-8 shadow-soft md:p-12">
              <span className="flex h-14 w-14 items-center justify-center rounded-full border border-blue/40 text-blue-deep">
                <Target size={24} strokeWidth={1.5} />
              </span>
              <h2 className="mt-6 font-serif text-3xl text-ink">Our Mission</h2>
              <p className="mt-4 text-stone leading-relaxed">
                To craft exceptional, made-to-measure clothing that empowers the modern African
                gentleman — combining heritage tailoring, premium materials and genuine personal
                service, while making world-class luxury accessible from anywhere in Nigeria and
                beyond.
              </p>
            </div>
            <div className="bg-ink p-8 text-ivory shadow-soft md:p-12">
              <span className="flex h-14 w-14 items-center justify-center rounded-full border border-blue-soft/40 text-blue-soft">
                <Eye size={24} strokeWidth={1.5} />
              </span>
              <h2 className="mt-6 font-serif text-3xl text-ivory">Our Vision</h2>
              <p className="mt-4 text-ivory/75 leading-relaxed">
                To become Africa&apos;s most celebrated luxury menswear house — a name spoken in the
                same breath as the great fashion capitals, proving that exceptional craftsmanship and
                a distinctly African sense of style belong on the world stage.
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* Core values */}
      <section className="py-20 md:py-28">
        <Container>
          <SectionHeading
            eyebrow="What We Stand For"
            title="Our Core Values"
            description="Six principles that have guided every commission since the very first stitch."
          />
          <div className="mt-14 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {VALUES.map(({ icon: Icon, title, text }) => (
              <div key={title}>
                <span className="flex h-14 w-14 items-center justify-center rounded-full border border-blue/40 text-blue-deep">
                  <Icon size={22} strokeWidth={1.5} />
                </span>
                <h3 className="mt-5 font-serif text-2xl text-ink">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-stone">{text}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Craftsmanship */}
      <section className="bg-ink py-20 text-ivory md:py-28">
        <Container>
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
            <div>
              <p className="eyebrow !text-blue-soft mb-3">Our Craftsmanship</p>
              <h2 className="text-4xl leading-tight text-ivory md:text-5xl">The Art Behind The Garment</h2>
              <p className="mt-5 text-ivory/75 leading-relaxed">
                Every Luxe piece passes through the hands of skilled artisans who have devoted their
                lives to the craft. We work with full-canvas construction, hand-padded lapels and
                cloths from the world&apos;s most storied mills — chosen not only for their beauty,
                but for how they perform in the West African climate.
              </p>
              <p className="mt-5 text-ivory/75 leading-relaxed">
                It can take over fifty hours and three fittings to complete a single bespoke suit.
                We would not have it any other way. This is slow fashion in its truest sense — made
                once, made properly and made to be worn for a lifetime.
              </p>
              <div className="mt-9">
                <ButtonLink href="/bespoke" variant="gold" size="lg">
                  Explore Bespoke <ArrowRight size={15} />
                </ButtonLink>
              </div>
            </div>
            <div className="relative aspect-[4/5] overflow-hidden bg-charcoal">
              <Image
                src="/products/noir-floral-jacquard-tuxedo.jpeg"
                alt="Hand craftsmanship at Luxe"
                fill
                sizes="(max-width:1024px) 100vw, 50vw"
                className="object-cover opacity-95"
              />
            </div>
          </div>
        </Container>
      </section>

      {/* Why we exist */}
      <section className="py-20 md:py-28">
        <Container width="narrow" className="text-center">
          <p className="eyebrow mb-4">Why We Exist</p>
          <h2 className="text-3xl leading-tight text-ink sm:text-4xl md:text-[2.6rem]">
            Because how a man dresses changes how he shows up in the world.
          </h2>
          <Divider className="my-8" />
          <p className="text-stone leading-relaxed">
            We have watched a well-cut suit straighten a man&apos;s shoulders before a defining
            meeting. We have seen a groom catch his own reflection and finally believe it is his day.
            Clothing, made well and made for you, is never only clothing — it is confidence you can
            put on. That is the reason Luxe Universal Wears exists: to give every gentleman that
            feeling, and to prove it can be made right here, at home.
          </p>
        </Container>
      </section>

      {/* Stats band */}
      <section className="bg-ink py-16 text-ivory">
        <Container>
          <div className="grid grid-cols-2 gap-y-10 md:grid-cols-4">
            {STATS.map((s) => (
              <div key={s.label} className="text-center">
                <p className="font-serif text-4xl text-blue-soft md:text-5xl">{s.value}</p>
                <p className="mt-2 text-[0.7rem] uppercase tracking-[0.2em] text-ivory/70">
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* CTA */}
      <section className="py-24 text-center">
        <Container width="narrow">
          <p className="flex items-center justify-center gap-2 text-xs uppercase tracking-[0.2em] text-mist">
            <MapPin size={13} className="text-blue-deep" /> Abuja · Nationwide · Worldwide
          </p>
          <h2 className="mt-4 text-4xl leading-tight text-ink md:text-5xl">
            Become Part Of The Story
          </h2>
          <p className="mx-auto mt-5 max-w-lg text-stone">
            Discover the collection or commission something made entirely for you. Either way, welcome
            to the house.
          </p>
          <div className="mt-9 flex flex-wrap justify-center gap-4">
            <ButtonLink href="/shop" variant="primary" size="lg">
              Shop The Collection
            </ButtonLink>
            <ButtonLink href="/bespoke" variant="outline" size="lg">
              Book A Consultation
            </ButtonLink>
          </div>
        </Container>
      </section>
    </>
  );
}

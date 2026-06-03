import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import { Container, Divider } from "@/components/ui/Container";
import { ButtonLink } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "The Lookbook | Luxe Universal Wears",
  description:
    "An editorial journey through the Luxe Universal Wears collections — Executive, Casual, Wedding and Luxury. Shop the look.",
};

type Story = {
  index: string;
  eyebrow: string;
  title: string;
  body: string;
  caption: string;
  shopHref: string;
  shopLabel: string;
  tall: string;
  wide: string;
  detail: string;
  reverse?: boolean;
};

const STORIES: Story[] = [
  {
    index: "01",
    eyebrow: "Chapter One",
    title: "The Executive",
    body: "Power is no longer loud. This season the boardroom speaks in cobalt and charcoal — structured shoulders, a clean break at the trouser and the kind of fit that needs no introduction. Dress for the position you intend to hold.",
    caption: "Royal Cobalt two-piece, worn with a crisp white shirt and double monk shoes.",
    shopHref: "/collections/corporate",
    shopLabel: "Shop Executive",
    tall: "/products/royal-cobalt-two-piece-suit.jpeg",
    wide: "/products/windsor-black-two-piece-suit.jpeg",
    detail: "/products/florence-black-double-monk-shoes.jpeg",
  },
  {
    index: "02",
    eyebrow: "Chapter Two",
    title: "Off Duty",
    body: "The weekend deserves its own discipline. Earth-toned co-ords, relaxed overshirts and considered layering — ease, tailored. These are the pieces for long lunches in Lekki and slow Sunday drives, where comfort and intention finally meet.",
    caption: "Dune Beige overshirt co-ord with the Monaco houndstooth layer.",
    shopHref: "/collections/casual",
    shopLabel: "Shop Casual",
    tall: "/products/dune-beige-overshirt-co-ord.jpeg",
    wide: "/products/monaco-houndstooth-overshirt.jpeg",
    detail: "/products/santa-fe-aztec-print-overshirt.jpeg",
    reverse: true,
  },
  {
    index: "03",
    eyebrow: "Chapter Three",
    title: "The Vows",
    body: "Every great love story deserves a great suit. From the groom in floral jacquard to the entire party in co-ordinated tartan, the wedding collection is built for the photographs you will keep for a lifetime — and the dance floor in between.",
    caption: "Noir floral jacquard tuxedo, paired with the Stewart red tartan blazer.",
    shopHref: "/collections/wedding",
    shopLabel: "Shop Wedding",
    tall: "/products/noir-floral-jacquard-tuxedo.jpeg",
    wide: "/products/stewart-red-tartan-check-blazer.jpeg",
    detail: "/products/emerald-tartan-check-blazer.jpeg",
  },
  {
    index: "04",
    eyebrow: "Chapter Four",
    title: "After Dark",
    body: "Luxury is a feeling before it is a fabric. Statement jacquards, suede textures and leather finished by hand — the pieces that turn an evening into an occasion. This is the wardrobe for galas, premieres and the nights you remember.",
    caption: "Brixton black suede trucker over the Oslo cream wool overshirt.",
    shopHref: "/collections/luxury",
    shopLabel: "Shop Luxury",
    tall: "/products/brixton-black-suede-trucker-jacket.jpeg",
    wide: "/products/oslo-cream-wool-overshirt.jpeg",
    detail: "/products/herm-s-izmir-black-leather-sandals.jpeg",
    reverse: true,
  },
];

export default function LookbookPage() {
  return (
    <>
      {/* Cover */}
      <section className="relative flex min-h-[92vh] items-center overflow-hidden bg-ink text-ivory">
        <Image
          src="/products/noir-floral-jacquard-tuxedo.jpeg"
          alt="Luxe Universal Wears lookbook cover"
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-50"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/40 to-transparent" />
        <Container className="relative z-10 py-32">
          <p className="eyebrow !text-blue-soft animate-fade-up">Volume IX · 2026</p>
          <h1 className="mt-5 max-w-3xl text-6xl leading-[0.95] text-ivory animate-fade-up sm:text-7xl md:text-8xl">
            The
            <br />
            Lookbook
          </h1>
          <p className="mt-7 max-w-md text-base leading-relaxed text-ivory/80 animate-fade-up">
            Four chapters. Four states of mind. A season of Nigerian luxury menswear, photographed
            and styled by the Luxe atelier. Turn the page.
          </p>
          <div className="mt-9 flex items-center gap-3 text-[0.7rem] uppercase tracking-[0.3em] text-ivory/60 animate-fade-up">
            <span className="h-px w-10 bg-blue" /> Scroll to begin
          </div>
        </Container>
      </section>

      {/* Stories */}
      {STORIES.map((story) => (
        <section key={story.index} className="border-b border-sand py-20 last:border-b-0 md:py-28">
          <Container width="wide">
            <div
              className={`grid items-center gap-8 lg:grid-cols-2 lg:gap-16 ${
                story.reverse ? "lg:[&>*:first-child]:order-2" : ""
              }`}
            >
              {/* Tall image */}
              <div className="relative">
                <div className="relative aspect-[3/4] overflow-hidden bg-cream">
                  <Image
                    src={story.tall}
                    alt={story.title}
                    fill
                    sizes="(max-width:1024px) 100vw, 50vw"
                    className="object-cover transition-transform duration-[1.2s] hover:scale-[1.04]"
                  />
                </div>
                <span className="pointer-events-none absolute -top-6 left-4 font-serif text-7xl text-sand/80 md:-left-8 md:text-8xl">
                  {story.index}
                </span>
              </div>

              {/* Text */}
              <div className="max-w-xl">
                <p className="eyebrow mb-4">{story.eyebrow}</p>
                <h2 className="text-5xl leading-[1.02] text-ink md:text-6xl">{story.title}</h2>
                <Divider className="my-7 !justify-start" />
                <p className="text-stone leading-relaxed">{story.body}</p>
                <p className="mt-6 border-l-2 border-blue/50 pl-4 font-serif text-lg italic text-charcoal">
                  {story.caption}
                </p>
                <div className="mt-9">
                  <ButtonLink href={story.shopHref} variant="outline" size="lg">
                    {story.shopLabel} <ArrowRight size={15} />
                  </ButtonLink>
                </div>
              </div>
            </div>

            {/* Wide + detail composition */}
            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              <div className="relative aspect-[4/5] overflow-hidden bg-cream sm:col-span-2 sm:aspect-[16/9]">
                <Image
                  src={story.wide}
                  alt={`${story.title} editorial`}
                  fill
                  sizes="(max-width:640px) 100vw, 66vw"
                  className="object-cover transition-transform duration-[1.2s] hover:scale-[1.04]"
                />
              </div>
              <div className="relative aspect-[4/5] overflow-hidden bg-cream sm:aspect-auto">
                <Image
                  src={story.detail}
                  alt={`${story.title} detail`}
                  fill
                  sizes="(max-width:640px) 100vw, 33vw"
                  className="object-cover transition-transform duration-[1.2s] hover:scale-[1.04]"
                />
                <div className="absolute inset-0 flex items-end bg-gradient-to-t from-ink/70 to-transparent p-5">
                  <Link
                    href={story.shopHref}
                    className="text-[0.7rem] uppercase tracking-[0.2em] text-ivory luxe-link-underline"
                  >
                    Shop the look
                  </Link>
                </div>
              </div>
            </div>
          </Container>
        </section>
      ))}

      {/* Closing */}
      <section className="bg-ink py-24 text-center text-ivory">
        <Container width="narrow">
          <p className="eyebrow !text-blue-soft mb-4">End Of Volume IX</p>
          <h2 className="text-4xl leading-tight text-ivory md:text-5xl">
            The Pages Were Only The Beginning
          </h2>
          <p className="mx-auto mt-5 max-w-lg text-ivory/75">
            Every piece in this lookbook is available now, with nationwide and international
            delivery. Or commission something entirely your own.
          </p>
          <div className="mt-9 flex flex-wrap justify-center gap-4">
            <ButtonLink href="/shop" variant="gold" size="lg">
              Shop The Collection
            </ButtonLink>
            <ButtonLink
              href="/bespoke"
              variant="outline"
              size="lg"
              className="!border-ivory/50 !text-ivory hover:!bg-ivory hover:!text-ink"
            >
              Explore Bespoke
            </ButtonLink>
          </div>
        </Container>
      </section>
    </>
  );
}

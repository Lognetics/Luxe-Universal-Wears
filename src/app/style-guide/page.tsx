import Image from "next/image";
import type { Metadata } from "next";
import { Check, ArrowRight, BookOpen } from "lucide-react";
import { Container, Divider } from "@/components/ui/Container";
import { ButtonLink } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "The Style Guide | Luxe Universal Wears",
  description:
    "In-depth style guides from the Luxe atelier — how to style a suit, choose a tuxedo, match shoes and belts, dress for the office and master casual weekend style.",
};

type Guide = {
  id: string;
  number: string;
  title: string;
  read: string;
  image: string;
  intro: string;
  paragraphs: string[];
  tipsTitle: string;
  tips: string[];
  reverse?: boolean;
};

const GUIDES: Guide[] = [
  {
    id: "style-a-suit",
    number: "01",
    title: "How to Style a Suit",
    read: "6 min read",
    image: "/products/windsor-black-two-piece-suit.jpeg",
    intro:
      "A suit is the foundation of any considered wardrobe — but a great suit is as much about how you wear it as the cloth it is cut from.",
    paragraphs: [
      "Begin with fit, because no detail rescues a poor one. The shoulder seam should sit exactly where your shoulder ends; the jacket should hug your back without pulling; and a single button — the top one on a two-button jacket — should fasten with room for a flat hand beneath. Trousers should graze the top of the shoe with a slight break, no more.",
      "Once the fit is right, build contrast deliberately. A navy or charcoal suit is the most versatile canvas, accepting everything from a white poplin shirt for the boardroom to a fine knit polo for an evening out. Let one element lead — a bold tie, a pocket square, or the shoes — and keep the rest quiet. Confidence in tailoring comes from restraint, not noise.",
    ],
    tipsTitle: "Quick rules",
    tips: [
      "Match the metal: belt buckle, watch and cufflinks should agree.",
      "Always undo the bottom button of a two-button jacket.",
      "Pocket square should complement the tie, never match it exactly.",
      "Show a quarter-inch of shirt cuff beyond the jacket sleeve.",
    ],
  },
  {
    id: "choosing-a-tuxedo",
    number: "02",
    title: "Choosing the Right Tuxedo",
    read: "5 min read",
    image: "/products/noir-floral-jacquard-tuxedo.jpeg",
    intro:
      "Black-tie is the one dress code where the rules genuinely matter — and where getting them right makes you unforgettable.",
    paragraphs: [
      "The classic tuxedo is midnight blue or black with a facing of silk — grosgrain for a matte, modern look, or satin for old-world sheen — on the lapel and trouser stripe. A peak lapel reads the most formal and flatters most frames; a shawl collar is softer and quietly glamorous. Reserve the notch lapel for business suits, not black-tie.",
      "For weddings and galas where you want to stand apart, a jacquard or velvet dinner jacket worn with black trousers is the considered way to make a statement without breaking the code. Pair any tuxedo with a crisp white dress shirt, black studs, a hand-tied bow tie and patent or highly polished leather shoes. Skip the regular belt — a well-fitted waistband or cummerbund finishes the line.",
    ],
    tipsTitle: "Black-tie essentials",
    tips: [
      "Always a hand-tied bow tie — never a long tie with a tuxedo.",
      "Silk-faced lapels; the facing should be matched in the trouser stripe.",
      "No belt — opt for side-adjusters or a cummerbund.",
      "Patent or mirror-polished black leather on the feet.",
    ],
    reverse: true,
  },
  {
    id: "shoes-and-belts",
    number: "03",
    title: "Matching Shoes and Belts",
    read: "4 min read",
    image: "/products/florence-black-double-monk-shoes.jpeg",
    intro:
      "The fastest way to look pulled together — or undone — lives at the two ends of your outfit. Get the leathers right and everything elevates.",
    paragraphs: [
      "The guiding principle is simple: your belt should match your shoes in both colour and finish. Black shoes call for a black belt; brown shoes for a brown belt in a similar tone. A smooth calf shoe pairs with a smooth leather belt, while suede or grain leathers should be echoed in texture where possible. When in doubt, a dark brown leather works with navy, grey and earth tones alike.",
      "Coordinate the metals too — a silver buckle sits naturally with a steel watch and silver cufflinks, gold with warmer accents. For black-tie and the most formal occasions, forgo the belt entirely. And remember the unwritten rule of footwear formality: the sleeker and darker the shoe, the dressier the outfit, with double monks and oxfords leading and suede loafers relaxing things down.",
    ],
    tipsTitle: "The leather code",
    tips: [
      "Belt colour and finish should mirror your shoes.",
      "Match buckle metal to your watch and cufflinks.",
      "Black leather is dressiest; mid-brown is the most versatile.",
      "No belt with black-tie — let the trousers do the work.",
    ],
  },
  {
    id: "corporate-fashion",
    number: "04",
    title: "Corporate Fashion Guide",
    read: "6 min read",
    image: "/products/royal-cobalt-two-piece-suit.jpeg",
    intro:
      "The modern Nigerian office spans the strictly formal and the smart-casual. Dressing well means reading the room and building a wardrobe that flexes.",
    paragraphs: [
      "Start with a capsule of three versatile suits — navy, charcoal and a mid-grey — alongside a handful of well-fitted shirts in white, light blue and subtle stripe. These pieces recombine endlessly, carrying you from quarterly board meetings to client lunches without a second thought. Invest in two pairs of good shoes, black and brown, and the rotation looks after itself.",
      "For smart-casual days, a tailored blazer over an open-collar shirt or fine-gauge polo strikes the right note: considered but never stiff. Lean on texture — houndstooth, hopsack, a subtle check — to add interest where a tie is absent. Always dress a notch above the room rather than below it; in a professional setting, being slightly overdressed reads as respect, never excess.",
    ],
    tipsTitle: "Boardroom-ready",
    tips: [
      "Build a three-suit capsule: navy, charcoal, mid-grey.",
      "Keep shirts crisp — white and light blue do the heavy lifting.",
      "A blazer instantly elevates smart-casual days.",
      "When unsure, dress one level above the room.",
    ],
    reverse: true,
  },
  {
    id: "casual-weekend",
    number: "05",
    title: "Casual Weekend Style",
    read: "5 min read",
    image: "/products/dune-beige-overshirt-co-ord.jpeg",
    intro:
      "Off-duty does not mean off-form. Weekend dressing is where personal taste comes alive — relaxed, but every bit as intentional.",
    paragraphs: [
      "The overshirt is the cornerstone of modern casual style — equal parts shirt and light jacket, it layers beautifully over a tee or fine knit and adapts from a morning coffee run to dinner. Co-ordinated sets in earth tones — beige, sage, tweed — offer an effortless, head-to-turn look with almost no decision-making required. Add interest through texture and tonal layering rather than loud colour.",
      "Footwear sets the register: suede loafers or clean walk shoes keep things smart, while leather sandals or slides signal true downtime. Roll a sleeve, leave the top button open, and let the fit stay relaxed but never sloppy. The goal of great weekend style is to look as though you put in no effort at all — which, of course, takes a little.",
    ],
    tipsTitle: "Off-duty done right",
    tips: [
      "An overshirt is the most versatile weekend layer you can own.",
      "Earth-tone co-ords look considered with zero effort.",
      "Build interest with texture, not loud colour.",
      "Keep the fit relaxed — relaxed is not the same as sloppy.",
    ],
  },
];

export default function StyleGuidePage() {
  return (
    <>
      {/* Hero */}
      <section className="relative flex min-h-[70vh] items-center overflow-hidden bg-ink text-ivory">
        <Image
          src="/products/cotswold-camel-houndstooth-blazer.jpeg"
          alt="The Luxe Style Guide"
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-45"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/50 to-ink/20" />
        <Container className="relative z-10 py-28 text-center">
          <p className="eyebrow !text-blue-soft mb-4 animate-fade-up">The Journal</p>
          <h1 className="mx-auto max-w-3xl text-5xl leading-[1.02] text-ivory animate-fade-up sm:text-6xl md:text-7xl">
            The Style Guide
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-ivory/80 leading-relaxed animate-fade-up">
            Considered advice from the Luxe atelier on dressing with intention — from black-tie to
            the weekend, and every fit in between.
          </p>
        </Container>
      </section>

      {/* Table of contents */}
      <section className="border-b border-sand bg-cream py-12">
        <Container>
          <div className="flex items-center gap-3 text-stone">
            <BookOpen size={18} className="text-blue-deep" />
            <p className="eyebrow !mb-0">In This Guide</p>
          </div>
          <nav className="mt-6 grid gap-x-8 gap-y-3 sm:grid-cols-2 lg:grid-cols-3">
            {GUIDES.map((g) => (
              <a
                key={g.id}
                href={`#${g.id}`}
                className="group flex items-baseline gap-3 border-b border-sand pb-3 transition hover:border-blue"
              >
                <span className="font-serif text-xl text-blue-deep">{g.number}</span>
                <span className="flex-1 text-ink transition group-hover:text-blue-deep">
                  {g.title}
                </span>
                <ArrowRight
                  size={15}
                  className="text-mist transition group-hover:translate-x-1 group-hover:text-blue-deep"
                />
              </a>
            ))}
          </nav>
        </Container>
      </section>

      {/* Articles */}
      {GUIDES.map((g) => (
        <section
          key={g.id}
          id={g.id}
          className="scroll-mt-24 border-b border-sand py-20 md:py-28"
        >
          <Container>
            <div
              className={`grid items-start gap-10 lg:grid-cols-2 lg:gap-16 ${
                g.reverse ? "lg:[&>*:first-child]:order-2" : ""
              }`}
            >
              {/* Image */}
              <div className="lg:sticky lg:top-24">
                <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-cream">
                  <Image
                    src={g.image}
                    alt={g.title}
                    fill
                    sizes="(max-width:1024px) 100vw, 50vw"
                    className="object-cover"
                  />
                  <span className="absolute left-5 top-5 bg-ivory/95 px-4 py-2 font-serif text-2xl text-ink">
                    {g.number}
                  </span>
                </div>
              </div>

              {/* Article body */}
              <article>
                <p className="eyebrow mb-3">Style Guide · {g.read}</p>
                <h2 className="text-4xl leading-tight text-ink md:text-5xl">{g.title}</h2>
                <Divider className="my-7 !justify-start" />
                <p className="font-serif text-xl leading-snug text-charcoal">{g.intro}</p>
                {g.paragraphs.map((p, i) => (
                  <p key={i} className="mt-5 text-stone leading-relaxed">
                    {p}
                  </p>
                ))}

                <div className="mt-8 border border-sand bg-cream/60 p-6">
                  <p className="eyebrow !mb-4">{g.tipsTitle}</p>
                  <ul className="space-y-3">
                    {g.tips.map((tip) => (
                      <li key={tip} className="flex gap-3 text-sm text-ink">
                        <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue/15 text-blue-deep">
                          <Check size={12} />
                        </span>
                        <span className="leading-relaxed">{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            </div>
          </Container>
        </section>
      ))}

      {/* CTA */}
      <section className="bg-ink py-24 text-center text-ivory">
        <Container width="narrow">
          <p className="eyebrow !text-blue-soft mb-4">Put It Into Practice</p>
          <h2 className="text-4xl leading-tight text-ivory md:text-5xl">
            Theory Is Nothing Without The Cloth
          </h2>
          <p className="mx-auto mt-5 max-w-lg text-ivory/75">
            Explore the collection, or let our atelier build a wardrobe around the principles above.
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
              Book A Consultation
            </ButtonLink>
          </div>
        </Container>
      </section>
    </>
  );
}

import Image from "next/image";
import type { Metadata } from "next";
import {
  Scissors,
  Ruler,
  Calendar,
  Sparkles,
  Crown,
  Gem,
  Check,
  ArrowRight,
  Quote,
  MapPin,
} from "lucide-react";
import { Container, SectionHeading, Divider } from "@/components/ui/Container";
import { ButtonLink } from "@/components/ui/Button";
import { BookingForm } from "./BookingForm";

export const metadata: Metadata = {
  title: "Bespoke Tailoring | Luxe Universal Wears",
  description:
    "Made-to-measure suits, shirts, wedding tuxedos and corporate wear, hand-crafted in Abuja. Book a private consultation with the Luxe atelier.",
};

const SERVICES = [
  {
    title: "Bespoke Suits",
    image: "/products/windsor-black-two-piece-suit.jpeg",
    text: "Two and three-piece suits drafted entirely to your frame — canvassed construction, hand-finished lapels and a silhouette that moves with you.",
  },
  {
    title: "Bespoke Shirts",
    image: "/products/oslo-cream-wool-overshirt.jpeg",
    text: "Egyptian and two-fold cottons cut to your exact collar, cuff and yoke. Monogramming and mother-of-pearl buttons included as standard.",
  },
  {
    title: "Wedding Tuxedos",
    image: "/products/noir-floral-jacquard-tuxedo.jpeg",
    text: "Make the moment unforgettable. Grosgrain or satin lapels, jacquard weaves and groomsmen co-ordination handled end to end.",
  },
  {
    title: "Corporate Wear",
    image: "/products/royal-cobalt-two-piece-suit.jpeg",
    text: "Boardroom-ready capsule wardrobes and team uniforms with consistent fit, branded linings and reliable nationwide reorders.",
  },
];

const PROCESS = [
  {
    icon: Calendar,
    step: "01",
    title: "Consultation",
    text: "We meet at our Abuja atelier or virtually to understand your taste, lifestyle and the occasion, then curate fabrics and styles together.",
  },
  {
    icon: Ruler,
    step: "02",
    title: "Measurement",
    text: "Our master cutter records over twenty measurements alongside posture and stance notes to draft a paper pattern unique to you.",
  },
  {
    icon: Scissors,
    step: "03",
    title: "Fitting",
    text: "A baste fitting in calico, then refinements on the finished garment ensure every line falls exactly as it should.",
  },
  {
    icon: Sparkles,
    step: "04",
    title: "Delivery",
    text: "Your finished piece is pressed, packaged and delivered to your door — anywhere in Nigeria or shipped internationally.",
  },
];

const MEASUREMENTS = [
  {
    name: "Chest",
    how: "Measured around the fullest part of the chest, under the arms, keeping the tape level.",
  },
  {
    name: "Shoulder",
    how: "From the seam of one shoulder straight across the back to the other shoulder seam.",
  },
  {
    name: "Sleeve",
    how: "From the shoulder seam over a slightly bent elbow to the wrist bone.",
  },
  {
    name: "Waist",
    how: "Around the natural waistline where trousers naturally sit, without pulling tight.",
  },
  {
    name: "Hip / Seat",
    how: "Around the widest part of the seat with feet together for a clean trouser line.",
  },
  {
    name: "Inseam",
    how: "From the crotch seam down the inner leg to the desired trouser break.",
  },
  {
    name: "Neck",
    how: "Around the base of the neck, leaving room for one finger for collar comfort.",
  },
  {
    name: "Jacket Length",
    how: "From the base of the collar down the back to where the jacket should finish.",
  },
];

const CRAFT = [
  { icon: Gem, title: "Italian & British Cloths", text: "Loro Piana, Vitale Barberis Canonico and Holland & Sherry." },
  { icon: Scissors, title: "Full Canvas Construction", text: "A floating chest piece that breathes and shapes to you over time." },
  { icon: Crown, title: "Hand-Finished Details", text: "Pick-stitched edges, working cuffs and bespoke linings." },
  { icon: Check, title: "Lifetime Alterations", text: "Complimentary adjustments as your frame and style evolve." },
];

export default function BespokePage() {
  return (
    <>
      {/* Hero */}
      <section className="relative flex min-h-[88vh] items-center justify-center overflow-hidden bg-ink text-ivory">
        <Image
          src="/products/windsor-black-two-piece-suit.jpeg"
          alt="Bespoke tailoring at Luxe Universal Wears"
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-55"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/50 to-ink/30" />
        <Container className="relative z-10 py-32 text-center">
          <p className="eyebrow !text-blue-soft animate-fade-up">The Luxe Atelier</p>
          <h1 className="mx-auto mt-5 max-w-4xl text-5xl leading-[1.02] text-ivory animate-fade-up sm:text-6xl md:text-7xl">
            Tailored To Your Identity
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-base text-ivory/80 leading-relaxed animate-fade-up">
            Made-to-measure suits, shirts and ceremonial wear, drafted by hand in Abuja for the
            modern Nigerian gentleman. One body, one pattern, one unmistakable fit.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4 animate-fade-up">
            <ButtonLink href="#book" variant="gold" size="lg">
              Book Consultation
            </ButtonLink>
            <ButtonLink
              href="#process"
              variant="outline"
              size="lg"
              className="!border-ivory/50 !text-ivory hover:!bg-ivory hover:!text-ink"
            >
              Our Process
            </ButtonLink>
          </div>
        </Container>
      </section>

      {/* Intro story */}
      <section className="py-20 md:py-28">
        <Container width="narrow" className="text-center">
          <p className="eyebrow mb-4">Since 1998 · Abuja</p>
          <h2 className="text-3xl leading-tight text-ink sm:text-4xl md:text-[2.8rem]">
            The garment should bow to the man — never the reverse.
          </h2>
          <Divider className="my-8" />
          <p className="text-stone leading-relaxed">
            For over two decades, Luxe Universal Wears has dressed Nigeria&apos;s most discerning
            gentlemen — captains of industry, grooms, statesmen and creatives. Bespoke is our
            highest expression of that craft: a single garment, drafted from a pattern made for you
            alone, refined across multiple fittings until it disappears into a second skin.
          </p>
          <p className="mt-5 text-stone leading-relaxed">
            We marry the discipline of Savile Row with the colour, confidence and occasion of West
            African dressing. The result is clothing that feels engineered for your life — quietly
            powerful, deeply personal and built to be worn for years.
          </p>
        </Container>
      </section>

      {/* Services */}
      <section className="bg-cream py-20 md:py-24">
        <Container>
          <SectionHeading
            eyebrow="Tailoring Services"
            title="Crafted For Every Occasion"
            description="From the boardroom to the altar, every commission begins as a conversation and ends as a garment that is entirely your own."
          />
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {SERVICES.map((s) => (
              <article key={s.title} className="group bg-paper shadow-soft">
                <div className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-cream">
                  <Image
                    src={s.image}
                    alt={s.title}
                    fill
                    sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 25vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <div className="p-6">
                  <h3 className="font-serif text-2xl text-ink">{s.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-stone">{s.text}</p>
                </div>
              </article>
            ))}
          </div>
        </Container>
      </section>

      {/* Process */}
      <section id="process" className="py-20 md:py-28">
        <Container>
          <SectionHeading
            eyebrow="Our Process"
            title="Four Steps To A Perfect Fit"
            description="A considered journey, refined over thousands of commissions, that turns a length of cloth into something unmistakably yours."
          />
          <div className="mt-16 grid gap-y-12 md:grid-cols-4 md:gap-x-6">
            {PROCESS.map(({ icon: Icon, step, title, text }, i) => (
              <div key={step} className="relative text-center md:text-left">
                <div className="flex items-center justify-center gap-4 md:justify-start">
                  <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-blue/40 text-blue-deep">
                    <Icon size={22} strokeWidth={1.5} />
                  </span>
                  <span className="font-serif text-4xl text-sand">{step}</span>
                </div>
                {i < PROCESS.length - 1 && (
                  <span className="absolute left-1/2 top-7 hidden h-px w-full -translate-x-0 bg-sand md:block" />
                )}
                <h3 className="mt-5 font-serif text-2xl text-ink">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-stone">{text}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Measurement guide */}
      <section className="bg-ink py-20 text-ivory md:py-28">
        <Container>
          <div className="grid items-start gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
            <div className="lg:sticky lg:top-28">
              <p className="eyebrow !text-blue-soft mb-3">Measurement Guide</p>
              <h2 className="text-4xl leading-tight text-ivory md:text-5xl">
                Know Your Numbers
              </h2>
              <p className="mt-5 text-ivory/75 leading-relaxed">
                Precision is the difference between a good suit and a great one. Use a soft tape and,
                ideally, a friend&apos;s hands. Stand naturally, breathe normally and keep the tape
                snug but never tight. Our cutter verifies everything in person — this is simply your
                starting point.
              </p>
              <div className="relative mt-8 aspect-[4/5] overflow-hidden bg-charcoal">
                <Image
                  src="/products/cotswold-camel-houndstooth-blazer.jpeg"
                  alt="Measuring for a bespoke garment"
                  fill
                  sizes="(max-width:1024px) 100vw, 40vw"
                  className="object-cover opacity-90"
                />
                <div className="absolute bottom-0 left-0 right-0 flex items-center gap-3 bg-ink/80 px-5 py-4">
                  <Ruler size={18} className="text-blue-soft" />
                  <p className="text-xs uppercase tracking-[0.18em] text-ivory/80">
                    Over 20 measurements per commission
                  </p>
                </div>
              </div>
            </div>
            <div>
              <ol className="divide-y divide-ivory/10 border-y border-ivory/10">
                {MEASUREMENTS.map((m, i) => (
                  <li key={m.name} className="flex gap-5 py-5">
                    <span className="mt-0.5 font-serif text-xl text-blue-soft">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <div>
                      <h3 className="font-serif text-xl text-ivory">{m.name}</h3>
                      <p className="mt-1 text-sm leading-relaxed text-ivory/65">{m.how}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </Container>
      </section>

      {/* Fabrics / craftsmanship */}
      <section className="py-20 md:py-28">
        <Container>
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
            <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-cream">
              <Image
                src="/products/emerald-tartan-check-blazer.jpeg"
                alt="Fabric library at the Luxe atelier"
                fill
                sizes="(max-width:1024px) 100vw, 50vw"
                className="object-cover"
              />
              <div className="absolute bottom-5 left-5 bg-ivory/95 px-6 py-4">
                <p className="font-serif text-2xl text-ink">300+ Cloths</p>
                <p className="text-xs uppercase tracking-[0.15em] text-mist">In our fabric library</p>
              </div>
            </div>
            <div>
              <p className="eyebrow mb-3">Fabrics &amp; Craftsmanship</p>
              <h2 className="text-4xl leading-tight text-ink md:text-5xl">
                Cloth Chosen With Intention
              </h2>
              <p className="mt-5 text-stone leading-relaxed">
                We source from the world&apos;s most storied mills and finish every garment by hand
                in Abuja. From breathable high-twist wools built for the West African climate to
                ceremonial jacquards, each cloth is selected for how it will live on you.
              </p>
              <div className="mt-9 grid gap-x-6 gap-y-7 sm:grid-cols-2">
                {CRAFT.map(({ icon: Icon, title, text }) => (
                  <div key={title} className="flex gap-3">
                    <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-blue/40 text-blue-deep">
                      <Icon size={18} strokeWidth={1.5} />
                    </span>
                    <div>
                      <h3 className="font-serif text-lg text-ink">{title}</h3>
                      <p className="mt-1 text-sm leading-relaxed text-stone">{text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Testimonial */}
      <section className="bg-cream py-20 md:py-24">
        <Container width="narrow" className="text-center">
          <Quote size={36} className="mx-auto text-blue" strokeWidth={1.25} />
          <blockquote className="mt-6 font-serif text-2xl leading-snug text-ink sm:text-3xl">
            &ldquo;I have been measured in London and Milan, yet the suit Luxe made for my daughter&apos;s
            wedding is the finest I own. The fit, the cloth, the quiet confidence — flawless.&rdquo;
          </blockquote>
          <div className="mt-8 flex items-center justify-center gap-3">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-blue/15 font-serif text-lg text-blue-deep">
              EA
            </span>
            <div className="text-left">
              <p className="font-medium text-ink">Engr. Emeka Adeyemi</p>
              <p className="flex items-center gap-1 text-xs uppercase tracking-[0.15em] text-mist">
                <MapPin size={12} /> Utako, Abuja
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* Booking form */}
      <section id="book" className="py-20 md:py-28">
        <Container width="default">
          <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
            <div className="lg:pt-4">
              <p className="eyebrow mb-3">Book Consultation</p>
              <h2 className="text-4xl leading-tight text-ink md:text-5xl">
                Begin Your Commission
              </h2>
              <p className="mt-5 text-stone leading-relaxed">
                Reserve a private appointment at our Abuja atelier or arrange a virtual fitting from
                anywhere in the world. Tell us a little about yourself and the occasion — our team
                will respond within 24 hours.
              </p>
              <ul className="mt-8 space-y-3">
                {[
                  "Private one-to-one styling session",
                  "No deposit required to book",
                  "Atelier visits & virtual fittings",
                  "Nationwide & international delivery",
                ].map((f) => (
                  <li key={f} className="flex items-center gap-3 text-sm text-ink">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue/15 text-blue-deep">
                      <Check size={13} />
                    </span>
                    {f}
                  </li>
                ))}
              </ul>
            </div>
            <BookingForm />
          </div>
        </Container>
      </section>

      {/* Closing CTA */}
      <section className="relative overflow-hidden bg-ink py-24 text-center text-ivory">
        <Image
          src="/products/noir-floral-jacquard-tuxedo.jpeg"
          alt=""
          fill
          sizes="100vw"
          className="object-cover opacity-25"
        />
        <div className="absolute inset-0 bg-ink/60" />
        <Container className="relative z-10">
          <p className="eyebrow !text-blue-soft mb-4">Made For You</p>
          <h2 className="mx-auto max-w-3xl text-4xl leading-tight text-ivory md:text-5xl">
            Wear Something No One Else Can
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-ivory/75">
            Your story deserves a garment as singular as you are. Let&apos;s create it together.
          </p>
          <div className="mt-9 flex flex-wrap justify-center gap-4">
            <ButtonLink href="#book" variant="gold" size="lg">
              Book Consultation <ArrowRight size={15} />
            </ButtonLink>
            <ButtonLink
              href="/shop"
              variant="outline"
              size="lg"
              className="!border-ivory/50 !text-ivory hover:!bg-ivory hover:!text-ink"
            >
              Shop Ready-To-Wear
            </ButtonLink>
          </div>
        </Container>
      </section>
    </>
  );
}

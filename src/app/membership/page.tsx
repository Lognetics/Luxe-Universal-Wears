import type { Metadata } from "next";
import { clsx } from "clsx";
import {
  Award,
  Calendar,
  Check,
  Crown,
  Gift,
  Sparkles,
  Users,
} from "lucide-react";
import { Container, SectionHeading, Divider } from "@/components/ui/Container";
import { ButtonLink } from "@/components/ui/Button";
import { formatNaira } from "@/lib/format";
import { FaqAccordion, type Faq } from "../contact/FaqAccordion";

export const metadata: Metadata = {
  title: "Luxe Membership Club | Luxe Universal Wears",
  description:
    "Join the Luxe Membership Club for early access, exclusive discounts, VIP events, complimentary shipping and your own personal stylist.",
};

type Tier = {
  name: string;
  price: number;
  tagline: string;
  featured?: boolean;
  benefits: string[];
};

const TIERS: Tier[] = [
  {
    name: "Silver",
    price: 0,
    tagline: "The essential membership, complimentary for every registered client.",
    benefits: [
      "Early access to seasonal drops",
      "Birthday reward each year",
      "Members-only newsletter",
      "Free shipping above ₦150,000",
      "Members-only sale previews",
    ],
  },
  {
    name: "Gold",
    price: 75000,
    featured: true,
    tagline: "For the discerning regular who values priority and reward.",
    benefits: [
      "Everything in Silver",
      "10% off every order, all year",
      "48-hour early access to all launches",
      "Complimentary shipping, no minimum",
      "Two VIP event invitations per year",
      "Priority concierge support",
    ],
  },
  {
    name: "Platinum",
    price: 250000,
    tagline: "The complete Luxe experience, with a stylist of your own.",
    benefits: [
      "Everything in Gold",
      "15% off every order, all year",
      "Dedicated personal stylist",
      "Complimentary annual bespoke fitting",
      "Unlimited VIP & runway invitations",
      "Free alterations for life",
      "First access to limited editions",
    ],
  },
];

const BENEFITS = [
  { icon: Sparkles, title: "Early Access", desc: "Shop new collections and limited editions before they reach the public." },
  { icon: Gift, title: "Exclusive Discounts", desc: "Year-round savings that grow with your tier — never wait for a sale again." },
  { icon: Calendar, title: "VIP Events", desc: "Private viewings, runway shows and members-only evenings at our atelier." },
  { icon: Award, title: "Free Shipping", desc: "Complimentary nationwide delivery, with no minimum spend at Gold and above." },
  { icon: Crown, title: "Personal Stylist", desc: "A dedicated expert to curate your wardrobe and dress you for every occasion." },
  { icon: Users, title: "Concierge Priority", desc: "Skip the queue with priority support for orders, fittings and enquiries." },
];

const STEPS = [
  { step: "01", title: "Choose Your Tier", desc: "Select the membership that matches the way you shop and dress." },
  { step: "02", title: "Create Your Account", desc: "Register in minutes and your benefits activate immediately." },
  { step: "03", title: "Earn & Enjoy", desc: "Unlock rewards, invitations and savings with every interaction." },
  { step: "04", title: "Rise Through the Tiers", desc: "The more you engage, the more the house gives back to you." },
];

const FAQS: Faq[] = [
  {
    q: "Is Silver membership really free?",
    a: "Yes. Every client who registers an account is automatically enrolled in Silver at no cost, with immediate access to early drops, birthday rewards and members-only previews.",
  },
  {
    q: "Can I upgrade or downgrade my tier?",
    a: "Absolutely. You may upgrade at any time and the difference is prorated. Paid tiers renew annually and can be changed or cancelled before each renewal date.",
  },
  {
    q: "How does the personal stylist service work?",
    a: "Platinum members are paired with a dedicated stylist who learns your preferences, curates seasonal edits, and is available for in-person or virtual styling sessions throughout the year.",
  },
  {
    q: "Do membership discounts stack with sale prices?",
    a: "Your tier discount applies to full-price items year-round. During promotional periods you will always receive the better of the two offers, never both combined.",
  },
];

export default function MembershipPage() {
  return (
    <main className="bg-ivory">
      {/* Hero */}
      <section className="relative overflow-hidden bg-ink text-ivory">
        <Container className="py-24 text-center sm:py-28">
          <Crown className="mx-auto text-blue" size={34} />
          <p className="eyebrow !text-blue-soft mb-4 mt-5">The Luxe Membership Club</p>
          <h1 className="mx-auto max-w-3xl text-4xl leading-[1.04] text-ivory sm:text-6xl md:text-7xl">
            Membership With Privilege
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-mist leading-relaxed">
            A rewarding relationship with the house — early access, exclusive savings, private events
            and a stylist of your own. This is how Luxe takes care of its own.
          </p>
          <div className="mt-9 flex justify-center">
            <ButtonLink href="/register" variant="gold" size="lg">
              Join the Club
            </ButtonLink>
          </div>
        </Container>
      </section>

      {/* Tiers */}
      <section className="py-16 sm:py-20">
        <Container>
          <SectionHeading
            eyebrow="Choose Your Tier"
            title="Three Levels of Privilege"
            description="Whether you are a new client or a longtime patron, there is a place for you in the club."
            className="mb-14"
          />
          <div className="grid grid-cols-1 gap-7 lg:grid-cols-3">
            {TIERS.map((tier) => (
              <div
                key={tier.name}
                className={clsx(
                  "flex flex-col border p-8 sm:p-10",
                  tier.featured
                    ? "border-ink bg-ink text-ivory shadow-card lg:-mt-4 lg:mb-4"
                    : "border-sand bg-cream"
                )}
              >
                {tier.featured && (
                  <span className="mb-5 inline-flex w-fit items-center gap-1.5 bg-blue px-3 py-1 text-[0.6rem] uppercase tracking-[0.2em] text-ink">
                    <Sparkles size={12} /> Most Popular
                  </span>
                )}
                <h3 className={clsx("font-serif text-3xl", tier.featured ? "text-ivory" : "text-ink")}>
                  {tier.name}
                </h3>
                <p className={clsx("mt-2 text-sm leading-relaxed", tier.featured ? "text-mist" : "text-stone")}>
                  {tier.tagline}
                </p>
                <div className="mt-6 flex items-baseline gap-2">
                  <span className={clsx("font-serif text-4xl", tier.featured ? "text-ivory" : "text-ink")}>
                    {tier.price === 0 ? "Free" : formatNaira(tier.price)}
                  </span>
                  {tier.price > 0 && (
                    <span className={clsx("text-sm", tier.featured ? "text-mist" : "text-stone")}>/ year</span>
                  )}
                </div>

                <ul className="mt-8 flex-1 space-y-3.5">
                  {tier.benefits.map((b) => (
                    <li key={b} className="flex gap-3">
                      <Check
                        size={16}
                        className={clsx("mt-0.5 shrink-0", tier.featured ? "text-blue" : "text-blue-deep")}
                      />
                      <span className={clsx("text-sm", tier.featured ? "text-ivory/90" : "text-charcoal")}>
                        {b}
                      </span>
                    </li>
                  ))}
                </ul>

                <ButtonLink
                  href="/register"
                  variant={tier.featured ? "gold" : "outline"}
                  size="md"
                  className="mt-9 w-full"
                >
                  {tier.price === 0 ? "Join Free" : `Become ${tier.name}`}
                </ButtonLink>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Benefits grid */}
      <section className="border-t border-sand bg-cream py-16 sm:py-20">
        <Container>
          <SectionHeading
            eyebrow="Why Join"
            title="Privileges Across the House"
            description="Every membership unlocks a curated set of benefits designed around the way you live and dress."
            className="mb-14"
          />
          <div className="grid grid-cols-1 gap-px overflow-hidden border border-sand bg-sand sm:grid-cols-2 lg:grid-cols-3">
            {BENEFITS.map((b) => (
              <div key={b.title} className="bg-ivory p-8">
                <div className="flex h-12 w-12 items-center justify-center bg-ink text-blue">
                  <b.icon size={22} />
                </div>
                <h3 className="mt-5 text-xl text-ink">{b.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-stone">{b.desc}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* How it works */}
      <section className="py-16 sm:py-20">
        <Container>
          <SectionHeading
            eyebrow="How It Works"
            title="Membership in Four Steps"
            className="mb-14"
          />
          <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((s) => (
              <div key={s.step}>
                <span className="font-serif text-4xl text-blue">{s.step}</span>
                <h3 className="mt-3 text-xl text-ink">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-stone">{s.desc}</p>
              </div>
            ))}
          </div>
          <Divider className="mt-16" />
        </Container>
      </section>

      {/* FAQ */}
      <section className="border-t border-sand bg-cream py-16 sm:py-20">
        <Container width="narrow">
          <SectionHeading eyebrow="Questions" title="Membership FAQ" className="mb-10" />
          <FaqAccordion items={FAQS} />
        </Container>
      </section>

      {/* Join CTA */}
      <section className="bg-ink py-20 text-center text-ivory sm:py-24">
        <Container width="narrow">
          <p className="eyebrow !text-blue-soft mb-4">Your Seat Awaits</p>
          <h2 className="text-3xl text-ivory sm:text-4xl md:text-5xl">Join the Luxe Membership Club</h2>
          <p className="mx-auto mt-4 max-w-md text-mist leading-relaxed">
            Create your account today and your privileges begin the moment you do.
          </p>
          <div className="mt-8 flex justify-center">
            <ButtonLink href="/register" variant="gold" size="lg">
              Become a Member
            </ButtonLink>
          </div>
        </Container>
      </section>
    </main>
  );
}

import type { Metadata } from "next";
import { Award, Briefcase, Building2, Check, Sparkles, Users } from "lucide-react";
import { Container, SectionHeading, Divider } from "@/components/ui/Container";
import { ButtonLink } from "@/components/ui/Button";
import { EnquiryForm } from "./EnquiryForm";

export const metadata: Metadata = {
  title: "Corporate & Bulk Orders | Luxe Universal Wears",
  description:
    "Custom branding, bulk pricing and a dedicated account manager for companies, schools, organisations and events. Outfit your team with Luxe.",
};

const VALUE_PROPS = [
  {
    icon: Sparkles,
    title: "Custom Branding",
    desc: "Embroidered logos, bespoke linings, custom buttons and colourways that carry your identity into every garment.",
  },
  {
    icon: Award,
    title: "Bulk Pricing",
    desc: "Tiered volume pricing that scales with your order, with transparent quotations and no hidden costs.",
  },
  {
    icon: Users,
    title: "Dedicated Account Manager",
    desc: "A single point of contact from first brief to final delivery, coordinating sizing, fittings and logistics.",
  },
];

const INDUSTRIES = [
  { icon: Building2, name: "Banks & Financial Services" },
  { icon: Briefcase, name: "Law & Professional Firms" },
  { icon: Users, name: "Hospitality & Airlines" },
  { icon: Award, name: "Schools & Universities" },
  { icon: Sparkles, name: "Events & Conferences" },
  { icon: Building2, name: "Government & Public Sector" },
];

const PROCESS = [
  { step: "01", title: "Brief & Consultation", desc: "Share your needs, branding and timeline with your account manager." },
  { step: "02", title: "Samples & Quotation", desc: "We prepare fabric samples, mock-ups and a transparent volume quote." },
  { step: "03", title: "Sizing & Production", desc: "Group measuring sessions ensure a precise fit before production begins." },
  { step: "04", title: "Delivery & Support", desc: "On-schedule nationwide delivery, with reorders and replacements on demand." },
];

const CLIENTS = ["Meridian Bank", "Lagos Law LLP", "Atlantic Air", "Crown Academy", "Summit Events", "Civic Group"];

export default function CorporatePage() {
  return (
    <main className="bg-ivory">
      {/* Hero */}
      <section className="relative overflow-hidden bg-ink text-ivory">
        <Container className="py-24 text-center sm:py-28">
          <Briefcase className="mx-auto text-blue" size={32} />
          <p className="eyebrow !text-blue-soft mb-4 mt-5">Corporate & Bulk Orders</p>
          <h1 className="mx-auto max-w-3xl text-4xl leading-[1.04] text-ivory sm:text-6xl md:text-7xl">
            Dress Your Whole Organisation
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-mist leading-relaxed">
            Custom-branded uniforms and tailored apparel for companies, schools, organisations and
            events — produced to Luxe standards, delivered at scale across Nigeria.
          </p>
          <div className="mt-9 flex justify-center">
            <ButtonLink href="#enquire" variant="gold" size="lg">
              Request a Quote
            </ButtonLink>
          </div>
        </Container>
      </section>

      {/* Value props */}
      <section className="py-16 sm:py-20">
        <Container>
          <SectionHeading
            eyebrow="Why Partner With Luxe"
            title="Built for Business"
            description="The craftsmanship of our atelier, organised around the demands of a large order."
            className="mb-14"
          />
          <div className="grid grid-cols-1 gap-7 md:grid-cols-3">
            {VALUE_PROPS.map((v) => (
              <div key={v.title} className="border border-sand bg-cream p-8">
                <div className="flex h-12 w-12 items-center justify-center bg-ink text-blue">
                  <v.icon size={22} />
                </div>
                <h3 className="mt-5 text-xl text-ink">{v.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-stone">{v.desc}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Industries */}
      <section className="border-t border-sand bg-cream py-16 sm:py-20">
        <Container>
          <SectionHeading
            eyebrow="Who We Serve"
            title="Industries We Outfit"
            className="mb-14"
          />
          <div className="grid grid-cols-1 gap-px overflow-hidden border border-sand bg-sand sm:grid-cols-2 lg:grid-cols-3">
            {INDUSTRIES.map((i) => (
              <div key={i.name} className="flex items-center gap-4 bg-ivory p-7">
                <i.icon className="shrink-0 text-blue-deep" size={22} />
                <span className="text-base font-medium text-ink">{i.name}</span>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Process */}
      <section className="py-16 sm:py-20">
        <Container>
          <SectionHeading
            eyebrow="How It Works"
            title="From Brief to Delivery"
            className="mb-14"
          />
          <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {PROCESS.map((p) => (
              <div key={p.step}>
                <span className="font-serif text-4xl text-blue">{p.step}</span>
                <h3 className="mt-3 text-xl text-ink">{p.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-stone">{p.desc}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Client band */}
      <section className="border-y border-sand bg-cream py-12">
        <Container>
          <p className="text-center text-[0.65rem] uppercase tracking-[0.2em] text-mist">
            Trusted by leading organisations across Nigeria
          </p>
          <div className="mt-8 grid grid-cols-2 gap-x-8 gap-y-6 sm:grid-cols-3 lg:grid-cols-6">
            {CLIENTS.map((c) => (
              <div
                key={c}
                className="flex h-16 items-center justify-center border border-sand bg-ivory px-4 text-center font-serif text-base text-stone"
              >
                {c}
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Enquiry form */}
      <section id="enquire" className="py-16 sm:py-20">
        <Container>
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-5 lg:gap-16">
            <div className="lg:col-span-2">
              <p className="eyebrow mb-3">Let's Talk</p>
              <h2 className="text-3xl text-ink sm:text-4xl">Request a Quotation</h2>
              <p className="mt-5 text-stone leading-relaxed">
                Tell us about your project and a dedicated account manager will prepare a tailored
                proposal — including samples, sizing and volume pricing — within one business day.
              </p>
              <ul className="mt-8 space-y-3">
                {[
                  "No minimum order too large",
                  "Dedicated account manager",
                  "Nationwide delivery & reorders",
                  "Transparent volume pricing",
                ].map((point) => (
                  <li key={point} className="flex items-center gap-3 text-sm text-charcoal">
                    <Check size={16} className="text-blue-deep" /> {point}
                  </li>
                ))}
              </ul>
              <Divider className="mt-10 !justify-start" />
            </div>
            <div className="lg:col-span-3">
              <EnquiryForm />
            </div>
          </div>
        </Container>
      </section>

      {/* CTA */}
      <section className="bg-ink py-20 text-center text-ivory sm:py-24">
        <Container width="narrow">
          <p className="eyebrow !text-blue-soft mb-4">Ready to Begin?</p>
          <h2 className="text-3xl text-ivory sm:text-4xl md:text-5xl">Outfit Your Team With Luxe</h2>
          <p className="mx-auto mt-4 max-w-md text-mist leading-relaxed">
            Speak with our corporate team about uniforms, branded apparel and executive suiting
            programmes.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <ButtonLink href="#enquire" variant="gold" size="lg">
              Request a Quote
            </ButtonLink>
            <ButtonLink
              href="/contact"
              variant="outline"
              size="lg"
              className="border-ivory/60 text-ivory hover:bg-ivory hover:text-ink"
            >
              Contact Sales
            </ButtonLink>
          </div>
        </Container>
      </section>
    </main>
  );
}

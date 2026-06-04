import type { Metadata } from "next";
import { Clock, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { Container, SectionHeading, Divider } from "@/components/ui/Container";
import { ContactForm } from "./ContactForm";
import { FaqAccordion, type Faq } from "./FaqAccordion";

export const metadata: Metadata = {
  title: "Contact Us | Luxe Universal Wears",
  description:
    "Visit our Utako flagship, call our concierge or send us a message. We are here to help with orders, bespoke commissions and styling.",
};

const HOURS = [
  { day: "Monday – Friday", time: "9:00 AM – 8:00 PM" },
  { day: "Saturday", time: "10:00 AM – 8:00 PM" },
  { day: "Sunday", time: "12:00 PM – 6:00 PM" },
];

const STORES = [
  {
    city: "Abuja — Flagship",
    address: "Shop 313, Favour Line, Ultra Modern Market, Utako, Abuja",
    phone: "+234 817 393 8770",
    note: "Full atelier, bespoke fittings & private styling suite.",
  },
  {
    city: "Abuja — Wuse II",
    address: "14 Aminu Kano Crescent, Wuse II, Abuja",
    phone: "+234 817 393 8770",
    note: "Ready-to-wear showroom & made-to-measure appointments.",
  },
  {
    city: "Port Harcourt",
    address: "9 Aba Road, GRA Phase II, Port Harcourt",
    phone: "+234 817 393 8770",
    note: "Boutique showroom & consultation lounge.",
  },
];

const FAQS: Faq[] = [
  {
    q: "Do I need an appointment to visit the atelier?",
    a: "Walk-ins are always welcome for ready-to-wear. For bespoke fittings, made-to-measure and private styling, we recommend booking in advance so we can dedicate a stylist to you.",
  },
  {
    q: "What are your delivery options across Nigeria?",
    a: "We offer same-day delivery within Abuja, next-day delivery to Port Harcourt and other major cities, and 2–4 day nationwide courier. Complimentary shipping applies to orders above ₦150,000.",
  },
  {
    q: "What is your returns and exchange policy?",
    a: "Ready-to-wear pieces may be returned or exchanged within 14 days in original, unworn condition with tags attached. Bespoke and made-to-measure commissions are final sale, as they are cut uniquely for you.",
  },
  {
    q: "How long does a bespoke commission take?",
    a: "A bespoke suit typically takes eight to twelve weeks from the first fitting to final pressing, including two to three fittings. We recommend beginning early for weddings and major events.",
  },
];

export default function ContactPage() {
  return (
    <main className="bg-ivory">
      {/* Hero */}
      <section className="border-b border-sand bg-cream">
        <Container className="py-20 text-center sm:py-24">
          <p className="eyebrow mb-4">We Are Here for You</p>
          <h1 className="mx-auto max-w-3xl text-4xl leading-[1.05] text-ink sm:text-5xl md:text-6xl">
            Get in Touch
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-stone leading-relaxed">
            Whether you have a question about an order, wish to commission a bespoke piece or simply
            want styling advice, our concierge team is ready to assist.
          </p>
          <Divider className="mt-8" />
        </Container>
      </section>

      {/* Two-column: form + details */}
      <section className="py-16 sm:py-20">
        <Container>
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-5 lg:gap-16">
            {/* Form */}
            <div className="lg:col-span-3">
              <p className="eyebrow mb-3">Send a Message</p>
              <h2 className="mb-8 text-3xl text-ink sm:text-4xl">Write to Us</h2>
              <ContactForm />
            </div>

            {/* Details */}
            <div className="lg:col-span-2">
              <p className="eyebrow mb-3">Flagship Atelier</p>
              <h2 className="mb-8 text-3xl text-ink sm:text-4xl">Visit Us in Utako</h2>

              <ul className="space-y-6">
                <li className="flex gap-4">
                  <MapPin className="mt-0.5 shrink-0 text-blue-deep" size={20} />
                  <div>
                    <p className="text-[0.65rem] uppercase tracking-[0.18em] text-mist">Address</p>
                    <p className="mt-1 text-ink">Shop 313, Favour Line, Ultra Modern Market, Utako, Abuja</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <Phone className="mt-0.5 shrink-0 text-blue-deep" size={20} />
                  <div>
                    <p className="text-[0.65rem] uppercase tracking-[0.18em] text-mist">Phone</p>
                    <a href="tel:+2348173938770" className="mt-1 block text-ink luxe-link-underline">
                      +234 817 393 8770
                    </a>
                  </div>
                </li>
                <li className="flex gap-4">
                  <Mail className="mt-0.5 shrink-0 text-blue-deep" size={20} />
                  <div>
                    <p className="text-[0.65rem] uppercase tracking-[0.18em] text-mist">Email</p>
                    <a
                      href="mailto:info@luxeuniversalwears.com"
                      className="mt-1 block text-ink luxe-link-underline"
                    >
                      info@luxeuniversalwears.com
                    </a>
                  </div>
                </li>
                <li className="flex gap-4">
                  <MessageCircle className="mt-0.5 shrink-0 text-blue-deep" size={20} />
                  <div>
                    <p className="text-[0.65rem] uppercase tracking-[0.18em] text-mist">WhatsApp</p>
                    <a href="https://wa.me/2348173938770" className="mt-1 block text-ink luxe-link-underline">
                      Chat with our concierge
                    </a>
                  </div>
                </li>
                <li className="flex gap-4">
                  <Clock className="mt-0.5 shrink-0 text-blue-deep" size={20} />
                  <div>
                    <p className="text-[0.65rem] uppercase tracking-[0.18em] text-mist">Opening Hours</p>
                    <ul className="mt-1 space-y-1">
                      {HOURS.map((h) => (
                        <li key={h.day} className="flex justify-between gap-6 text-sm text-stone">
                          <span>{h.day}</span>
                          <span className="text-ink">{h.time}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </li>
              </ul>

              <div className="mt-8 border-t border-sand pt-6">
                <p className="text-[0.65rem] uppercase tracking-[0.18em] text-mist">Follow the House</p>
                <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-sm text-stone">
                  <span className="luxe-link-underline cursor-pointer">Instagram</span>
                  <span className="luxe-link-underline cursor-pointer">Twitter / X</span>
                  <span className="luxe-link-underline cursor-pointer">Facebook</span>
                  <span className="luxe-link-underline cursor-pointer">LinkedIn</span>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Map */}
      <section className="border-t border-sand">
        <div className="relative aspect-[16/9] w-full bg-cream sm:aspect-[16/6]">
          <iframe
            title="Luxe Universal Wears — Utako, Abuja"
            src="https://www.google.com/maps?q=Utako,Abuja&output=embed"
            className="absolute inset-0 h-full w-full border-0"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
          />
        </div>
      </section>

      {/* Store locator cards */}
      <section className="py-16 sm:py-20">
        <Container>
          <SectionHeading
            eyebrow="Our Locations"
            title="Find a Showroom"
            description="Three addresses across Nigeria, each with its own atmosphere and team of stylists."
            className="mb-12"
          />
          <div className="grid grid-cols-1 gap-7 md:grid-cols-3">
            {STORES.map((s) => (
              <div key={s.city} className="flex flex-col border border-sand bg-cream p-8">
                <p className="text-[0.65rem] uppercase tracking-[0.18em] text-blue-deep">{s.city}</p>
                <h3 className="mt-3 text-2xl text-ink">{s.address}</h3>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-stone">{s.note}</p>
                <div className="mt-6 border-t border-sand pt-5">
                  <a
                    href={`tel:${s.phone.replace(/\s/g, "")}`}
                    className="inline-flex items-center gap-2 text-sm text-ink luxe-link-underline"
                  >
                    <Phone size={14} /> {s.phone}
                  </a>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* FAQ */}
      <section className="border-t border-sand bg-cream py-16 sm:py-20">
        <Container width="narrow">
          <SectionHeading
            eyebrow="Good to Know"
            title="Frequently Asked"
            description="Quick answers to the questions we hear most often."
            className="mb-10"
          />
          <FaqAccordion items={FAQS} />
        </Container>
      </section>
    </main>
  );
}

import Link from "next/link";
import { Phone, Mail, MapPin } from "lucide-react";
import { FOOTER_LINKS } from "@/lib/nav";
import { NewsletterForm } from "./NewsletterForm";
import { Logo } from "@/components/ui/Logo";
import { InstagramIcon, FacebookIcon, XIcon, WhatsAppIcon } from "@/components/ui/SocialIcons";

export function Footer() {
  return (
    <footer className="mt-24 bg-ink text-ivory">
      {/* Newsletter */}
      <div className="border-b border-ivory/10">
        <div className="mx-auto grid max-w-[1320px] items-center gap-8 px-6 py-14 md:grid-cols-2">
          <div>
            <p className="eyebrow !text-blue-soft mb-3">The Luxe List</p>
            <h3 className="font-serif text-3xl leading-tight md:text-4xl">
              Style intelligence, delivered.
            </h3>
            <p className="mt-3 max-w-md text-sm text-ivory/70">
              Subscribe for early access to new collections, private events, and bespoke styling
              insight. Enjoy ₦10,000 off your first order over ₦100,000.
            </p>
          </div>
          <NewsletterForm />
        </div>
      </div>

      {/* Links */}
      <div className="mx-auto grid max-w-[1320px] gap-10 px-6 py-16 md:grid-cols-2 lg:grid-cols-6">
        <div className="lg:col-span-2">
          <Link href="/" aria-label="Luxe Universal Wears — home" className="inline-flex">
            <Logo variant="light" className="h-20 w-auto" />
          </Link>
          <p className="mt-5 max-w-xs text-sm leading-relaxed text-ivory/65">
            Premium fashion, bespoke tailoring & luxury accessories for the modern gentleman.
            Crafted with intention, delivered with care — across Nigeria & worldwide.
          </p>
          <div className="mt-6 flex gap-3">
            {[InstagramIcon, FacebookIcon, XIcon, WhatsAppIcon].map((Icon, i) => (
              <a key={i} href="#" aria-label="Social" className="flex h-10 w-10 items-center justify-center rounded-full border border-ivory/20 transition hover:border-blue hover:text-blue-soft">
                <Icon width={17} height={17} />
              </a>
            ))}
          </div>
        </div>

        {Object.entries(FOOTER_LINKS).map(([heading, links]) => (
          <div key={heading}>
            <p className="eyebrow !text-blue-soft mb-4">{heading}</p>
            <ul className="space-y-2.5">
              {links.map((l) => (
                <li key={l.label}>
                  <Link href={l.href} className="text-sm text-ivory/65 transition hover:text-ivory">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Contact strip */}
      <div className="border-t border-ivory/10">
        <div className="mx-auto flex max-w-[1320px] flex-col gap-4 px-6 py-6 text-sm text-ivory/70 md:flex-row md:items-center md:justify-between">
          <span className="inline-flex items-center gap-2"><MapPin size={15} className="text-blue-soft" /> 21 Awolowo Road, Ikoyi, Lagos, Nigeria</span>
          <span className="inline-flex items-center gap-2"><Phone size={15} className="text-blue-soft" /> +234 800 123 4567</span>
          <span className="inline-flex items-center gap-2"><Mail size={15} className="text-blue-soft" /> hello@luxeuniversal.com</span>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-ivory/10">
        <div className="mx-auto flex max-w-[1320px] flex-col items-center justify-between gap-3 px-6 py-6 text-xs text-ivory/50 md:flex-row">
          <p>© {new Date().getFullYear()} Luxe Universal Wears. All rights reserved.</p>
          <div className="flex flex-wrap gap-5">
            <Link href="/style-guide" className="hover:text-ivory">Style Guide</Link>
            <Link href="/contact" className="hover:text-ivory">Contact</Link>
            <span>Privacy</span>
            <span>Terms</span>
          </div>
          <p className="text-ivory/40">Secure payments · Paystack · Flutterwave · Stripe</p>
        </div>
      </div>
    </footer>
  );
}

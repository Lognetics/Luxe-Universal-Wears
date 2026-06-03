import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container, SectionHeading, Divider } from "@/components/ui/Container";
import { ButtonLink } from "@/components/ui/Button";
import { POSTS, formatPostDate } from "./posts";
import { BlogFilter } from "./BlogFilter";

export const metadata: Metadata = {
  title: "Fashion Journal | Luxe Universal Wears",
  description:
    "Style notes, suiting guides and grooming wisdom from Luxe Universal Wears — the considered perspective on dressing well in Lagos and beyond.",
};

export default function BlogPage() {
  const lead = POSTS.find((p) => p.featured) ?? POSTS[0];
  const rest = POSTS.filter((p) => p.slug !== lead.slug);

  return (
    <main className="bg-ivory">
      {/* Hero */}
      <section className="border-b border-sand bg-cream">
        <Container className="py-20 text-center sm:py-24">
          <p className="eyebrow mb-4">The Journal</p>
          <h1 className="mx-auto max-w-3xl text-4xl leading-[1.05] text-ink sm:text-5xl md:text-6xl">
            The Fashion Journal
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-stone leading-relaxed">
            Considered perspectives on tailoring, grooming and the art of dressing well — written for
            the modern gentleman, from our atelier in Ikoyi.
          </p>
          <Divider className="mt-8" />
        </Container>
      </section>

      {/* Featured lead post */}
      <section className="py-16 sm:py-20">
        <Container>
          <Link
            href={`/blog/${lead.slug}`}
            className="group grid grid-cols-1 items-center gap-8 lg:grid-cols-2 lg:gap-12"
          >
            <div className="relative aspect-[4/3] overflow-hidden bg-cream">
              <Image
                src={lead.image}
                alt={lead.title}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <span className="absolute left-5 top-5 bg-blue px-3.5 py-1.5 text-[0.6rem] uppercase tracking-[0.2em] text-ink">
                Featured
              </span>
            </div>
            <div>
              <div className="flex items-center gap-3 text-[0.65rem] uppercase tracking-[0.18em] text-mist">
                <span className="text-blue-deep">{lead.category}</span>
                <span className="h-1 w-1 rounded-full bg-sand" />
                <span>{formatPostDate(lead.date)}</span>
                <span className="h-1 w-1 rounded-full bg-sand" />
                <span>{lead.readTime}</span>
              </div>
              <h2 className="mt-4 text-3xl leading-tight text-ink transition group-hover:text-blue-deep sm:text-4xl md:text-5xl">
                {lead.title}
              </h2>
              <p className="mt-5 max-w-lg text-stone leading-relaxed">{lead.excerpt}</p>
              <div className="mt-7 flex items-center gap-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-ink text-sm font-medium text-ivory">
                  {lead.author.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-medium text-ink">{lead.author}</p>
                  <p className="text-xs text-stone">{lead.authorRole}</p>
                </div>
              </div>
              <span className="mt-8 inline-flex items-center gap-2 text-[0.72rem] uppercase tracking-[0.2em] text-ink transition group-hover:gap-3 group-hover:text-blue-deep">
                Read Article <ArrowRight size={14} />
              </span>
            </div>
          </Link>
        </Container>
      </section>

      {/* Filterable grid */}
      <section className="border-t border-sand py-16 sm:py-20">
        <Container>
          <SectionHeading
            eyebrow="All Stories"
            title="Browse the Archive"
            description="Filter by theme to find the guidance you are looking for."
            className="mb-12"
          />
          <BlogFilter posts={rest} />
        </Container>
      </section>

      {/* Newsletter CTA */}
      <section className="bg-ink py-20 text-center text-ivory sm:py-24">
        <Container width="narrow">
          <p className="eyebrow !text-blue-soft mb-4">Stay in the Know</p>
          <h2 className="text-3xl text-ivory sm:text-4xl">Never Miss an Edit</h2>
          <p className="mx-auto mt-4 max-w-md text-mist leading-relaxed">
            Join our list for new journal entries, private previews and styling invitations delivered
            to your inbox.
          </p>
          <div className="mt-8 flex justify-center">
            <ButtonLink href="/register" variant="gold" size="lg">
              Subscribe
            </ButtonLink>
          </div>
        </Container>
      </section>
    </main>
  );
}

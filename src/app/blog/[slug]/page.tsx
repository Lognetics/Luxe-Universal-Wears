import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Container, Divider } from "@/components/ui/Container";
import { ButtonLink } from "@/components/ui/Button";
import { POSTS, getPost, relatedPosts, formatPostDate } from "../posts";

export function generateStaticParams() {
  return POSTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return { title: "Article Not Found | Luxe Universal Wears" };
  return {
    title: `${post.title} | Luxe Journal`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: [post.image],
      type: "article",
    },
  };
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const related = relatedPosts(slug, 3);

  return (
    <main className="bg-ivory">
      {/* Cover */}
      <section className="relative">
        <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl bg-cream sm:aspect-[16/8] lg:aspect-[16/6]">
          <Image
            src={post.image}
            alt={post.title}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/20 to-transparent" />
        </div>
        <Container className="relative -mt-28 sm:-mt-32">
          <div className="mx-auto max-w-3xl bg-ivory px-6 py-10 text-center shadow-card sm:px-12 sm:py-14">
            <p className="eyebrow mb-4">{post.category}</p>
            <h1 className="text-3xl leading-[1.08] text-ink sm:text-4xl md:text-5xl">{post.title}</h1>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3 text-[0.65rem] uppercase tracking-[0.18em] text-mist">
              <span>{post.author}</span>
              <span className="h-1 w-1 rounded-full bg-sand" />
              <span>{formatPostDate(post.date)}</span>
              <span className="h-1 w-1 rounded-full bg-sand" />
              <span>{post.readTime}</span>
            </div>
          </div>
        </Container>
      </section>

      {/* Body */}
      <article className="py-16 sm:py-20">
        <Container width="narrow">
          <Link
            href="/blog"
            className="mb-10 inline-flex items-center gap-2 text-[0.7rem] uppercase tracking-[0.18em] text-stone transition hover:text-ink"
          >
            <ArrowLeft size={14} /> Back to Journal
          </Link>

          <div className="space-y-7">
            {post.body.map((block, i) => {
              if (block.type === "h2") {
                return (
                  <h2 key={i} className="pt-4 text-2xl text-ink sm:text-3xl">
                    {block.text}
                  </h2>
                );
              }
              if (block.type === "quote") {
                return (
                  <blockquote
                    key={i}
                    className="my-10 border-l-2 border-blue pl-6 sm:pl-8"
                  >
                    <p className="font-serif text-2xl leading-snug text-ink sm:text-3xl">
                      &ldquo;{block.text}&rdquo;
                    </p>
                    {block.cite && (
                      <cite className="mt-4 block text-[0.7rem] uppercase not-italic tracking-[0.18em] text-blue-deep">
                        — {block.cite}
                      </cite>
                    )}
                  </blockquote>
                );
              }
              return (
                <p key={i} className="text-[1.05rem] leading-[1.85] text-charcoal">
                  {block.text}
                </p>
              );
            })}
          </div>

          {/* Author card */}
          <div className="mt-14 flex items-center gap-5 border-t border-sand pt-10">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-ink text-lg font-medium text-ivory">
              {post.author.charAt(0)}
            </div>
            <div>
              <p className="text-[0.65rem] uppercase tracking-[0.18em] text-mist">Written by</p>
              <p className="text-lg text-ink">{post.author}</p>
              <p className="text-sm text-stone">{post.authorRole}, Luxe Universal Wears</p>
            </div>
          </div>
        </Container>
      </article>

      {/* Related reading */}
      <section className="border-t border-sand bg-cream py-16 sm:py-20">
        <Container>
          <div className="mb-12 text-center">
            <p className="eyebrow mb-3">Continue Reading</p>
            <h2 className="text-3xl text-ink sm:text-4xl">Related Reading</h2>
            <Divider className="mt-6" />
          </div>
          <div className="grid grid-cols-1 gap-x-7 gap-y-12 sm:grid-cols-3">
            {related.map((r) => (
              <article key={r.slug} className="group flex flex-col">
                <Link href={`/blog/${r.slug}`} className="relative aspect-[4/3] overflow-hidden bg-ivory">
                  <Image
                    src={r.image}
                    alt={r.title}
                    fill
                    sizes="(max-width: 640px) 100vw, 33vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </Link>
                <p className="mt-4 text-[0.65rem] uppercase tracking-[0.18em] text-blue-deep">
                  {r.category}
                </p>
                <Link href={`/blog/${r.slug}`}>
                  <h3 className="mt-2 text-xl leading-tight text-ink transition group-hover:text-blue-deep">
                    {r.title}
                  </h3>
                </Link>
                <span className="mt-3 inline-flex items-center gap-1.5 text-[0.7rem] uppercase tracking-[0.18em] text-stone transition group-hover:gap-2.5 group-hover:text-ink">
                  Read <ArrowRight size={13} />
                </span>
              </article>
            ))}
          </div>
        </Container>
      </section>

      {/* Newsletter CTA */}
      <section className="bg-ink py-20 text-center text-ivory sm:py-24">
        <Container width="narrow">
          <p className="eyebrow !text-blue-soft mb-4">The Luxe Letter</p>
          <h2 className="text-3xl text-ivory sm:text-4xl">Dress With Intention</h2>
          <p className="mx-auto mt-4 max-w-md text-mist leading-relaxed">
            Receive new journal entries, styling guidance and private previews straight to your inbox.
          </p>
          <div className="mt-8 flex justify-center">
            <ButtonLink href="/register" variant="gold" size="lg">
              Join the List
            </ButtonLink>
          </div>
        </Container>
      </section>
    </main>
  );
}

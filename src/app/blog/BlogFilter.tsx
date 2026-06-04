"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { clsx } from "clsx";
import { ArrowRight } from "lucide-react";
import { BLOG_CATEGORIES, formatPostDate, type BlogPost } from "./posts";

export function BlogFilter({ posts }: { posts: BlogPost[] }) {
  const [active, setActive] = useState<string>("All");

  const filtered = active === "All" ? posts : posts.filter((p) => p.category === active);

  return (
    <div>
      <div className="flex flex-wrap justify-center gap-2.5">
        {["All", ...BLOG_CATEGORIES].map((cat) => (
          <button
            key={cat}
            onClick={() => setActive(cat)}
            className={clsx(
              "rounded-full border px-5 py-2.5 text-[0.7rem] uppercase tracking-[0.18em] transition-all duration-300",
              active === cat
                ? "border-ink bg-ink text-ivory"
                : "border-sand text-stone hover:border-ink hover:text-ink"
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="mt-14 grid grid-cols-1 gap-x-7 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((post) => (
          <article key={post.slug} className="group flex flex-col">
            <Link href={`/blog/${post.slug}`} className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-cream">
              <Image
                src={post.image}
                alt={post.title}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <span className="absolute left-4 top-4 bg-ivory/95 px-3 py-1.5 text-[0.6rem] uppercase tracking-[0.2em] text-ink">
                {post.category}
              </span>
            </Link>
            <div className="flex flex-1 flex-col pt-5">
              <div className="flex items-center gap-3 text-[0.65rem] uppercase tracking-[0.18em] text-mist">
                <span>{formatPostDate(post.date)}</span>
                <span className="h-1 w-1 rounded-full bg-sand" />
                <span>{post.readTime}</span>
              </div>
              <Link href={`/blog/${post.slug}`}>
                <h3 className="mt-3 text-2xl leading-tight text-ink transition group-hover:text-blue-deep">
                  {post.title}
                </h3>
              </Link>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-stone">{post.excerpt}</p>
              <div className="mt-5 flex items-center justify-between border-t border-sand pt-4">
                <span className="text-xs text-stone">By {post.author}</span>
                <Link
                  href={`/blog/${post.slug}`}
                  className="inline-flex items-center gap-1.5 text-[0.7rem] uppercase tracking-[0.18em] text-ink transition group-hover:gap-2.5 group-hover:text-blue-deep"
                >
                  Read <ArrowRight size={13} />
                </Link>
              </div>
            </div>
          </article>
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="mt-16 text-center text-stone">No articles in this category yet. Check back soon.</p>
      )}
    </div>
  );
}

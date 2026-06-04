"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { clsx } from "clsx";

export function ProductGallery({
  image,
  alt,
  isNew,
  discount,
}: {
  image: string;
  alt: string;
  isNew: boolean;
  discount: number | null;
}) {
  const [active, setActive] = useState(0);
  const [zoom, setZoom] = useState(false);
  const [origin, setOrigin] = useState("50% 50%");
  const ref = useRef<HTMLDivElement>(null);

  // One real image; show it plus subtle placeholder thumbnails for an editorial gallery feel.
  const thumbs = [image, image, image];

  const onMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setOrigin(`${x}% ${y}%`);
  };

  return (
    <div className="flex flex-col-reverse gap-4 md:flex-row">
      {/* Thumbnails */}
      <div className="flex gap-3 md:flex-col">
        {thumbs.map((t, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            aria-label={`View ${i + 1}`}
            className={clsx(
              "relative h-20 w-16 overflow-hidden rounded-xl border bg-cream transition md:h-24 md:w-20",
              active === i ? "border-ink" : "border-sand hover:border-ink/50"
            )}
          >
            <Image src={t} alt={`${alt} view ${i + 1}`} fill sizes="80px" className="object-cover" />
          </button>
        ))}
      </div>

      {/* Main image */}
      <div
        ref={ref}
        onMouseEnter={() => setZoom(true)}
        onMouseLeave={() => setZoom(false)}
        onMouseMove={onMove}
        className="relative aspect-[3/4] flex-1 cursor-zoom-in overflow-hidden rounded-2xl bg-cream"
      >
        <Image
          src={image}
          alt={alt}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 50vw"
          style={{ transformOrigin: origin }}
          className={clsx(
            "object-cover transition-transform duration-300",
            zoom ? "scale-[1.7]" : "scale-100"
          )}
        />
        <div className="absolute left-4 top-4 flex flex-col gap-1.5">
          {isNew && (
            <span className="bg-ink px-3 py-1 text-[0.6rem] uppercase tracking-[0.2em] text-ivory">
              New
            </span>
          )}
          {discount && (
            <span className="bg-wine px-3 py-1 text-[0.6rem] uppercase tracking-[0.2em] text-ivory">
              -{discount}%
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

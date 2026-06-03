"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { ButtonLink } from "@/components/ui/Button";

const slides = [
  {
    image: "/products/windsor-black-two-piece-suit.jpeg",
    eyebrow: "The Corporate Collection",
    title: "Elevate Your Style.\nDefine Your Presence.",
    text: "Premium fashion, bespoke tailoring & luxury accessories for the modern man.",
  },
  {
    image: "/products/noir-floral-jacquard-tuxedo.jpeg",
    eyebrow: "Black-Tie & Evening",
    title: "Made For\nThe Moment.",
    text: "Tuxedos and double-breasted statements, tailored to command the room.",
  },
  {
    image: "/products/monaco-houndstooth-overshirt.jpeg",
    eyebrow: "Casual Luxury",
    title: "Effortless.\nEvery Day.",
    text: "Layering essentials and relaxed silhouettes with a refined edge.",
  },
];

export function Hero() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setActive((a) => (a + 1) % slides.length), 6000);
    return () => clearInterval(t);
  }, []);

  return (
    <section className="relative h-[88vh] min-h-[560px] w-full overflow-hidden bg-ink">
      {slides.map((slide, i) => (
        <div
          key={i}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            i === active ? "opacity-100" : "opacity-0"
          }`}
        >
          <Image
            src={slide.image}
            alt={slide.title}
            fill
            priority={i === 0}
            sizes="100vw"
            className="object-cover object-top"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-ink/85 via-ink/45 to-ink/20" />
        </div>
      ))}

      <div className="relative z-10 mx-auto flex h-full max-w-[1320px] items-center px-6 sm:px-8">
        <div className="max-w-xl text-ivory" key={active}>
          <p className="eyebrow !text-blue-soft animate-fade-up">{slides[active].eyebrow}</p>
          <h1 className="mt-4 whitespace-pre-line text-4xl leading-[1.02] animate-fade-up sm:text-6xl md:text-7xl">
            {slides[active].title}
          </h1>
          <p className="mt-5 max-w-md text-base text-ivory/80 animate-fade-up">
            {slides[active].text}
          </p>
          <div className="mt-8 flex flex-wrap gap-3 animate-fade-up">
            <ButtonLink href="/shop" variant="blue" size="lg">
              Shop Collection
            </ButtonLink>
            <ButtonLink href="/bespoke" size="lg" className="border border-ivory/60 bg-transparent text-ivory hover:bg-ivory hover:text-ink">
              Book Bespoke
            </ButtonLink>
          </div>
        </div>
      </div>

      {/* Slide indicators */}
      <div className="absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 gap-3">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            aria-label={`Go to slide ${i + 1}`}
            className={`h-0.5 transition-all duration-500 ${
              i === active ? "w-10 bg-blue" : "w-5 bg-ivory/40"
            }`}
          />
        ))}
      </div>
    </section>
  );
}

"use client";

import { useState } from "react";
import { Star, Quote, ChevronLeft, ChevronRight } from "lucide-react";

const reviews = [
  {
    name: "Chidi Okafor",
    role: "Investment Banker, Abuja",
    text: "The bespoke suit fits like a second skin. From measurement to delivery, the experience felt genuinely luxurious. Luxe has earned a client for life.",
  },
  {
    name: "Emeka Williams",
    role: "Creative Director, Abuja",
    text: "Impeccable craftsmanship. My wedding tuxedo turned heads all night — and the groomsmen package made dressing the whole party effortless.",
  },
  {
    name: "Tunde Adeyemi",
    role: "Tech Entrepreneur",
    text: "Fast delivery, premium packaging, and quality that rivals anything I've bought abroad. The corporate collection is now my go-to.",
  },
  {
    name: "David Okonkwo",
    role: "Lawyer, Port Harcourt",
    text: "Their attention to detail is unmatched. The monk-strap shoes and matching belt are exquisite. Customer service is world-class.",
  },
];

export function Testimonials() {
  const [i, setI] = useState(0);
  const r = reviews[i];

  return (
    <div className="relative mx-auto max-w-3xl text-center">
      <Quote size={48} className="mx-auto text-blue/40" />
      <p className="mt-6 font-serif text-2xl leading-relaxed text-ink md:text-[1.7rem]">
        &ldquo;{r.text}&rdquo;
      </p>
      <div className="mt-6 flex justify-center gap-1">
        {Array.from({ length: 5 }).map((_, s) => (
          <Star key={s} size={16} className="fill-blue text-blue" />
        ))}
      </div>
      <p className="mt-4 font-medium uppercase tracking-[0.15em] text-ink">{r.name}</p>
      <p className="text-sm text-mist">{r.role}</p>

      <div className="mt-8 flex justify-center gap-3">
        <button onClick={() => setI((i - 1 + reviews.length) % reviews.length)} aria-label="Previous review" className="flex h-10 w-10 items-center justify-center border border-ink/30 transition hover:bg-ink hover:text-ivory">
          <ChevronLeft size={16} />
        </button>
        <button onClick={() => setI((i + 1) % reviews.length)} aria-label="Next review" className="flex h-10 w-10 items-center justify-center border border-ink/30 transition hover:bg-ink hover:text-ivory">
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { Minus, Plus } from "lucide-react";

export type Faq = { q: string; a: string };

export function FaqAccordion({ items }: { items: Faq[] }) {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="divide-y divide-sand border-y border-sand">
      {items.map((item, i) => {
        const isOpen = open === i;
        return (
          <div key={i}>
            <button
              onClick={() => setOpen(isOpen ? null : i)}
              className="flex w-full items-center justify-between gap-4 py-5 text-left"
              aria-expanded={isOpen}
            >
              <span className="text-base font-medium text-ink sm:text-lg">{item.q}</span>
              <span className="flex h-7 w-7 shrink-0 items-center justify-center border border-sand text-ink">
                {isOpen ? <Minus size={14} /> : <Plus size={14} />}
              </span>
            </button>
            <div
              className={`grid transition-all duration-300 ${
                isOpen ? "grid-rows-[1fr] pb-5" : "grid-rows-[0fr]"
              }`}
            >
              <div className="overflow-hidden">
                <p className="text-sm leading-relaxed text-stone">{item.a}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

"use client";

import { useState } from "react";
import { Plus, Minus } from "lucide-react";
import { clsx } from "clsx";

type Item = { title: string; content: React.ReactNode };

export function ProductAccordion({ items }: { items: Item[] }) {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="border-t border-sand">
      {items.map((item, i) => {
        const isOpen = open === i;
        return (
          <div key={item.title} className="border-b border-sand">
            <button
              onClick={() => setOpen(isOpen ? null : i)}
              className="flex w-full items-center justify-between py-5 text-left"
              aria-expanded={isOpen}
            >
              <span className="font-serif text-lg text-ink">{item.title}</span>
              {isOpen ? (
                <Minus size={16} className="text-blue-deep" />
              ) : (
                <Plus size={16} className="text-stone" />
              )}
            </button>
            <div
              className={clsx(
                "grid transition-all duration-300",
                isOpen ? "grid-rows-[1fr] pb-6 opacity-100" : "grid-rows-[0fr] opacity-0"
              )}
            >
              <div className="overflow-hidden text-sm leading-relaxed text-stone">
                {item.content}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

"use client";

import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Product } from "@/lib/types";
import { ProductCard } from "@/components/product/ProductCard";

export function ProductRail({ products }: { products: Product[] }) {
  const ref = useRef<HTMLDivElement>(null);

  const scroll = (dir: 1 | -1) => {
    ref.current?.scrollBy({ left: dir * (ref.current.clientWidth * 0.8), behavior: "smooth" });
  };

  return (
    <div className="relative">
      <div ref={ref} className="no-scrollbar flex gap-5 overflow-x-auto scroll-smooth pb-2">
        {products.map((p) => (
          <div key={p.id} className="w-[68%] shrink-0 sm:w-[42%] md:w-[31%] lg:w-[23.5%]">
            <ProductCard product={p} />
          </div>
        ))}
      </div>
      <div className="mt-6 flex justify-center gap-3">
        <button onClick={() => scroll(-1)} aria-label="Previous" className="flex h-11 w-11 items-center justify-center border border-ink/30 text-ink transition hover:bg-ink hover:text-ivory">
          <ChevronLeft size={18} />
        </button>
        <button onClick={() => scroll(1)} aria-label="Next" className="flex h-11 w-11 items-center justify-center border border-ink/30 text-ink transition hover:bg-ink hover:text-ivory">
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
}

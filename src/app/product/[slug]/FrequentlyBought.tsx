"use client";

import Image from "next/image";
import Link from "next/link";
import { Plus } from "lucide-react";
import type { Product } from "@/lib/types";
import { Button } from "@/components/ui/Button";
import { useStore } from "@/components/providers/StoreProvider";
import { formatNaira } from "@/lib/format";

export function FrequentlyBought({ items }: { items: Product[] }) {
  const { addToCart } = useStore();
  const total = items.reduce((sum, p) => sum + p.price, 0);

  return (
    <div className="border border-sand bg-cream/40 p-6 md:p-8">
      <div className="flex flex-col items-center gap-4 sm:flex-row sm:flex-wrap sm:justify-center">
        {items.map((p, i) => (
          <div key={p.id} className="flex items-center gap-4">
            <Link href={`/product/${p.slug}`} className="group block">
              <div className="relative h-28 w-24 overflow-hidden rounded-2xl bg-cream">
                <Image
                  src={p.images[0]}
                  alt={p.name}
                  fill
                  sizes="96px"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <p className="mt-2 max-w-[6rem] text-xs leading-snug text-ink">{p.name}</p>
              <p className="text-xs text-stone">{formatNaira(p.price)}</p>
            </Link>
            {i < items.length - 1 && <Plus size={18} className="hidden text-stone sm:block" />}
          </div>
        ))}
      </div>
      <div className="mt-6 flex flex-col items-center gap-4 border-t border-sand pt-6 sm:flex-row sm:justify-between">
        <p className="text-sm text-stone">
          Total for {items.length} pieces:{" "}
          <span className="font-medium text-ink">{formatNaira(total)}</span>
        </p>
        <Button
          variant="dark"
          onClick={() => {
            items.forEach((p) => addToCart(p));
          }}
        >
          Add All To Bag
        </Button>
      </div>
    </div>
  );
}

"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingBag, Star } from "lucide-react";
import { clsx } from "clsx";
import type { Product } from "@/lib/types";
import { formatNaira, discountPercent } from "@/lib/format";
import { useStore } from "@/components/providers/StoreProvider";

export function ProductCard({ product, priority = false }: { product: Product; priority?: boolean }) {
  const { addToCart, toggleWishlist, isWishlisted } = useStore();
  const discount = discountPercent(product.price, product.comparePrice);
  const wished = isWishlisted(product.id);

  return (
    <div className="group relative flex flex-col">
      <div className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-cream">
        <Link href={`/product/${product.slug}`}>
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            priority={priority}
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
        </Link>

        {/* Badges */}
        <div className="absolute left-3 top-3 flex flex-col gap-1.5">
          {product.isNew && (
            <span className="bg-blue px-2.5 py-1 text-[0.6rem] uppercase tracking-[0.2em] text-white">New</span>
          )}
          {discount && (
            <span className="bg-wine px-2.5 py-1 text-[0.6rem] uppercase tracking-[0.2em] text-ivory">-{discount}%</span>
          )}
          {product.isBestSeller && !product.isNew && (
            <span className="bg-blue px-2.5 py-1 text-[0.6rem] uppercase tracking-[0.2em] text-ink">Bestseller</span>
          )}
        </div>

        {/* Wishlist */}
        <button
          onClick={() => toggleWishlist(product.id)}
          aria-label="Toggle wishlist"
          className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-ivory/90 text-ink shadow-sm transition hover:bg-ivory"
        >
          <Heart size={16} className={clsx(wished && "fill-wine text-wine")} />
        </button>

        {/* Quick add */}
        <button
          onClick={() => addToCart(product)}
          className="absolute inset-x-3 bottom-3 flex translate-y-3 items-center justify-center gap-2 bg-ink/95 py-3 text-[0.7rem] uppercase tracking-[0.2em] text-ivory opacity-0 transition-all duration-300 hover:bg-ink group-hover:translate-y-0 group-hover:opacity-100"
        >
          <ShoppingBag size={14} /> Quick Add
        </button>
      </div>

      <div className="flex flex-1 flex-col pt-3.5">
        <div className="flex items-center justify-between">
          <p className="text-[0.65rem] uppercase tracking-[0.2em] text-mist">{product.categoryName}</p>
          <span className="flex items-center gap-1 text-[0.7rem] text-stone">
            <Star size={11} className="fill-blue text-blue" /> {product.rating}
          </span>
        </div>
        <Link href={`/product/${product.slug}`} className="mt-1">
          <h3 className="font-sans text-[0.95rem] font-medium leading-snug text-ink transition group-hover:text-blue-deep">
            {product.name}
          </h3>
        </Link>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-[0.95rem] font-medium text-ink">{formatNaira(product.price)}</span>
          {product.comparePrice && (
            <span className="text-xs text-mist line-through">{formatNaira(product.comparePrice)}</span>
          )}
        </div>
      </div>
    </div>
  );
}

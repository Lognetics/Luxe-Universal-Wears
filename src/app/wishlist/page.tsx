"use client";

import { useMemo } from "react";
import { Heart, ShoppingBag } from "lucide-react";
import { useStore } from "@/components/providers/StoreProvider";
import { getProduct } from "@/lib/catalog";
import { Container } from "@/components/ui/Container";
import { Button, ButtonLink } from "@/components/ui/Button";
import { ProductGrid } from "@/components/product/ProductGrid";
import type { Product } from "@/lib/types";

export default function WishlistPage() {
  const { wishlist, addToCart, notify } = useStore();

  const products = useMemo<Product[]>(
    () =>
      wishlist
        .map((id) => getProduct(id))
        .filter((p): p is Product => Boolean(p)),
    [wishlist]
  );

  function addAllToBag() {
    if (products.length === 0) return;
    products.forEach((p) => addToCart(p, { quantity: 1 }));
    notify(`${products.length} item${products.length === 1 ? "" : "s"} added to bag`);
  }

  if (products.length === 0) {
    return (
      <Container className="py-24 sm:py-32">
        <div className="mx-auto flex max-w-md flex-col items-center text-center">
          <span className="flex h-20 w-20 items-center justify-center rounded-full border border-sand bg-cream">
            <Heart size={30} strokeWidth={1.25} className="text-stone" />
          </span>
          <p className="eyebrow mt-8">Wishlist</p>
          <h1 className="mt-3 text-4xl text-ink sm:text-5xl">Your wishlist is empty</h1>
          <p className="mt-4 leading-relaxed text-stone">
            Save the pieces you love by tapping the heart on any product. They’ll be
            waiting for you here whenever you’re ready.
          </p>
          <ButtonLink href="/shop" variant="primary" size="lg" className="mt-8">
            Discover the Collection
          </ButtonLink>
        </div>
      </Container>
    );
  }

  return (
    <Container className="py-14 sm:py-20">
      <div className="flex flex-col gap-6 border-b border-sand pb-8 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="eyebrow">Wishlist</p>
          <h1 className="mt-3 text-4xl text-ink sm:text-5xl">
            Saved Items
            <span className="ml-3 align-middle text-base font-normal text-stone">
              ({products.length} {products.length === 1 ? "piece" : "pieces"})
            </span>
          </h1>
        </div>
        <Button variant="dark" size="md" onClick={addAllToBag} className="self-start sm:self-auto">
          <ShoppingBag size={16} /> Add All to Bag
        </Button>
      </div>

      <div className="mt-10">
        <ProductGrid products={products} />
      </div>
    </Container>
  );
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Heart, Minus, Plus, ShoppingBag, ShieldCheck, Truck, RefreshCw } from "lucide-react";
import { clsx } from "clsx";
import type { Product } from "@/lib/types";
import { Button } from "@/components/ui/Button";
import { useStore } from "@/components/providers/StoreProvider";
import { titleCase } from "@/lib/format";

const COLOR_HEX: Record<string, string> = {
  black: "#14110f",
  white: "#f6f1e9",
  navy: "#1f2a44",
  grey: "#8a8a8a",
  brown: "#6b4a2f",
  olive: "#5d5a3a",
  cream: "#efe6d4",
  beige: "#d8c7a8",
  blue: "#3a5a8c",
  orange: "#c4632a",
  multicolor: "#b8924a",
  camel: "#bd8f5a",
  green: "#3a5d44",
  purple: "#5c3a6b",
  red: "#8c2f2f",
  tan: "#c9a274",
};

export function ProductPurchase({ product }: { product: Product }) {
  const router = useRouter();
  const { addToCart, setCartOpen, toggleWishlist, isWishlisted, notify } = useStore();

  const [size, setSize] = useState<string>(product.sizes[0] ?? "One Size");
  const [color, setColor] = useState<string>(product.colors[0] ?? "Default");
  const [qty, setQty] = useState(1);

  const wished = isWishlisted(product.id);
  const inStock = product.stock > 0;
  const lowStock = inStock && product.stock <= 5;

  const handleAdd = () => {
    if (!inStock) return;
    addToCart(product, { size, color, quantity: qty });
    setCartOpen(true);
  };

  const handleBuyNow = () => {
    if (!inStock) return;
    addToCart(product, { size, color, quantity: qty });
    router.push("/checkout");
  };

  return (
    <div className="mt-8 space-y-7 border-t border-sand pt-8">
      {/* Size */}
      {product.sizes.length > 0 && (
        <div>
          <div className="mb-3 flex items-center justify-between">
            <span className="text-[0.7rem] font-medium uppercase tracking-[0.2em] text-stone">
              Size
            </span>
            <span className="text-xs text-stone underline-offset-2 hover:text-blue-deep">
              <span className="cursor-help">Size guide</span>
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {product.sizes.map((s) => (
              <button
                key={s}
                onClick={() => setSize(s)}
                className={clsx(
                  "min-w-[3rem] border px-3 py-2.5 text-xs uppercase tracking-[0.1em] transition",
                  size === s
                    ? "border-ink bg-ink text-ivory"
                    : "border-sand text-ink hover:border-ink"
                )}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Color */}
      {product.colors.length > 0 && (
        <div>
          <div className="mb-3 text-[0.7rem] font-medium uppercase tracking-[0.2em] text-stone">
            Colour: <span className="text-ink">{titleCase(color)}</span>
          </div>
          <div className="flex flex-wrap gap-3">
            {product.colors.map((c) => (
              <button
                key={c}
                title={titleCase(c)}
                aria-label={titleCase(c)}
                onClick={() => setColor(c)}
                className={clsx(
                  "relative h-9 w-9 rounded-full border transition",
                  color === c
                    ? "ring-2 ring-blue ring-offset-2 ring-offset-ivory border-transparent"
                    : "border-sand"
                )}
                style={{ backgroundColor: COLOR_HEX[c] ?? "#cccccc" }}
              >
                {c === "multicolor" && (
                  <span className="absolute inset-0 rounded-full bg-[conic-gradient(from_0deg,#8c2f2f,#b8924a,#3a5d44,#3a5a8c,#5c3a6b,#8c2f2f)]" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Quantity + stock */}
      <div className="flex flex-wrap items-center gap-5">
        <div>
          <div className="mb-3 text-[0.7rem] font-medium uppercase tracking-[0.2em] text-stone">
            Quantity
          </div>
          <div className="inline-flex items-center border border-sand">
            <button
              onClick={() => setQty((q) => Math.max(1, q - 1))}
              aria-label="Decrease quantity"
              className="flex h-11 w-11 items-center justify-center text-ink transition hover:bg-cream disabled:opacity-40"
              disabled={qty <= 1}
            >
              <Minus size={14} />
            </button>
            <span className="w-12 text-center text-sm font-medium text-ink">{qty}</span>
            <button
              onClick={() => setQty((q) => Math.min(product.stock || 99, q + 1))}
              aria-label="Increase quantity"
              className="flex h-11 w-11 items-center justify-center text-ink transition hover:bg-cream disabled:opacity-40"
              disabled={inStock && qty >= product.stock}
            >
              <Plus size={14} />
            </button>
          </div>
        </div>
        <div className="pt-7">
          {inStock ? (
            <span className={clsx("text-sm", lowStock ? "text-wine" : "text-success")}>
              {lowStock ? `Only ${product.stock} left in stock` : "In stock"}
            </span>
          ) : (
            <span className="text-sm text-danger">Out of stock</span>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="space-y-3">
        <div className="flex gap-3">
          <Button
            variant="primary"
            size="lg"
            className="flex-1"
            onClick={handleAdd}
            disabled={!inStock}
          >
            <ShoppingBag size={16} /> Add To Bag
          </Button>
          <button
            onClick={() => toggleWishlist(product.id)}
            aria-label="Toggle wishlist"
            className={clsx(
              "flex h-auto w-14 shrink-0 items-center justify-center border transition",
              wished ? "border-wine bg-wine/5 text-wine" : "border-ink/70 text-ink hover:bg-ink hover:text-ivory"
            )}
          >
            <Heart size={18} className={clsx(wished && "fill-wine")} />
          </button>
        </div>
        <Button
          variant="blue"
          size="lg"
          className="w-full"
          onClick={handleBuyNow}
          disabled={!inStock}
        >
          Buy It Now
        </Button>
      </div>

      {/* SKU */}
      <p className="text-xs text-mist">
        SKU: <span className="text-stone">{product.sku}</span>
      </p>

      {/* Trust badges */}
      <div className="grid grid-cols-3 gap-3 border-t border-sand pt-6">
        {[
          { icon: ShieldCheck, label: "Secure Payment" },
          { icon: Truck, label: "Fast Delivery" },
          { icon: RefreshCw, label: "14-Day Returns" },
        ].map(({ icon: Icon, label }) => (
          <div key={label} className="flex flex-col items-center gap-2 text-center">
            <Icon size={20} strokeWidth={1.5} className="text-blue-deep" />
            <span className="text-[0.65rem] uppercase tracking-[0.12em] text-stone">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

"use client";

import Image from "next/image";
import Link from "next/link";
import { X, Minus, Plus, ShoppingBag } from "lucide-react";
import { useStore } from "@/components/providers/StoreProvider";
import { formatNaira } from "@/lib/format";
import { ButtonLink } from "@/components/ui/Button";

const FREE_SHIPPING_THRESHOLD = 150000;

export function MiniCart() {
  const { cart, cartOpen, setCartOpen, cartSubtotal, updateQuantity, removeFromCart, cartCount } =
    useStore();

  const remaining = Math.max(0, FREE_SHIPPING_THRESHOLD - cartSubtotal);
  const progress = Math.min(100, (cartSubtotal / FREE_SHIPPING_THRESHOLD) * 100);

  return (
    <>
      <div
        onClick={() => setCartOpen(false)}
        className={`fixed inset-0 z-[90] bg-ink/40 backdrop-blur-sm transition-opacity duration-300 ${
          cartOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />
      <aside
        className={`fixed right-0 top-0 z-[95] flex h-full w-full max-w-md flex-col bg-ivory shadow-card transition-transform duration-400 ${
          cartOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-sand px-6 py-5">
          <h3 className="flex items-center gap-2 text-xl">
            <ShoppingBag size={18} /> Your Bag ({cartCount})
          </h3>
          <button onClick={() => setCartOpen(false)} aria-label="Close cart" className="text-stone hover:text-ink">
            <X size={22} />
          </button>
        </div>

        {cart.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
            <ShoppingBag size={40} className="text-mist" strokeWidth={1} />
            <p className="text-stone">Your shopping bag is empty.</p>
            <ButtonLink href="/shop" variant="outline" onClick={() => setCartOpen(false)}>
              Continue Shopping
            </ButtonLink>
          </div>
        ) : (
          <>
            <div className="border-b border-sand px-6 py-4">
              <p className="text-xs text-stone">
                {remaining > 0 ? (
                  <>Spend <span className="font-medium text-ink">{formatNaira(remaining)}</span> more for free shipping</>
                ) : (
                  <span className="text-emerald font-medium">You&apos;ve unlocked free shipping ✨</span>
                )}
              </p>
              <div className="mt-2 h-1 w-full bg-sand">
                <div className="h-full bg-blue transition-all" style={{ width: `${progress}%` }} />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-4 no-scrollbar">
              {cart.map((item) => (
                <div key={`${item.productId}-${item.size}-${item.color}`} className="flex gap-4 border-b border-sand/70 py-4">
                  <Link href={`/product/${item.slug}`} onClick={() => setCartOpen(false)} className="relative h-28 w-20 shrink-0 overflow-hidden bg-cream">
                    <Image src={item.image} alt={item.name} fill sizes="80px" className="object-cover" />
                  </Link>
                  <div className="flex flex-1 flex-col">
                    <div className="flex justify-between gap-2">
                      <Link href={`/product/${item.slug}`} onClick={() => setCartOpen(false)} className="text-sm font-medium leading-snug text-ink hover:text-blue-deep">
                        {item.name}
                      </Link>
                      <button onClick={() => removeFromCart(item.productId, item.size, item.color)} aria-label="Remove" className="text-mist hover:text-danger">
                        <X size={16} />
                      </button>
                    </div>
                    <p className="mt-1 text-xs uppercase tracking-wide text-mist">
                      {item.color} · {item.size}
                    </p>
                    <div className="mt-auto flex items-center justify-between pt-2">
                      <div className="flex items-center border border-sand">
                        <button onClick={() => updateQuantity(item.productId, item.size, item.color, item.quantity - 1)} className="px-2 py-1 text-stone hover:text-ink" aria-label="Decrease">
                          <Minus size={13} />
                        </button>
                        <span className="w-7 text-center text-sm">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.productId, item.size, item.color, item.quantity + 1)} className="px-2 py-1 text-stone hover:text-ink" aria-label="Increase">
                          <Plus size={13} />
                        </button>
                      </div>
                      <span className="text-sm font-medium">{formatNaira(item.price * item.quantity)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-sand px-6 py-5">
              <div className="mb-4 flex items-center justify-between">
                <span className="text-sm uppercase tracking-wider text-stone">Subtotal</span>
                <span className="text-lg font-medium">{formatNaira(cartSubtotal)}</span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <ButtonLink href="/cart" variant="outline" onClick={() => setCartOpen(false)}>
                  View Bag
                </ButtonLink>
                <ButtonLink href="/checkout" variant="primary" onClick={() => setCartOpen(false)}>
                  Checkout
                </ButtonLink>
              </div>
            </div>
          </>
        )}
      </aside>
    </>
  );
}

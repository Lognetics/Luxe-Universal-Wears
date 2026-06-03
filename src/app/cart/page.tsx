"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ShoppingBag,
  Minus,
  Plus,
  X,
  Tag,
  Truck,
  ShieldCheck,
  RotateCcw,
  ArrowRight,
} from "lucide-react";
import { useStore } from "@/components/providers/StoreProvider";
import { formatNaira } from "@/lib/format";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Container, SectionHeading } from "@/components/ui/Container";
import { ProductRail } from "@/components/home/ProductRail";
import { bestSellers } from "@/lib/catalog";

const FREE_SHIPPING_THRESHOLD = 150000;
const FLAT_SHIPPING = 3500;
const COUPON_CODE = "LUXE10";
const COUPON_RATE = 0.1;

export default function CartPage() {
  const { cart, cartSubtotal, updateQuantity, removeFromCart, cartCount } = useStore();

  const [couponInput, setCouponInput] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [couponError, setCouponError] = useState<string | null>(null);

  const recommended = useMemo(() => bestSellers(8), []);

  const discount = appliedCoupon ? Math.round(cartSubtotal * COUPON_RATE) : 0;
  const subtotalAfterDiscount = cartSubtotal - discount;
  const shipping =
    cart.length === 0
      ? 0
      : subtotalAfterDiscount >= FREE_SHIPPING_THRESHOLD
        ? 0
        : FLAT_SHIPPING;
  const total = subtotalAfterDiscount + shipping;
  const remaining = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotalAfterDiscount);

  function applyCoupon() {
    const code = couponInput.trim().toUpperCase();
    if (!code) return;
    if (code === COUPON_CODE) {
      setAppliedCoupon(code);
      setCouponError(null);
    } else {
      setAppliedCoupon(null);
      setCouponError("That code isn’t valid. Try LUXE10.");
    }
  }

  function removeCoupon() {
    setAppliedCoupon(null);
    setCouponInput("");
    setCouponError(null);
  }

  if (cart.length === 0) {
    return (
      <Container className="py-24 sm:py-32">
        <div className="mx-auto flex max-w-md flex-col items-center text-center">
          <span className="flex h-20 w-20 items-center justify-center rounded-full border border-sand bg-cream">
            <ShoppingBag size={30} strokeWidth={1.25} className="text-stone" />
          </span>
          <p className="eyebrow mt-8">Shopping Bag</p>
          <h1 className="mt-3 text-4xl text-ink sm:text-5xl">Your bag is empty</h1>
          <p className="mt-4 leading-relaxed text-stone">
            You haven’t added anything yet. Explore our latest arrivals and timeless
            essentials, hand-tailored for the modern gentleman.
          </p>
          <ButtonLink href="/shop" variant="primary" size="lg" className="mt-8">
            Start Shopping
          </ButtonLink>
        </div>

        <div className="mt-28">
          <SectionHeading
            eyebrow="Curated For You"
            title="You may also like"
            align="center"
          />
          <div className="mt-10">
            <ProductRail products={recommended} />
          </div>
        </div>
      </Container>
    );
  }

  return (
    <Container className="py-14 sm:py-20">
      <div className="border-b border-sand pb-8">
        <p className="eyebrow">Shopping Bag</p>
        <h1 className="mt-3 text-4xl text-ink sm:text-5xl">
          Your Bag
          <span className="ml-3 align-middle text-base font-normal text-stone">
            ({cartCount} {cartCount === 1 ? "item" : "items"})
          </span>
        </h1>
      </div>

      <div className="mt-10 grid grid-cols-1 gap-12 lg:grid-cols-[1fr_400px]">
        {/* Line items */}
        <div>
          {remaining > 0 ? (
            <div className="mb-8 flex items-center gap-3 border border-sand bg-cream px-5 py-4 text-sm text-stone">
              <Truck size={18} className="shrink-0 text-blue-deep" />
              <span>
                Spend{" "}
                <span className="font-medium text-ink">{formatNaira(remaining)}</span>{" "}
                more to unlock complimentary shipping.
              </span>
            </div>
          ) : (
            <div className="mb-8 flex items-center gap-3 border border-emerald/40 bg-emerald/5 px-5 py-4 text-sm text-emerald">
              <Truck size={18} className="shrink-0" />
              <span className="font-medium">
                You’ve unlocked complimentary shipping.
              </span>
            </div>
          )}

          <ul className="divide-y divide-sand border-y border-sand">
            {cart.map((item) => (
              <li
                key={`${item.productId}-${item.size}-${item.color}`}
                className="flex gap-5 py-6"
              >
                <Link
                  href={`/product/${item.slug}`}
                  className="relative aspect-[3/4] w-24 shrink-0 overflow-hidden bg-cream sm:w-28"
                >
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    sizes="112px"
                    className="object-cover"
                  />
                </Link>

                <div className="flex flex-1 flex-col">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <Link
                        href={`/product/${item.slug}`}
                        className="text-base font-medium leading-snug text-ink transition hover:text-blue-deep"
                      >
                        {item.name}
                      </Link>
                      <p className="mt-1.5 text-xs uppercase tracking-[0.15em] text-mist">
                        {item.color} · Size {item.size}
                      </p>
                      <p className="mt-1 text-sm text-stone">
                        {formatNaira(item.price)} each
                      </p>
                    </div>
                    <button
                      onClick={() =>
                        removeFromCart(item.productId, item.size, item.color)
                      }
                      aria-label={`Remove ${item.name}`}
                      className="text-mist transition hover:text-danger"
                    >
                      <X size={18} />
                    </button>
                  </div>

                  <div className="mt-auto flex items-end justify-between pt-4">
                    <div className="flex items-center border border-sand">
                      <button
                        onClick={() =>
                          updateQuantity(
                            item.productId,
                            item.size,
                            item.color,
                            item.quantity - 1
                          )
                        }
                        className="px-3 py-2 text-stone transition hover:text-ink"
                        aria-label="Decrease quantity"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="w-9 text-center text-sm">{item.quantity}</span>
                      <button
                        onClick={() =>
                          updateQuantity(
                            item.productId,
                            item.size,
                            item.color,
                            item.quantity + 1
                          )
                        }
                        className="px-3 py-2 text-stone transition hover:text-ink"
                        aria-label="Increase quantity"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                    <span className="text-base font-medium text-ink">
                      {formatNaira(item.price * item.quantity)}
                    </span>
                  </div>
                </div>
              </li>
            ))}
          </ul>

          <div className="mt-8">
            <Link
              href="/shop"
              className="luxe-link-underline inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-ink"
            >
              <ArrowRight size={14} className="rotate-180" />
              Continue Shopping
            </Link>
          </div>
        </div>

        {/* Order summary */}
        <aside className="lg:sticky lg:top-28 lg:self-start">
          <div className="border border-sand bg-paper p-7 shadow-soft">
            <h2 className="text-2xl text-ink">Order Summary</h2>

            {/* Coupon */}
            <div className="mt-6 border-b border-sand pb-6">
              <label className="flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-stone">
                <Tag size={14} /> Promo Code
              </label>
              {appliedCoupon ? (
                <div className="mt-3 flex items-center justify-between border border-emerald/40 bg-emerald/5 px-4 py-3">
                  <span className="text-sm text-emerald">
                    <span className="font-medium">{appliedCoupon}</span> applied — 10% off
                  </span>
                  <button
                    onClick={removeCoupon}
                    aria-label="Remove promo code"
                    className="text-emerald/70 transition hover:text-danger"
                  >
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <>
                  <div className="mt-3 flex gap-2">
                    <input
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && applyCoupon()}
                      placeholder="Enter code"
                      className="min-w-0 flex-1 border border-sand bg-ivory px-4 py-3 text-sm text-ink outline-none transition focus:border-ink"
                    />
                    <Button variant="dark" size="sm" onClick={applyCoupon}>
                      Apply
                    </Button>
                  </div>
                  {couponError && (
                    <p className="mt-2 text-xs text-danger">{couponError}</p>
                  )}
                </>
              )}
            </div>

            {/* Totals */}
            <dl className="mt-6 space-y-3 text-sm">
              <div className="flex justify-between">
                <dt className="text-stone">Subtotal</dt>
                <dd className="text-ink">{formatNaira(cartSubtotal)}</dd>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-emerald">
                  <dt>Discount (LUXE10)</dt>
                  <dd>−{formatNaira(discount)}</dd>
                </div>
              )}
              <div className="flex justify-between">
                <dt className="text-stone">Shipping</dt>
                <dd className="text-ink">
                  {shipping === 0 ? (
                    <span className="text-emerald">Free</span>
                  ) : (
                    formatNaira(shipping)
                  )}
                </dd>
              </div>
              <p className="text-xs text-mist">
                Free shipping on orders over {formatNaira(FREE_SHIPPING_THRESHOLD)}.
                Otherwise a flat rate of {formatNaira(FLAT_SHIPPING)} applies.
              </p>
            </dl>

            <div className="mt-6 flex items-center justify-between border-t border-sand pt-5">
              <span className="text-sm uppercase tracking-[0.18em] text-stone">
                Total
              </span>
              <span className="text-2xl text-ink">{formatNaira(total)}</span>
            </div>

            <ButtonLink
              href="/checkout"
              variant="primary"
              size="lg"
              className="mt-6 w-full"
            >
              Proceed to Checkout <ArrowRight size={16} />
            </ButtonLink>

            {/* Trust badges */}
            <ul className="mt-7 space-y-3 border-t border-sand pt-6 text-xs text-stone">
              <li className="flex items-center gap-3">
                <ShieldCheck size={16} className="text-blue-deep" />
                Secure, encrypted checkout
              </li>
              <li className="flex items-center gap-3">
                <Truck size={16} className="text-blue-deep" />
                Nationwide delivery across Nigeria
              </li>
              <li className="flex items-center gap-3">
                <RotateCcw size={16} className="text-blue-deep" />
                14-day returns &amp; exchanges
              </li>
            </ul>
          </div>
        </aside>
      </div>

      {/* Recommendations */}
      <div className="mt-28">
        <SectionHeading eyebrow="Curated For You" title="You may also like" align="center" />
        <div className="mt-10">
          <ProductRail products={recommended} />
        </div>
      </div>
    </Container>
  );
}

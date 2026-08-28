"use client";

import { Suspense, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
import { useStore } from "@/components/providers/StoreProvider";
import { Container } from "@/components/ui/Container";
import { ButtonLink } from "@/components/ui/Button";

/**
 * Where NETICS sends the customer after a paid online checkout. The order
 * and the payment already live in NETICS (the Luxe team sees them on their
 * order board and the customer has the receipt email), so this page only
 * has to clear the bag and say what happens next.
 */
export default function CheckoutSuccessPage() {
  // useSearchParams needs a Suspense boundary for prerendering (Next.js 16).
  return (
    <Suspense fallback={null}>
      <CheckoutSuccess />
    </Suspense>
  );
}

function CheckoutSuccess() {
  const params = useSearchParams();
  const reference = params.get("order") || "";
  const { cart, clearCart } = useStore();
  const cleared = useRef(false);

  // The bag is loaded from storage after the first render, so clearing it on
  // mount would be undone a moment later. Clear it once, when it has loaded.
  useEffect(() => {
    if (cart.length > 0 && !cleared.current) {
      cleared.current = true;
      clearCart();
    }
  }, [cart.length, clearCart]);

  return (
    <Container className="py-24 sm:py-32">
      <div className="mx-auto flex max-w-md flex-col items-center text-center">
        <span className="flex h-20 w-20 items-center justify-center rounded-full border border-sand bg-cream">
          <CheckCircle2 size={30} strokeWidth={1.25} className="text-emerald" />
        </span>
        <p className="eyebrow mt-8">Order received</p>
        <h1 className="mt-3 text-4xl text-ink sm:text-5xl">Thank you</h1>
        <p className="mt-4 leading-relaxed text-stone">
          {reference ? (
            <>
              Your payment for order <strong className="text-ink">{reference}</strong> is
              confirmed.{" "}
            </>
          ) : (
            "Your payment is confirmed. "
          )}
          A receipt is on its way to your email, and you will hear from us by email as the
          Luxe team confirms delivery and prepares your order.
        </p>
        <ButtonLink href="/shop" variant="primary" size="lg" className="mt-8">
          Continue Shopping
        </ButtonLink>
      </div>
    </Container>
  );
}

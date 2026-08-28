"use client";

import { useEffect } from "react";
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
  const params = useSearchParams();
  const reference = params.get("order") || "";
  const { cart, clearCart } = useStore();

  useEffect(() => {
    if (cart.length > 0) clearCart();
    // Clear once, when the page is reached; the bag stays empty afterwards.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
          A receipt is on its way to your email, and the Luxe team will confirm your delivery
          cost and timing on WhatsApp.
        </p>
        <ButtonLink href="/shop" variant="primary" size="lg" className="mt-8">
          Continue Shopping
        </ButtonLink>
      </div>
    </Container>
  );
}

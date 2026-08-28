"use server";

/**
 * Online payment through NETICS.
 *
 * The site never touches card details or a payment provider. It creates the
 * order in NETICS through the public API and asks NETICS for the hosted
 * checkout link, which is served by the payment provider connected to the
 * Luxe workspace (Flutterwave or Paystack, settled straight to Luxe's bank).
 * NETICS also emails the customer the link and the receipt, and the order
 * appears on the Luxe team's NETICS order board like any other.
 *
 * Needs NETICS_API_KEY (server only) with the write:orders scope. Without
 * it, the checkout page keeps its WhatsApp route and says so.
 */

const API_BASE = (
  process.env.NEXT_PUBLIC_NETICS_API_BASE?.trim() || "https://business.neticsai.com"
).replace(/\/+$/, "");

export type CheckoutLine = {
  name: string;
  sku?: string;
  color: string;
  size: string;
  quantity: number;
  price: number;
};

export type CheckoutInput = {
  email: string;
  fullName: string;
  phone: string;
  destination: string;
  international: boolean;
  deliveryPreference: string;
  lines: CheckoutLine[];
};

export type CheckoutResult =
  | { ok: true; checkoutUrl: string; reference: string }
  | { ok: false; reason: "unavailable" | "failed"; message: string };

async function neticsFetch(path: string, key: string, init: RequestInit) {
  return fetch(`${API_BASE}/api/public/v1${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
      ...(init.headers ?? {}),
    },
    cache: "no-store",
  });
}

export async function createNeticsCheckout(input: CheckoutInput): Promise<CheckoutResult> {
  const key = process.env.NETICS_API_KEY?.trim();
  if (!key) {
    return {
      ok: false,
      reason: "unavailable",
      message: "Online payment is not switched on yet. Continue in WhatsApp.",
    };
  }
  if (!input.lines.length) {
    return { ok: false, reason: "failed", message: "Your bag is empty." };
  }

  const items = input.lines.map((line) => ({
    name: line.name.slice(0, 200),
    quantity: Math.max(1, Math.min(999, Math.round(line.quantity))),
    unit_price: Math.max(0, line.price),
    notes: [line.sku ? `SKU ${line.sku}` : "", line.color, line.size]
      .filter(Boolean)
      .join(" · ")
      .slice(0, 400),
  }));

  try {
    const created = await neticsFetch("/orders", key, {
      method: "POST",
      body: JSON.stringify({
        customer_name: input.fullName.slice(0, 200),
        customer_phone: input.phone.slice(0, 40),
        customer_email: input.email.slice(0, 320),
        order_type: "delivery",
        delivery_address: input.destination.slice(0, 400),
        notes: [
          "Website checkout.",
          `Delivery preference: ${input.deliveryPreference || "to be confirmed"}.`,
          input.international ? "International delivery: quote and confirm shipping." : "",
          "Delivery cost is not included in the payment link; confirm it with the customer.",
        ]
          .filter(Boolean)
          .join(" ")
          .slice(0, 4000),
        items,
      }),
    });
    if (!created.ok) {
      console.error("[netics] order create failed", created.status, (await created.text()).slice(0, 300));
      return {
        ok: false,
        reason: "failed",
        message: "We could not start the online payment. Continue in WhatsApp and we will sort it out.",
      };
    }
    const order = (await created.json()) as { id: string; reference: string };

    const checkout = await neticsFetch(`/orders/${order.id}/checkout`, key, { method: "POST" });
    if (!checkout.ok) {
      console.error("[netics] checkout failed", checkout.status, (await checkout.text()).slice(0, 300));
      return {
        ok: false,
        reason: "failed",
        message: `Order ${order.reference} is recorded, but the payment link could not be created. The Luxe team will send it to you.`,
      };
    }
    const link = (await checkout.json()) as { checkout_url?: string; reference?: string };
    if (!link.checkout_url) {
      return {
        ok: false,
        reason: "failed",
        message: `Order ${order.reference} is recorded; the payment link is on its way from the Luxe team.`,
      };
    }
    return { ok: true, checkoutUrl: link.checkout_url, reference: link.reference || order.reference };
  } catch (error) {
    console.error("[netics] checkout error", error);
    return {
      ok: false,
      reason: "failed",
      message: "We could not reach the payment service. Continue in WhatsApp.",
    };
  }
}

"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import {
  Lock,
  ShieldCheck,
  CreditCard,
  Globe,
  Check,
  ShoppingBag,
} from "lucide-react";
import { clsx } from "clsx";
import { useStore } from "@/components/providers/StoreProvider";
import { useAuth } from "@/components/providers/AuthProvider";
import { formatNaira } from "@/lib/format";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { openWhatsApp } from "@/lib/whatsapp";
import { createNeticsCheckout } from "./actions";

const CONCIERGE_ENABLED = Boolean(process.env.NEXT_PUBLIC_NETICS_AGENT_ID?.trim());
const ONLINE_PAYMENT_ENABLED =
  process.env.NEXT_PUBLIC_NETICS_PAYMENTS?.trim() === "1" || CONCIERGE_ENABLED;

type ConciergeElement = HTMLElement & { ask?: (question: string) => Promise<void> };

const NIGERIAN_STATES = [
  "Abia", "Adamawa", "Akwa Ibom", "Anambra", "Bauchi", "Bayelsa", "Benue",
  "Borno", "Cross River", "Delta", "Ebonyi", "Edo", "Ekiti", "Enugu",
  "Gombe", "Imo", "Jigawa", "Kaduna", "Kano", "Katsina", "Kebbi", "Kogi",
  "Kwara", "Lagos", "Nasarawa", "Niger", "Ogun", "Ondo", "Osun", "Oyo",
  "Plateau", "Rivers", "Sokoto", "Taraba", "Yobe", "Zamfara", "FCT - Abuja",
];

type DeliveryOption = {
  id: string;
  label: string;
  description: string;
  eta: string;
};

const DELIVERY_OPTIONS: DeliveryOption[] = [
  {
    id: "confirm-with-team",
    label: "Delivery confirmed by the Luxe team",
    description: "Share your destination for an accurate quote",
    eta: "Cost and timing confirmed on WhatsApp",
  },
];

type PaymentOption = {
  id: string;
  label: string;
  description: string;
  icon: typeof CreditCard;
  scope: "domestic" | "international";
};

const PAYMENT_OPTIONS: PaymentOption[] = [
  {
    id: "confirm-domestic",
    label: "Confirm with the Luxe team",
    description: "Stock, delivery and a verified payment method will be confirmed on WhatsApp",
    icon: CreditCard,
    scope: "domestic",
  },
  {
    id: "confirm-international",
    label: "Confirm with the Luxe team",
    description: "International delivery and payment will be confirmed on WhatsApp",
    icon: Globe,
    scope: "international",
  },
];

function FieldError({ message }: { message?: string }) {
  return message ? <p className="mt-1.5 text-xs text-danger" data-field-error="">{message}</p> : null;
}

export default function CheckoutPage() {
  const { cart, cartSubtotal } = useStore();
  const { user } = useAuth();

  // Form state
  const [emailInput, setEmailInput] = useState<string | null>(null);
  const email = emailInput ?? user?.email ?? "";
  const [intl, setIntl] = useState(false);
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [intlCountry, setIntlCountry] = useState("");
  const [delivery, setDelivery] = useState("confirm-with-team");
  const [payment, setPayment] = useState("confirm-domestic");
  const [handoffReady, setHandoffReady] = useState(false);
  const [conciergeReady, setConciergeReady] = useState(false);
  const [paying, setPaying] = useState(false);
  const [payError, setPayError] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const availablePayments = useMemo(
    () => PAYMENT_OPTIONS.filter((p) => p.scope === (intl ? "international" : "domestic")),
    [intl]
  );

  const selectedDelivery =
    DELIVERY_OPTIONS.find((option) => option.id === delivery) ?? DELIVERY_OPTIONS[0];

  function validate(): boolean {
    const next: Record<string, string> = {};
    if (!email.trim()) next.email = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()))
      next.email = "Enter a valid email.";
    if (!fullName.trim()) next.fullName = "Full name is required.";
    if (!phone.trim()) next.phone = "Phone number is required.";
    if (!address.trim()) next.address = "Address is required.";
    if (!city.trim()) next.city = "City is required.";
    if (intl) {
      if (!intlCountry.trim()) next.country = "Country is required.";
    } else if (!state) {
      next.state = "Please select a state.";
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function handToConcierge(destination: string): boolean {
    const concierge = document.querySelector("netics-agent") as ConciergeElement | null;
    if (!concierge?.ask) return false;
    const items = cart.map(
      (item) =>
        `${item.quantity} x ${item.name} (${item.color}, ${item.size}) at ${formatNaira(item.price)} each`,
    );
    void concierge.ask(
      [
        "I would like to order these items from the website and pay online:",
        ...items,
        `Deliver to: ${destination}.`,
        `My name is ${fullName}, phone ${phone}, email ${email}.`,
        "Please take the order and send me the secure payment link.",
      ].join(" "),
    );
    setConciergeReady(true);
    return true;
  }

  async function payOnline() {
    if (!validate()) {
      // Say so next to the button and take them to the first missing field:
      // a silent scroll to the top reads as "the button does nothing".
      setPayError("Fill in your email, name, phone and delivery address first, then press Pay Online again.");
      window.setTimeout(() => {
        const first = document.querySelector("[data-field-error]");
        if (first) first.scrollIntoView({ behavior: "smooth", block: "center" });
        else window.scrollTo({ top: 0, behavior: "smooth" });
      }, 0);
      return;
    }
    const destination = intl
      ? `${address}, ${city}, ${intlCountry}`
      : `${address}, ${city}, ${state}, Nigeria`;
    setPaying(true);
    setPayError("");
    try {
      // NETICS records the order and returns the hosted payment link (card,
      // bank transfer, USSD), settled to the Luxe account. The cart is kept
      // until the customer is back from a confirmed payment.
      const result = await createNeticsCheckout({
        email: email.trim(),
        fullName: fullName.trim(),
        phone: phone.trim(),
        destination,
        international: intl,
        deliveryPreference: selectedDelivery?.label || "",
        lines: cart.map((item) => ({
          name: item.name,
          color: item.color,
          size: item.size,
          quantity: item.quantity,
          price: item.price,
        })),
      });
      if (result.ok) {
        window.location.assign(result.checkoutUrl);
        return;
      }
      if (result.reason === "unavailable" && handToConcierge(destination)) return;
      setPayError(result.message);
    } finally {
      setPaying(false);
    }
  }

  function placeOrder() {
    if (!validate()) {
      // Scroll to first error region
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    const lines = cart.map(
      (item) =>
        `- ${item.name} — ${item.color}, ${item.size}, qty ${item.quantity}: ${formatNaira(
          item.price * item.quantity,
        )}`,
    );
    const paymentLabel =
      PAYMENT_OPTIONS.find((p) => p.id === payment)?.label ?? "Confirm with the Luxe team";
    const destination = intl
      ? `${address}, ${city}, ${intlCountry}`
      : `${address}, ${city}, ${state}, Nigeria`;

    openWhatsApp(
      [
        "Hello Luxe Universal Wears, I would like the team to review this website order request.",
        "",
        ...lines,
        "",
        `Items subtotal (delivery excluded): ${formatNaira(cartSubtotal)}`,
        "Delivery cost and timing: To be confirmed by the Luxe team",
        `Delivery preference: ${selectedDelivery?.label || "Confirm with the Luxe team"}`,
        `Payment: ${paymentLabel}`,
        "",
        `Name: ${fullName}`,
        `Phone: ${phone}`,
        `Email: ${email}`,
        `Destination: ${destination}`,
        "",
        "Please confirm stock, delivery cost and a verified payment method before I pay.",
      ].join("\n"),
    );
    setHandoffReady(true);
  }

  if (cart.length === 0) {
    return (
      <Container className="py-24 sm:py-32">
        <div className="mx-auto flex max-w-md flex-col items-center text-center">
          <span className="flex h-20 w-20 items-center justify-center rounded-full border border-sand bg-cream">
            <ShoppingBag size={30} strokeWidth={1.25} className="text-stone" />
          </span>
          <p className="eyebrow mt-8">Checkout</p>
          <h1 className="mt-3 text-4xl text-ink sm:text-5xl">Nothing to check out</h1>
          <p className="mt-4 leading-relaxed text-stone">
            Your bag is empty. Add a few pieces before proceeding to checkout.
          </p>
          <ButtonLink href="/shop" variant="primary" size="lg" className="mt-8">
            Browse the Collection
          </ButtonLink>
        </div>
      </Container>
    );
  }

  const inputClass =
    "w-full border border-sand bg-ivory px-4 py-3 text-sm text-ink outline-none transition focus:border-ink placeholder:text-mist";
  const labelClass =
    "mb-2 block text-xs uppercase tracking-[0.16em] text-stone";

  function selectRegion(nextInternational: boolean) {
    setIntl(nextInternational);
    setPayment(nextInternational ? "confirm-international" : "confirm-domestic");
  }

  return (
    <Container className="py-14 sm:py-20">
      <div className="border-b border-sand pb-8">
        <p className="eyebrow">Order Request</p>
        <h1 className="mt-3 text-4xl text-ink sm:text-5xl">Prepare your order</h1>
        <p className="mt-3 flex items-center gap-2 text-sm text-stone">
          <Lock size={14} className="text-blue-deep" />
          Review your details, then send the request to the Luxe team in WhatsApp.
        </p>
      </div>

      <div className="mt-10 grid grid-cols-1 gap-12 lg:grid-cols-[1fr_400px]">
        {/* Left: form */}
        <div className="space-y-12">
          {/* Contact */}
          <section>
            <h2 className="text-2xl text-ink">
              <span className="mr-3 text-blue-deep">01</span>Contact
            </h2>
            <div className="mt-5">
              <label htmlFor="email" className={labelClass}>
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmailInput(e.target.value)}
                placeholder="you@example.com"
                className={clsx(inputClass, errors.email && "border-danger ring-1 ring-danger/40")}
              />
              <FieldError message={errors.email} />
              <p className="mt-2 text-xs text-mist">
                Order confirmation and tracking will be sent here.
              </p>
            </div>
          </section>

          {/* Shipping */}
          <section>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-2xl text-ink">
                <span className="mr-3 text-blue-deep">02</span>Shipping Information
              </h2>
              <div className="flex border border-sand">
                <button
                  type="button"
                  onClick={() => selectRegion(false)}
                  className={clsx(
                    "px-4 py-2 text-xs uppercase tracking-[0.14em] transition",
                    !intl ? "bg-ink text-ivory" : "text-stone hover:text-ink"
                  )}
                >
                  Nigeria
                </button>
                <button
                  type="button"
                  onClick={() => selectRegion(true)}
                  className={clsx(
                    "px-4 py-2 text-xs uppercase tracking-[0.14em] transition",
                    intl ? "bg-ink text-ivory" : "text-stone hover:text-ink"
                  )}
                >
                  International
                </button>
              </div>
            </div>

            <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label htmlFor="fullName" className={labelClass}>
                  Full Name
                </label>
                <input
                  id="fullName"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Adewale Okonkwo"
                  className={clsx(inputClass, errors.fullName && "border-danger ring-1 ring-danger/40")}
                />
                <FieldError message={errors.fullName} />
              </div>
              <div>
                <label htmlFor="phone" className={labelClass}>
                  Phone Number
                </label>
                <input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+234 800 000 0000"
                  className={clsx(inputClass, errors.phone && "border-danger ring-1 ring-danger/40")}
                />
                <FieldError message={errors.phone} />
              </div>
              <div>
                <label htmlFor="city" className={labelClass}>
                  City
                </label>
                <input
                  id="city"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Utako"
                  className={clsx(inputClass, errors.city && "border-danger ring-1 ring-danger/40")}
                />
                <FieldError message={errors.city} />
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="address" className={labelClass}>
                  Street Address
                </label>
                <input
                  id="address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="12 Bourdillon Road"
                  className={clsx(inputClass, errors.address && "border-danger ring-1 ring-danger/40")}
                />
                <FieldError message={errors.address} />
              </div>

              {intl ? (
                <div className="sm:col-span-2">
                  <label htmlFor="country" className={labelClass}>
                    Country
                  </label>
                  <input
                    id="country"
                    value={intlCountry}
                    onChange={(e) => setIntlCountry(e.target.value)}
                    placeholder="United Kingdom"
                    className={clsx(inputClass, errors.country && "border-danger ring-1 ring-danger/40")}
                  />
                  <FieldError message={errors.country} />
                </div>
              ) : (
                <>
                  <div>
                    <label htmlFor="state" className={labelClass}>
                      State
                    </label>
                    <select
                      id="state"
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      className={clsx(inputClass, !state && "text-mist")}
                    >
                      <option value="">Select a state</option>
                      {NIGERIAN_STATES.map((s) => (
                        <option key={s} value={s} className="text-ink">
                          {s}
                        </option>
                      ))}
                    </select>
                    <FieldError message={errors.state} />
                  </div>
                  <div>
                    <label className={labelClass}>Country</label>
                    <div className={clsx(inputClass, "flex items-center text-stone")}>
                      Nigeria
                    </div>
                  </div>
                </>
              )}
            </div>
          </section>

          {/* Delivery */}
          <section>
            <h2 className="text-2xl text-ink">
              <span className="mr-3 text-blue-deep">03</span>Delivery Method
            </h2>
            <div className="mt-5 space-y-3">
              {DELIVERY_OPTIONS.map((option) => {
                const active = delivery === option.id;
                return (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => setDelivery(option.id)}
                    className={clsx(
                      "flex w-full items-center justify-between gap-4 border px-5 py-4 text-left transition",
                      active
                        ? "border-ink bg-cream"
                        : "border-sand hover:border-ink/40"
                    )}
                  >
                    <div className="flex items-center gap-4">
                      <span
                        className={clsx(
                          "flex h-5 w-5 shrink-0 items-center justify-center rounded-full border",
                          active ? "border-ink bg-ink" : "border-sand"
                        )}
                      >
                        {active && <Check size={12} className="text-ivory" />}
                      </span>
                      <div>
                        <p className="text-sm font-medium text-ink">{option.label}</p>
                        <p className="mt-0.5 text-xs text-stone">
                          {option.description} · {option.eta}
                        </p>
                      </div>
                    </div>
                    <span className="text-right text-xs font-medium text-ink">
                      To be confirmed
                    </span>
                  </button>
                );
              })}
            </div>
          </section>

          {/* Payment */}
          <section>
            <h2 className="text-2xl text-ink">
              <span className="mr-3 text-blue-deep">04</span>Payment
            </h2>
            <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {availablePayments.map((option) => {
                const active = payment === option.id;
                const Icon = option.icon;
                return (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => setPayment(option.id)}
                    className={clsx(
                      "flex items-start gap-4 border px-5 py-4 text-left transition",
                      active ? "border-ink bg-cream" : "border-sand hover:border-ink/40"
                    )}
                  >
                    <Icon size={20} className="mt-0.5 shrink-0 text-blue-deep" />
                    <div>
                      <p className="text-sm font-medium text-ink">{option.label}</p>
                      <p className="mt-0.5 text-xs text-stone">{option.description}</p>
                    </div>
                  </button>
                );
              })}
            </div>

            <p className="mt-4 text-xs leading-relaxed text-mist">
              This page does not take payment. The team must confirm stock, delivery and a real
              payment method before you pay.
            </p>
          </section>
        </div>

        {/* Right: summary */}
        <aside className="lg:sticky lg:top-28 lg:self-start">
          <div className="border border-sand bg-paper p-7 shadow-soft">
            <h2 className="text-2xl text-ink">Order Summary</h2>

            <ul className="mt-6 space-y-4 border-b border-sand pb-6">
              {cart.map((item) => (
                <li
                  key={`${item.productId}-${item.size}-${item.color}`}
                  className="flex gap-4"
                >
                  <div className="relative aspect-[3/4] w-16 shrink-0 overflow-hidden rounded-2xl bg-cream">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      sizes="64px"
                      className="object-cover"
                    />
                    <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-ink text-[10px] text-ivory">
                      {item.quantity}
                    </span>
                  </div>
                  <div className="flex flex-1 flex-col justify-center">
                    <p className="text-sm font-medium leading-snug text-ink">
                      {item.name}
                    </p>
                    <p className="mt-0.5 text-xs uppercase tracking-[0.13em] text-mist">
                      {item.color} · {item.size}
                    </p>
                  </div>
                  <span className="self-center text-sm text-ink">
                    {formatNaira(item.price * item.quantity)}
                  </span>
                </li>
              ))}
            </ul>

            <dl className="space-y-3 py-6 text-sm">
              <div className="flex justify-between">
                <dt className="text-stone">Items subtotal</dt>
                <dd className="text-ink">{formatNaira(cartSubtotal)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-stone">Delivery</dt>
                <dd className="text-ink">To be confirmed</dd>
              </div>
            </dl>

            <div className="flex items-center justify-between border-t border-sand pt-5">
              <span className="max-w-[12rem] text-xs uppercase tracking-[0.16em] text-stone">
                Estimated items total (delivery excluded)
              </span>
              <span className="text-2xl text-ink">{formatNaira(cartSubtotal)}</span>
            </div>

            {ONLINE_PAYMENT_ENABLED && (
              <>
                <Button
                  variant="primary"
                  size="lg"
                  onClick={() => void payOnline()}
                  disabled={paying}
                  className="mt-6 w-full"
                >
                  {paying ? "Preparing secure payment…" : "Pay Online"}
                </Button>
                <p className="mt-2 text-center text-xs leading-relaxed text-stone">
                  Card, bank transfer or USSD on a secure payment page. Delivery cost is
                  confirmed separately.
                </p>
                {payError && (
                  <p className="mt-3 border border-red-500/30 bg-red-500/5 p-3 text-xs leading-relaxed text-red-700">
                    {payError}
                  </p>
                )}
                {conciergeReady && (
                  <p className="mt-3 border border-emerald/30 bg-emerald/5 p-3 text-xs leading-relaxed text-emerald">
                    Your order is with the Luxe Concierge in the chat at the corner of the page.
                    Your cart stays here until the order is confirmed.
                  </p>
                )}
              </>
            )}

            <Button
              variant={ONLINE_PAYMENT_ENABLED ? "outline" : "primary"}
              size="lg"
              onClick={placeOrder}
              className={ONLINE_PAYMENT_ENABLED ? "mt-3 w-full" : "mt-6 w-full"}
            >
              Continue Order in WhatsApp
            </Button>

            {handoffReady && (
              <p className="mt-3 border border-emerald/30 bg-emerald/5 p-3 text-xs leading-relaxed text-emerald">
                WhatsApp opened with your order request. Press Send there to deliver it. Your cart
                remains here until the Luxe team confirms the order.
              </p>
            )}

            <p className="mt-4 flex items-center justify-center gap-2 text-xs text-stone">
              <ShieldCheck size={14} className="text-blue-deep" />
              No payment is collected on this page
            </p>
          </div>
        </aside>
      </div>
    </Container>
  );
}

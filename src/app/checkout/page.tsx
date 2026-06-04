"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import {
  Lock,
  ShieldCheck,
  CreditCard,
  Landmark,
  Wallet,
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
import { OrderConfirmation, type ConfirmationData } from "./OrderConfirmation";

const FREE_SHIPPING_THRESHOLD = 150000;
const COUPON_RATE = 0.1;

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
  price: number;
  eta: string;
  domesticOnly?: boolean;
  lagosOnly?: boolean;
};

const DELIVERY_OPTIONS: DeliveryOption[] = [
  {
    id: "standard",
    label: "Standard Delivery",
    description: "Free over ₦150,000",
    price: 3500,
    eta: "3 – 5 business days",
  },
  {
    id: "express",
    label: "Express Delivery",
    description: "Priority dispatch & tracking",
    price: 7500,
    eta: "1 – 2 business days",
  },
  {
    id: "sameday",
    label: "Same-Day (Abuja)",
    description: "Order before 12pm, within Abuja",
    price: 5000,
    eta: "Today",
    lagosOnly: true,
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
    id: "paystack",
    label: "Paystack",
    description: "Cards, bank & USSD — instant confirmation",
    icon: CreditCard,
    scope: "domestic",
  },
  {
    id: "flutterwave",
    label: "Flutterwave",
    description: "Pay with card, transfer or mobile money",
    icon: Wallet,
    scope: "domestic",
  },
  {
    id: "bank",
    label: "Bank Transfer",
    description: "Direct transfer to our account",
    icon: Landmark,
    scope: "domestic",
  },
  {
    id: "stripe",
    label: "Stripe",
    description: "Secure international card payments",
    icon: CreditCard,
    scope: "international",
  },
  {
    id: "paypal",
    label: "PayPal",
    description: "Pay with your PayPal balance or card",
    icon: Globe,
    scope: "international",
  },
];

function deliveryEstimate(option: DeliveryOption): string {
  const today = new Date("2026-06-03");
  let days = 4;
  if (option.id === "express") days = 2;
  if (option.id === "sameday") days = 0;
  const target = new Date(today);
  target.setDate(target.getDate() + days);
  return target.toLocaleDateString("en-NG", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
}

export default function CheckoutPage() {
  const { cart, cartSubtotal, clearCart } = useStore();
  const { user } = useAuth();

  const [confirmation, setConfirmation] = useState<ConfirmationData | null>(null);

  // Form state
  const [email, setEmail] = useState("");
  const [intl, setIntl] = useState(false);
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [intlCountry, setIntlCountry] = useState("");
  const [delivery, setDelivery] = useState("standard");
  const [payment, setPayment] = useState("paystack");
  const [coupon, setCoupon] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [couponError, setCouponError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (user?.email && !email) setEmail(user.email);
  }, [user, email]);

  // When switching scope, reset payment to a valid option for that scope.
  useEffect(() => {
    const valid = PAYMENT_OPTIONS.some(
      (p) => p.id === payment && p.scope === (intl ? "international" : "domestic")
    );
    if (!valid) setPayment(intl ? "stripe" : "paystack");
    // sameday is Nigeria-only
    if (intl && delivery === "sameday") setDelivery("standard");
  }, [intl, payment, delivery]);

  const availableDelivery = useMemo(
    () => DELIVERY_OPTIONS.filter((o) => !(o.lagosOnly && (intl || state !== "FCT - Abuja"))),
    [intl, state]
  );

  const availablePayments = useMemo(
    () => PAYMENT_OPTIONS.filter((p) => p.scope === (intl ? "international" : "domestic")),
    [intl]
  );

  const selectedDelivery =
    availableDelivery.find((o) => o.id === delivery) ?? availableDelivery[0];

  const discount = appliedCoupon ? Math.round(cartSubtotal * COUPON_RATE) : 0;
  const subtotalAfterDiscount = cartSubtotal - discount;

  const shipping = useMemo(() => {
    if (!selectedDelivery) return 0;
    if (
      selectedDelivery.id === "standard" &&
      subtotalAfterDiscount >= FREE_SHIPPING_THRESHOLD &&
      !intl
    ) {
      return 0;
    }
    return selectedDelivery.price;
  }, [selectedDelivery, subtotalAfterDiscount, intl]);

  const total = subtotalAfterDiscount + shipping;

  function applyCoupon() {
    const code = coupon.trim().toUpperCase();
    if (!code) return;
    if (code === "LUXE10") {
      setAppliedCoupon(code);
      setCouponError(null);
    } else {
      setAppliedCoupon(null);
      setCouponError("Invalid promo code.");
    }
  }

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

  function placeOrder() {
    if (!validate()) {
      // Scroll to first error region
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    setSubmitting(true);

    const orderNumber = `LUX-${String(Date.now()).slice(-6)}`;
    const lines = cart.map((item) => ({
      key: `${item.productId}-${item.size}-${item.color}`,
      name: item.name,
      color: item.color,
      size: item.size,
      quantity: item.quantity,
      price: item.price,
    }));
    const paymentLabel =
      PAYMENT_OPTIONS.find((p) => p.id === payment)?.label ?? "Card";

    // Simulate payment processing.
    setTimeout(() => {
      setConfirmation({
        orderNumber,
        email,
        total,
        lines,
        deliveryLabel: selectedDelivery
          ? `${selectedDelivery.label} — ${
              shipping === 0 ? "Free" : formatNaira(shipping)
            }`
          : "Standard Delivery",
        estimatedDelivery: selectedDelivery
          ? deliveryEstimate(selectedDelivery)
          : "3 – 5 business days",
        paymentLabel,
      });
      clearCart();
      setSubmitting(false);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 1200);
  }

  if (confirmation) {
    return <OrderConfirmation data={confirmation} />;
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

  function FieldError({ name }: { name: string }) {
    return errors[name] ? (
      <p className="mt-1.5 text-xs text-danger">{errors[name]}</p>
    ) : null;
  }

  return (
    <Container className="py-14 sm:py-20">
      <div className="border-b border-sand pb-8">
        <p className="eyebrow">Secure Checkout</p>
        <h1 className="mt-3 text-4xl text-ink sm:text-5xl">Checkout</h1>
        <p className="mt-3 flex items-center gap-2 text-sm text-stone">
          <Lock size={14} className="text-blue-deep" />
          Your details are encrypted and processed securely.
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
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className={inputClass}
              />
              <FieldError name="email" />
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
                  onClick={() => setIntl(false)}
                  className={clsx(
                    "px-4 py-2 text-xs uppercase tracking-[0.14em] transition",
                    !intl ? "bg-ink text-ivory" : "text-stone hover:text-ink"
                  )}
                >
                  Nigeria
                </button>
                <button
                  type="button"
                  onClick={() => setIntl(true)}
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
                  className={inputClass}
                />
                <FieldError name="fullName" />
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
                  className={inputClass}
                />
                <FieldError name="phone" />
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
                  className={inputClass}
                />
                <FieldError name="city" />
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
                  className={inputClass}
                />
                <FieldError name="address" />
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
                    className={inputClass}
                  />
                  <FieldError name="country" />
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
                    <FieldError name="state" />
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
              {availableDelivery.map((option) => {
                const free =
                  option.id === "standard" &&
                  subtotalAfterDiscount >= FREE_SHIPPING_THRESHOLD &&
                  !intl;
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
                    <span className="text-sm font-medium text-ink">
                      {free ? (
                        <span className="text-emerald">Free</span>
                      ) : (
                        formatNaira(option.price)
                      )}
                    </span>
                  </button>
                );
              })}
            </div>
          </section>

          {/* Payment */}
          <section>
            <h2 className="text-2xl text-ink">
              <span className="mr-3 text-blue-deep">04</span>Payment Method
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

            {payment === "bank" && (
              <div className="mt-5 border border-sand bg-cream p-5">
                <p className="flex items-center gap-2 text-xs uppercase tracking-[0.16em] text-stone">
                  <Landmark size={14} /> Bank Transfer Details
                </p>
                <dl className="mt-4 space-y-2 text-sm">
                  <div className="flex justify-between gap-4">
                    <dt className="text-stone">Account Name</dt>
                    <dd className="text-right font-medium text-ink">
                      Luxe Universal Wears Ltd
                    </dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="text-stone">Bank</dt>
                    <dd className="font-medium text-ink">GTBank</dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="text-stone">Account Number</dt>
                    <dd className="font-medium text-ink">0123456789</dd>
                  </div>
                </dl>
                <p className="mt-4 text-xs text-mist">
                  Use your order number as the transfer reference. Your order ships once
                  payment is confirmed.
                </p>
              </div>
            )}
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

            {/* Coupon */}
            <div className="border-b border-sand py-6">
              {appliedCoupon ? (
                <div className="flex items-center justify-between text-sm text-emerald">
                  <span>
                    <span className="font-medium">{appliedCoupon}</span> — 10% off applied
                  </span>
                  <button
                    onClick={() => {
                      setAppliedCoupon(null);
                      setCoupon("");
                    }}
                    className="text-xs uppercase tracking-[0.14em] text-stone underline hover:text-danger"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <>
                  <div className="flex gap-2">
                    <input
                      value={coupon}
                      onChange={(e) => setCoupon(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && applyCoupon()}
                      placeholder="Promo code"
                      className="min-w-0 flex-1 border border-sand bg-ivory px-4 py-2.5 text-sm text-ink outline-none transition focus:border-ink"
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

            <dl className="space-y-3 py-6 text-sm">
              <div className="flex justify-between">
                <dt className="text-stone">Subtotal</dt>
                <dd className="text-ink">{formatNaira(cartSubtotal)}</dd>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-emerald">
                  <dt>Discount</dt>
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
            </dl>

            <div className="flex items-center justify-between border-t border-sand pt-5">
              <span className="text-sm uppercase tracking-[0.18em] text-stone">
                Total
              </span>
              <span className="text-2xl text-ink">{formatNaira(total)}</span>
            </div>

            <Button
              variant="primary"
              size="lg"
              onClick={placeOrder}
              disabled={submitting}
              className="mt-6 w-full"
            >
              {submitting ? "Processing…" : "Place Order"}
            </Button>

            <p className="mt-4 flex items-center justify-center gap-2 text-xs text-stone">
              <ShieldCheck size={14} className="text-blue-deep" />
              Encrypted &amp; secure · 14-day returns
            </p>
          </div>
        </aside>
      </div>
    </Container>
  );
}

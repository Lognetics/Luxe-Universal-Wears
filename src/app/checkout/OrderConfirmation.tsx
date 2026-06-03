"use client";

import { CheckCircle2, Package, Truck, Mail } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { ButtonLink } from "@/components/ui/Button";
import { formatNaira } from "@/lib/format";

export type ConfirmationLine = {
  key: string;
  name: string;
  color: string;
  size: string;
  quantity: number;
  price: number;
};

export type ConfirmationData = {
  orderNumber: string;
  email: string;
  total: number;
  lines: ConfirmationLine[];
  deliveryLabel: string;
  estimatedDelivery: string;
  paymentLabel: string;
};

export function OrderConfirmation({ data }: { data: ConfirmationData }) {
  return (
    <Container width="narrow" className="py-16 sm:py-24">
      <div className="flex flex-col items-center text-center">
        <span className="flex h-20 w-20 items-center justify-center rounded-full border border-emerald/40 bg-emerald/5">
          <CheckCircle2 size={36} strokeWidth={1.5} className="text-emerald" />
        </span>
        <p className="eyebrow mt-8">Order Confirmed</p>
        <h1 className="mt-3 text-4xl text-ink sm:text-5xl">Thank you for your order</h1>
        <p className="mt-4 max-w-md leading-relaxed text-stone">
          Your order has been received and is being prepared with care. A confirmation has
          been sent to{" "}
          <span className="font-medium text-ink">{data.email}</span>.
        </p>
      </div>

      <div className="mt-12 border border-sand bg-paper p-7 shadow-soft sm:p-9">
        <div className="flex flex-col gap-4 border-b border-sand pb-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-stone">Order Number</p>
            <p className="mt-1 text-2xl text-ink">{data.orderNumber}</p>
          </div>
          <div className="sm:text-right">
            <p className="text-xs uppercase tracking-[0.18em] text-stone">Order Total</p>
            <p className="mt-1 text-2xl text-ink">{formatNaira(data.total)}</p>
          </div>
        </div>

        <ul className="divide-y divide-sand/70 py-2">
          {data.lines.map((line) => (
            <li key={line.key} className="flex items-start justify-between gap-4 py-4">
              <div>
                <p className="text-sm font-medium text-ink">{line.name}</p>
                <p className="mt-1 text-xs uppercase tracking-[0.15em] text-mist">
                  {line.color} · Size {line.size} · Qty {line.quantity}
                </p>
              </div>
              <span className="shrink-0 text-sm text-ink">
                {formatNaira(line.price * line.quantity)}
              </span>
            </li>
          ))}
        </ul>

        <dl className="space-y-4 border-t border-sand pt-6 text-sm">
          <div className="flex items-start gap-3">
            <Truck size={18} className="mt-0.5 shrink-0 text-blue-deep" />
            <div>
              <dt className="text-stone">Delivery</dt>
              <dd className="text-ink">{data.deliveryLabel}</dd>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Package size={18} className="mt-0.5 shrink-0 text-blue-deep" />
            <div>
              <dt className="text-stone">Estimated Arrival</dt>
              <dd className="text-ink">{data.estimatedDelivery}</dd>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Mail size={18} className="mt-0.5 shrink-0 text-blue-deep" />
            <div>
              <dt className="text-stone">Payment</dt>
              <dd className="text-ink">{data.paymentLabel}</dd>
            </div>
          </div>
        </dl>
      </div>

      <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:justify-center">
        <ButtonLink href="/shop" variant="primary" size="lg">
          Continue Shopping
        </ButtonLink>
        <ButtonLink href="/account" variant="outline" size="lg">
          View Account
        </ButtonLink>
      </div>
    </Container>
  );
}

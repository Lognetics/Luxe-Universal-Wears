"use client";

import { clsx } from "clsx";
import type { ReactNode } from "react";
import type { OrderStatus } from "../mock-data";

export function SectionTitle({
  eyebrow,
  title,
  description,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="mb-8">
      {eyebrow && <p className="eyebrow mb-2">{eyebrow}</p>}
      <h2 className="text-3xl text-ink sm:text-4xl">{title}</h2>
      {description && (
        <p className="mt-2 max-w-xl text-sm leading-relaxed text-stone">{description}</p>
      )}
    </div>
  );
}

export function Card({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={clsx("border border-sand bg-paper p-6 shadow-soft", className)}>
      {children}
    </div>
  );
}

export function StatusBadge({ status }: { status: OrderStatus | string }) {
  const map: Record<string, string> = {
    Delivered: "bg-success/10 text-success border-success/30",
    Refunded: "bg-success/10 text-success border-success/30",
    Approved: "bg-success/10 text-success border-success/30",
    Completed: "bg-success/10 text-success border-success/30",
    Shipped: "bg-blue/15 text-blue-deep border-blue/40",
    "In Production": "bg-blue/15 text-blue-deep border-blue/40",
    Processing: "bg-wine/10 text-wine border-wine/30",
    Pending: "bg-wine/10 text-wine border-wine/30",
    Requested: "bg-mist/15 text-stone border-mist/40",
    "In Consultation": "bg-mist/15 text-stone border-mist/40",
  };
  return (
    <span
      className={clsx(
        "inline-block border px-3 py-1 text-[0.65rem] font-medium uppercase tracking-[0.18em]",
        map[status] ?? "bg-mist/15 text-stone border-mist/40"
      )}
    >
      {status}
    </span>
  );
}

export function FormField({
  label,
  id,
  type = "text",
  value,
  onChange,
  placeholder,
}: {
  label: string;
  id: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-2 block text-xs font-medium uppercase tracking-[0.2em] text-charcoal"
      >
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full border border-sand bg-paper px-4 py-3 text-sm text-ink outline-none transition-colors placeholder:text-mist focus:border-blue"
      />
    </div>
  );
}

export function InlineNotice({ message }: { message: string }) {
  return (
    <p className="border border-success/30 bg-success/5 px-4 py-3 text-xs font-medium uppercase tracking-[0.15em] text-success">
      {message}
    </p>
  );
}

export function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <Card className="text-center">
      <h3 className="text-2xl text-ink">{title}</h3>
      <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-stone">
        {description}
      </p>
      {action && <div className="mt-6 flex justify-center">{action}</div>}
    </Card>
  );
}

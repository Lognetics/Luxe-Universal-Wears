"use client";

import { useState } from "react";
import { Check, Calendar, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";

const SERVICES = [
  "Bespoke Suit",
  "Bespoke Shirt",
  "Wedding Tuxedo",
  "Corporate Wear",
  "Full Wardrobe Consultation",
];

const CITIES = [
  "Lagos",
  "Abuja",
  "Port Harcourt",
  "Ibadan",
  "Benin City",
  "Kano",
  "International (Virtual)",
];

const fieldClass =
  "w-full border border-sand bg-paper px-4 py-3.5 text-sm text-ink placeholder:text-mist outline-none transition focus:border-blue";
const labelClass =
  "mb-2 block text-[0.7rem] font-medium uppercase tracking-[0.2em] text-stone";

export function BookingForm() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    service: SERVICES[0],
    date: "",
    city: CITIES[0],
    notes: "",
  });

  function update(key: keyof typeof form, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center border border-blue/40 bg-paper px-8 py-16 text-center shadow-soft">
        <span className="flex h-16 w-16 items-center justify-center rounded-full border border-blue/50 text-blue-deep">
          <Check size={28} strokeWidth={1.5} />
        </span>
        <p className="eyebrow mt-6">Consultation Requested</p>
        <h3 className="mt-3 font-serif text-3xl text-ink">Thank you, {form.name.split(" ")[0] || "friend"}.</h3>
        <p className="mt-4 max-w-md text-stone leading-relaxed">
          Your request for a <span className="text-ink">{form.service}</span> consultation in{" "}
          <span className="text-ink">{form.city}</span> has been received. A member of our atelier
          will reach out within 24 hours to confirm your appointment and discuss the finer details.
        </p>
        <button
          type="button"
          onClick={() => {
            setSubmitted(false);
            setForm({
              name: "",
              phone: "",
              email: "",
              service: SERVICES[0],
              date: "",
              city: CITIES[0],
              notes: "",
            });
          }}
          className="mt-8 border-b border-blue pb-1 text-[0.72rem] uppercase tracking-[0.2em] text-blue-deep transition hover:text-ink"
        >
          Book another appointment
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="border border-sand bg-cream/60 p-6 shadow-soft sm:p-10"
    >
      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="bf-name" className={labelClass}>
            Full Name
          </label>
          <input
            id="bf-name"
            required
            value={form.name}
            onChange={(e) => update("name", e.target.value)}
            placeholder="Adewale Okonkwo"
            className={fieldClass}
          />
        </div>
        <div>
          <label htmlFor="bf-phone" className={labelClass}>
            Phone Number
          </label>
          <input
            id="bf-phone"
            required
            type="tel"
            value={form.phone}
            onChange={(e) => update("phone", e.target.value)}
            placeholder="+234 800 000 0000"
            className={fieldClass}
          />
        </div>
        <div>
          <label htmlFor="bf-email" className={labelClass}>
            Email Address
          </label>
          <input
            id="bf-email"
            required
            type="email"
            value={form.email}
            onChange={(e) => update("email", e.target.value)}
            placeholder="you@example.com"
            className={fieldClass}
          />
        </div>
        <div>
          <label htmlFor="bf-service" className={labelClass}>
            Service Type
          </label>
          <select
            id="bf-service"
            value={form.service}
            onChange={(e) => update("service", e.target.value)}
            className={fieldClass}
          >
            {SERVICES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="bf-date" className={labelClass}>
            Preferred Date
          </label>
          <div className="relative">
            <input
              id="bf-date"
              required
              type="date"
              value={form.date}
              onChange={(e) => update("date", e.target.value)}
              className={fieldClass}
            />
            <Calendar
              size={16}
              className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-mist"
            />
          </div>
        </div>
        <div>
          <label htmlFor="bf-city" className={labelClass}>
            City
          </label>
          <select
            id="bf-city"
            value={form.city}
            onChange={(e) => update("city", e.target.value)}
            className={fieldClass}
          >
            {CITIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-6">
        <label htmlFor="bf-notes" className={labelClass}>
          Notes &amp; Occasion
        </label>
        <textarea
          id="bf-notes"
          rows={4}
          value={form.notes}
          onChange={(e) => update("notes", e.target.value)}
          placeholder="Tell us about the occasion, preferred fabrics, colours or timelines."
          className={`${fieldClass} resize-none`}
        />
      </div>

      <div className="mt-8 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="max-w-sm text-xs leading-relaxed text-mist">
          By requesting a consultation you agree to be contacted by our atelier. No payment is
          required to book.
        </p>
        <Button type="submit" variant="gold" size="lg" className="w-full sm:w-auto">
          Request Consultation <ArrowRight size={15} />
        </Button>
      </div>
    </form>
  );
}

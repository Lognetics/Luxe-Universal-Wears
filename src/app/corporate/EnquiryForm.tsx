"use client";

import { useState, type FormEvent } from "react";
import { Check, Send } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { formValue, openWhatsApp } from "@/lib/whatsapp";

const ORDER_TYPES = [
  "Corporate Uniforms",
  "School Uniforms",
  "Event / Conference Apparel",
  "Branded Workwear",
  "Executive Suiting Programme",
  "Other",
];

const fieldClass =
  "w-full border border-sand bg-ivory px-4 py-3.5 text-sm text-ink placeholder:text-mist focus:border-ink focus:outline-none transition-colors";
const labelClass = "mb-2 block text-[0.65rem] uppercase tracking-[0.18em] text-stone";

export function EnquiryForm() {
  const [sent, setSent] = useState(false);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    openWhatsApp(
      [
        "Hello Luxe Universal Wears, I would like to discuss a corporate or bulk order.",
        "",
        `Company: ${formValue(data, "company")}`,
        `Contact: ${formValue(data, "contact")}`,
        `Email: ${formValue(data, "email")}`,
        `Phone: ${formValue(data, "phone")}`,
        `Order type: ${formValue(data, "orderType")}`,
        `Estimated quantity: ${formValue(data, "quantity")}`,
        `Project details: ${formValue(data, "details")}`,
      ].join("\n"),
    );
    setSent(true);
  }

  if (sent) {
    return (
      <div className="flex flex-col items-center justify-center border border-sand bg-cream px-8 py-20 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald text-ivory">
          <Check size={26} />
        </div>
        <h3 className="mt-6 text-2xl text-ink">Continue in WhatsApp</h3>
        <p className="mt-3 max-w-sm text-sm leading-relaxed text-stone">
          Your corporate enquiry is ready in WhatsApp. Press <strong>Send</strong> there to deliver
          it before the team can review your requirements and prepare a quotation.
        </p>
        <Button variant="outline" size="sm" className="mt-8" onClick={() => setSent(false)}>
          Prepare Another Enquiry
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <label className={labelClass} htmlFor="company">
            Company / Organisation
          </label>
          <input id="company" name="company" required className={fieldClass} placeholder="Acme Group Ltd" />
        </div>
        <div>
          <label className={labelClass} htmlFor="contact">
            Contact Name
          </label>
          <input id="contact" name="contact" required className={fieldClass} placeholder="Your full name" />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <label className={labelClass} htmlFor="email">
            Email Address
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className={fieldClass}
            placeholder="you@company.com"
          />
        </div>
        <div>
          <label className={labelClass} htmlFor="phone">
            Phone Number
          </label>
          <input id="phone" name="phone" type="tel" className={fieldClass} placeholder="+234 800 000 0000" />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <label className={labelClass} htmlFor="orderType">
            Order Type
          </label>
          <select id="orderType" name="orderType" required className={fieldClass} defaultValue="">
            <option value="" disabled>
              Select order type
            </option>
            {ORDER_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelClass} htmlFor="quantity">
            Estimated Quantity
          </label>
          <input
            id="quantity"
            name="quantity"
            type="number"
            min={1}
            className={fieldClass}
            placeholder="e.g. 150"
          />
        </div>
      </div>

      <div>
        <label className={labelClass} htmlFor="details">
          Project Details
        </label>
        <textarea
          id="details"
          name="details"
          required
          rows={5}
          className={fieldClass}
          placeholder="Tell us about your requirements, timeline, branding needs and budget."
        />
      </div>

      <Button type="submit" variant="primary" size="lg" className="w-full sm:w-auto">
        <Send size={15} /> Continue in WhatsApp
      </Button>
    </form>
  );
}

"use client";

import { useState, type FormEvent } from "react";
import { Check, Send } from "lucide-react";
import { Button } from "@/components/ui/Button";

const SUBJECTS = [
  "General Enquiry",
  "Order & Delivery",
  "Bespoke & Made-to-Measure",
  "Wedding & Groom Styling",
  "Corporate & Bulk Orders",
  "Press & Partnerships",
];

const fieldClass =
  "w-full border border-sand bg-ivory px-4 py-3.5 text-sm text-ink placeholder:text-mist focus:border-ink focus:outline-none transition-colors";
const labelClass = "mb-2 block text-[0.65rem] uppercase tracking-[0.18em] text-stone";

export function ContactForm() {
  const [sent, setSent] = useState(false);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSent(true);
  }

  if (sent) {
    return (
      <div className="flex flex-col items-center justify-center border border-sand bg-cream px-8 py-20 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald text-ivory">
          <Check size={26} />
        </div>
        <h3 className="mt-6 text-2xl text-ink">Message Received</h3>
        <p className="mt-3 max-w-sm text-sm leading-relaxed text-stone">
          Thank you for reaching out to Luxe Universal Wears. A member of our team will respond within
          one business day.
        </p>
        <Button variant="outline" size="sm" className="mt-8" onClick={() => setSent(false)}>
          Send Another Message
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <label className={labelClass} htmlFor="name">
            Full Name
          </label>
          <input id="name" name="name" required className={fieldClass} placeholder="Adewale Johnson" />
        </div>
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
            placeholder="you@example.com"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <label className={labelClass} htmlFor="phone">
            Phone Number
          </label>
          <input id="phone" name="phone" type="tel" className={fieldClass} placeholder="+234 800 000 0000" />
        </div>
        <div>
          <label className={labelClass} htmlFor="subject">
            Subject
          </label>
          <select id="subject" name="subject" required className={fieldClass} defaultValue="">
            <option value="" disabled>
              Select a subject
            </option>
            {SUBJECTS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className={labelClass} htmlFor="message">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={6}
          className={fieldClass}
          placeholder="How can we help you?"
        />
      </div>

      <Button type="submit" variant="primary" size="lg" className="w-full sm:w-auto">
        <Send size={15} /> Send Message
      </Button>
    </form>
  );
}

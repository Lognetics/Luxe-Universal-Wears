"use client";

import { useState } from "react";
import { ArrowRight, Check } from "lucide-react";

export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (email.includes("@")) setDone(true);
      }}
      className="w-full"
    >
      {done ? (
        <div className="flex items-center gap-3 border border-blue/40 bg-ivory/5 px-5 py-4 text-blue-soft">
          <Check size={18} /> You&apos;re on the list. Welcome to Luxe.
        </div>
      ) : (
        <div className="flex border border-ivory/25 focus-within:border-blue">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email address"
            className="flex-1 bg-transparent px-5 py-4 text-sm text-ivory outline-none placeholder:text-ivory/40"
          />
          <button type="submit" aria-label="Subscribe" className="flex items-center gap-2 bg-blue px-6 text-xs uppercase tracking-[0.18em] text-white transition hover:bg-blue-deep">
            Join <ArrowRight size={15} />
          </button>
        </div>
      )}
      <p className="mt-3 text-xs text-ivory/40">By subscribing you agree to our privacy policy.</p>
    </form>
  );
}

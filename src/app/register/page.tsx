"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/providers/AuthProvider";
import { Button } from "@/components/ui/Button";

export default function RegisterPage() {
  const router = useRouter();
  const { signUp, configured } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (!agreed) {
      setError("Please accept the terms to continue.");
      return;
    }

    setLoading(true);
    const { error: err } = await signUp(email.trim(), password, name.trim());
    setLoading(false);
    if (err) {
      setError(err);
      return;
    }
    router.push("/account");
  }

  return (
    <div className="grid min-h-[calc(100vh-0px)] lg:grid-cols-2">
      {/* Form side */}
      <div className="order-2 flex items-center justify-center bg-ivory px-5 py-16 sm:px-10 lg:order-1">
        <div className="w-full max-w-md animate-fade-up">
          <Link
            href="/"
            className="mb-10 inline-block font-serif text-xl tracking-tight text-ink lg:hidden"
          >
            Luxe Universal Wears
          </Link>
          <p className="eyebrow mb-3">Join The House</p>
          <h1 className="text-4xl text-ink sm:text-5xl">Create Account</h1>
          <p className="mt-3 text-sm leading-relaxed text-stone">
            Already a member?{" "}
            <Link href="/login" className="luxe-link-underline text-blue-deep">
              Sign in
            </Link>
          </p>

          {!configured && (
            <p className="mt-6 border border-sand bg-cream px-4 py-3 text-xs leading-relaxed text-stone">
              Preview mode — your details create a local demo account only.
            </p>
          )}

          {error && (
            <p className="mt-6 border border-danger/30 bg-danger/5 px-4 py-3 text-xs text-danger">
              {error}
            </p>
          )}

          <form onSubmit={onSubmit} className="mt-8 space-y-5">
            <Field
              id="name"
              label="Full Name"
              type="text"
              value={name}
              onChange={setName}
              placeholder="Adewale Okonkwo"
            />
            <Field
              id="email"
              label="Email Address"
              type="email"
              value={email}
              onChange={setEmail}
              placeholder="you@example.com"
            />
            <Field
              id="password"
              label="Password"
              type="password"
              value={password}
              onChange={setPassword}
              placeholder="At least 6 characters"
            />
            <Field
              id="confirm"
              label="Confirm Password"
              type="password"
              value={confirm}
              onChange={setConfirm}
              placeholder="Re-enter your password"
            />

            <label className="flex cursor-pointer items-start gap-3 text-xs leading-relaxed text-stone select-none">
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="mt-0.5 h-4 w-4 accent-blue"
              />
              <span>
                I agree to the{" "}
                <Link href="/" className="luxe-link-underline text-charcoal">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link href="/" className="luxe-link-underline text-charcoal">
                  Privacy Policy
                </Link>
                .
              </span>
            </label>

            <Button type="submit" size="lg" className="w-full" disabled={loading}>
              {loading ? "Creating account…" : "Create Account"}
            </Button>
          </form>

          <p className="mt-10 text-center text-[0.7rem] uppercase tracking-[0.2em] text-mist">
            Crafted in Abuja · Worn the world over
          </p>
        </div>
      </div>

      {/* Image side */}
      <div className="relative order-1 hidden min-h-[40vh] lg:order-2 lg:block">
        <Image
          src="/products/noir-floral-jacquard-tuxedo.jpeg"
          alt="Luxe Universal Wears — bespoke craftsmanship"
          fill
          sizes="50vw"
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-ink/55" />
        <div className="absolute inset-0 flex flex-col justify-between p-12 text-ivory">
          <Link href="/" className="self-end font-serif text-2xl tracking-tight">
            Luxe Universal Wears
          </Link>
          <div className="max-w-md">
            <p className="eyebrow mb-4 text-blue-soft">A Private Wardrobe</p>
            <h2 className="text-4xl leading-[1.08] text-ivory">
              Begin a lifelong relationship with fine tailoring.
            </h2>
            <p className="mt-5 text-sm leading-relaxed text-ivory/70">
              Members enjoy early access to collections, personalised styling,
              and the rewards of the Luxe Membership programme.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({
  id,
  label,
  type,
  value,
  onChange,
  placeholder,
}: {
  id: string;
  label: string;
  type: string;
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
        required
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full border border-sand bg-paper px-4 py-3.5 text-sm text-ink outline-none transition-colors placeholder:text-mist focus:border-blue"
      />
    </div>
  );
}

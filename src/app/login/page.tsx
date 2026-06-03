"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/providers/AuthProvider";
import { Button } from "@/components/ui/Button";

export default function LoginPage() {
  const router = useRouter();
  const { signIn, configured } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const { error: err } = await signIn(email.trim(), password);
    setLoading(false);
    if (err) {
      setError(err);
      return;
    }
    router.push("/account");
  }

  return (
    <div className="grid min-h-[calc(100vh-0px)] lg:grid-cols-2">
      {/* Image side */}
      <div className="relative hidden min-h-[40vh] lg:block">
        <Image
          src="/products/windsor-black-two-piece-suit.jpeg"
          alt="Luxe Universal Wears — tailored elegance"
          fill
          sizes="50vw"
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-ink/55" />
        <div className="absolute inset-0 flex flex-col justify-between p-12 text-ivory">
          <Link href="/" className="font-serif text-2xl tracking-tight">
            Luxe Universal Wears
          </Link>
          <div className="max-w-md">
            <p className="eyebrow mb-4 text-blue-soft">Members&apos; Atelier</p>
            <h2 className="text-4xl leading-[1.08] text-ivory">
              Where the well-dressed are remembered by name.
            </h2>
            <p className="mt-5 text-sm leading-relaxed text-ivory/70">
              Sign in to track orders, save your bespoke measurements, and enjoy
              the privileges of Luxe Membership.
            </p>
          </div>
        </div>
      </div>

      {/* Form side */}
      <div className="flex items-center justify-center bg-ivory px-5 py-16 sm:px-10">
        <div className="w-full max-w-md animate-fade-up">
          <Link
            href="/"
            className="mb-10 inline-block font-serif text-xl tracking-tight text-ink lg:hidden"
          >
            Luxe Universal Wears
          </Link>
          <p className="eyebrow mb-3">Welcome Back</p>
          <h1 className="text-4xl text-ink sm:text-5xl">Sign In</h1>
          <p className="mt-3 text-sm leading-relaxed text-stone">
            Don&apos;t have an account yet?{" "}
            <Link href="/register" className="luxe-link-underline text-blue-deep">
              Create one
            </Link>
          </p>

          {!configured && (
            <p className="mt-6 border border-sand bg-cream px-4 py-3 text-xs leading-relaxed text-stone">
              Preview mode — any email and password will sign you into a demo
              account.
            </p>
          )}

          {error && (
            <p className="mt-6 border border-danger/30 bg-danger/5 px-4 py-3 text-xs text-danger">
              {error}
            </p>
          )}

          <form onSubmit={onSubmit} className="mt-8 space-y-6">
            <div>
              <label htmlFor="email" className="mb-2 block text-xs font-medium uppercase tracking-[0.2em] text-charcoal">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full border border-sand bg-paper px-4 py-3.5 text-sm text-ink outline-none transition-colors placeholder:text-mist focus:border-blue"
              />
            </div>

            <div>
              <label htmlFor="password" className="mb-2 block text-xs font-medium uppercase tracking-[0.2em] text-charcoal">
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full border border-sand bg-paper px-4 py-3.5 text-sm text-ink outline-none transition-colors placeholder:text-mist focus:border-blue"
              />
            </div>

            <div className="flex items-center justify-between text-xs text-stone">
              <label className="flex cursor-pointer items-center gap-2 select-none">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  className="h-4 w-4 accent-blue"
                />
                Remember me
              </label>
              <Link href="/account" className="luxe-link-underline text-charcoal">
                Forgot password?
              </Link>
            </div>

            <Button type="submit" size="lg" className="w-full" disabled={loading}>
              {loading ? "Signing in…" : "Sign In"}
            </Button>
          </form>

          <p className="mt-10 text-center text-[0.7rem] uppercase tracking-[0.2em] text-mist">
            Crafted in Lagos · Worn the world over
          </p>
        </div>
      </div>
    </div>
  );
}

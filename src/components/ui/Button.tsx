import Link from "next/link";
import { clsx } from "clsx";
import type { ComponentProps, ReactNode } from "react";

type Variant = "primary" | "outline" | "ghost" | "gold" | "dark" | "blue";
type Size = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 font-sans uppercase tracking-[0.18em] text-xs font-medium transition-all duration-300 disabled:opacity-50 disabled:pointer-events-none";

const variants: Record<Variant, string> = {
  primary: "bg-ink text-ivory hover:bg-blue",
  dark: "bg-charcoal text-ivory hover:bg-ink",
  gold: "bg-blue text-ink hover:bg-blue-deep hover:text-ivory",
  blue: "bg-blue text-white hover:bg-blue-deep",
  outline: "border border-ink/70 text-ink hover:bg-blue hover:border-blue hover:text-white",
  ghost: "text-ink hover:text-blue-deep",
};

const sizes: Record<Size, string> = {
  sm: "px-4 py-2.5",
  md: "px-7 py-3.5",
  lg: "px-9 py-4 text-[0.8rem]",
};

type CommonProps = {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: ReactNode;
};

export function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  ...props
}: CommonProps & ComponentProps<"button">) {
  return (
    <button className={clsx(base, variants[variant], sizes[size], className)} {...props}>
      {children}
    </button>
  );
}

export function ButtonLink({
  variant = "primary",
  size = "md",
  className,
  children,
  href,
  ...props
}: CommonProps & ComponentProps<typeof Link>) {
  return (
    <Link href={href} className={clsx(base, variants[variant], sizes[size], className)} {...props}>
      {children}
    </Link>
  );
}

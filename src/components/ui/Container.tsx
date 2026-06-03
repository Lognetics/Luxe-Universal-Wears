import { clsx } from "clsx";
import type { ReactNode } from "react";

export function Container({
  children,
  className,
  width = "default",
}: {
  children: ReactNode;
  className?: string;
  width?: "default" | "wide" | "narrow";
}) {
  return (
    <div
      className={clsx(
        "mx-auto px-5 sm:px-8",
        width === "wide" && "max-w-[1600px]",
        width === "default" && "max-w-[1320px]",
        width === "narrow" && "max-w-3xl",
        className
      )}
    >
      {children}
    </div>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
  className,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "center" | "left";
  className?: string;
}) {
  return (
    <div
      className={clsx(
        align === "center" ? "text-center mx-auto max-w-2xl" : "text-left",
        className
      )}
    >
      {eyebrow && <p className="eyebrow mb-3">{eyebrow}</p>}
      <h2 className="text-3xl sm:text-4xl md:text-5xl text-ink leading-[1.05]">{title}</h2>
      {description && <p className="mt-4 text-stone leading-relaxed">{description}</p>}
    </div>
  );
}

export function Divider({ className }: { className?: string }) {
  return (
    <div className={clsx("flex items-center justify-center gap-3", className)}>
      <span className="h-px w-10 bg-blue/50" />
      <span className="h-1.5 w-1.5 rotate-45 bg-blue" />
      <span className="h-px w-10 bg-blue/50" />
    </div>
  );
}

import Image from "next/image";

export function Logo({
  variant = "dark",
  className,
  priority = false,
}: {
  variant?: "dark" | "light";
  className?: string;
  priority?: boolean;
}) {
  const src = variant === "light" ? "/brand/logo-light.png" : "/brand/logo-dark.png";
  return (
    <Image
      src={src}
      alt="Luxe Universal Wears"
      width={1000}
      height={650}
      priority={priority}
      className={className}
    />
  );
}

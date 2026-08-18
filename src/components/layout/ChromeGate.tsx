"use client";

import { usePathname } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MiniCart } from "@/components/cart/MiniCart";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";
import { NeticsConcierge } from "@/components/ui/NeticsConcierge";

/** Storefront header — hidden on the /admin panel. */
export function ChromeHeader() {
  const pathname = usePathname();
  if (pathname?.startsWith("/admin")) return null;
  return <Header />;
}

/** Storefront footer + floating widgets — hidden on the /admin panel. */
export function ChromeFooter() {
  const pathname = usePathname();
  if (pathname?.startsWith("/admin")) return null;
  return (
    <>
      <Footer />
      <MiniCart />
      <NeticsConcierge />
      <WhatsAppButton />
    </>
  );
}

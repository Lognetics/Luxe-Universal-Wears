"use client";

import { usePathname } from "next/navigation";
import { WhatsAppIcon } from "./SocialIcons";
import { createWhatsAppLink } from "@/lib/whatsapp";

export function WhatsAppButton() {
  const pathname = usePathname();
  const pageUrl = `https://www.luxeuniversalwears.com${pathname || "/"}`;
  const href = createWhatsAppLink(
    `Hello Luxe Universal Wears! I'd like help with an order.\n\nPage: ${pageUrl}`,
  );

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Place your order on WhatsApp"
      title="Place your order on WhatsApp"
      className="fixed bottom-24 right-4 z-[70] flex items-center gap-1.5 rounded-full bg-[#25D366] py-1.5 pl-1.5 pr-1.5 text-[#0b2b18] shadow-soft transition-colors duration-200 hover:bg-[#20bd5b] sm:right-5 sm:pr-3"
    >
      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white/20">
        <WhatsAppIcon width={16} height={16} />
      </span>
      <span className="hidden whitespace-nowrap text-[0.7rem] font-medium tracking-wide sm:inline">
        WhatsApp
      </span>
    </a>
  );
}

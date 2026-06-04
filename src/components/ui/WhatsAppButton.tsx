import { WhatsAppIcon } from "./SocialIcons";

const WHATSAPP_NUMBER = "2348173938770"; // +234 817 393 8770
const PREFILLED_MESSAGE =
  "Hello Luxe Universal Wears! I'd like to place an order.";

export function WhatsAppButton() {
  const href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(PREFILLED_MESSAGE)}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Place your order on WhatsApp"
      title="Place your order on WhatsApp"
      className="fixed bottom-4 right-4 z-[70] flex items-center gap-1.5 rounded-full bg-[#25D366] py-1.5 pl-1.5 pr-3 text-white shadow-soft transition-colors duration-200 hover:bg-[#1ebe5b] sm:bottom-5 sm:right-5"
    >
      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white/20">
        <WhatsAppIcon width={16} height={16} />
      </span>
      <span className="whitespace-nowrap text-[0.7rem] font-medium tracking-wide">Order</span>
    </a>
  );
}

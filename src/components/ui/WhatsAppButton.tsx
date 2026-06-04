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
      className="group fixed bottom-5 right-5 z-[70] flex items-center gap-2.5 rounded-full bg-[#25D366] py-2.5 pl-2.5 pr-3 text-white shadow-card transition-all duration-300 hover:bg-[#1ebe5b] hover:pr-5 sm:bottom-6 sm:right-6 sm:pr-5"
    >
      <span className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/20">
        <span className="absolute inset-0 animate-ping rounded-full bg-white/25" />
        <WhatsAppIcon width={24} height={24} />
      </span>
      <span className="whitespace-nowrap pr-1 text-[0.8rem] font-medium tracking-wide sm:text-sm">
        Place your order on WhatsApp
      </span>
    </a>
  );
}

export const LUXE_WHATSAPP_NUMBER = "2348173938770";
export const LUXE_WHATSAPP_DISPLAY = "+234 817 393 8770";

const MAX_WHATSAPP_MESSAGE_LENGTH = 3500;

export function createWhatsAppLink(message: string) {
  const safeMessage = message.trim().slice(0, MAX_WHATSAPP_MESSAGE_LENGTH);
  return `https://wa.me/${LUXE_WHATSAPP_NUMBER}?text=${encodeURIComponent(safeMessage)}`;
}

export function openWhatsApp(message: string) {
  window.open(createWhatsAppLink(message), "_blank", "noopener,noreferrer");
}

export function formValue(formData: FormData, key: string, fallback = "Not provided") {
  const value = formData.get(key);
  return typeof value === "string" && value.trim() ? value.trim() : fallback;
}

import { MessageCircle } from "lucide-react";
import { useSiteContent } from "../context/SiteContentContext";
import { BUDGET_WHATSAPP_MESSAGE, getWhatsappUrl } from "../lib/siteContent";

export default function FloatingWhatsapp() {
  const { content } = useSiteContent();
  return (
    <a
      href={getWhatsappUrl(
        content.contact.whatsappNumber,
        BUDGET_WHATSAPP_MESSAGE,
      )}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Escribinos por WhatsApp"
      className="fixed bottom-[calc(1rem+env(safe-area-inset-bottom))] right-4 z-40 inline-flex h-14 w-14 items-center justify-center rounded-full border border-emerald-200/30 bg-emerald-400 text-[#041022] shadow-lg hover:bg-emerald-300"
    >
      <MessageCircle aria-hidden="true" className="h-7 w-7" />
    </a>
  );
}

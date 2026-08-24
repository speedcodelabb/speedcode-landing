export const maxMessageLength = 1600;
export const maxWhatsappMessageLength = 1200;

export function truncateForWhatsapp(message: string) {
  if (message.length <= maxWhatsappMessageLength) return message;
  return `${message.slice(0, maxWhatsappMessageLength).trim()}...\n\nMensaje recortado; la versión completa quedó registrada.`;
}

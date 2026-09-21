import { site } from '../data/site'

/** Link a WhatsApp con mensaje prearmado opcional. */
export function whatsappLink(message?: string): string {
  const base = `https://wa.me/${site.whatsappNumber}`
  return message ? `${base}?text=${encodeURIComponent(message)}` : base
}

export const WA_GENERIC_MESSAGE = 'Hola! Vi la página de El Jardín de Jazmín y quiero hacer una consulta.'

export function productInquiryMessage(productName: string, detail?: string): string {
  const what = detail ? `${productName} (${detail})` : productName
  return `Hola! Quiero consultar por ${what}.`
}

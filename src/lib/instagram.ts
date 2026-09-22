import { site } from '../data/site'

/**
 * Link al chat de Instagram con la cuenta. A diferencia de wa.me, ig.me NO acepta
 * texto prearmado: el mensaje por producto se copia al portapapeles (ver copyToClipboard).
 */
export function instagramDmLink(): string {
  return site.instagramDmUrl
}

export function productInquiryMessage(productName: string, detail?: string): string {
  const what = detail ? `${productName} (${detail})` : productName
  return `Hola! Quiero consultar por ${what}.`
}

/** Mensaje del CTA de souvenirs para eventos (sección Souvenirs). */
export function eventInquiryMessage(): string {
  return 'Hola! Quiero consultar por souvenirs para un evento.'
}

/** Copia texto al portapapeles. Devuelve false si el navegador no lo permite (el link abre igual). */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    if (!navigator.clipboard) return false
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    return false
  }
}

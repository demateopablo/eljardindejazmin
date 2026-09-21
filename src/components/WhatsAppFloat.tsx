import { whatsappLink, WA_GENERIC_MESSAGE } from '../lib/whatsapp'
import { WhatsAppIcon } from './Icons'

/** Botón flotante visible durante todo el scroll. */
export function WhatsAppFloat() {
  return (
    <a
      href={whatsappLink(WA_GENERIC_MESSAGE)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Escribinos por WhatsApp"
      className="fixed right-4 bottom-4 z-50 inline-flex h-14 w-14 items-center justify-center rounded-full bg-whatsapp text-white shadow-[0_6px_18px_rgba(37,211,102,0.4)] transition-transform hover:scale-105 hover:bg-whatsapp-dark sm:right-6 sm:bottom-6"
    >
      <WhatsAppIcon className="h-7 w-7" />
    </a>
  )
}

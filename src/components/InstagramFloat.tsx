import { instagramDmLink } from '../lib/instagram'
import { InstagramIcon } from './Icons'

/** Botón flotante visible durante todo el scroll: abre el DM de Instagram. */
export function InstagramFloat() {
  return (
    <a
      href={instagramDmLink()}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Escribinos por Instagram"
      className="fixed right-4 bottom-4 z-50 inline-flex h-14 w-14 items-center justify-center rounded-full bg-sage-500 text-cream-50 shadow-[0_6px_18px_rgba(107,133,104,0.45)] transition-transform hover:scale-105 hover:bg-sage-600 sm:right-6 sm:bottom-6"
    >
      <InstagramIcon className="h-7 w-7" />
    </a>
  )
}

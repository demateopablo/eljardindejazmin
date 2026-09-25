import Lightbox, { type SlotStyles } from 'yet-another-react-lightbox'
import Captions from 'yet-another-react-lightbox/plugins/captions'
import Zoom from 'yet-another-react-lightbox/plugins/zoom'
import 'yet-another-react-lightbox/styles.css'
import 'yet-another-react-lightbox/plugins/captions.css'
import { formatPrice, type Product } from '../data/products'
import { instagramDmLink } from '../lib/instagram'
import { useProductInquiry } from '../lib/useProductInquiry'
import { InstagramIcon } from './Icons'

/** Una foto de la galería: las de cada producto van seguidas, en el orden de la grilla. */
export interface GallerySlide {
  product: Product
  src: string
  /** Número de foto dentro del producto (1-based) y total de fotos del producto */
  n: number
  total: number
}

interface Props {
  slides: GallerySlide[]
  index: number
  onClose: () => void
}

/* Colores del sitio sobre las variables de YARL (los tokens de Tailwind v4 existen como CSS vars). */
const theme: SlotStyles['root'] = {
  '--yarl__color_backdrop': 'rgba(22, 23, 17, 0.97)',
  '--yarl__color_button': 'var(--color-cream-100)',
  '--yarl__color_button_active': 'var(--color-cream-50)',
  '--yarl__slide_captions_container_background': 'rgba(22, 23, 17, 0.6)',
  '--yarl__slide_title_color': 'var(--color-cream-50)',
  '--yarl__slide_description_color': 'var(--color-cream-200)',
}

const reduceMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

/**
 * Foto del producto a pantalla completa (swipe, flechas, pinch-zoom). Catalogo lo importa
 * lazy y solo lo monta mientras está abierto, así la biblioteca no pesa en la visita inicial.
 */
export default function ProductLightbox({ slides: gallery, index, onClose }: Props) {
  const slides = gallery.map(({ product: p, src, n, total }) => ({
    src,
    alt: `${p.detail ? `${p.name} — ${p.detail}` : p.name}${total > 1 ? ` (foto ${n} de ${total})` : ''}`,
    title: total > 1 ? `${p.name} · ${n}/${total}` : p.name,
    description: <Caption product={p} />,
  }))

  return (
    <Lightbox
      open
      close={onClose}
      index={index}
      slides={slides}
      plugins={[Captions, Zoom]}
      captions={{ descriptionTextAlign: 'center', showToggle: false }}
      zoom={{ maxZoomPixelRatio: 2, scrollToZoom: true }}
      carousel={{ finite: true, padding: '48px' }}
      controller={{ closeOnBackdropClick: true, closeOnPullDown: true }}
      animation={reduceMotion() ? { fade: 0, swipe: 0, zoom: 0 } : { fade: 200, swipe: 350 }}
      labels={{
        Previous: 'Anterior',
        Next: 'Siguiente',
        Close: 'Cerrar',
        'Zoom in': 'Acercar',
        'Zoom out': 'Alejar',
        Lightbox: 'Foto del producto',
        'Photo gallery': 'Fotos de productos',
      }}
      styles={{
        root: theme,
        captionsTitle: { fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: '1.5rem', fontWeight: 400 },
        captionsTitleContainer: { background: 'transparent' },
        captionsDescription: { fontFamily: 'var(--font-body)', fontSize: '0.9rem' },
      }}
    />
  )
}

function Caption({ product }: { product: Product }) {
  const { copied, handleInquiry } = useProductInquiry(product)
  const price = product.price === null ? 'Precio a consultar' : formatPrice(product.price)
  return (
    <span className="flex flex-col items-center gap-2 py-1">
      <span>{product.detail ? `${product.detail} · ${price}` : price}</span>
      <a
        href={instagramDmLink()}
        target="_blank"
        rel="noopener noreferrer"
        onClick={handleInquiry}
        className="inline-flex items-center gap-2 rounded-full bg-sage-500 px-4 py-2 text-sm font-medium text-cream-50 transition-colors hover:bg-sage-600"
      >
        <InstagramIcon className="h-4 w-4 shrink-0" />
        Consultar por Instagram
      </a>
      <span role="status" aria-live="polite" className="min-h-4 text-xs text-sage-200">
        {copied && 'Mensaje copiado, pegalo en el chat ✓'}
      </span>
    </span>
  )
}

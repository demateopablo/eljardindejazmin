import { formatPrice, type Product } from '../data/products'
import { instagramDmLink } from '../lib/instagram'
import { useProductInquiry } from '../lib/useProductInquiry'
import { InstagramIcon } from './Icons'

interface Props {
  product: Product
  /** Si se pasa, la foto se vuelve un botón que abre el lightbox (ver Catalogo). */
  onOpenImage?: (id: string) => void
}

/** Card de producto: foto en arco (el motivo de ventana de boticario del sitio), nombre, precio y consulta. */
export function ProductCard({ product, onOpenImage }: Props) {
  const { copied, handleInquiry } = useProductInquiry(product)
  const alt = product.detail ? `${product.name} — ${product.detail}` : product.name
  const [cover] = product.images
  const photos = product.images.length

  return (
    <article className="reveal group flex flex-col">
      <div className="arch relative aspect-[4/5] overflow-hidden bg-cream-200 shadow-[0_18px_30px_-18px_rgba(50,46,41,0.45)] ring-1 ring-cream-300/80 transition-shadow duration-500 group-hover:shadow-[0_22px_40px_-14px_rgba(224,145,63,0.45)]">
        {cover ? (
          onOpenImage ? (
            <button
              type="button"
              onClick={() => onOpenImage(product.id)}
              aria-label={photos > 1 ? `Ver las ${photos} fotos: ${product.name}` : `Ver más grande: ${product.name}`}
              className="block h-full w-full cursor-zoom-in focus-visible:outline-2 focus-visible:outline-offset-[-3px] focus-visible:outline-sage-500"
            >
              <ProductImage src={cover} alt={alt} />
            </button>
          ) : (
            <ProductImage src={cover} alt={alt} />
          )
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-3 bg-gradient-to-b from-cream-200 via-peach-200 to-blush-200 text-ink-500">
            <svg viewBox="0 0 40 56" className="h-14 w-10 opacity-50" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" aria-hidden="true">
              <path d="M20 4 C 24 11, 24 16, 20 20 C 16 16, 16 11, 20 4 Z" />
              <path d="M20 20 V 25 M8 25 H32 L31 52 H9 Z" />
            </svg>
            <span className="text-[11px] tracking-wide uppercase">[Foto pendiente]</span>
          </div>
        )}
        {/* luz cálida desde abajo, como si la vela estuviera prendida */}
        {cover && (
          <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-night-950/25 to-transparent" />
        )}
        {photos > 1 && (
          <span className="pointer-events-none absolute right-3 bottom-3 rounded-full bg-night-900/70 px-2 py-0.5 text-[11px] tracking-wide text-ember-200 backdrop-blur-sm">
            {photos} fotos
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col px-1 pt-4 text-center">
        {/* flex-1 acá empuja el botón al fondo para que las cards de una fila queden alineadas */}
        <div className="flex-1">
          <h3 className="font-display text-xl leading-tight font-medium text-ink-900 sm:text-[1.4rem]">{product.name}</h3>
          {product.detail && <p className="mt-1 text-[13px] leading-snug text-ink-500">{product.detail}</p>}

          {product.price === null ? (
            <p className="mt-2 font-hand text-xl text-gold-500">Precio a consultar</p>
          ) : (
            <p className="mt-2 font-display text-2xl text-sage-700">{formatPrice(product.price)}</p>
          )}
        </div>

        <a
          href={instagramDmLink()}
          target="_blank"
          rel="noopener noreferrer"
          onClick={handleInquiry}
          className="mt-3 inline-flex items-center justify-center gap-2 self-center rounded-full border border-sage-400 px-4 py-2 text-sm font-medium text-sage-700 transition-colors hover:border-sage-600 hover:bg-sage-600 hover:text-cream-50"
        >
          <InstagramIcon className="h-4 w-4 shrink-0" />
          Consultar
        </a>
        <p role="status" aria-live="polite" className="mt-1.5 min-h-4 text-xs text-sage-700">
          {copied && 'Mensaje copiado, pegalo en el chat ✓'}
        </p>
      </div>
    </article>
  )
}

function ProductImage({ src, alt }: { src: string; alt: string }) {
  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      decoding="async"
      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
    />
  )
}

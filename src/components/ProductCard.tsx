import { formatPrice, type Product } from '../data/products'
import { productInquiryMessage, whatsappLink } from '../lib/whatsapp'
import { WhatsAppIcon } from './Icons'

export function ProductCard({ product }: { product: Product }) {
  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-cream-300/70 bg-cream-50 shadow-[0_1px_2px_rgba(50,46,41,0.04)] transition-shadow hover:shadow-[0_6px_20px_rgba(50,46,41,0.08)]">
      <div className="relative aspect-square overflow-hidden bg-cream-200">
        {product.image ? (
          <img
            src={product.image}
            alt={product.imageAlt ?? (product.detail ? `${product.name} — ${product.detail}` : product.name)}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-gradient-to-br from-cream-200 via-peach-200 to-sage-100 text-ink-500">
            <svg viewBox="0 0 24 24" className="h-8 w-8 opacity-50" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true">
              <rect x="3" y="5" width="18" height="14" rx="2" />
              <circle cx="9" cy="10" r="1.6" />
              <path d="M21 16l-5-5-7 7" />
            </svg>
            <span className="text-xs tracking-wide uppercase">[Foto pendiente]</span>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col p-4">
        {/* flex-1 acá empuja el botón al fondo para que las cards de una fila queden alineadas */}
        <div className="flex-1">
          <h3 className="font-display text-xl leading-snug text-ink-900">{product.name}</h3>
          {product.detail && <p className="mt-0.5 text-sm text-ink-500">{product.detail}</p>}

          {product.price === null ? (
            <p className="mt-3 text-sm font-medium text-gold-500">Precio a consultar</p>
          ) : (
            <p className="mt-3 text-base font-medium text-sage-700">{formatPrice(product.price)}</p>
          )}
        </div>

        <a
          href={whatsappLink(productInquiryMessage(product.name, product.detail))}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-flex items-center justify-center gap-2 rounded-full bg-sage-500 px-4 py-2.5 text-sm font-medium text-cream-50 transition-colors hover:bg-sage-600"
        >
          <WhatsAppIcon className="h-4 w-4 shrink-0" />
          <span className="sm:hidden">Consultar</span>
          <span className="hidden sm:inline">Consultar por WhatsApp</span>
        </a>
      </div>
    </article>
  )
}

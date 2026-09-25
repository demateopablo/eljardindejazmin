import { lazy, Suspense, useState } from 'react'
import { categories, products, type CategoryId } from '../data/products'
import type { GallerySlide } from './ProductLightbox'
import { ProductCard } from './ProductCard'
import { SectionTitle } from './SectionTitle'

// Lazy: la biblioteca del lightbox (y su CSS) se bajan recién cuando alguien toca una foto
const ProductLightbox = lazy(() => import('./ProductLightbox'))

export function Catalogo() {
  const [active, setActive] = useState<CategoryId>(categories[0].id)
  /** Índice (en `slides`) de la foto abierta en el lightbox; null = cerrado */
  const [lightbox, setLightbox] = useState<number | null>(null)
  const current = categories.find((c) => c.id === active) ?? categories[0]
  const visible = products.filter((p) => p.category === active)
  // Todas las fotos de la categoría en fila: al abrir un producto se ven primero sus
  // fotos y, si seguís deslizando, las del siguiente.
  const slides: GallerySlide[] = visible.flatMap((product) =>
    product.images.map((src, i) => ({ product, src, n: i + 1, total: product.images.length })),
  )

  function selectCategory(id: CategoryId) {
    setActive(id)
    setLightbox(null)
  }

  function openImage(id: string) {
    const i = slides.findIndex((s) => s.product.id === id)
    if (i !== -1) setLightbox(i)
  }

  return (
    <section id="catalogo" className="py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionTitle
          eyebrow="Catálogo"
          title={
            <>
              Lo que <em>hacemos</em>
            </>
          }
          intro="Elegí lo que te guste y escribinos: te contamos disponibilidad, colores y tiempos. Los precios pueden variar."
        />

        {/* Tabs de categoría: scroll horizontal en celular */}
        <div
          role="tablist"
          aria-label="Categorías"
          className="mt-10 -mx-4 flex gap-1 overflow-x-auto px-4 pb-2 sm:mx-0 sm:justify-center sm:px-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {categories.map((c) => {
            const selected = c.id === active
            const count = products.filter((p) => p.category === c.id).length
            return (
              <button
                key={c.id}
                type="button"
                role="tab"
                id={`tab-${c.id}`}
                aria-selected={selected}
                aria-controls={`panel-${c.id}`}
                onClick={() => selectCategory(c.id)}
                className={`group relative shrink-0 px-4 pt-2 pb-3 font-display text-xl whitespace-nowrap transition-colors sm:text-2xl ${
                  selected ? 'text-ink-900 italic' : 'text-ink-500 hover:text-sage-700'
                }`}
              >
                {c.name}
                <sup className="ml-1 font-body text-[10px] not-italic text-gold-500">{count}</sup>
                {/* subrayado hecho a mano */}
                <svg
                  viewBox="0 0 100 8"
                  preserveAspectRatio="none"
                  aria-hidden="true"
                  className={`absolute inset-x-3 bottom-0.5 h-2 text-gold-400 transition-opacity duration-300 ${selected ? 'opacity-100' : 'opacity-0 group-hover:opacity-40 group-focus-visible:opacity-40'}`}
                >
                  <path d="M2 5 C 20 2, 40 7, 60 4 S 90 3, 98 5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                </svg>
              </button>
            )
          })}
        </div>

        <div role="tabpanel" id={`panel-${current.id}`} aria-labelledby={`tab-${current.id}`} className="mt-4">
          <p className="text-center text-sm font-light text-ink-500">{current.description}</p>

          {visible.length > 0 ? (
            <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 md:grid-cols-3 lg:grid-cols-4 lg:gap-x-8 lg:gap-y-14">
              {visible.map((p) => (
                <ProductCard key={p.id} product={p} onOpenImage={openImage} />
              ))}
            </div>
          ) : (
            <p className="mt-8 text-center text-ink-500">Muy pronto vas a ver productos acá.</p>
          )}
        </div>
      </div>

      {lightbox !== null && (
        <Suspense fallback={null}>
          <ProductLightbox slides={slides} index={lightbox} onClose={() => setLightbox(null)} />
        </Suspense>
      )}
    </section>
  )
}

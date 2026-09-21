import { useState } from 'react'
import { categories, products, type CategoryId } from '../data/products'
import { ProductCard } from './ProductCard'
import { Aromas } from './Aromas'
import { SectionTitle } from './SectionTitle'

export function Catalogo() {
  const [active, setActive] = useState<CategoryId>(categories[0].id)
  const current = categories.find((c) => c.id === active) ?? categories[0]
  const visible = products.filter((p) => p.category === active)

  return (
    <section id="catalogo" className="py-16 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionTitle
          eyebrow="Catálogo"
          title="Lo que hacemos"
          intro="Elegí lo que te guste y escribinos: te contamos disponibilidad, colores y tiempos. Los precios pueden variar."
        />

        {/* Tabs de categoría: chips con scroll horizontal en celular */}
        <div
          role="tablist"
          aria-label="Categorías"
          className="mt-10 -mx-4 flex gap-2 overflow-x-auto px-4 pb-2 sm:mx-0 sm:flex-wrap sm:justify-center sm:px-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {categories.map((c) => {
            const selected = c.id === active
            return (
              <button
                key={c.id}
                type="button"
                role="tab"
                id={`tab-${c.id}`}
                aria-selected={selected}
                aria-controls={`panel-${c.id}`}
                onClick={() => setActive(c.id)}
                className={`shrink-0 rounded-full border px-4 py-2 text-sm tracking-wide transition-colors ${
                  selected
                    ? 'border-sage-500 bg-sage-500 text-cream-50'
                    : 'border-cream-300 bg-cream-50 text-ink-500 hover:border-sage-300 hover:text-sage-700'
                }`}
              >
                {c.name}
              </button>
            )
          })}
        </div>

        <div
          role="tabpanel"
          id={`panel-${current.id}`}
          aria-labelledby={`tab-${current.id}`}
          className="mt-6"
        >
          <p className="text-center text-sm text-ink-500 font-light">{current.description}</p>

          {visible.length > 0 ? (
            <div className="mt-6 grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">
              {visible.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          ) : (
            <p className="mt-8 text-center text-ink-500">Muy pronto vas a ver productos acá.</p>
          )}
        </div>

        <Aromas />
      </div>
    </section>
  )
}

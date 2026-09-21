import { aromas } from '../data/products'

/**
 * Aromas disponibles, mostrados con los tags impresos que van colgados en cada
 * producto. Los aromas sin tag todavía se muestran como tarjeta de texto con el
 * mismo formato.
 */
export function Aromas() {
  return (
    <div className="mt-16">
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-xs tracking-[0.2em] text-gold-500 uppercase">Aromas</p>
        <h3 className="mt-2 font-display text-2xl italic text-sage-700 sm:text-3xl">
          Elegí el aroma que más te guste
        </h3>
        <p className="mt-3 text-sm leading-relaxed text-ink-500 font-light">
          Todos los productos se hacen con cualquiera de estos aromas. Cada uno va con su tag colgado.
        </p>
      </div>

      <ul className="mt-8 grid grid-cols-3 gap-3 sm:grid-cols-4 sm:gap-4 lg:grid-cols-5">
        {aromas.map((a) => (
          <li key={a.name}>
            {a.tag ? (
              <img
                src={a.tag}
                alt={`Tag del aroma ${a.name}`}
                loading="lazy"
                decoding="async"
                width="240"
                height="241"
                className="aspect-square w-full rounded-xl object-cover shadow-[0_2px_8px_rgba(50,46,41,0.08)]"
              />
            ) : (
              <div className="flex aspect-square w-full flex-col items-center justify-center rounded-xl border border-cream-300 bg-cream-50 p-3 text-center shadow-[0_2px_8px_rgba(50,46,41,0.06)]">
                <span className="font-display text-sm italic text-sage-600">El jardín de Jazmín</span>
                <span className="my-1.5 h-px w-8 bg-sage-300" aria-hidden="true" />
                <span className="font-display text-base leading-tight font-semibold text-sage-700">{a.name}</span>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}

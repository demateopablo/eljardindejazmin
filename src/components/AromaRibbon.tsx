import { aromas } from '../data/products'
import { JasmineFlower } from './Jasmine'

/**
 * Franja oscura con los nombres de los aromas pasando despacio, entre el hero y el
 * catálogo. Decorativa (aria-hidden): los aromas se listan de verdad en <Aromas />.
 * El contenido va duplicado para que el loop de -50 % no tenga salto.
 */
export function AromaRibbon() {
  const row = (
    <ul className="flex shrink-0 items-center">
      {aromas.map((a) => (
        <li key={a.name} className="flex items-center">
          <span className="px-6 font-display text-xl whitespace-nowrap text-ember-200 italic sm:text-2xl">{a.name}</span>
          <JasmineFlower className="h-4 w-4 text-ember-400/70" />
        </li>
      ))}
    </ul>
  )
  return (
    <div aria-hidden="true" className="relative overflow-hidden bg-night-900 py-4 sm:py-5">
      <div className="flex w-max animate-marquee">
        {row}
        {row}
      </div>
      <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-night-900 to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-night-900 to-transparent" />
    </div>
  )
}

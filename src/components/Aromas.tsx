import type { CSSProperties } from 'react'
import { aromas } from '../data/products'
import { SectionTitle } from './SectionTitle'
import { WaveEdge } from './WaveEdge'

/**
 * Aromas disponibles, de noche: los tags impresos que van en cada producto cuelgan
 * de un hilo y se mecen despacio con la luz de la vela. Los aromas sin tag todavía
 * se muestran como tarjeta de texto con el mismo formato.
 */
export function Aromas() {
  return (
    <section id="aromas" className="relative">
      <WaveEdge className="text-night-900" />
      <div className="relative overflow-hidden bg-night-900 pt-14 pb-24 sm:pt-20 sm:pb-28">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute top-0 left-1/2 h-[36rem] w-[60rem] -translate-x-1/2 -translate-y-1/3 rounded-full bg-[radial-gradient(ellipse,rgba(238,181,102,0.22),transparent_65%)]"
        />

        <div className="relative mx-auto max-w-6xl px-6">
          <SectionTitle
            tone="dark"
            eyebrow="Aromas"
            title={
              <>
                Elegí tu <em>aroma</em>
              </>
            }
            intro="Todos los productos se hacen con cualquiera de estos aromas. Cada uno va con su tag colgado."
          />

          <ul className="mx-auto mt-12 flex max-w-5xl flex-wrap justify-center gap-x-[5%] gap-y-4 sm:gap-x-[4%] lg:gap-x-[2.5%]">
            {aromas.map((a, i) => (
              <li key={a.name} className="flex w-[30%] flex-col items-center sm:w-[22%] lg:w-[18%]">
                {/* clavito + hilo, de largo variable para que no quede en fila de soldaditos */}
                <span className="h-1.5 w-1.5 rounded-full bg-gold-400 shadow-[0_0_6px_rgba(238,181,102,0.8)]" aria-hidden="true" />
                <div
                  className="hanging group flex w-full flex-col items-center"
                  style={
                    {
                      '--tilt': `${i % 2 ? 2.5 : -2.5}deg`,
                      '--sway': `${4.5 + (i % 3)}s`,
                      '--delay': `${-(i * 0.7)}s`,
                    } as CSSProperties
                  }
                >
                  {/* el hilo baja hasta el agujerito del tag (≈ 11 % del ancho desde arriba) */}
                  <span
                    className="relative z-10 w-px bg-gold-300/60"
                    style={{ height: `${26 + ((i * 7) % 22)}px`, marginBottom: '-11%' }}
                    aria-hidden="true"
                  />
                  {a.tag ? (
                    <img
                      src={a.tag}
                      alt={`Tag del aroma ${a.name}`}
                      loading="lazy"
                      decoding="async"
                      width="240"
                      height="241"
                      className="aspect-square w-full rounded-lg object-cover shadow-[0_14px_30px_-8px_rgba(0,0,0,0.6)] transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex aspect-square w-full flex-col items-center justify-center rounded-lg bg-cream-50 p-3 text-center shadow-[0_14px_30px_-8px_rgba(0,0,0,0.6)]">
                      <span className="font-display text-sm text-sage-600 italic">El jardín de Jazmín</span>
                      <span className="my-1.5 h-px w-8 bg-sage-300" aria-hidden="true" />
                      <span className="font-display text-base leading-tight font-semibold text-sage-700">{a.name}</span>
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <WaveEdge flip className="text-night-900" />
    </section>
  )
}

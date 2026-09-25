import { site } from '../data/site'
import { instagramDmLink } from '../lib/instagram'
import { CandleScene } from './CandleScene'
import { ArrowDownIcon, InstagramIcon } from './Icons'
import { JasmineFlower } from './Jasmine'

export function Hero() {
  return (
    <section id="inicio" className="relative overflow-hidden">
      {/* luz cálida detrás de la vela */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 left-1/2 h-[46rem] w-[46rem] -translate-y-1/3 rounded-full bg-[radial-gradient(circle,rgba(246,211,154,0.35),transparent_65%)] md:left-[62%]"
      />

      <div className="relative mx-auto grid max-w-6xl items-center gap-14 px-6 pt-10 pb-20 sm:pt-16 md:grid-cols-[1.15fr_0.85fr] md:gap-10 md:pb-28">
        <div className="text-center md:text-left">
          <p className="inline-flex items-center gap-2 text-[11px] tracking-[0.28em] text-gold-500 uppercase sm:text-xs">
            <JasmineFlower className="h-4 w-4 text-gold-400" />
            Aromaterapia artesanal
          </p>

          {/* site.tagline, partido a mano para la tipografía */}
          <h1 className="mt-6 font-display text-[3.6rem] leading-[0.92] font-medium text-ink-900 sm:text-7xl lg:text-[5.5rem]">
            Calidez <br className="sm:hidden" />
            <span className="font-normal text-sage-600 italic">y aromas</span>
            <br />
            para tu hogar
          </h1>

          <p className="mx-auto mt-6 max-w-md text-base leading-relaxed font-light text-ink-500 sm:text-lg md:mx-0">
            Velas de diseño, difusores, wax melts y jabones hechos a mano en {site.city}.
          </p>

          <p className="mt-4 -rotate-2 font-hand text-2xl text-sage-600">{site.subtagline} ♡</p>

          <div className="mt-9 flex flex-col items-center gap-4 sm:flex-row sm:justify-center md:justify-start">
            <a
              href="#catalogo"
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-night-900 px-8 py-3.5 text-sm font-medium tracking-wide text-ember-200 shadow-[0_10px_30px_-10px_rgba(31,32,25,0.6)] transition-colors hover:bg-night-800 sm:w-auto"
            >
              Ver catálogo
              <ArrowDownIcon className="h-4 w-4" />
            </a>
            <a
              href={instagramDmLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-2 py-2 text-sm font-medium text-sage-700 underline decoration-sage-300 decoration-1 underline-offset-[6px] transition-colors hover:decoration-sage-600"
            >
              <InstagramIcon className="h-4 w-4" />
              Escribinos por Instagram
            </a>
          </div>
        </div>

        <CandleScene />
      </div>
    </section>
  )
}

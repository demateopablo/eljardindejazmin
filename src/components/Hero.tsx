import logo from '../assets/logo.webp'
import { site } from '../data/site'
import { instagramDmLink } from '../lib/instagram'
import { ArrowDownIcon, InstagramIcon } from './Icons'
import { BotanicalDivider } from './BotanicalDivider'

export function Hero() {
  return (
    <section id="inicio" className="relative overflow-hidden">
      {/* manchas suaves de color, muy sutiles, para que el crema no quede plano */}
      <div aria-hidden="true" className="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full bg-sage-100 blur-3xl" />
      <div aria-hidden="true" className="pointer-events-none absolute -right-20 top-40 h-64 w-64 rounded-full bg-blush-200 blur-3xl" />

      <div className="relative mx-auto flex max-w-3xl flex-col items-center px-6 pt-14 pb-16 text-center sm:pt-20 sm:pb-24">
        <img
          src={logo}
          alt={`${site.name} — ${site.descriptor}`}
          className="w-64 max-w-full sm:w-80"
          width="743"
          height="455"
          fetchPriority="high"
        />

        <h1 className="mt-8 font-display text-4xl italic leading-tight text-sage-700 sm:text-5xl">
          {site.tagline}
        </h1>
        <p className="mt-3 text-sm tracking-[0.18em] text-ink-500 uppercase">
          {site.subtagline}
        </p>

        <p className="mt-6 max-w-md text-base leading-relaxed text-ink-500 font-light">
          Velas de diseño, difusores, wax melts y jabones hechos a mano en {site.city}.
        </p>

        <div className="mt-9 flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:gap-4">
          <a
            href="#catalogo"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-sage-500 px-7 py-3 text-sm font-medium tracking-wide text-cream-50 shadow-sm transition-colors hover:bg-sage-600"
          >
            Ver catálogo
            <ArrowDownIcon className="h-4 w-4" />
          </a>
          <a
            href={instagramDmLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-full border border-sage-400 bg-cream-50/60 px-7 py-3 text-sm font-medium tracking-wide text-sage-700 transition-colors hover:bg-sage-100"
          >
            <InstagramIcon className="h-4 w-4" />
            Escribinos por Instagram
          </a>
        </div>

        <BotanicalDivider className="mt-14" />
      </div>
    </section>
  )
}

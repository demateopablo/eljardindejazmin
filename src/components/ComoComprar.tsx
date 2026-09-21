import { site } from '../data/site'
import { whatsappLink, WA_GENERIC_MESSAGE } from '../lib/whatsapp'
import { WhatsAppIcon } from './Icons'
import { SectionTitle } from './SectionTitle'
import { BotanicalDivider } from './BotanicalDivider'

const steps = [
  {
    n: '1',
    title: 'Elegí en el catálogo',
    text: 'Mirá los productos y anotá cuál te gustó. Si tenés dudas sobre aromas o colores, preguntanos.',
  },
  {
    n: '2',
    title: 'Escribinos por WhatsApp',
    text: 'Te confirmamos disponibilidad, precio y tiempos. Si es un regalo, también lo armamos.',
  },
  {
    n: '3',
    title: 'Coordinamos la entrega',
    text: `Entregas y retiros en ${site.city}, a coordinar por WhatsApp.`,
  },
]

export function ComoComprar() {
  return (
    <section id="como-comprar" className="bg-cream-50 py-16 sm:py-24">
      <div className="mx-auto max-w-6xl px-6">
        <SectionTitle
          eyebrow="Cómo comprar"
          title="Simple, como charlar por WhatsApp"
          intro="No tenemos tienda online ni local abierto al público: trabajamos desde casa y vendemos directo."
        />

        <ol className="mx-auto mt-12 grid max-w-4xl gap-8 sm:grid-cols-3">
          {steps.map((s) => (
            <li key={s.n} className="text-center">
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-sage-300 font-display text-xl text-sage-600">
                {s.n}
              </span>
              <h3 className="mt-4 font-display text-xl text-ink-900">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-500">{s.text}</p>
            </li>
          ))}
        </ol>

        <BotanicalDivider className="mt-12" />

        <dl className="mx-auto mt-10 grid max-w-2xl gap-6 text-center sm:grid-cols-3">
          <div>
            <dt className="text-xs tracking-[0.2em] text-gold-500 uppercase">Zona</dt>
            <dd className="mt-1 text-ink-700">
              {site.city}, {site.province}
            </dd>
          </div>
          <div>
            <dt className="text-xs tracking-[0.2em] text-gold-500 uppercase">Entregas</dt>
            <dd className="mt-1 text-ink-700">Retiros y entregas a coordinar</dd>
          </div>
          <div>
            <dt className="text-xs tracking-[0.2em] text-gold-500 uppercase">Horario de contacto</dt>
            <dd className="mt-1 text-ink-700">Todos los días de {site.contactHours}</dd>
          </div>
        </dl>

        <div className="mt-10 text-center">
          <a
            href={whatsappLink(WA_GENERIC_MESSAGE)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-sage-500 px-7 py-3 text-sm font-medium tracking-wide text-cream-50 shadow-sm transition-colors hover:bg-sage-600"
          >
            <WhatsAppIcon className="h-4 w-4" />
            Escribinos por WhatsApp
          </a>
        </div>
      </div>
    </section>
  )
}

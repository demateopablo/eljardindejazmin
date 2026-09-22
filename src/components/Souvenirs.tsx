import { eventInquiryMessage, instagramDmLink } from '../lib/instagram'
import { useInquiry } from '../lib/useProductInquiry'
import { CakeIcon, GiftIcon, HeartIcon, InstagramIcon, RingsIcon } from './Icons'
import { SectionTitle } from './SectionTitle'

/*
 * Pedidos personalizados para eventos. Solo ejemplos de ocasiones e invitación a
 * escribir: no publicamos mínimos, plazos ni precios (se conversan por DM), ni
 * prometemos servicios que no tenemos confirmados (etiquetas con nombre, packaging…).
 */
const occasions = [
  {
    title: 'Cumpleaños',
    text: 'Infantiles y de grandes: un detalle con el aroma y los colores de la fiesta.',
    Icon: CakeIcon,
  },
  {
    title: 'Aniversarios y casamientos',
    text: 'Para que cada mesa se lleve un recuerdo del día.',
    Icon: RingsIcon,
  },
  {
    title: 'Baby shower, bautismos y comuniones',
    text: 'Souvenirs delicados para celebrar las llegadas y los primeros pasos.',
    Icon: HeartIcon,
  },
  {
    title: 'Empresas y regalos corporativos',
    text: 'Fin de año, agradecimientos a clientes o a tu equipo, con un toque hecho a mano.',
    Icon: GiftIcon,
  },
]

const steps = [
  {
    n: '1',
    title: 'Elegís el producto',
    text: 'Velas, wax melts, jabones o difusores del catálogo, en versión souvenir.',
  },
  {
    n: '2',
    title: 'Elegís aroma y colores',
    text: 'Cualquiera de nuestros aromas (los ves en el catálogo) y los tonos que combinen con tu evento.',
  },
  {
    n: '3',
    title: 'Nos contás fecha y cantidad',
    text: 'Cantidades, precio y tiempos de armado los conversamos por mensaje. Consultanos sin compromiso.',
  },
]

export function Souvenirs() {
  const { copied, handleInquiry } = useInquiry(eventInquiryMessage())

  return (
    <section id="souvenirs" className="bg-blush-200/40 py-16 sm:py-24">
      <div className="mx-auto max-w-6xl px-6">
        <SectionTitle
          eyebrow="Pedidos personalizados"
          title="Souvenirs para tus celebraciones"
          intro="Armamos recuerdos con aroma para que tus invitados se lleven un pedacito de la fiesta a casa. Contanos la ocasión y lo pensamos juntos."
        />

        <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {occasions.map(({ title, text, Icon }) => (
            <li
              key={title}
              className="flex flex-col items-center gap-3 rounded-2xl border border-cream-300/70 bg-cream-50 px-5 py-6 text-center"
            >
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-sage-100 text-sage-700">
                <Icon className="h-6 w-6" />
              </span>
              <h3 className="font-display text-xl leading-snug text-ink-900">{title}</h3>
              <p className="text-sm leading-relaxed text-ink-500">{text}</p>
            </li>
          ))}
        </ul>

        <ol className="mx-auto mt-14 grid max-w-4xl gap-8 sm:grid-cols-3">
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

        <div className="mt-10 text-center">
          <a
            href={instagramDmLink()}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleInquiry}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-sage-500 px-7 py-3 text-sm font-medium tracking-wide text-cream-50 shadow-sm transition-colors hover:bg-sage-600"
          >
            <InstagramIcon className="h-4 w-4" />
            Contanos tu evento
          </a>
          <p role="status" aria-live="polite" className="mt-3 min-h-5 text-sm text-sage-700">
            {copied && 'Mensaje copiado, pegalo en el chat ✓'}
          </p>
        </div>
      </div>
    </section>
  )
}

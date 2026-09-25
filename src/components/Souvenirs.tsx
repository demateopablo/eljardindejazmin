import { eventInquiryMessage, instagramDmLink } from '../lib/instagram'
import { useInquiry } from '../lib/useProductInquiry'
import { CakeIcon, GiftIcon, HeartIcon, InstagramIcon, RingsIcon } from './Icons'
import { SectionTitle } from './SectionTitle'
import { WaveEdge } from './WaveEdge'

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
    <section id="souvenirs" className="relative">
      <WaveEdge className="text-blush-100" />
      <div className="bg-blush-100 py-16 sm:py-24">
        <div className="mx-auto max-w-6xl px-6">
          <SectionTitle
            eyebrow="Pedidos personalizados"
            title={
              <>
                Souvenirs para <em>tus celebraciones</em>
              </>
            }
            intro="Armamos recuerdos con aroma para que tus invitados se lleven un pedacito de la fiesta a casa. Contanos la ocasión y lo pensamos juntos."
          />

          <ul className="mt-12 grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
            {occasions.map(({ title, text, Icon }) => (
              <li
                key={title}
                className="reveal flex flex-col items-center gap-3 rounded-t-[5rem] rounded-b-2xl bg-cream-50 sm:rounded-t-[8rem] px-4 pt-10 pb-6 text-center shadow-[0_14px_30px_-20px_rgba(50,46,41,0.4)] sm:px-6 sm:pt-14"
              >
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-blush-200 text-sage-700">
                  <Icon className="h-6 w-6" />
                </span>
                <h3 className="font-display text-lg leading-snug font-medium text-ink-900 sm:text-xl">{title}</h3>
                <p className="text-[13px] leading-relaxed text-ink-500 sm:text-sm">{text}</p>
              </li>
            ))}
          </ul>

          <div className="relative mx-auto mt-16 max-w-4xl">
            {/* hilo punteado que une los pasos (solo en pantallas anchas) */}
            <div aria-hidden="true" className="absolute top-6 right-[16%] left-[16%] hidden border-t border-dashed border-gold-400/60 sm:block" />
            <ol className="grid gap-10 sm:grid-cols-3 sm:gap-8">
            {steps.map((s) => (
              <li key={s.n} className="reveal relative text-center">
                <span className="relative inline-flex h-12 w-12 items-center justify-center rounded-full bg-blush-100 font-hand text-4xl text-gold-500">
                  {s.n}
                </span>
                <h3 className="mt-3 font-display text-xl font-medium text-ink-900">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-500">{s.text}</p>
              </li>
            ))}
            </ol>
          </div>

          <div className="mt-12 text-center">
            <a
              href={instagramDmLink()}
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleInquiry}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-night-900 px-8 py-3.5 text-sm font-medium tracking-wide text-ember-200 shadow-[0_10px_30px_-10px_rgba(31,32,25,0.6)] transition-colors hover:bg-night-800"
            >
              <InstagramIcon className="h-4 w-4" />
              Contanos tu evento
            </a>
            <p role="status" aria-live="polite" className="mt-3 min-h-5 text-sm text-sage-700">
              {copied && 'Mensaje copiado, pegalo en el chat ✓'}
            </p>
          </div>
        </div>
      </div>
      <WaveEdge flip className="text-blush-100" />
    </section>
  )
}

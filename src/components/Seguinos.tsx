import { site } from '../data/site'
import { FacebookIcon, InstagramIcon } from './Icons'
import { SectionTitle } from './SectionTitle'

const socials = [
  {
    name: 'Instagram',
    label: `@${site.instagramHandle}`,
    href: site.instagramUrl,
    Icon: InstagramIcon,
  },
  {
    name: 'Facebook',
    label: 'eljardindejazmindeco',
    href: site.facebookUrl,
    Icon: FacebookIcon,
  },
]

export function Seguinos() {
  return (
    <section id="seguinos" className="py-16 sm:py-24">
      <div className="mx-auto max-w-6xl px-6">
        <SectionTitle
          eyebrow="Seguinos"
          title="Mirá las novedades"
          intro="Subimos los productos nuevos, aromas de temporada y algunas escenas del jardín. Por Instagram también nos escribís para hacer tu pedido."
        />

        <ul className="mx-auto mt-10 grid max-w-xl gap-4 sm:grid-cols-2">
          {socials.map(({ name, label, href, Icon }) => (
            <li key={name}>
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center gap-3 rounded-2xl border border-cream-300/70 bg-cream-50 px-4 py-6 text-center transition-colors hover:border-sage-300 hover:bg-sage-100/40"
              >
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-sage-100 text-sage-700">
                  <Icon className="h-6 w-6" />
                </span>
                <span className="font-display text-lg text-ink-900">{name}</span>
                <span className="text-sm text-ink-500 break-all">{label}</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

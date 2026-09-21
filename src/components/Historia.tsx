import { site } from '../data/site'
import { SectionTitle } from './SectionTitle'

/*
 * Copy en primera persona, cálido y casero. Se basa solo en lo que sabemos:
 * el nombre viene de Jazmín (hija de la dueña), la dueña es docente y
 * emprendedora, todo se hace a mano en casa, en Tres Arroyos.
 * TODO: revisar/ajustar con la dueña antes de publicar.
 */
export function Historia() {
  return (
    <section id="historia" className="bg-cream-50 py-16 sm:py-24">
      <div className="mx-auto max-w-6xl px-6">
        <SectionTitle eyebrow="Nuestra historia" title="Un jardín que nació en casa" />

        <div className="mx-auto mt-10 max-w-2xl space-y-5 text-center leading-relaxed text-ink-700">
          <p>
            El Jardín de Jazmín lleva el nombre de Jazmín, mi hija. Empezó como una forma de
            llenar nuestra casa de calidez y aromas, y de a poquito se convirtió en este pequeño
            emprendimiento que hoy comparto con ustedes desde {site.city}.
          </p>
          <p>
            Soy docente y emprendedora. Cada vela, difusor, wax melt y jabón lo hago yo, a mano,
            eligiendo aromas que acompañen esos momentos simples: un libro, un mate, una tarde
            de lluvia, una manta tejida en el sillón.
          </p>
          <p>
            No somos una fábrica: somos un proyecto familiar que crece con cada persona que se
            lleva un pedacito de este jardín a su hogar.
          </p>
        </div>

        <p className="mt-10 text-center font-display text-2xl italic text-sage-600">
          "{site.subtagline}"
        </p>
      </div>
    </section>
  )
}

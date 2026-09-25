import { site } from '../data/site'
import { JasmineSprig } from './Jasmine'
import { SectionTitle } from './SectionTitle'

/*
 * Copy en primera persona, cálido y casero. Se basa solo en lo que sabemos:
 * el nombre viene de Jazmín (hija de la dueña), la dueña es docente y
 * emprendedora, todo se hace a mano en casa, en Tres Arroyos.
 * Se presenta como una carta en papel, con una ramita "prensada" en la esquina.
 * TODO: revisar/ajustar con la dueña antes de publicar.
 */
export function Historia() {
  return (
    <section id="historia" className="overflow-hidden bg-sage-100/70 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-6">
        <SectionTitle
          eyebrow="Nuestra historia"
          title={
            <>
              Un jardín que <em>nació en casa</em>
            </>
          }
        />

        <article className="reveal relative mx-auto mt-12 max-w-2xl -rotate-[0.6deg] rounded-sm bg-cream-50 px-7 pt-12 pb-10 shadow-[0_2px_0_rgba(50,46,41,0.04),0_24px_50px_-24px_rgba(50,46,41,0.45)] sm:px-14 sm:pt-16 sm:pb-14">
          <JasmineSprig className="pointer-events-none absolute -top-8 -right-6 w-36 rotate-12 text-sage-400 sm:-right-10 sm:w-44" />

          <div className="relative space-y-5 text-[1.05rem] leading-8 text-ink-700">
            <p className="first-letter:float-left first-letter:mt-1 first-letter:mr-2 first-letter:font-display first-letter:text-6xl first-letter:leading-[0.8] first-letter:text-sage-600">
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

          <p className="relative mt-8 text-right font-hand text-3xl leading-tight text-sage-600">{site.subtagline}</p>
        </article>
      </div>
    </section>
  )
}

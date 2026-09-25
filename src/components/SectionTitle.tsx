import type { ReactNode } from 'react'
import { JasmineFlower } from './Jasmine'

interface Props {
  eyebrow?: string
  /** Puede llevar un <em> para la parte en itálica */
  title: ReactNode
  intro?: string
  /** "dark" para secciones de noche (texto claro) */
  tone?: 'light' | 'dark'
}

export function SectionTitle({ eyebrow, title, intro, tone = 'light' }: Props) {
  const dark = tone === 'dark'
  return (
    <div className="reveal mx-auto max-w-2xl text-center">
      {eyebrow && (
        <p className={`flex items-center justify-center gap-3 text-[11px] tracking-[0.28em] uppercase ${dark ? 'text-ember-300' : 'text-gold-500'}`}>
          <span className={`h-px w-8 ${dark ? 'bg-ember-300/40' : 'bg-gold-300'}`} aria-hidden="true" />
          <JasmineFlower className="h-3.5 w-3.5" />
          {eyebrow}
          <JasmineFlower className="h-3.5 w-3.5" />
          <span className={`h-px w-8 ${dark ? 'bg-ember-300/40' : 'bg-gold-300'}`} aria-hidden="true" />
        </p>
      )}
      <h2
        className={`mt-4 font-display text-4xl leading-[1.05] font-medium sm:text-5xl [&_em]:font-normal [&_em]:italic ${
          dark ? 'text-cream-50 [&_em]:text-ember-300' : 'text-ink-900 [&_em]:text-sage-600'
        }`}
      >
        {title}
      </h2>
      {intro && <p className={`mt-5 leading-relaxed font-light ${dark ? 'text-cream-200/80' : 'text-ink-500'}`}>{intro}</p>}
    </div>
  )
}

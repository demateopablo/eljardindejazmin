interface Props {
  eyebrow?: string
  title: string
  intro?: string
}

export function SectionTitle({ eyebrow, title, intro }: Props) {
  return (
    <div className="mx-auto max-w-2xl text-center">
      {eyebrow && (
        <p className="text-xs tracking-[0.2em] text-gold-500 uppercase">{eyebrow}</p>
      )}
      <h2 className="mt-2 font-display text-3xl italic text-sage-700 sm:text-4xl">{title}</h2>
      {intro && <p className="mt-4 leading-relaxed text-ink-500 font-light">{intro}</p>}
    </div>
  )
}

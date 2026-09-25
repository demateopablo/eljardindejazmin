/**
 * Borde orgánico entre una banda de color y la siguiente (en vez de un corte recto).
 * El color sale de `text-*`; `flip` lo da vuelta para el borde de abajo.
 */
export function WaveEdge({ className = '', flip = false }: { className?: string; flip?: boolean }) {
  return (
    <svg
      viewBox="0 0 1200 40"
      preserveAspectRatio="none"
      aria-hidden="true"
      className={`-my-px block h-5 w-full sm:h-8 ${flip ? 'rotate-180' : ''} ${className}`}
    >
      <path d="M0 40 V22 C 140 4, 260 36, 420 22 S 700 2, 860 18 S 1100 38, 1200 16 V40 Z" fill="currentColor" />
    </svg>
  )
}

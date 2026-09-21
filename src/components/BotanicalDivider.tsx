/**
 * Separador botánico de línea fina (ramita con hojas), en sintonía con la
 * rama de jazmín del logo. Usar con moderación.
 */
export function BotanicalDivider({ className = '' }: { className?: string }) {
  return (
    <div className={`flex justify-center text-sage-400 ${className}`} aria-hidden="true">
      <svg viewBox="0 0 200 28" width="200" height="28" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
        {/* tallo */}
        <path d="M8 14 C 60 14, 140 14, 192 14" />
        {/* hojas izquierda */}
        <path d="M52 14 c -6 -8, -14 -8, -18 -2 c 6 5, 14 5, 18 2 z" />
        <path d="M68 14 c 2 8, 10 9, 15 4 c -5 -6, -12 -7, -15 -4 z" />
        {/* centro: capullo de jazmín */}
        <circle cx="100" cy="14" r="3.2" />
        <path d="M100 10.8 v -3.5 M103 12.2 l 2.5 -2.5 M97 12.2 l -2.5 -2.5" />
        {/* hojas derecha */}
        <path d="M132 14 c -2 -8, -10 -9, -15 -4 c 5 6, 12 7, 15 4 z" />
        <path d="M148 14 c 6 8, 14 8, 18 2 c -6 -5, -14 -5, -18 -2 z" />
      </svg>
    </div>
  )
}

/**
 * Jazmín en línea fina, en sintonía con la rama del logo (sin copiarla: el logo no
 * se recrea). Flor de 5 pétalos + ramita con hojas y capullos. Heredan currentColor.
 */

export function JasmineFlower({ className = '', filled = false }: { className?: string; filled?: boolean }) {
  return (
    <svg viewBox="-12 -12 24 24" className={className} aria-hidden="true">
      <Flower filled={filled} />
    </svg>
  )
}

function Flower({ filled, x = 0, y = 0, r = 0, s = 1 }: { filled?: boolean; x?: number; y?: number; r?: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${r}) scale(${s})`}>
      {[0, 72, 144, 216, 288].map((a) => (
        <path
          key={a}
          d="M0 -1.6 C 3.2 -4.5, 3 -9.5, 0 -10.5 C -3 -9.5, -3.2 -4.5, 0 -1.6 Z"
          transform={`rotate(${a})`}
          fill={filled ? 'currentColor' : 'none'}
          fillOpacity={filled ? 0.18 : undefined}
          stroke="currentColor"
          strokeWidth={0.9 / s}
          strokeLinejoin="round"
        />
      ))}
      <circle r="1.3" fill="currentColor" />
    </g>
  )
}

function Leaf({ x, y, r, s = 1 }: { x: number; y: number; r: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${r}) scale(${s})`}>
      <path d="M0 0 C 5 -4, 14 -4, 20 0 C 14 4, 5 4, 0 0 Z" fill="currentColor" fillOpacity="0.12" stroke="currentColor" strokeWidth="0.9" />
      <path d="M1 0 H 17" stroke="currentColor" strokeWidth="0.6" />
    </g>
  )
}

function Bud({ x, y, r }: { x: number; y: number; r: number }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${r})`}>
      <path d="M0 0 C 2.5 -3, 2.5 -8, 0 -10 C -2.5 -8, -2.5 -3, 0 0 Z" fill="none" stroke="currentColor" strokeWidth="0.9" />
      <path d="M0 0 V 5" stroke="currentColor" strokeWidth="0.9" />
    </g>
  )
}

/** Ramita diagonal (≈ 3:2). Útil para enmarcar esquinas. */
export function JasmineSprig({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 180 120" className={className} fill="none" strokeLinecap="round" aria-hidden="true">
      <path d="M6 112 C 40 96, 70 70, 96 52 S 150 20, 172 10" stroke="currentColor" strokeWidth="1.1" />
      <path d="M58 80 C 56 66, 62 56, 70 50" stroke="currentColor" strokeWidth="0.9" />
      <path d="M118 36 C 124 46, 124 56, 120 64" stroke="currentColor" strokeWidth="0.9" />
      <Leaf x={24} y={104} r={-70} />
      <Leaf x={40} y={94} r={20} s={0.9} />
      <Leaf x={84} y={60} r={-80} s={0.85} />
      <Leaf x={104} y={46} r={15} s={0.8} />
      <Leaf x={140} y={26} r={-60} s={0.75} />
      <Flower filled x={72} y={46} r={10} s={1.1} />
      <Flower filled x={120} y={68} r={-20} s={0.95} />
      <Flower filled x={166} y={10} r={30} s={0.85} />
      <Bud x={150} y={22} r={40} />
      <Bud x={96} y={50} r={-25} />
    </svg>
  )
}

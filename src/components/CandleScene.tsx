import type { CSSProperties } from 'react'
import { JasmineSprig } from './Jasmine'

/*
 * Vela encendida dentro de una ventana en arco, de noche: la llama titila, el
 * aroma sube como humo y flotan motas de luz. Todo SVG/CSS (sin imágenes ni JS),
 * transform/opacity nada más, y quieto con prefers-reduced-motion.
 */

/** Motas de luz: posición (%), desvío horizontal, duración y retraso. Fijas para que no "salten" entre renders. */
const motes = [
  { left: 22, top: 70, dx: 10, dur: 8, delay: 0 },
  { left: 34, top: 58, dx: -8, dur: 7, delay: 2.5 },
  { left: 64, top: 64, dx: 14, dur: 9, delay: 1 },
  { left: 76, top: 52, dx: -12, dur: 7.5, delay: 4 },
  { left: 48, top: 44, dx: 6, dur: 10, delay: 3 },
  { left: 58, top: 78, dx: -6, dur: 8.5, delay: 5.5 },
  { left: 28, top: 40, dx: 8, dur: 9.5, delay: 6 },
  { left: 70, top: 34, dx: -10, dur: 8, delay: 7 },
]

export function CandleScene({ className = '' }: { className?: string }) {
  return (
    <div style={{ '--arch-b': '2rem' } as CSSProperties} className={`relative mx-auto w-full max-w-[300px] sm:max-w-[340px] ${className}`}>
      <div className="arch relative aspect-[4/5] overflow-hidden bg-gradient-to-b from-night-700 via-night-900 to-night-950 shadow-[0_30px_60px_-20px_rgba(31,32,25,0.55)] ring-1 ring-gold-400/30">
        {/* marco interior, como una ventana de boticario */}
        <div className="arch absolute inset-3 border border-gold-300/20" aria-hidden="true" />

        {/* halo de luz de la llama */}
        <div
          aria-hidden="true"
          className="absolute top-[48%] left-1/2 aspect-square w-[95%] -translate-x-1/2 -translate-y-1/2"
        >
          <div className="h-full w-full animate-glow rounded-full bg-[radial-gradient(circle,rgba(246,211,154,0.5)_0%,rgba(238,181,102,0.16)_35%,transparent_68%)]" />
        </div>

        {motes.map((m, i) => (
          <span
            key={i}
            aria-hidden="true"
            className="mote absolute h-[3px] w-[3px] rounded-full bg-ember-200 shadow-[0_0_6px_rgba(251,230,194,0.9)]"
            style={{ left: `${m.left}%`, top: `${m.top}%`, '--dx': `${m.dx}px`, '--dur': `${m.dur}s`, '--delay': `${m.delay}s` } as CSSProperties}
          />
        ))}

        <svg viewBox="0 0 240 300" className="absolute inset-0 h-full w-full" role="img" aria-label="Vela encendida en un vaso, con el aroma subiendo">
          <defs>
            <linearGradient id="cs-wax" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0" stopColor="#fbe6c2" />
              <stop offset="0.35" stopColor="#f3dedb" />
              <stop offset="1" stopColor="#d9b8a8" />
            </linearGradient>
            <radialGradient id="cs-flame" cx="0.5" cy="0.72" r="0.6">
              <stop offset="0" stopColor="#fffaf0" />
              <stop offset="0.35" stopColor="#fbe6c2" />
              <stop offset="0.7" stopColor="#eeb566" />
              <stop offset="1" stopColor="#e0913f" stopOpacity="0" />
            </radialGradient>
            <linearGradient id="cs-glass" x1="0" x2="1">
              <stop offset="0" stopColor="#fff" stopOpacity="0.14" />
              <stop offset="0.25" stopColor="#fff" stopOpacity="0.03" />
              <stop offset="0.8" stopColor="#fff" stopOpacity="0.02" />
              <stop offset="1" stopColor="#fff" stopOpacity="0.12" />
            </linearGradient>
          </defs>

          {/* mesa y sombra */}
          <path d="M20 268 H 220" stroke="#dcc9a3" strokeOpacity="0.25" />
          <ellipse cx="120" cy="268" rx="62" ry="6" fill="#000" fillOpacity="0.35" />
          <ellipse cx="120" cy="268" rx="90" ry="9" fill="#eeb566" fillOpacity="0.08" />

          {/* cera */}
          <path d="M79.5 182 L82.5 258 Q83 263 88 263 H152 Q157 263 157.5 258 L160.5 182 Z" fill="url(#cs-wax)" />
          <ellipse cx="120" cy="182" rx="40.5" ry="6" fill="#fbe6c2" />
          <ellipse cx="120" cy="182" rx="18" ry="2.6" fill="#fffaf0" fillOpacity="0.8" />

          {/* etiqueta (sin texto: no recreamos el logo) */}
          <rect x="97" y="208" width="46" height="36" rx="1.5" fill="#fbf9f4" fillOpacity="0.92" />
          <g stroke="#7a8b6f" strokeWidth="0.8" fill="none" strokeLinecap="round">
            <path d="M104 220 C 112 214, 126 214, 136 219" />
            <circle cx="112" cy="216.5" r="1.6" />
            <circle cx="126" cy="215.5" r="1.4" />
          </g>
          <path d="M106 229 H134 M110 235 H130" stroke="#b08f55" strokeWidth="0.8" strokeOpacity="0.7" />

          {/* vaso */}
          <path d="M76 150 L80 258 Q80.6 266 88 266 H152 Q159.4 266 160 258 L164 150" fill="url(#cs-glass)" stroke="#fbf9f4" strokeOpacity="0.35" strokeWidth="1.2" />
          <ellipse cx="120" cy="150" rx="44" ry="5" fill="none" stroke="#fbf9f4" strokeOpacity="0.3" strokeWidth="1" />
          <path d="M84 160 L87 250" stroke="#fff" strokeOpacity="0.18" strokeWidth="3" strokeLinecap="round" />

          {/* mecha y llama */}
          <path d="M120 182 V 171" stroke="#322e29" strokeWidth="1.6" strokeLinecap="round" />
          <g className="animate-flicker" style={{ transformBox: 'fill-box', transformOrigin: '50% 100%' }}>
            <path d="M120 126 C 129 142, 132 157, 120 172 C 108 157, 111 142, 120 126 Z" fill="url(#cs-flame)" />
            <path d="M120 150 C 124 158, 124 164, 120 169 C 116 164, 116 158, 120 150 Z" fill="#fffaf0" fillOpacity="0.9" />
          </g>

          {/* aroma subiendo */}
          <g fill="none" stroke="#fbe6c2" strokeWidth="1.1" strokeLinecap="round" strokeOpacity="0.55">
            <path className="smoke" d="M120 120 c -7 -9, 7 -17, 0 -26 c -7 -9, 7 -17, 0 -26" />
            <path className="smoke" style={{ animationDelay: '2s' }} d="M117 118 c 6 -9, -8 -16, -1 -25 c 7 -9, -6 -16, 1 -25" />
            <path className="smoke" style={{ animationDelay: '4s' }} d="M123 119 c -5 -8, 9 -15, 2 -24 c -7 -9, 6 -17, -1 -26" />
          </g>
        </svg>
      </div>

      {/* ramitas de jazmín asomando por el marco */}
      <JasmineSprig className="pointer-events-none absolute -top-6 -left-10 w-40 -rotate-12 text-sage-500 sm:-left-14 sm:w-48" />
      <JasmineSprig className="pointer-events-none absolute -right-8 -bottom-4 w-32 rotate-[165deg] text-sage-500 sm:-right-12 sm:w-40" />
    </div>
  )
}

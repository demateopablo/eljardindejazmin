import { useState } from 'react'

/** path público → data URL local */
export type Previews = Map<string, string>

/**
 * Miniatura de producto. Si hay preview local (foto pendiente o subida en esta
 * sesión) se usa esa y NO se pide la URL pública: hasta que termine el deploy
 * daría 404 y ese 404 podría quedar cacheado en el CDN. Si igual falla (foto recién
 * publicada desde otro dispositivo), muestra "Publicando…" en vez de un ícono roto.
 */
export function Thumb({
  image,
  previews,
  className = '',
}: {
  image: string | null | undefined
  previews: Previews
  className?: string
}) {
  const src = image ? (previews.get(image) ?? image) : null
  const [failed, setFailed] = useState<string | null>(null)

  if (src && failed !== src) {
    return <img src={src} alt="" loading="lazy" decoding="async" onError={() => setFailed(src)} className={`object-cover ${className}`} />
  }
  return (
    <div
      className={`flex items-center justify-center bg-gradient-to-br from-cream-200 via-peach-200 to-sage-100 text-center text-[10px] leading-tight tracking-wide text-ink-500 uppercase ${className}`}
    >
      {src ? 'Publicando…' : 'Sin foto'}
    </div>
  )
}

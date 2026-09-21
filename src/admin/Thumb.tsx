/** path público → data URL local */
export type Previews = Map<string, string>

/**
 * Miniatura de producto. Si hay preview local (foto pendiente o subida en esta
 * sesión) se usa esa y NO se pide la URL pública: hasta que termine el deploy
 * daría 404 y ese 404 podría quedar cacheado en el CDN.
 */
export function Thumb({
  image,
  previews,
  className = '',
}: {
  image: string | null
  previews: Previews
  className?: string
}) {
  const src = image ? (previews.get(image) ?? image) : null
  return src ? (
    <img src={src} alt="" className={`object-cover ${className}`} />
  ) : (
    <div
      className={`flex items-center justify-center bg-gradient-to-br from-cream-200 via-peach-200 to-sage-100 text-[10px] tracking-wide text-ink-500 uppercase ${className}`}
    >
      Sin foto
    </div>
  )
}

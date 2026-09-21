import type { PendingImages } from './Editor'

/** Miniatura de producto: foto del repo, foto pendiente de subir, o placeholder. */
export function Thumb({
  image,
  pending,
  className = '',
}: {
  image: string | null
  pending: PendingImages
  className?: string
}) {
  const src = image ? (pending.get(image)?.previewUrl ?? image) : null
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

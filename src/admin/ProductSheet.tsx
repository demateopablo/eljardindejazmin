import { useRef, useState, type FormEvent, type ReactNode } from 'react'
import { categories } from '../data/products'
import { MAX_PHOTOS_PER_PRODUCT, productSchema, type CategoryId, type Product } from '../data/productsSchema'
import { resizeToWebp } from './lib/image'
import { uniqueId } from './lib/slug'
import { Thumb, type Previews } from './Thumb'
import { Field, inputCls, PriceField, primaryBtn, Segmented, Sheet, Switch } from './ui'

export interface ProductDraft {
  product: Product
  /** Fotos nuevas elegidas en esta hoja (ya redimensionadas): [ruta pública, base64] */
  newImages: [string, string][]
}

/** Foto en la hoja: ya publicada (path) o recién elegida (base64 + preview). */
type Photo = { key: string; path: string } | { key: string; base64: string; previewUrl: string }

interface Props {
  /** null = producto nuevo */
  initial: Product | null
  category: CategoryId
  takenIds: Set<string>
  previews: Previews
  onClose: () => void
  onSubmit: (draft: ProductDraft) => void
  onDelete?: (id: string) => void
}

const FORM_ID = 'product-form'

export function ProductSheet({ initial, category, takenIds, previews, onClose, onSubmit, onDelete }: Props) {
  const [name, setName] = useState(initial?.name ?? '')
  const [detail, setDetail] = useState(initial?.detail ?? '')
  const [cat, setCat] = useState<CategoryId>(category)
  const [consult, setConsult] = useState(initial ? initial.price === null : false)
  const [price, setPrice] = useState<number | null>(initial?.price ?? null)
  const [visible, setVisible] = useState(initial?.visible ?? true)
  const [photos, setPhotos] = useState<Photo[]>(() => (initial?.images ?? []).map((path) => ({ key: path, path })))
  const [processing, setProcessing] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const errorRef = useRef<HTMLParagraphElement>(null)

  const room = MAX_PHOTOS_PER_PRODUCT - photos.length

  async function addFiles(list: FileList | null) {
    const files = [...(list ?? [])].slice(0, room)
    if (!files.length) return
    setError(null)
    try {
      for (const [i, file] of files.entries()) {
        setProcessing(files.length > 1 ? `Preparando ${i + 1} de ${files.length}…` : 'Preparando…')
        const { base64, previewUrl } = await resizeToWebp(file)
        setPhotos((ps) => [...ps, { key: `${Date.now()}-${i}-${file.name}`, base64, previewUrl }])
      }
      if ((list?.length ?? 0) > room) setError(`Se agregaron ${room}: el máximo es ${MAX_PHOTOS_PER_PRODUCT} fotos por producto.`)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'No se pudo procesar la foto')
    } finally {
      setProcessing(null)
    }
  }

  function movePhoto(i: number, to: number) {
    setPhotos((ps) => {
      const next = [...ps]
      const [p] = next.splice(i, 1)
      next.splice(to, 0, p)
      return next
    })
  }

  function showError(message: string) {
    setError(message)
    requestAnimationFrame(() => errorRef.current?.scrollIntoView({ block: 'center', behavior: 'smooth' }))
  }

  function submit(e: FormEvent, close: () => void) {
    e.preventDefault()
    if (processing) return
    const id = initial?.id ?? uniqueId(name, takenIds)
    // La ruta se arma recién acá, con el id final (antes salían "producto-123.webp")
    const stamp = Date.now()
    const newImages: [string, string][] = []
    const images = photos.map((p, i) => {
      if ('path' in p) return p.path
      const path = `/products/${id}-${stamp + i}.webp`
      newImages.push([path, p.base64])
      return path
    })
    if (!consult && price === null) return showError('Poné un precio o marcá "A consultar".')
    const parsed = productSchema.safeParse({ id, category: cat, name, detail, price: consult ? null : price, images, visible })
    if (!parsed.success) return showError(parsed.error.issues[0].message)
    onSubmit({ product: parsed.data, newImages })
    close()
  }

  return (
    <Sheet
      title={initial ? 'Editar producto' : 'Nuevo producto'}
      onClose={onClose}
      action={() => (
        <button type="submit" form={FORM_ID} disabled={!!processing} className={primaryBtn}>
          {initial ? 'Listo' : 'Agregar'}
        </button>
      )}
    >
      {(close) => (
        <form id={FORM_ID} onSubmit={(e) => submit(e, close)} noValidate>
          {error && (
            <p ref={errorRef} role="alert" className="mt-4 rounded-xl border border-blush-300 bg-blush-200/50 p-3 text-base text-ink-700">
              {error}
            </p>
          )}

          <Field label={`Fotos (${photos.length} de ${MAX_PHOTOS_PER_PRODUCT})`} hint="La primera es la portada. Tocá las flechas para cambiar el orden.">
            <ul className="-mx-5 flex snap-x gap-3 overflow-x-auto px-5 pb-2">
              {photos.map((p, i) => (
                <li key={p.key} className="relative w-32 shrink-0 snap-start">
                  <Thumb
                    image={'path' in p ? p.path : p.key}
                    previews={'path' in p ? previews : new Map([[p.key, p.previewUrl]])}
                    className="aspect-[4/5] w-full rounded-2xl"
                  />
                  {i === 0 && (
                    <span className="absolute top-2 left-2 rounded-full bg-sage-600/90 px-2 py-0.5 text-[11px] tracking-wide text-cream-50 uppercase">
                      Portada
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={() => setPhotos((ps) => ps.filter((x) => x.key !== p.key))}
                    aria-label={`Quitar foto ${i + 1}`}
                    className="absolute top-1 right-1 flex h-9 w-9 items-center justify-center rounded-full bg-ink-900/60 text-lg text-cream-50"
                  >
                    ×
                  </button>
                  <div className="mt-1.5 flex justify-between">
                    <PhotoMove label="Mover a la izquierda" disabled={i === 0} onClick={() => movePhoto(i, i - 1)}>
                      ←
                    </PhotoMove>
                    {i > 0 && (
                      <button type="button" onClick={() => movePhoto(i, 0)} className="min-h-10 px-1 text-xs text-sage-700 underline underline-offset-2">
                        Portada
                      </button>
                    )}
                    <PhotoMove label="Mover a la derecha" disabled={i === photos.length - 1} onClick={() => movePhoto(i, i + 1)}>
                      →
                    </PhotoMove>
                  </div>
                </li>
              ))}

              {room > 0 && (
                <li className="flex w-32 shrink-0 snap-start flex-col gap-2">
                  <PhotoPicker capture disabled={!!processing} onFiles={addFiles}>
                    <CameraGlyph />
                    Sacar foto
                  </PhotoPicker>
                  <PhotoPicker multiple disabled={!!processing} onFiles={addFiles}>
                    <GalleryGlyph />
                    Elegir fotos
                  </PhotoPicker>
                </li>
              )}
            </ul>
            {processing && <p className="mt-1 text-sm text-sage-700">{processing}</p>}
          </Field>

          <Field label="Nombre">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={80}
              autoCapitalize="sentences"
              enterKeyHint="next"
              placeholder="Ej: Vela en vaso Gourmet"
              className={inputCls}
            />
          </Field>

          <Field label="Detalle (opcional)" hint="Material, tamaño, forma. Ej: Parafina en gel · aroma a elección">
            <input value={detail} onChange={(e) => setDetail(e.target.value)} maxLength={120} enterKeyHint="done" className={inputCls} />
          </Field>

          <Field label="Precio">
            <div className="flex items-center gap-4">
              {!consult && <PriceField large value={price} onChange={setPrice} label="Precio" className="flex-1" />}
              <label className="flex min-h-12 flex-1 items-center justify-between gap-3 text-base text-ink-700">
                A consultar
                <Switch checked={consult} onChange={setConsult} label="Precio a consultar" />
              </label>
            </div>
          </Field>

          <Field label="Categoría">
            <Segmented label="Categoría" value={cat} onChange={setCat} options={categories.map((c) => ({ value: c.id, label: c.name }))} />
          </Field>

          <div className="mt-6 flex min-h-14 items-center justify-between gap-4 rounded-2xl border border-cream-300/70 bg-cream-50 px-4">
            <div>
              <p className="text-base text-ink-900">Visible en el sitio</p>
              <p className="text-sm text-ink-500">{visible ? 'Se muestra en el catálogo' : 'Oculto, pero queda guardado acá'}</p>
            </div>
            <Switch checked={visible} onChange={setVisible} label="Visible en el sitio" />
          </div>

          {initial && onDelete && (
            <div className="mt-10 border-t border-cream-300/70 pt-6 text-center">
              {confirmDelete ? (
                <div className="flex flex-col gap-2">
                  <p className="text-base text-ink-700">¿Seguro? Si es por un tiempo, mejor ocultalo.</p>
                  <div className="flex justify-center gap-3">
                    <button type="button" onClick={() => setConfirmDelete(false)} className="min-h-11 rounded-full px-5 text-base text-ink-500">
                      No
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        onDelete(initial.id)
                        close()
                      }}
                      className="min-h-11 rounded-full bg-blush-400 px-5 text-base font-medium text-cream-50"
                    >
                      Sí, eliminar
                    </button>
                  </div>
                </div>
              ) : (
                <button type="button" onClick={() => setConfirmDelete(true)} className="min-h-11 px-4 text-base text-blush-400">
                  Eliminar producto
                </button>
              )}
            </div>
          )}
        </form>
      )}
    </Sheet>
  )
}

function PhotoMove({ label, disabled, onClick, children }: { label: string; disabled: boolean; onClick: () => void; children: string }) {
  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className="flex h-10 w-10 items-center justify-center rounded-full border border-cream-300 bg-cream-50 text-ink-700 disabled:opacity-25"
    >
      {children}
    </button>
  )
}

function PhotoPicker({
  capture,
  multiple,
  disabled,
  onFiles,
  children,
}: {
  capture?: boolean
  multiple?: boolean
  disabled: boolean
  onFiles: (files: FileList | null) => void
  children: ReactNode
}) {
  return (
    <label
      className={`flex flex-1 cursor-pointer flex-col items-center justify-center gap-1 rounded-2xl border-2 border-dashed border-sage-300 bg-cream-50 p-2 text-center text-sm text-sage-700 transition-colors hover:bg-sage-100 ${
        disabled ? 'pointer-events-none opacity-50' : ''
      }`}
    >
      {children}
      <input
        type="file"
        accept="image/*"
        className="sr-only"
        multiple={multiple}
        capture={capture ? 'environment' : undefined}
        disabled={disabled}
        onChange={(e) => {
          onFiles(e.target.files)
          e.target.value = '' // permite elegir la misma foto otra vez
        }}
      />
    </label>
  )
}

function CameraGlyph() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M4 8h3l1.5-2h7L17 8h3v11H4z" />
      <circle cx="12" cy="13" r="3.5" />
    </svg>
  )
}

function GalleryGlyph() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <circle cx="9" cy="10" r="1.6" />
      <path d="M21 16l-5-5-7 7" />
    </svg>
  )
}

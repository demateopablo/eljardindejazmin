import { useEffect, useState, type FormEvent, type ReactNode } from 'react'
import { categories } from '../data/products'
import { productSchema, type CategoryId, type Product } from '../data/productsSchema'
import type { PendingImages } from './Editor'
import { resizeToWebp } from './lib/image'
import { uniqueId } from './lib/slug'
import { Thumb } from './Thumb'

export interface ProductDraft {
  product: Product
  /** Foto nueva elegida en este formulario (ya redimensionada) */
  newImage?: { base64: string; previewUrl: string }
}

interface Props {
  /** null = producto nuevo */
  initial: Product | null
  category: CategoryId
  takenIds: Set<string>
  pending: PendingImages
  onCancel: () => void
  onSubmit: (draft: ProductDraft) => void
}

export function ProductForm({ initial, category, takenIds, pending, onCancel, onSubmit }: Props) {
  const [name, setName] = useState(initial?.name ?? '')
  const [detail, setDetail] = useState(initial?.detail ?? '')
  const [cat, setCat] = useState<CategoryId>(category)
  const [consult, setConsult] = useState(initial ? initial.price === null : false)
  const [price, setPrice] = useState<string>(initial?.price != null ? String(initial.price) : '')
  const [visible, setVisible] = useState(initial?.visible ?? true)
  const [image, setImage] = useState<string | null>(initial?.image ?? null)
  const [newImage, setNewImage] = useState<{ base64: string; previewUrl: string; bytes: number } | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [processing, setProcessing] = useState(false)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onCancel()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onCancel])

  const id = initial?.id ?? uniqueId(name, takenIds)

  async function onFile(file: File | undefined) {
    if (!file) return
    setProcessing(true)
    setError(null)
    try {
      const resized = await resizeToWebp(file)
      setNewImage(resized)
      setImage(`/products/${id}-${Date.now()}.webp`)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'No se pudo procesar la foto')
    } finally {
      setProcessing(false)
    }
  }

  function submit(e: FormEvent) {
    e.preventDefault()
    const candidate = {
      id,
      category: cat,
      name,
      detail,
      price: consult ? null : Math.round(Number(price)),
      image,
      visible,
    }
    const parsed = productSchema.safeParse(candidate)
    if (!parsed.success) {
      setError(parsed.error.issues[0].message)
      return
    }
    onSubmit({ product: parsed.data, newImage: newImage ?? undefined })
  }

  // Preview: foto nueva > foto pendiente de otro guardado > foto del repo
  const previewPending: PendingImages = newImage && image ? new Map(pending).set(image, newImage) : pending

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-ink-900/40 p-0 sm:items-center sm:p-6"
      onClick={onCancel}
    >
      <form
        onSubmit={submit}
        onClick={(e) => e.stopPropagation()}
        className="max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-t-3xl bg-cream-50 p-5 shadow-xl sm:rounded-3xl"
      >
        <h2 className="font-display text-2xl italic text-sage-700">
          {initial ? 'Editar producto' : 'Nuevo producto'}
        </h2>

        <div className="mt-5 flex gap-4">
          <Thumb image={image} pending={previewPending} className="h-28 w-28 shrink-0 rounded-xl" />
          <div className="flex flex-col justify-center gap-2 text-sm">
            <label className="cursor-pointer rounded-full border border-sage-400 px-4 py-1.5 text-center text-sage-700 transition-colors hover:bg-sage-100">
              {processing ? 'Procesando…' : image ? 'Cambiar foto' : 'Subir foto'}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                disabled={processing}
                onChange={(e) => onFile(e.target.files?.[0])}
              />
            </label>
            {image && (
              <button
                type="button"
                onClick={() => {
                  setImage(null)
                  setNewImage(null)
                }}
                className="text-xs text-ink-500 underline-offset-2 hover:underline"
              >
                Quitar foto
              </button>
            )}
            {newImage && (
              <span className="text-xs text-ink-500">{Math.round(newImage.bytes / 1024)} KB, lista para subir</span>
            )}
          </div>
        </div>

        <Field label="Nombre">
          <input value={name} onChange={(e) => setName(e.target.value)} required maxLength={80} className={inputCls} />
        </Field>

        <Field label="Detalle (opcional)" hint="Material, tamaño, forma. Ej: Parafina en gel · aroma a elección">
          <input value={detail} onChange={(e) => setDetail(e.target.value)} maxLength={120} className={inputCls} />
        </Field>

        <Field label="Categoría">
          <select value={cat} onChange={(e) => setCat(e.target.value as CategoryId)} className={inputCls}>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Precio">
          <div className="flex flex-wrap items-center gap-3">
            <label className="flex items-center gap-1 rounded-lg border border-cream-300 bg-cream-100 px-2 focus-within:border-sage-400">
              <span className="text-ink-500">$</span>
              <input
                type="number"
                inputMode="numeric"
                min={0}
                step={10}
                disabled={consult}
                required={!consult}
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-28 bg-transparent py-1.5 outline-none disabled:text-ink-500"
              />
            </label>
            <label className="flex cursor-pointer items-center gap-1.5 text-sm text-ink-500">
              <input type="checkbox" checked={consult} onChange={(e) => setConsult(e.target.checked)} className="accent-sage-500" />
              A consultar
            </label>
          </div>
        </Field>

        <label className="mt-4 flex cursor-pointer items-center gap-2 text-sm text-ink-700">
          <input type="checkbox" checked={visible} onChange={(e) => setVisible(e.target.checked)} className="accent-sage-500" />
          Visible en el sitio
        </label>

        {error && (
          <p role="alert" className="mt-4 rounded-xl border border-blush-300 bg-blush-200/40 p-3 text-sm text-ink-700">
            {error}
          </p>
        )}

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-full px-5 py-2.5 text-sm text-ink-500 transition-colors hover:text-ink-900"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={processing}
            className="rounded-full bg-sage-500 px-6 py-2.5 text-sm font-medium text-cream-50 transition-colors hover:bg-sage-600 disabled:opacity-40"
          >
            {initial ? 'Aplicar' : 'Agregar'}
          </button>
        </div>
      </form>
    </div>
  )
}

const inputCls =
  'w-full rounded-lg border border-cream-300 bg-cream-100 px-3 py-2 text-sm text-ink-900 outline-none focus:border-sage-400'

function Field({ label, hint, children }: { label: string; hint?: string; children: ReactNode }) {
  return (
    <label className="mt-4 block">
      <span className="text-xs tracking-[0.15em] text-ink-500 uppercase">{label}</span>
      <div className="mt-1.5">{children}</div>
      {hint && <span className="mt-1 block text-xs text-ink-500">{hint}</span>}
    </label>
  )
}

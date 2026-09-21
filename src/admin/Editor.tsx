import { useEffect, useMemo, useState } from 'react'
import { allProducts, categories } from '../data/products'
import { MAX_IMAGES_PER_SAVE, type CategoryId, type Product } from '../data/productsSchema'
import { site } from '../data/site'
import { api, ApiError } from './lib/api'
import { ProductForm, type ProductDraft } from './ProductForm'
import { SaveBar } from './SaveBar'
import { Thumb, type Previews } from './Thumb'

/** Fotos nuevas todavía no commiteadas: ruta pública → { base64, previewUrl } */
export type PendingImages = Map<string, { base64: string; previewUrl: string }>

type FormState = { mode: 'new'; category: CategoryId } | { mode: 'edit'; product: Product } | null

export function Editor() {
  const [products, setProducts] = useState<Product[]>(allProducts)
  const [baseline, setBaseline] = useState<string>(() => JSON.stringify(allProducts))
  const [pending, setPending] = useState<PendingImages>(new Map())
  /** Previews de fotos ya publicadas en esta sesión (el deploy puede tardar; no pedimos la URL real). */
  const [uploaded, setUploaded] = useState<Previews>(new Map())
  const [form, setForm] = useState<FormState>(null)
  const [saving, setSaving] = useState(false)
  const [notice, setNotice] = useState<{ kind: 'ok' | 'error'; text: string } | null>(null)

  const dirty = JSON.stringify(products) !== baseline || pending.size > 0

  useEffect(() => {
    if (!dirty) return
    const warn = (e: BeforeUnloadEvent) => {
      e.preventDefault()
    }
    window.addEventListener('beforeunload', warn)
    return () => window.removeEventListener('beforeunload', warn)
  }, [dirty])

  const previews = useMemo<Previews>(() => {
    const m = new Map(uploaded)
    for (const [path, { previewUrl }] of pending) m.set(path, previewUrl)
    return m
  }, [uploaded, pending])

  const byCategory = useMemo(
    () => categories.map((c) => ({ category: c, items: products.filter((p) => p.category === c.id) })),
    [products],
  )

  function update(id: string, patch: Partial<Product>) {
    setProducts((ps) => ps.map((p) => (p.id === id ? { ...p, ...patch } : p)))
  }

  function remove(id: string) {
    const p = products.find((x) => x.id === id)
    if (!p || !confirm(`¿Eliminar "${p.name}"? Si solo querés sacarlo del sitio un tiempo, mejor ocultalo.`)) return
    setProducts((ps) => ps.filter((x) => x.id !== id))
    if (p.image && pending.has(p.image)) {
      setPending((m) => {
        const next = new Map(m)
        next.delete(p.image!)
        return next
      })
    }
  }

  /** Mueve un producto un lugar dentro de su categoría (el orden global es el del array). */
  function move(id: string, dir: -1 | 1) {
    setProducts((ps) => {
      const idx = ps.findIndex((p) => p.id === id)
      const cat = ps[idx].category
      let j = idx + dir
      while (j >= 0 && j < ps.length && ps[j].category !== cat) j += dir
      if (j < 0 || j >= ps.length) return ps
      const next = [...ps]
      ;[next[idx], next[j]] = [next[j], next[idx]]
      return next
    })
  }

  function commitForm(draft: ProductDraft) {
    if (draft.newImage) {
      setPending((m) => new Map(m).set(draft.product.image!, draft.newImage!))
    }
    setProducts((ps) => {
      const exists = ps.some((p) => p.id === draft.product.id)
      return exists ? ps.map((p) => (p.id === draft.product.id ? draft.product : p)) : [...ps, draft.product]
    })
    setForm(null)
  }

  async function save() {
    setNotice(null)
    // Solo mandamos las fotos que algún producto sigue referenciando.
    const referenced = new Set(products.map((p) => p.image))
    const images = [...pending.entries()]
      .filter(([path]) => referenced.has(path))
      .map(([path, { base64 }]) => ({ path, base64 }))

    if (images.length > MAX_IMAGES_PER_SAVE) {
      setNotice({ kind: 'error', text: `Podés subir hasta ${MAX_IMAGES_PER_SAVE} fotos por guardado. Guardá en dos veces.` })
      return
    }

    setSaving(true)
    try {
      await api.save({ products, images })
      setBaseline(JSON.stringify(products))
      setUploaded((u) => {
        const next = new Map(u)
        for (const [path, { previewUrl }] of pending) next.set(path, previewUrl)
        return next
      })
      setPending(new Map())
      setNotice({
        kind: 'ok',
        text: 'Publicado. En 1 o 2 minutos los cambios se ven en el sitio. Si recargás esta página antes, vas a ver los datos viejos hasta que termine.',
      })
    } catch (e) {
      setNotice({ kind: 'error', text: e instanceof ApiError ? e.message : 'No se pudo guardar. Probá de nuevo.' })
    } finally {
      setSaving(false)
    }
  }

  const takenIds = useMemo(() => new Set(products.map((p) => p.id)), [products])

  return (
    <main className="mx-auto max-w-4xl px-4 pt-6 pb-32">
      <p className="text-sm leading-relaxed text-ink-500">
        Cambiá lo que necesites y después tocá <strong className="font-medium text-ink-700">Guardar y publicar</strong>.
        Nada se publica hasta ese momento.
      </p>

      {byCategory.map(({ category, items }) => (
        <section key={category.id} className="mt-8">
          <div className="flex items-end justify-between gap-4">
            <h2 className="font-display text-2xl italic text-sage-700">{category.name}</h2>
            <button
              type="button"
              onClick={() => setForm({ mode: 'new', category: category.id })}
              className="shrink-0 rounded-full border border-sage-400 px-3.5 py-1.5 text-sm text-sage-700 transition-colors hover:bg-sage-100"
            >
              + Nuevo
            </button>
          </div>

          {items.length === 0 ? (
            <p className="mt-3 text-sm text-ink-500">Sin productos en esta categoría.</p>
          ) : (
            <ul className="mt-3 divide-y divide-cream-300/70 overflow-hidden rounded-2xl border border-cream-300/70 bg-cream-50">
              {items.map((p, i) => (
                <li key={p.id} className={`p-3 ${p.visible ? '' : 'opacity-60'}`}>
                  <div className="flex gap-3">
                    <Thumb image={p.image} previews={previews} className="h-14 w-14 shrink-0 rounded-lg" />
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-baseline gap-x-2">
                        <span className="font-display text-lg leading-tight text-ink-900">{p.name}</span>
                        {!p.visible && (
                          <span className="text-[11px] tracking-wide text-gold-500 uppercase">Oculto</span>
                        )}
                      </div>
                      {p.detail && <p className="truncate text-sm text-ink-500">{p.detail}</p>}
                    </div>
                    <div className="flex shrink-0 gap-1">
                      <IconButton label="Subir" disabled={i === 0} onClick={() => move(p.id, -1)}>
                        ↑
                      </IconButton>
                      <IconButton label="Bajar" disabled={i === items.length - 1} onClick={() => move(p.id, 1)}>
                        ↓
                      </IconButton>
                    </div>
                  </div>

                  <div className="mt-2.5 flex flex-wrap items-center gap-x-4 gap-y-2 sm:pl-[68px]">
                    <PriceInput value={p.price} onChange={(price) => update(p.id, { price })} />
                    <label className="flex cursor-pointer items-center gap-1.5 text-xs text-ink-500">
                      <input
                        type="checkbox"
                        checked={p.visible}
                        onChange={(e) => update(p.id, { visible: e.target.checked })}
                        className="accent-sage-500"
                      />
                      Visible
                    </label>
                    <span className="ml-auto flex gap-3 text-xs">
                      <button
                        type="button"
                        onClick={() => setForm({ mode: 'edit', product: p })}
                        className="text-sage-700 underline-offset-2 hover:underline"
                      >
                        Editar
                      </button>
                      <button
                        type="button"
                        onClick={() => remove(p.id)}
                        className="text-blush-400 underline-offset-2 hover:underline"
                      >
                        Eliminar
                      </button>
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      ))}

      {form && (
        <ProductForm
          initial={form.mode === 'edit' ? form.product : null}
          category={form.mode === 'new' ? form.category : form.product.category}
          takenIds={takenIds}
          previews={previews}
          onCancel={() => setForm(null)}
          onSubmit={commitForm}
        />
      )}

      <SaveBar dirty={dirty} saving={saving} notice={notice} onSave={save} siteUrl={site.url} />
    </main>
  )
}

function PriceInput({ value, onChange }: { value: number | null; onChange: (v: number | null) => void }) {
  const consult = value === null
  return (
    <div className="flex items-center gap-2">
      <label className="flex items-center gap-1 rounded-lg border border-cream-300 bg-cream-100 px-2 text-sm text-ink-700 focus-within:border-sage-400">
        <span className="text-ink-500">$</span>
        <input
          type="number"
          inputMode="numeric"
          min={0}
          step={10}
          disabled={consult}
          value={consult ? '' : value}
          onChange={(e) => onChange(e.target.value === '' ? 0 : Math.max(0, Math.round(Number(e.target.value))))}
          className="w-20 bg-transparent py-1 text-sm outline-none disabled:text-ink-500"
          aria-label="Precio"
        />
      </label>
      <label className="flex cursor-pointer items-center gap-1.5 text-xs whitespace-nowrap text-ink-500">
        <input
          type="checkbox"
          checked={consult}
          onChange={(e) => onChange(e.target.checked ? null : 0)}
          className="accent-sage-500"
        />
        A consultar
      </label>
    </div>
  )
}

function IconButton({
  label,
  disabled,
  onClick,
  children,
}: {
  label: string
  disabled?: boolean
  onClick: () => void
  children: string
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      disabled={disabled}
      onClick={onClick}
      className="h-7 w-7 rounded-md border border-cream-300 text-ink-500 transition-colors hover:border-sage-300 hover:text-sage-700 disabled:cursor-not-allowed disabled:opacity-30"
    >
      {children}
    </button>
  )
}

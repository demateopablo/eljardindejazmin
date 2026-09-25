import { useEffect, useMemo, useRef, useState } from 'react'
import { allProducts, categories } from '../data/products'
import { MAX_IMAGE_BYTES, MAX_IMAGES_PER_SAVE, type CategoryId, type Product } from '../data/productsSchema'
import { site } from '../data/site'
import { api, ApiError } from './lib/api'
import { draftStore } from './lib/draft'
import { PriceAdjustSheet } from './PriceAdjustSheet'
import { ProductRow } from './ProductRow'
import { ProductSheet, type ProductDraft } from './ProductSheet'
import { SaveBar } from './SaveBar'
import type { Previews } from './Thumb'

/** Fotos nuevas todavía no subidas: ruta pública → base64 WebP */
type Pending = Map<string, string>

type Filter = CategoryId | 'all'
type SheetState =
  | { kind: 'new'; category: CategoryId }
  | { kind: 'edit'; id: string }
  | { kind: 'prices' }
  | null

type Banner = { text: string; action?: { label: string; run: () => void } } | null

/** El body de una Function acepta ~4,5 MB: mandamos las fotos en tandas de hasta ~3,5 MB. */
const MAX_BATCH_BASE64 = 3_500_000

const toDataUrl = (base64: string) => `data:image/webp;base64,${base64}`

export function Editor() {
  const [loading, setLoading] = useState(true)
  const [products, setProducts] = useState<Product[]>(allProducts)
  const [baseline, setBaseline] = useState<Product[]>(allProducts)
  const [pending, setPending] = useState<Pending>(new Map())
  /** Previews de fotos ya publicadas en esta sesión (el deploy tarda; no pedimos la URL real). */
  const [uploaded, setUploaded] = useState<Previews>(new Map())
  const [filter, setFilter] = useState<Filter>('all')
  const [sorting, setSorting] = useState(false)
  const [sheet, setSheet] = useState<SheetState>(null)
  const [progress, setProgress] = useState<string | null>(null)
  const [notice, setNotice] = useState<{ kind: 'ok' | 'error'; text: string } | null>(null)
  const [banner, setBanner] = useState<Banner>(null)
  const [toast, setToast] = useState<Banner>(null)

  // Arranque: catálogo actual de GitHub + borrador local si había cambios sin publicar.
  useEffect(() => {
    let cancelled = false
    ;(async () => {
      const [server, draft] = await Promise.all([
        api.products().then((r) => r.products).catch(() => null),
        draftStore.load(),
      ])
      if (cancelled) return
      const base = server ?? allProducts
      setBaseline(base)
      if (draft && JSON.stringify(draft.products) !== JSON.stringify(base)) {
        setProducts(draft.products)
        setPending(new Map(draft.pending))
        setBanner({
          text: 'Recuperamos los cambios que habías dejado sin publicar.',
          action: { label: 'Descartarlos', run: () => discard(base, false) },
        })
      } else {
        setProducts(base)
        if (draft) void draftStore.clear()
        if (!server) setBanner({ text: 'No pude leer la última versión del catálogo; te muestro la del sitio. Si publicaste hace un rato, esperá un minuto y recargá.' })
      }
      setLoading(false)
    })()
    return () => {
      cancelled = true
    }
  }, [])

  const changedIds = useMemo(() => {
    const before = new Map(baseline.map((p) => [p.id, JSON.stringify(p)]))
    return new Set(products.filter((p) => before.get(p.id) !== JSON.stringify(p)).map((p) => p.id))
  }, [products, baseline])

  const changes = useMemo(() => {
    const ids = new Set(products.map((p) => p.id))
    const removed = baseline.filter((p) => !ids.has(p.id)).length
    const n = changedIds.size + removed
    const reordered = products.map((p) => p.id).join() !== baseline.filter((p) => ids.has(p.id)).map((p) => p.id).join()
    return n === 0 && reordered ? 1 : n
  }, [products, baseline, changedIds])

  // Guardar borrador local (debounced) mientras haya cambios.
  const draftTimer = useRef<ReturnType<typeof setTimeout>>(undefined)
  useEffect(() => {
    if (loading) return
    clearTimeout(draftTimer.current)
    draftTimer.current = setTimeout(() => {
      if (changes > 0) void draftStore.save({ products, pending: [...pending], savedAt: Date.now() })
      else void draftStore.clear()
    }, 400)
    return () => clearTimeout(draftTimer.current)
  }, [products, pending, changes, loading])

  useEffect(() => {
    if (changes === 0) return
    const warn = (e: BeforeUnloadEvent) => e.preventDefault()
    window.addEventListener('beforeunload', warn)
    return () => window.removeEventListener('beforeunload', warn)
  }, [changes])

  useEffect(() => {
    if (!toast) return
    const t = setTimeout(() => setToast(null), 6000)
    return () => clearTimeout(t)
  }, [toast])

  const previews = useMemo<Previews>(() => {
    const m = new Map(uploaded)
    for (const [path, base64] of pending) m.set(path, toDataUrl(base64))
    return m
  }, [uploaded, pending])

  const takenIds = useMemo(() => new Set(products.map((p) => p.id)), [products])
  const counts = useMemo(() => {
    const c = new Map<Filter, number>([['all', products.length]])
    for (const p of products) c.set(p.category, (c.get(p.category) ?? 0) + 1)
    return c
  }, [products])

  const groups = categories
    .filter((c) => filter === 'all' || c.id === filter)
    .map((c) => ({ category: c, items: products.filter((p) => p.category === c.id) }))

  function update(id: string, patch: Partial<Product>) {
    setProducts((ps) => ps.map((p) => (p.id === id ? { ...p, ...patch } : p)))
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

  function remove(id: string) {
    const index = products.findIndex((p) => p.id === id)
    const removed = products[index]
    if (!removed) return
    setProducts((ps) => ps.filter((p) => p.id !== id))
    setToast({
      text: `Eliminaste "${removed.name}".`,
      action: {
        label: 'Deshacer',
        run: () =>
          setProducts((ps) => (ps.some((p) => p.id === id) ? ps : [...ps.slice(0, index), removed, ...ps.slice(index)])),
      },
    })
  }

  function commitSheet({ product, newImages }: ProductDraft) {
    if (newImages.length) {
      setPending((m) => {
        const next = new Map(m)
        for (const [path, base64] of newImages) next.set(path, base64)
        return next
      })
    }
    setProducts((ps) => (ps.some((p) => p.id === product.id) ? ps.map((p) => (p.id === product.id ? product : p)) : [...ps, product]))
  }

  function applyPrices(prices: Map<string, number>) {
    setProducts((ps) => ps.map((p) => (prices.has(p.id) ? { ...p, price: prices.get(p.id)! } : p)))
    setToast({ text: `Actualizaste ${prices.size} ${prices.size === 1 ? 'precio' : 'precios'}. Revisalos y publicá.` })
  }

  function discard(base = baseline, ask = true) {
    if (ask && !confirm('¿Descartar todos los cambios sin publicar?')) return
    setProducts(base)
    setPending(new Map())
    setBanner(null)
    setNotice(null)
    void draftStore.clear()
  }

  async function save() {
    setNotice(null)
    const zero = products.find((p) => p.visible && p.price === 0)
    if (zero) {
      setNotice({ kind: 'error', text: `"${zero.name}" quedó con precio $ 0. Poné el precio o marcalo "A consultar".` })
      return
    }

    // Solo mandamos las fotos que algún producto sigue referenciando.
    const referenced = new Set(products.flatMap((p) => p.images))
    const images = [...pending].filter(([path]) => referenced.has(path)).map(([path, base64]) => ({ path, base64 }))
    const tooBig = images.find((i) => (i.base64.length * 3) / 4 > MAX_IMAGE_BYTES)
    if (tooBig) {
      setNotice({ kind: 'error', text: 'Una de las fotos quedó demasiado pesada. Probá sacarla de nuevo o elegir otra.' })
      return
    }

    // Tandas: todas menos la última se suben solas; la última va con el catálogo.
    const batches: (typeof images)[] = [[]]
    for (const img of images) {
      const current = batches[batches.length - 1]
      const size = current.reduce((n, i) => n + i.base64.length, 0)
      if (current.length >= MAX_IMAGES_PER_SAVE || (current.length > 0 && size + img.base64.length > MAX_BATCH_BASE64)) {
        batches.push([])
      }
      batches[batches.length - 1].push(img)
    }
    const last = batches.pop()!

    try {
      for (const [i, batch] of batches.entries()) {
        setProgress(`Subiendo fotos (${i + 1} de ${batches.length + 1})…`)
        await api.uploadPhotos({ images: batch })
        markUploaded(batch.map((b) => b.path))
      }
      setProgress(batches.length ? `Publicando (${batches.length + 1} de ${batches.length + 1})…` : 'Publicando…')
      await api.save({ products, images: last })
      markUploaded(last.map((b) => b.path))
      setPending(new Map())
      setBaseline(products)
      setBanner(null)
      void draftStore.clear()
      setNotice({ kind: 'ok', text: 'Publicado. En 1 o 2 minutos los cambios se ven en el sitio.' })
    } catch (e) {
      setNotice({ kind: 'error', text: e instanceof ApiError ? e.message : 'No se pudo publicar. Revisá la conexión y probá de nuevo.' })
    } finally {
      setProgress(null)
    }
  }

  /** Las fotos ya subidas salen de `pending` (si algo falla después, no se re-suben) pero su preview queda. */
  function markUploaded(paths: string[]) {
    setUploaded((u) => {
      const next = new Map(u)
      for (const path of paths) {
        const base64 = pending.get(path)
        if (base64) next.set(path, toDataUrl(base64))
      }
      return next
    })
    setPending((m) => {
      const next = new Map(m)
      for (const path of paths) next.delete(path)
      return next
    })
  }

  const editing = sheet?.kind === 'edit' ? products.find((p) => p.id === sheet.id) : undefined

  if (loading) return <p className="p-10 text-center text-ink-500">Cargando productos…</p>

  return (
    <>
      {/* Filtros y herramientas: pegados arriba, debajo del header del panel */}
      <div className="sticky top-14 z-30 border-b border-cream-300/60 bg-cream-100/95 backdrop-blur">
        <div className="mx-auto max-w-3xl">
          <div className="flex gap-2 overflow-x-auto px-4 pt-3 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {([{ id: 'all' as Filter, name: 'Todos' }, ...categories] as { id: Filter; name: string }[]).map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => setFilter(c.id)}
                aria-pressed={filter === c.id}
                className={`min-h-10 shrink-0 rounded-full border px-4 text-sm transition-colors ${
                  filter === c.id ? 'border-sage-500 bg-sage-500 text-cream-50' : 'border-cream-300 bg-cream-50 text-ink-700'
                }`}
              >
                {c.name} <span className="opacity-70">{counts.get(c.id) ?? 0}</span>
              </button>
            ))}
          </div>
          <div className="flex gap-2 px-4 pb-3">
            <ToolButton onClick={() => setSheet({ kind: 'prices' })}>% Ajustar precios</ToolButton>
            <ToolButton active={sorting} onClick={() => setSorting((s) => !s)}>
              {sorting ? '✓ Listo, terminar de ordenar' : '↕ Ordenar'}
            </ToolButton>
          </div>
        </div>
      </div>

      <main className="mx-auto max-w-3xl px-4 pt-4 pb-44">
        {banner && (
          <div className="mb-4 flex flex-wrap items-center gap-x-3 gap-y-1 rounded-2xl border border-gold-300 bg-cream-50 p-3 text-sm text-ink-700">
            <p className="flex-1">{banner.text}</p>
            {banner.action && (
              <button type="button" onClick={banner.action.run} className="min-h-10 font-medium text-sage-700 underline underline-offset-2">
                {banner.action.label}
              </button>
            )}
            <button type="button" onClick={() => setBanner(null)} aria-label="Cerrar aviso" className="min-h-10 px-1 text-lg text-ink-500">
              ×
            </button>
          </div>
        )}

        {sorting && (
          <p className="mb-2 text-sm text-ink-500">Usá las flechas para cambiar el orden en que se ven dentro de cada categoría.</p>
        )}

        {groups.map(({ category, items }) => (
          <section key={category.id} className="mb-8">
            {filter === 'all' && <h2 className="mb-3 font-display text-2xl italic text-sage-700">{category.name}</h2>}
            <ul className="flex flex-col gap-2.5">
              {items.map((p, i) => (
                <ProductRow
                  key={p.id}
                  product={p}
                  previews={previews}
                  changed={changedIds.has(p.id)}
                  sorting={sorting}
                  isFirst={i === 0}
                  isLast={i === items.length - 1}
                  onEdit={() => setSheet({ kind: 'edit', id: p.id })}
                  onChange={(patch) => update(p.id, patch)}
                  onMove={(dir) => move(p.id, dir)}
                />
              ))}
            </ul>
            {!sorting && (
              <button
                type="button"
                onClick={() => setSheet({ kind: 'new', category: category.id })}
                className="mt-2.5 min-h-12 w-full rounded-2xl border-2 border-dashed border-sage-300 text-base text-sage-700 transition-colors hover:bg-sage-100"
              >
                + Agregar en {category.name.toLowerCase()}
              </button>
            )}
          </section>
        ))}
      </main>

      {toast && (
        <div role="status" className="fixed inset-x-4 bottom-28 z-40 mx-auto flex max-w-md items-center gap-3 rounded-2xl bg-ink-900 px-4 py-2 text-sm text-cream-50 shadow-lg">
          <p className="flex-1 py-1.5">{toast.text}</p>
          {toast.action && (
            <button
              type="button"
              onClick={() => {
                toast.action!.run()
                setToast(null)
              }}
              className="min-h-10 font-medium text-gold-300"
            >
              {toast.action.label}
            </button>
          )}
        </div>
      )}

      {(sheet?.kind === 'new' || editing) && (
        <ProductSheet
          key={sheet?.kind === 'edit' ? sheet.id : 'new'}
          initial={editing ?? null}
          category={editing?.category ?? (sheet as { category: CategoryId }).category}
          takenIds={takenIds}
          previews={previews}
          onClose={() => setSheet(null)}
          onSubmit={commitSheet}
          onDelete={(id) => {
            setSheet(null)
            remove(id)
          }}
        />
      )}
      {sheet?.kind === 'prices' && (
        <PriceAdjustSheet
          products={products}
          initialScope={filter}
          onClose={() => setSheet(null)}
          onApply={applyPrices}
        />
      )}

      <SaveBar
        changes={changes}
        progress={progress}
        notice={notice}
        onSave={save}
        onDiscard={() => discard()}
        onDismissNotice={() => setNotice(null)}
        siteUrl={site.url}
      />
    </>
  )
}

function ToolButton({ active, onClick, children }: { active?: boolean; onClick: () => void; children: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`min-h-10 rounded-full px-3.5 text-sm transition-colors ${
        active ? 'bg-gold-400 text-cream-50' : 'bg-cream-200 text-ink-700 hover:bg-sage-100'
      }`}
    >
      {children}
    </button>
  )
}

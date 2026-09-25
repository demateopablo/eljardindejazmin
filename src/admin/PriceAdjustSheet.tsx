import { useState } from 'react'
import { categories, formatPrice } from '../data/products'
import type { CategoryId, Product } from '../data/productsSchema'
import { adjustPrice } from './lib/price'
import { Field, inputCls, primaryBtn, Segmented, Sheet } from './ui'

type Scope = CategoryId | 'all'
type Direction = 'up' | 'down'

/**
 * Actualización masiva de precios por porcentaje (lo más común con la inflación):
 * "subir 10 % todas las velas, redondeando a $100". Muestra antes → después y
 * aplica como cualquier otro cambio: no se publica hasta tocar "Publicar".
 */
export function PriceAdjustSheet({
  products,
  initialScope,
  onClose,
  onApply,
}: {
  products: Product[]
  initialScope: Scope
  onClose: () => void
  onApply: (prices: Map<string, number>) => void
}) {
  const [scope, setScope] = useState<Scope>(initialScope)
  const [direction, setDirection] = useState<Direction>('up')
  const [percentText, setPercentText] = useState('')
  const [roundTo, setRoundTo] = useState<'100' | '50' | '10'>('100')

  const percent = Number(percentText.replace(',', '.')) || 0
  const signed = direction === 'up' ? percent : -percent
  const affected = products.filter((p) => p.price !== null && (scope === 'all' || p.category === scope))
  const preview = affected.map((p) => ({ p, next: adjustPrice(p.price!, signed, Number(roundTo)) }))
  const changes = preview.filter(({ p, next }) => next !== p.price)

  return (
    <Sheet
      title="Ajustar precios"
      onClose={onClose}
      action={(close) => (
        <button
          type="button"
          disabled={changes.length === 0}
          onClick={() => {
            onApply(new Map(changes.map(({ p, next }) => [p.id, next])))
            close()
          }}
          className={primaryBtn}
        >
          Aplicar
        </button>
      )}
    >
      {() => (
        <>
          <Field label="¿Qué productos?">
            <Segmented
              label="Productos"
              value={scope}
              onChange={setScope}
              options={[{ value: 'all' as Scope, label: 'Todos' }, ...categories.map((c) => ({ value: c.id as Scope, label: c.name }))]}
            />
          </Field>

          <Field label="Porcentaje">
            <div className="flex items-center gap-3">
              <Segmented
                label="Subir o bajar"
                value={direction}
                onChange={setDirection}
                options={[
                  { value: 'up', label: 'Subir' },
                  { value: 'down', label: 'Bajar' },
                ]}
              />
              <label className="flex flex-1 items-center gap-1">
                <input
                  type="text"
                  inputMode="decimal"
                  value={percentText}
                  onChange={(e) => setPercentText(e.target.value.replace(/[^\d.,]/g, ''))}
                  placeholder="10"
                  aria-label="Porcentaje"
                  className={`${inputCls} text-right text-xl`}
                />
                <span className="text-xl text-ink-500">%</span>
              </label>
            </div>
          </Field>

          <Field label="Redondear a">
            <Segmented
              label="Redondeo"
              value={roundTo}
              onChange={setRoundTo}
              options={[
                { value: '100', label: '$ 100' },
                { value: '50', label: '$ 50' },
                { value: '10', label: '$ 10' },
              ]}
            />
          </Field>

          <div className="mt-8">
            <p className="text-sm text-ink-500">
              {percent > 0
                ? `${changes.length} ${changes.length === 1 ? 'precio cambia' : 'precios cambian'}. Los "a consultar" no se tocan.`
                : 'Escribí un porcentaje para ver cómo quedan.'}
            </p>
            {percent > 0 && (
              <ul className="mt-3 divide-y divide-cream-300/70 rounded-2xl border border-cream-300/70 bg-cream-50">
                {preview.map(({ p, next }) => (
                  <li key={p.id} className="flex items-baseline gap-3 px-4 py-2.5">
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-base text-ink-900">{p.name}</span>
                      {p.detail && <span className="block truncate text-xs text-ink-500">{p.detail}</span>}
                    </span>
                    <span className="shrink-0 text-sm text-ink-500 tabular-nums line-through">{formatPrice(p.price!)}</span>
                    <span className="shrink-0 text-base font-medium text-sage-700 tabular-nums">{formatPrice(next)}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </>
      )}
    </Sheet>
  )
}

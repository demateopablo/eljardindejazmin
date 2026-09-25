import type { Product } from '../data/productsSchema'
import { Thumb, type Previews } from './Thumb'
import { PriceField, Switch } from './ui'

interface Props {
  product: Product
  previews: Previews
  changed: boolean
  /** Modo "Ordenar": en vez de precio y visibilidad, flechas grandes. */
  sorting: boolean
  isFirst: boolean
  isLast: boolean
  onEdit: () => void
  onChange: (patch: Partial<Product>) => void
  onMove: (dir: -1 | 1) => void
}

/**
 * Una fila por producto. Lo que se toca seguido (precio y visible) se edita acá
 * mismo; todo lo demás (nombre, fotos, categoría) está en la hoja que abre al tocar
 * la foto o el nombre.
 */
export function ProductRow({ product: p, previews, changed, sorting, isFirst, isLast, onEdit, onChange, onMove }: Props) {
  return (
    <li
      className={`flex items-stretch gap-3 rounded-2xl border bg-cream-50 p-2.5 transition-colors ${
        changed ? 'border-gold-300' : 'border-cream-300/70'
      }`}
    >
      <button type="button" onClick={onEdit} className="flex min-w-0 flex-1 items-center gap-3 text-left">
        <span className="relative shrink-0">
          <Thumb image={p.images[0]} previews={previews} className={`h-[4.5rem] w-14 rounded-xl ${p.visible ? '' : 'opacity-40 grayscale'}`} />
          {p.images.length > 1 && (
            <span className="absolute right-1 bottom-1 rounded-full bg-ink-900/60 px-1.5 text-[10px] leading-4 text-cream-50">
              {p.images.length}
            </span>
          )}
        </span>
        <span className="min-w-0 flex-1">
          <span className={`line-clamp-2 font-display text-lg leading-tight ${p.visible ? 'text-ink-900' : 'text-ink-500'}`}>
            {p.name}
          </span>
          {p.detail && <span className="mt-0.5 block truncate text-sm text-ink-500">{p.detail}</span>}
          <span className="mt-1 flex flex-wrap gap-1.5">
            {!p.visible && <Badge className="bg-cream-200 text-ink-500">Oculto</Badge>}
            {changed && <Badge className="bg-gold-300/50 text-gold-500">Sin publicar</Badge>}
          </span>
        </span>
      </button>

      {sorting ? (
        <div className="flex shrink-0 flex-col justify-center gap-1.5">
          <MoveButton label={`Subir ${p.name}`} disabled={isFirst} onClick={() => onMove(-1)}>
            ↑
          </MoveButton>
          <MoveButton label={`Bajar ${p.name}`} disabled={isLast} onClick={() => onMove(1)}>
            ↓
          </MoveButton>
        </div>
      ) : (
        <div className="flex w-[7.5rem] shrink-0 flex-col items-end justify-between gap-2">
          <span className="flex items-center gap-2">
            <span className="text-xs text-ink-500" aria-hidden="true">
              {p.visible ? 'Visible' : 'Oculto'}
            </span>
            <Switch checked={p.visible} onChange={(visible) => onChange({ visible })} label={`Mostrar ${p.name} en el sitio`} />
          </span>
          {p.price === null ? (
            <button
              type="button"
              onClick={onEdit}
              className="min-h-11 w-full rounded-xl border border-dashed border-gold-400 px-2 text-sm text-gold-500"
            >
              A consultar
            </button>
          ) : (
            <PriceField value={p.price} onChange={(v) => onChange({ price: v ?? 0 })} label={`Precio de ${p.name}`} className="w-full" />
          )}
        </div>
      )}
    </li>
  )
}

function Badge({ className, children }: { className: string; children: string }) {
  return <span className={`rounded-full px-2 py-0.5 text-[11px] tracking-wide uppercase ${className}`}>{children}</span>
}

function MoveButton({ label, disabled, onClick, children }: { label: string; disabled: boolean; onClick: () => void; children: string }) {
  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className="flex h-11 w-12 items-center justify-center rounded-xl border border-cream-300 bg-cream-100 text-lg text-ink-700 active:bg-sage-100 disabled:opacity-25"
    >
      {children}
    </button>
  )
}

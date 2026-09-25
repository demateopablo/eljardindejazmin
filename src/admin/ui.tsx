import { useEffect, type KeyboardEvent, type ReactNode } from 'react'
import { formatDigits, parseDigits } from './lib/price'
import { useBackToClose } from './lib/useBackToClose'

/*
 * Piezas chicas del panel pensadas para el dedo: todo lo tocable mide ≥ 44 px y
 * los inputs usan text-base (16 px) para que iOS no haga zoom al enfocarlos.
 */

export const inputCls =
  'w-full rounded-xl border border-cream-300 bg-cream-100 px-3.5 py-3 text-base text-ink-900 outline-none focus:border-sage-400 focus:bg-cream-50'

export function Switch({
  checked,
  onChange,
  label,
}: {
  checked: boolean
  onChange: (v: boolean) => void
  label: string
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className="group -m-2 inline-flex shrink-0 items-center p-2"
    >
      <span
        className={`relative h-7 w-12 rounded-full transition-colors ${checked ? 'bg-sage-500' : 'bg-cream-300'}`}
      >
        <span
          className={`absolute top-0.5 left-0.5 h-6 w-6 rounded-full bg-cream-50 shadow-sm transition-transform ${
            checked ? 'translate-x-5' : ''
          }`}
        />
      </span>
    </button>
  )
}

/**
 * Precio con separador de miles mientras se escribe ("18.200") y teclado numérico.
 * Enter salta al siguiente precio de la lista, para actualizar varios de corrido.
 */
export function PriceField({
  value,
  onChange,
  label,
  className = '',
  large = false,
}: {
  value: number | null
  onChange: (v: number | null) => void
  label: string
  className?: string
  large?: boolean
}) {
  function onKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key !== 'Enter') return
    e.preventDefault()
    const all = [...document.querySelectorAll<HTMLInputElement>('input[data-price]')]
    const next = all[all.indexOf(e.currentTarget) + 1]
    if (next) next.focus()
    else e.currentTarget.blur()
  }

  return (
    <label
      className={`flex items-center gap-1 rounded-xl border px-3 text-ink-900 focus-within:border-sage-400 focus-within:bg-cream-50 ${
        value ? 'border-cream-300 bg-cream-100' : 'border-blush-400 bg-blush-200/50'
      } ${className}`}
    >
      <span className="text-ink-500">$</span>
      <input
        data-price
        type="text"
        inputMode="numeric"
        enterKeyHint="next"
        autoComplete="off"
        placeholder="0"
        value={value ? formatDigits(value) : ''}
        onChange={(e) => onChange(parseDigits(e.target.value))}
        onKeyDown={onKeyDown}
        onFocus={(e) => e.currentTarget.select()}
        aria-label={label}
        className={`w-full min-w-0 bg-transparent text-right font-medium tabular-nums outline-none ${
          large ? 'py-3 text-xl' : 'py-2 text-base'
        }`}
      />
    </label>
  )
}

/** Opciones como botones grandes (reemplaza <select> y radios). */
export function Segmented<T extends string>({
  value,
  options,
  onChange,
  label,
}: {
  value: T
  options: { value: T; label: string }[]
  onChange: (v: T) => void
  label: string
}) {
  return (
    <div role="radiogroup" aria-label={label} className="flex flex-wrap gap-2">
      {options.map((o) => {
        const selected = o.value === value
        return (
          <button
            key={o.value}
            type="button"
            role="radio"
            aria-checked={selected}
            onClick={() => onChange(o.value)}
            className={`min-h-11 rounded-full border px-4 text-sm transition-colors ${
              selected
                ? 'border-sage-500 bg-sage-500 text-cream-50'
                : 'border-cream-300 bg-cream-50 text-ink-700 hover:border-sage-300'
            }`}
          >
            {o.label}
          </button>
        )
      })}
    </div>
  )
}

export function Field({ label, hint, children }: { label: string; hint?: string; children: ReactNode }) {
  return (
    <div className="mt-6">
      <span className="text-xs font-medium tracking-[0.15em] text-ink-500 uppercase">{label}</span>
      <div className="mt-2">{children}</div>
      {hint && <p className="mt-1.5 text-sm text-ink-500">{hint}</p>}
    </div>
  )
}

/**
 * Hoja a pantalla completa en el celu (diálogo centrado en desktop), con la acción
 * principal arriba a la derecha, siempre a mano aunque el teclado tape el final.
 * El "atrás" del celu la cierra (ver useBackToClose).
 */
export function Sheet({
  title,
  onClose,
  action,
  children,
}: {
  title: string
  onClose: () => void
  /** Botón principal; recibe `close` para cerrar después de aplicar. */
  action?: (close: () => void) => ReactNode
  children: (close: () => void) => ReactNode
}) {
  const close = useBackToClose(onClose)

  useEffect(() => {
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e: globalThis.KeyboardEvent) => e.key === 'Escape' && close()
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prev
      window.removeEventListener('keydown', onKey)
    }
  }, [close])

  return (
    <div className="fixed inset-0 z-50 flex justify-center bg-ink-900/40 sm:items-center sm:p-6" onClick={close}>
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onClick={(e) => e.stopPropagation()}
        className="flex h-dvh w-full flex-col bg-cream-100 shadow-xl sm:h-auto sm:max-h-[90vh] sm:max-w-lg sm:overflow-hidden sm:rounded-3xl"
      >
        <header className="flex shrink-0 items-center gap-2 border-b border-cream-300/70 bg-cream-50 px-2 pt-[env(safe-area-inset-top)]">
          <button type="button" onClick={close} className="min-h-12 px-3 text-base text-ink-500">
            Cancelar
          </button>
          <h2 className="min-w-0 flex-1 truncate text-center font-display text-xl italic text-sage-700">{title}</h2>
          <div className="flex min-h-12 min-w-[5.5rem] items-center justify-end pr-1">{action?.(close)}</div>
        </header>
        <div className="flex-1 overflow-y-auto overscroll-contain px-5 pt-2 pb-[max(2rem,env(safe-area-inset-bottom))]">
          {children(close)}
        </div>
      </div>
    </div>
  )
}

export const primaryBtn =
  'inline-flex min-h-11 items-center justify-center rounded-full bg-sage-500 px-5 text-base font-medium text-cream-50 transition-colors hover:bg-sage-600 disabled:opacity-40'

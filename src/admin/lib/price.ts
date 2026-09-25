const grouping = new Intl.NumberFormat('es-AR', { maximumFractionDigits: 0 })

/** 18200 → "18.200" (sin el signo $, para el input) */
export function formatDigits(n: number): string {
  return grouping.format(n)
}

/** "18.200" / "$ 18200" → 18200; vacío → null */
export function parseDigits(text: string): number | null {
  const digits = text.replace(/\D/g, '')
  return digits === '' ? null : Number(digits)
}

/** Aplica un porcentaje y redondea al múltiplo indicado (100 → a la centena). */
export function adjustPrice(price: number, percent: number, roundTo: number): number {
  const raw = price * (1 + percent / 100)
  return Math.max(0, roundTo > 1 ? Math.round(raw / roundTo) * roundTo : Math.round(raw))
}

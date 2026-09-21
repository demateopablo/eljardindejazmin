import { site } from '../data/site'

/**
 * Carga Microsoft Clarity (mapas de calor y grabaciones de sesión).
 * Solo en producción y solo si hay un Project ID configurado en site.ts,
 * para no mandar datos desde el entorno de desarrollo.
 */
export function loadClarity(): void {
  const id = site.clarityProjectId
  if (!import.meta.env.PROD || !id) return

  // Equivalente al snippet oficial de Clarity: encola llamadas hasta que carga el script.
  type ClarityFn = ((...args: unknown[]) => void) & { q?: unknown[][] }
  const w = window as Window & { clarity?: ClarityFn }
  w.clarity =
    w.clarity ??
    Object.assign(
      (...args: unknown[]) => {
        ;(w.clarity!.q ??= []).push(args)
      },
      { q: [] as unknown[][] },
    )

  const script = document.createElement('script')
  script.async = true
  script.src = `https://www.clarity.ms/tag/${id}`
  document.head.appendChild(script)
}

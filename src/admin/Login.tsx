import { useEffect, useRef, useState } from 'react'
import { api, ApiError } from './lib/api'

/** Tipado mínimo de Google Identity Services (script cargado en admin.html). */
declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: { client_id: string; callback: (r: { credential: string }) => void }) => void
          renderButton: (el: HTMLElement, options: Record<string, string | number>) => void
        }
      }
    }
  }
}

const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID as string | undefined

export function Login({ onLogin }: { onLogin: (email: string) => void }) {
  const buttonRef = useRef<HTMLDivElement>(null)
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    if (!CLIENT_ID) return
    let cancelled = false

    // El script de Google carga async; esperamos a que exista window.google.
    const tryInit = () => {
      if (cancelled) return
      const gis = window.google?.accounts.id
      if (!gis || !buttonRef.current) {
        setTimeout(tryInit, 100)
        return
      }
      gis.initialize({
        client_id: CLIENT_ID,
        callback: async ({ credential }) => {
          setBusy(true)
          setError(null)
          try {
            const { email } = await api.login(credential)
            onLogin(email)
          } catch (e) {
            setError(e instanceof ApiError ? e.message : 'No se pudo iniciar sesión')
          } finally {
            setBusy(false)
          }
        },
      })
      gis.renderButton(buttonRef.current, {
        theme: 'outline',
        size: 'large',
        text: 'signin_with',
        shape: 'pill',
        locale: 'es',
        width: 280,
      })
    }
    tryInit()
    return () => {
      cancelled = true
    }
  }, [onLogin])

  return (
    <main className="mx-auto flex max-w-md flex-col items-center px-6 py-16 text-center">
      <h1 className="font-display text-3xl italic text-sage-700">Hola, Mar</h1>
      <p className="mt-3 text-sm leading-relaxed text-ink-500">
        Entrá con tu cuenta de Google para editar los productos, precios y fotos del sitio.
      </p>

      {CLIENT_ID ? (
        <div ref={buttonRef} className="mt-8 min-h-11" />
      ) : (
        <p className="mt-8 rounded-xl border border-gold-300 bg-cream-50 p-4 text-sm text-gold-500">
          Falta configurar <code>VITE_GOOGLE_CLIENT_ID</code>.
        </p>
      )}

      {busy && <p className="mt-4 text-sm text-ink-500">Verificando…</p>}
      {error && (
        <p role="alert" className="mt-4 rounded-xl border border-blush-300 bg-blush-200/40 p-3 text-sm text-ink-700">
          {error}
        </p>
      )}
    </main>
  )
}

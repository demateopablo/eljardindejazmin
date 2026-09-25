import { useEffect, useState } from 'react'
import logo from '../assets/logo.webp'
import { api } from './lib/api'
import { Login } from './Login'
import { Editor } from './Editor'

type State = { kind: 'loading' } | { kind: 'anonymous' } | { kind: 'ready'; email: string }

export function AdminApp() {
  const [state, setState] = useState<State>({ kind: 'loading' })

  useEffect(() => {
    api
      .me()
      .then(({ email }) => setState({ kind: 'ready', email }))
      .catch(() => setState({ kind: 'anonymous' }))
  }, [])

  async function logout() {
    await api.logout().catch(() => undefined)
    setState({ kind: 'anonymous' })
  }

  return (
    <div className="min-h-screen bg-cream-100">
      <header className="sticky top-0 z-40 pt-[env(safe-area-inset-top)] border-b border-cream-300/60 bg-cream-100/90 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-3xl items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <img src={logo} alt="" className="h-9 w-auto" width="743" height="455" />
            <span className="text-xs tracking-[0.18em] text-ink-500 uppercase">Panel</span>
          </div>
          {state.kind === 'ready' && (
            <div className="flex items-center gap-1 text-sm text-ink-500">
              <span className="mr-2 hidden sm:inline">{state.email}</span>
              <a
                href="/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-10 items-center rounded-full px-3 transition-colors hover:text-sage-700"
              >
                Ver sitio
              </a>
              <button
                type="button"
                onClick={logout}
                className="min-h-10 rounded-full border border-cream-300 px-3 transition-colors hover:border-sage-300 hover:text-sage-700"
              >
                Salir
              </button>
            </div>
          )}
        </div>
      </header>

      {state.kind === 'loading' && <p className="p-8 text-center text-ink-500">Cargando…</p>}
      {state.kind === 'anonymous' && <Login onLogin={(email) => setState({ kind: 'ready', email })} />}
      {state.kind === 'ready' && <Editor />}
    </div>
  )
}

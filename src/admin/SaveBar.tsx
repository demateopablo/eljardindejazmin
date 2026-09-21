interface Props {
  dirty: boolean
  saving: boolean
  notice: { kind: 'ok' | 'error'; text: string } | null
  onSave: () => void
  siteUrl: string
}

/** Barra fija abajo: estado de cambios + botón de publicar. */
export function SaveBar({ dirty, saving, notice, onSave, siteUrl }: Props) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-cream-300/70 bg-cream-50/95 backdrop-blur">
      <div className="mx-auto max-w-4xl px-4 py-3">
        {notice && (
          <p
            role={notice.kind === 'error' ? 'alert' : 'status'}
            className={`mb-3 rounded-xl border p-3 text-sm ${
              notice.kind === 'ok'
                ? 'border-sage-300 bg-sage-100/60 text-sage-700'
                : 'border-blush-300 bg-blush-200/40 text-ink-700'
            }`}
          >
            {notice.text}{' '}
            {notice.kind === 'ok' && (
              <a href={siteUrl} target="_blank" rel="noopener noreferrer" className="underline">
                Ver el sitio
              </a>
            )}
          </p>
        )}
        <div className="flex items-center justify-between gap-4">
          <span className="text-sm text-ink-500">
            {saving ? 'Guardando…' : dirty ? 'Tenés cambios sin publicar' : 'Todo publicado'}
          </span>
          <button
            type="button"
            disabled={!dirty || saving}
            onClick={onSave}
            className="rounded-full bg-sage-500 px-6 py-2.5 text-sm font-medium text-cream-50 shadow-sm transition-colors hover:bg-sage-600 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Guardar y publicar
          </button>
        </div>
      </div>
    </div>
  )
}

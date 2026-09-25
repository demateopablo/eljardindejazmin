interface Props {
  changes: number
  /** Texto de progreso mientras publica (null = no está publicando) */
  progress: string | null
  notice: { kind: 'ok' | 'error'; text: string } | null
  onSave: () => void
  onDiscard: () => void
  onDismissNotice: () => void
  siteUrl: string
}

/** Barra fija abajo: cuántos cambios hay, descartar y publicar. Respeta la zona segura del iPhone. */
export function SaveBar({ changes, progress, notice, onSave, onDiscard, onDismissNotice, siteUrl }: Props) {
  const dirty = changes > 0
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-cream-300/70 bg-cream-50/95 pb-[env(safe-area-inset-bottom)] shadow-[0_-4px_20px_rgba(50,46,41,0.06)] backdrop-blur">
      <div className="mx-auto max-w-3xl px-4 py-3">
        {notice && (
          <div
            role={notice.kind === 'error' ? 'alert' : 'status'}
            className={`mb-3 flex items-start gap-3 rounded-xl border p-3 text-sm ${
              notice.kind === 'ok'
                ? 'border-sage-300 bg-sage-100/60 text-sage-700'
                : 'border-blush-300 bg-blush-200/50 text-ink-700'
            }`}
          >
            <p className="flex-1">
              {notice.text}{' '}
              {notice.kind === 'ok' && (
                <a href={siteUrl} target="_blank" rel="noopener noreferrer" className="font-medium underline">
                  Ver el sitio
                </a>
              )}
            </p>
            <button type="button" onClick={onDismissNotice} aria-label="Cerrar aviso" className="-m-2 p-2 text-lg leading-none">
              ×
            </button>
          </div>
        )}
        <div className="flex items-center gap-3">
          <p className="min-w-0 flex-1 text-sm leading-tight text-ink-500">
            {progress ??
              (dirty ? (
                <>
                  <strong className="font-medium text-ink-900">
                    {changes} {changes === 1 ? 'cambio' : 'cambios'}
                  </strong>{' '}
                  sin publicar
                </>
              ) : (
                'Todo publicado ✓'
              ))}
          </p>
          {dirty && !progress && (
            <button type="button" onClick={onDiscard} className="min-h-11 px-2 text-sm text-ink-500 underline-offset-2 hover:underline">
              Descartar
            </button>
          )}
          <button
            type="button"
            disabled={!dirty || !!progress}
            onClick={onSave}
            className="min-h-12 rounded-full bg-sage-500 px-6 text-base font-medium text-cream-50 shadow-sm transition-colors hover:bg-sage-600 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Publicar
          </button>
        </div>
      </div>
    </div>
  )
}

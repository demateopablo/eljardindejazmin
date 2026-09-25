import { useCallback, useEffect, useRef } from 'react'

const KEY = 'panelSheet'

/**
 * Hace que el botón "atrás" del celu cierre la hoja abierta en vez de salir del panel.
 * Al abrir se agrega una entrada al historial; cerrar desde la UI hace history.back(),
 * y el cierre real ocurre siempre en el popstate (un solo camino, tolera StrictMode).
 * Devuelve la función para cerrar desde botones.
 */
export function useBackToClose(onClose: () => void): () => void {
  const onCloseRef = useRef(onClose)
  useEffect(() => {
    onCloseRef.current = onClose
  })

  useEffect(() => {
    if (!(history.state as Record<string, unknown> | null)?.[KEY]) {
      history.pushState({ ...(history.state as object | null), [KEY]: true }, '')
    }
    const onPop = () => onCloseRef.current()
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])

  return useCallback(() => {
    if ((history.state as Record<string, unknown> | null)?.[KEY]) history.back()
    else onCloseRef.current()
  }, [])
}

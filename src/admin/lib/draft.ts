import type { Product } from '../../data/productsSchema'

/**
 * Borrador local de cambios sin publicar, en IndexedDB (las fotos pesan demasiado
 * para localStorage). En el celu es común que el navegador recargue la pestaña
 * al volver de la cámara o de otra app: con esto no se pierde nada.
 */
export interface Draft {
  products: Product[]
  /** Fotos nuevas todavía no subidas: [ruta pública, base64 WebP] */
  pending: [string, string][]
  savedAt: number
}

const DB = 'jardin-panel'
const STORE = 'draft'
const KEY = 'current'

function open(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB, 1)
    req.onupgradeneeded = () => req.result.createObjectStore(STORE)
    req.onsuccess = () => resolve(req.result)
    req.onerror = () => reject(req.error)
  })
}

async function run<T>(mode: IDBTransactionMode, fn: (store: IDBObjectStore) => IDBRequest): Promise<T> {
  const db = await open()
  try {
    return await new Promise<T>((resolve, reject) => {
      const req = fn(db.transaction(STORE, mode).objectStore(STORE))
      req.onsuccess = () => resolve(req.result as T)
      req.onerror = () => reject(req.error)
    })
  } finally {
    db.close()
  }
}

/** Nunca tira: si IndexedDB no está disponible (modo privado viejo, etc.) el panel funciona igual. */
export const draftStore = {
  load: () => run<Draft | undefined>('readonly', (s) => s.get(KEY)).catch(() => undefined),
  save: (draft: Draft) => run('readwrite', (s) => s.put(draft, KEY)).catch(() => undefined),
  clear: () => run('readwrite', (s) => s.delete(KEY)).catch(() => undefined),
}

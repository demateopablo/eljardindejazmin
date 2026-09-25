import type { PhotosPayload, Product, SavePayload } from '../../data/productsSchema'

export class ApiError extends Error {
  status: number
  constructor(status: number, message: string) {
    super(message)
    this.status = status
  }
}

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const res = await fetch(path, {
    ...init,
    credentials: 'same-origin',
    headers: { ...(init.body ? { 'content-type': 'application/json' } : {}), ...init.headers },
  })
  const data = (await res.json().catch(() => ({}))) as { error?: string } & T
  if (!res.ok) throw new ApiError(res.status, data.error ?? `Error ${res.status}`)
  return data
}

export const api = {
  me: () => request<{ email: string }>('/api/auth/me'),
  login: (credential: string) =>
    request<{ email: string }>('/api/auth/login', { method: 'POST', body: JSON.stringify({ credential }) }),
  logout: () => request<{ ok: true }>('/api/auth/logout', { method: 'POST', body: '{}' }),
  /** Catálogo actual en GitHub (no el empaquetado en el build). */
  products: () => request<{ products: Product[] }>('/api/products'),
  uploadPhotos: (payload: PhotosPayload) =>
    request<{ ok: true }>('/api/products/photos', { method: 'POST', body: JSON.stringify(payload) }),
  save: (payload: SavePayload) =>
    request<{ ok: true; commit: { sha: string; url: string } }>('/api/products/save', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
}

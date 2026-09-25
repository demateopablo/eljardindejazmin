import { MAX_IMAGE_BYTES, PRODUCT_IMAGE_PATTERN, type PhotosPayload } from '../src/data/productsSchema.js'
import { HttpError } from './http.js'

/** Rutas en el repo que escribe el panel. */
export const PRODUCTS_JSON = 'src/data/products.json'
export const IMAGES_DIR = 'public/products'

/** Convierte el primer issue de zod en un 400 legible. */
export function invalidPayload(issue: { path: PropertyKey[]; message: string }): HttpError {
  return new HttpError(400, `Datos inválidos: ${issue.path.map(String).join('.')} — ${issue.message}`)
}

export function assertImageSizes(images: PhotosPayload['images']): void {
  for (const img of images) {
    // base64 ≈ 4/3 del tamaño real
    if ((img.base64.length * 3) / 4 > MAX_IMAGE_BYTES) {
      throw new HttpError(413, `La foto ${img.path} supera ${Math.round(MAX_IMAGE_BYTES / 1024)} KB`)
    }
  }
}

/** "public/products/x-1.webp" → "/products/x-1.webp" si es una foto de producto del panel; si no, null. */
export function repoPathToImage(repoPath: string): string | null {
  const image = repoPath.slice('public'.length)
  return repoPath.startsWith(`${IMAGES_DIR}/`) && PRODUCT_IMAGE_PATTERN.test(image) ? image : null
}

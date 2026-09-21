/**
 * Redimensiona una foto en el navegador a WebP (máx. 1200 px de lado) antes
 * de subirla, así el repo y el sitio quedan livianos sin que Mar tenga que
 * hacer nada. Devuelve base64 sin el prefijo "data:".
 */
const MAX_SIDE = 1200
const QUALITY = 0.82

export interface ResizedImage {
  base64: string
  /** data URL para previsualizar */
  previewUrl: string
  bytes: number
}

export async function resizeToWebp(file: File): Promise<ResizedImage> {
  const bitmap = await createImageBitmap(file)
  const scale = Math.min(1, MAX_SIDE / Math.max(bitmap.width, bitmap.height))
  const width = Math.round(bitmap.width * scale)
  const height = Math.round(bitmap.height * scale)

  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('No se pudo procesar la imagen')
  ctx.drawImage(bitmap, 0, 0, width, height)
  bitmap.close()

  const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/webp', QUALITY))
  if (!blob) throw new Error('Tu navegador no puede generar WebP')

  const dataUrl = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = () => reject(reader.error)
    reader.readAsDataURL(blob)
  })

  return { base64: dataUrl.split(',')[1], previewUrl: dataUrl, bytes: blob.size }
}

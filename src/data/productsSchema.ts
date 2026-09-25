import { z } from 'zod'

// Mensajes de validación en español (los ve Mar en el panel y en los errores de la API)
z.config(z.locales.es())

/**
 * Esquema del catálogo editable. Lo usan el sitio (al importar products.json),
 * el panel de admin (validación antes de guardar) y la API (validación del
 * payload antes de commitear). Si cambiás un campo, cambialo acá primero.
 */

export const CATEGORY_IDS = ['velas', 'difusores', 'wax-melts', 'jabones'] as const
export const categoryIdSchema = z.enum(CATEGORY_IDS)
export type CategoryId = z.infer<typeof categoryIdSchema>

/** Ruta pública de una foto de producto: /products/<slug>-<timestamp>.webp */
export const PRODUCT_IMAGE_PATTERN = /^\/products\/[a-z0-9-]+-\d+\.webp$/

/** Fotos por producto. La primera es la portada (la que se ve en la card). */
export const MAX_PHOTOS_PER_PRODUCT = 6

/**
 * Hasta sep-2026 cada producto tenía una sola foto en `image` (string | null). Lo
 * convertimos a `images` al validar, así un panel viejo abierto en alguna pestaña
 * no borra las fotos al guardar (zod descartaría `image` y dejaría `images` vacío).
 */
function migrateLegacyImage(value: unknown): unknown {
  if (value && typeof value === 'object' && 'image' in value && !('images' in value)) {
    const { image, ...rest } = value as { image: unknown }
    return { ...rest, images: typeof image === 'string' ? [image] : [] }
  }
  return value
}

const productObject = z.object({
  id: z
    .string()
    .min(1)
    .max(60)
    .regex(/^[a-z0-9-]+$/, 'Solo minúsculas, números y guiones'),
  category: categoryIdSchema,
  name: z.string().trim().min(1, 'El nombre es obligatorio').max(80),
  /** Detalle corto debajo del nombre: material, tamaño, forma… */
  detail: z.string().trim().max(120).default(''),
  /** Precio en pesos; null = "Precio a consultar" */
  price: z.number().int().nonnegative().nullable(),
  /** Rutas públicas de las fotos; vacío = placeholder "[Foto pendiente]" */
  images: z
    .array(z.string().regex(PRODUCT_IMAGE_PATTERN))
    .max(MAX_PHOTOS_PER_PRODUCT, `Hasta ${MAX_PHOTOS_PER_PRODUCT} fotos por producto`)
    .refine((a) => new Set(a).size === a.length, 'Hay una foto repetida'),
  /** Si es false no se muestra en el sitio pero se conserva en el panel */
  visible: z.boolean(),
})
export const productSchema = z.preprocess(migrateLegacyImage, productObject)
export type Product = z.infer<typeof productObject>

export const catalogSchema = z.object({
  products: z.array(productSchema).max(200),
})
export type Catalog = z.infer<typeof catalogSchema>

/** Payload que manda el panel al guardar. */
export const MAX_IMAGES_PER_SAVE = 8
export const MAX_IMAGE_BYTES = 400 * 1024

const imagesSchema = z
  .array(
    z.object({
      path: z.string().regex(PRODUCT_IMAGE_PATTERN),
      /** WebP en base64 (sin prefijo data:) */
      base64: z.string().min(1),
    }),
  )
  .max(MAX_IMAGES_PER_SAVE)

export const savePayloadSchema = z.object({
  products: catalogSchema.shape.products,
  images: imagesSchema,
})
export type SavePayload = z.infer<typeof savePayloadSchema>

/**
 * Solo fotos, sin tocar el catálogo. El panel lo usa para mandar por adelantado
 * las fotos que no entran en un guardado (el body de una Function tiene tope de ~4,5 MB).
 */
export const photosPayloadSchema = z.object({ images: imagesSchema.min(1) })
export type PhotosPayload = z.infer<typeof photosPayloadSchema>

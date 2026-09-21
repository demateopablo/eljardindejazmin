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

export const productSchema = z.object({
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
  /** Ruta pública de la foto; null = placeholder */
  image: z.string().regex(PRODUCT_IMAGE_PATTERN).nullable(),
  /** Si es false no se muestra en el sitio pero se conserva en el panel */
  visible: z.boolean(),
})
export type Product = z.infer<typeof productSchema>

export const catalogSchema = z.object({
  products: z.array(productSchema).max(200),
})
export type Catalog = z.infer<typeof catalogSchema>

/** Payload que manda el panel al guardar. */
export const MAX_IMAGES_PER_SAVE = 8
export const MAX_IMAGE_BYTES = 400 * 1024

export const savePayloadSchema = z.object({
  products: catalogSchema.shape.products,
  images: z
    .array(
      z.object({
        path: z.string().regex(PRODUCT_IMAGE_PATTERN),
        /** WebP en base64 (sin prefijo data:) */
        base64: z.string().min(1),
      }),
    )
    .max(MAX_IMAGES_PER_SAVE),
})
export type SavePayload = z.infer<typeof savePayloadSchema>

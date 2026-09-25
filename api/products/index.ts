import { catalogSchema } from '../../src/data/productsSchema.js'
import { readRepoFile } from '../../server/github.js'
import { handle, HttpError, json } from '../../server/http.js'
import { PRODUCTS_JSON } from '../../server/products.js'
import { requireSession } from '../../server/session.js'

/**
 * GET /api/products → { products }
 * El catálogo tal como está AHORA en GitHub (incluye ocultos). El panel arranca de acá
 * y no del JSON empaquetado en el build, que queda viejo hasta que termina el deploy.
 */
export const GET = handle(async (req) => {
  await requireSession(req)
  const parsed = catalogSchema.safeParse(JSON.parse(await readRepoFile(PRODUCTS_JSON)))
  if (!parsed.success) throw new HttpError(502, 'El catálogo del repositorio no es válido')
  return json({ products: parsed.data.products })
})

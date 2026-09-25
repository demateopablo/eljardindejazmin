import { photosPayloadSchema } from '../../src/data/productsSchema.js'
import { commitFiles } from '../../server/github.js'
import { assertSameOrigin, handle, json, readJson } from '../../server/http.js'
import { assertImageSizes, invalidPayload } from '../../server/products.js'
import { requireSession } from '../../server/session.js'

/**
 * POST /api/products/photos  { images: [{ path, base64 }] }
 * Sube fotos sin tocar el catálogo. El panel lo llama antes de /save cuando hay
 * más fotos de las que entran en un solo guardado; /save después las encuentra en el repo.
 */
export const POST = handle(async (req) => {
  assertSameOrigin(req)
  const session = await requireSession(req)

  const parsed = photosPayloadSchema.safeParse(await readJson(req))
  if (!parsed.success) throw invalidPayload(parsed.error.issues[0])
  const { images } = parsed.data
  assertImageSizes(images)

  const commit = await commitFiles({
    message: `panel: subir fotos (${session.email})`,
    author: { name: 'Panel El Jardín de Jazmín', email: session.email },
    files: images.map((i) => ({ path: `public${i.path}`, content: i.base64, encoding: 'base64' as const })),
  })

  return json({ ok: true, commit })
})

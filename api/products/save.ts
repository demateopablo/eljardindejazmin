import { savePayloadSchema } from '../../src/data/productsSchema.js'
import { commitFiles, listRepoDir, type FileToCommit } from '../../server/github.js'
import { assertSameOrigin, handle, HttpError, json, readJson } from '../../server/http.js'
import { assertImageSizes, IMAGES_DIR, invalidPayload, PRODUCTS_JSON, repoPathToImage } from '../../server/products.js'
import { requireSession } from '../../server/session.js'

/**
 * POST /api/products/save  { products: Product[], images: [{ path, base64 }] }
 * Valida todo, comprueba que cada foto referenciada exista (en el repo o en el
 * payload) y hace UN commit con el JSON + las fotos nuevas, borrando de paso las
 * fotos que ya no usa ningún producto. Vercel redeploya.
 */
export const POST = handle(async (req) => {
  assertSameOrigin(req)
  const session = await requireSession(req)

  const parsed = savePayloadSchema.safeParse(await readJson(req))
  if (!parsed.success) throw invalidPayload(parsed.error.issues[0])
  const { products, images } = parsed.data

  const ids = new Set<string>()
  for (const p of products) {
    if (ids.has(p.id)) throw new HttpError(400, `ID de producto repetido: ${p.id}`)
    ids.add(p.id)
  }
  assertImageSizes(images)

  // Toda foto referenciada tiene que existir ya en el repo o venir en este guardado.
  const existing = await listRepoDir(IMAGES_DIR)
  const incoming = new Set(images.map((i) => i.path))
  const referenced = new Set(products.flatMap((p) => p.images))
  for (const image of referenced) {
    if (!existing.has(`public${image}`) && !incoming.has(image)) {
      throw new HttpError(400, `Falta la foto ${image}`)
    }
  }

  // Fotos del panel que quedaron sin producto (reemplazadas o de productos eliminados).
  const orphans: FileToCommit[] = [...existing].flatMap((path) => {
    const image = repoPathToImage(path)
    return image && !referenced.has(image) && !incoming.has(image) ? [{ path, delete: true as const }] : []
  })

  const commit = await commitFiles({
    message: `panel: actualizar productos (${session.email})`,
    author: { name: 'Panel El Jardín de Jazmín', email: session.email },
    files: [
      { path: PRODUCTS_JSON, content: JSON.stringify({ products }, null, 2) + '\n', encoding: 'utf-8' },
      ...images.map((i) => ({ path: `public${i.path}`, content: i.base64, encoding: 'base64' as const })),
      ...orphans,
    ],
  })

  return json({ ok: true, commit })
})

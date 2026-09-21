import { MAX_IMAGE_BYTES, savePayloadSchema } from '../../src/data/productsSchema'
import { commitFiles, listRepoDir } from '../../server/github'
import { assertSameOrigin, handle, HttpError, json, readJson } from '../../server/http'
import { requireSession } from '../../server/session'

const PRODUCTS_JSON = 'src/data/products.json'
const IMAGES_DIR = 'public/products'

/**
 * POST /api/products/save  { products: Product[], images: [{ path, base64 }] }
 * Valida todo, comprueba que cada foto referenciada exista (en el repo o en el
 * payload) y hace UN commit con el JSON + las fotos nuevas. Vercel redeploya.
 */
export const POST = handle(async (req) => {
  assertSameOrigin(req)
  const session = await requireSession(req)

  const parsed = savePayloadSchema.safeParse(await readJson(req))
  if (!parsed.success) {
    const issue = parsed.error.issues[0]
    throw new HttpError(400, `Datos inválidos: ${issue.path.join('.')} — ${issue.message}`)
  }
  const { products, images } = parsed.data

  const ids = new Set<string>()
  for (const p of products) {
    if (ids.has(p.id)) throw new HttpError(400, `ID de producto repetido: ${p.id}`)
    ids.add(p.id)
  }

  for (const img of images) {
    // base64 ≈ 4/3 del tamaño real
    if ((img.base64.length * 3) / 4 > MAX_IMAGE_BYTES) {
      throw new HttpError(413, `La foto ${img.path} supera ${Math.round(MAX_IMAGE_BYTES / 1024)} KB`)
    }
  }

  // Toda foto referenciada tiene que existir ya en el repo o venir en este guardado.
  const referenced = products.flatMap((p) => (p.image ? [p.image] : []))
  if (referenced.length > 0) {
    const existing = await listRepoDir(IMAGES_DIR)
    const incoming = new Set(images.map((i) => i.path))
    for (const image of referenced) {
      const repoPath = `public${image}`
      if (!existing.has(repoPath) && !incoming.has(image)) {
        throw new HttpError(400, `Falta la foto ${image}`)
      }
    }
  }

  const commit = await commitFiles({
    message: `panel: actualizar productos (${session.email})`,
    author: { name: 'Panel El Jardín de Jazmín', email: session.email },
    files: [
      { path: PRODUCTS_JSON, content: JSON.stringify({ products }, null, 2) + '\n', encoding: 'utf-8' },
      ...images.map((i) => ({ path: `public${i.path}`, content: i.base64, encoding: 'base64' as const })),
    ],
  })

  return json({ ok: true, commit })
})

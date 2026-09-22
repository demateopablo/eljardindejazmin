import { handle, json } from '../../server/http.js'
import { fetchRecentPosts, getInstagramToken } from '../../server/instagram.js'

/**
 * GET /api/instagram/feed → { posts: [{ id, permalink, image, caption, timestamp, isVideo }] }
 * Público. La CDN de Vercel lo cachea 1 h, así Instagram recibe una llamada por hora como mucho.
 * Nunca falla hacia el sitio: ante cualquier problema devuelve una lista vacía y el bloque se oculta.
 */
const CACHE_OK = 'public, s-maxage=3600, stale-while-revalidate=86400'
const CACHE_EMPTY = 'public, s-maxage=300'

export const GET = handle(async () => {
  const token = await getInstagramToken()
  if (!token) return json({ posts: [] }, 200, { 'cache-control': CACHE_EMPTY })

  try {
    const posts = await fetchRecentPosts(token, 3)
    return json({ posts }, 200, { 'cache-control': posts.length ? CACHE_OK : CACHE_EMPTY })
  } catch (err) {
    console.error('Instagram feed:', err)
    return json({ posts: [] }, 200, { 'cache-control': CACHE_EMPTY })
  }
})

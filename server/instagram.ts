/**
 * Feed de Instagram (Instagram API with Instagram Login) y renovación del token.
 *
 * El token largo dura 60 días. Se guarda en Vercel Edge Config (se puede actualizar en
 * runtime, a diferencia de las env vars) y `INSTAGRAM_ACCESS_TOKEN` queda solo como
 * bootstrap / desarrollo local. Ver docs/instagram.md.
 */
import { get } from '@vercel/edge-config'
import { requireEnv } from './env.js'

const GRAPH = 'https://graph.instagram.com/v25.0'
const TOKEN_KEY = 'instagramToken'
const REFRESHED_AT_KEY = 'instagramTokenRefreshedAt'
const CAPTION_MAX = 140

export interface InstagramPost {
  id: string
  permalink: string
  image: string
  caption: string
  timestamp: string
  isVideo: boolean
}

interface MediaItem {
  id: string
  caption?: string
  media_type: 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM'
  media_url?: string
  thumbnail_url?: string
  permalink: string
  timestamp: string
}

/** Lee una clave de Edge Config; null si el store no está conectado o no tiene el valor. */
async function edgeConfigGet(key: string): Promise<string | null> {
  if (!process.env.EDGE_CONFIG) return null
  try {
    const value = await get<string>(key)
    return typeof value === 'string' && value ? value : null
  } catch (err) {
    console.error('Edge Config: no se pudo leer', key, err)
    return null
  }
}

/** Token vigente: Edge Config primero, después la env var (bootstrap / local). */
export async function getInstagramToken(): Promise<string | null> {
  return (await edgeConfigGet(TOKEN_KEY)) ?? process.env.INSTAGRAM_ACCESS_TOKEN ?? null
}

export async function getInstagramTokenRefreshedAt(): Promise<Date | null> {
  const iso = await edgeConfigGet(REFRESHED_AT_KEY)
  if (!iso) return null
  const date = new Date(iso)
  return Number.isNaN(date.getTime()) ? null : date
}

function trimCaption(caption: string | undefined): string {
  const oneLine = (caption ?? '').replace(/\s+/g, ' ').trim()
  if (oneLine.length <= CAPTION_MAX) return oneLine
  return `${oneLine.slice(0, CAPTION_MAX).replace(/\s+\S*$/, '')}…`
}

/** Últimas publicaciones con foto (para los videos/reels se usa la miniatura). */
export async function fetchRecentPosts(token: string, limit = 3): Promise<InstagramPost[]> {
  const url = new URL(`${GRAPH}/me/media`)
  url.searchParams.set('fields', 'id,caption,media_type,media_url,thumbnail_url,permalink,timestamp')
  url.searchParams.set('limit', String(limit + 5))
  url.searchParams.set('access_token', token)

  const res = await fetch(url)
  if (!res.ok) throw new Error(`Instagram /me/media respondió ${res.status}: ${await res.text()}`)
  const body = (await res.json()) as { data?: MediaItem[] }

  const posts: InstagramPost[] = []
  for (const item of body.data ?? []) {
    const isVideo = item.media_type === 'VIDEO'
    const image = isVideo ? item.thumbnail_url : item.media_url
    if (!image) continue
    posts.push({
      id: item.id,
      permalink: item.permalink,
      image,
      caption: trimCaption(item.caption),
      timestamp: item.timestamp,
      isVideo,
    })
    if (posts.length === limit) break
  }
  return posts
}

/** Renueva un token largo (tiene que tener ≥ 24 h y no estar vencido). Devuelve el nuevo. */
export async function refreshInstagramToken(token: string): Promise<{ token: string; expiresInDays: number }> {
  const url = new URL('https://graph.instagram.com/refresh_access_token')
  url.searchParams.set('grant_type', 'ig_refresh_token')
  url.searchParams.set('access_token', token)

  const res = await fetch(url)
  if (!res.ok) throw new Error(`Instagram refresh_access_token respondió ${res.status}: ${await res.text()}`)
  const body = (await res.json()) as { access_token: string; expires_in: number }
  return { token: body.access_token, expiresInDays: Math.floor(body.expires_in / 86400) }
}

/** Persiste el token en Edge Config vía la API de Vercel (la SDK de lectura no escribe). */
export async function storeInstagramToken(token: string, refreshedAt: Date): Promise<void> {
  const url = new URL(`https://api.vercel.com/v1/edge-config/${requireEnv('EDGE_CONFIG_ID')}/items`)
  const teamId = process.env.VERCEL_TEAM_ID
  if (teamId) url.searchParams.set('teamId', teamId)

  const res = await fetch(url, {
    method: 'PATCH',
    headers: {
      authorization: `Bearer ${requireEnv('VERCEL_API_TOKEN')}`,
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      items: [
        { operation: 'upsert', key: TOKEN_KEY, value: token },
        { operation: 'upsert', key: REFRESHED_AT_KEY, value: refreshedAt.toISOString() },
      ],
    }),
  })
  if (!res.ok) throw new Error(`Vercel Edge Config respondió ${res.status}: ${await res.text()}`)
}

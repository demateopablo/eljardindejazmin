import { requireEnv } from '../../server/env.js'
import { handle, HttpError, json } from '../../server/http.js'
import {
  getInstagramToken,
  getInstagramTokenRefreshedAt,
  refreshInstagramToken,
  storeInstagramToken,
} from '../../server/instagram.js'

/** Cada refresh emite un token nuevo; con renovar una vez por semana alcanza (dura 60 días). */
const REFRESH_EVERY_DAYS = 7

/**
 * GET /api/cron/instagram-refresh — lo invoca Vercel Cron a diario (vercel.json) con
 * `Authorization: Bearer $CRON_SECRET`. También se puede disparar a mano con curl.
 */
export const GET = handle(async (req) => {
  if (req.headers.get('authorization') !== `Bearer ${requireEnv('CRON_SECRET')}`) {
    throw new HttpError(401, 'No autorizado')
  }

  const refreshedAt = await getInstagramTokenRefreshedAt()
  const ageDays = refreshedAt ? (Date.now() - refreshedAt.getTime()) / 86_400_000 : Infinity
  if (ageDays < REFRESH_EVERY_DAYS) {
    return json({ skipped: true, refreshedAt: refreshedAt?.toISOString(), ageDays: Math.floor(ageDays) })
  }

  const current = await getInstagramToken()
  if (!current) throw new HttpError(500, 'No hay token de Instagram para renovar')

  const now = new Date()
  const { token, expiresInDays } = await refreshInstagramToken(current)
  await storeInstagramToken(token, now)
  return json({ refreshed: true, refreshedAt: now.toISOString(), expiresInDays })
})

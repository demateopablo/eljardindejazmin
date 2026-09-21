import { assertSameOrigin, handle, json } from '../../server/http'
import { clearSessionCookie } from '../../server/session'

/** POST /api/auth/logout */
export const POST = handle(async (req) => {
  assertSameOrigin(req)
  return json({ ok: true }, 200, { 'set-cookie': clearSessionCookie() })
})

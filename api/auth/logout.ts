import { assertSameOrigin, handle, json } from '../../server/http.js'
import { clearSessionCookie } from '../../server/session.js'

/** POST /api/auth/logout */
export const POST = handle(async (req) => {
  assertSameOrigin(req)
  return json({ ok: true }, 200, { 'set-cookie': clearSessionCookie() })
})

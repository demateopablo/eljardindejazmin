import { handle, json } from '../../server/http.js'
import { getSession } from '../../server/session.js'

/** GET /api/auth/me → { email } o 401 */
export const GET = handle(async (req) => {
  const session = await getSession(req)
  if (!session) return json({ error: 'Sin sesión' }, 401)
  return json({ email: session.email })
})

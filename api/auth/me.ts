import { handle, json } from '../../server/http'
import { getSession } from '../../server/session'

/** GET /api/auth/me → { email } o 401 */
export const GET = handle(async (req) => {
  const session = await getSession(req)
  if (!session) return json({ error: 'Sin sesión' }, 401)
  return json({ email: session.email })
})

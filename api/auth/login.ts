import { OAuth2Client } from 'google-auth-library'
import { adminEmails, requireEnv } from '../../server/env'
import { assertSameOrigin, handle, HttpError, json, readJson } from '../../server/http'
import { createSessionCookie } from '../../server/session'

/**
 * POST /api/auth/login  { credential: <ID token de Google Identity Services> }
 * Verifica el token contra Google, exige email verificado y en la lista blanca,
 * y devuelve la cookie de sesión.
 */
export const POST = handle(async (req) => {
  assertSameOrigin(req)
  const body = (await readJson(req)) as { credential?: unknown }
  if (typeof body.credential !== 'string') throw new HttpError(400, 'Falta credential')

  const clientId = requireEnv('GOOGLE_CLIENT_ID')
  const client = new OAuth2Client(clientId)
  let payload
  try {
    const ticket = await client.verifyIdToken({ idToken: body.credential, audience: clientId })
    payload = ticket.getPayload()
  } catch {
    throw new HttpError(401, 'Token de Google inválido')
  }

  const email = payload?.email?.toLowerCase()
  if (!email || !payload?.email_verified) throw new HttpError(401, 'Email no verificado')
  if (!adminEmails().includes(email)) {
    throw new HttpError(403, `La cuenta ${email} no está autorizada para usar el panel`)
  }

  return json({ email }, 200, { 'set-cookie': await createSessionCookie(email) })
})

import { SignJWT, jwtVerify } from 'jose'
import { requireEnv } from './env.js'
import { HttpError } from './http.js'

const COOKIE = 'admin_session'
const MAX_AGE_SECONDS = 7 * 24 * 60 * 60

const secret = () => new TextEncoder().encode(requireEnv('SESSION_SECRET'))

export interface Session {
  email: string
}

export async function createSessionCookie(email: string): Promise<string> {
  const token = await new SignJWT({ email })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(`${MAX_AGE_SECONDS}s`)
    .sign(secret())

  // Path=/api: la cookie solo viaja a las Functions, nunca al sitio público.
  return `${COOKIE}=${token}; Path=/api; Max-Age=${MAX_AGE_SECONDS}; HttpOnly; Secure; SameSite=Lax`
}

export function clearSessionCookie(): string {
  return `${COOKIE}=; Path=/api; Max-Age=0; HttpOnly; Secure; SameSite=Lax`
}

function readCookie(req: Request): string | null {
  const header = req.headers.get('cookie') ?? ''
  for (const part of header.split(';')) {
    const [name, ...rest] = part.trim().split('=')
    if (name === COOKIE) return rest.join('=')
  }
  return null
}

export async function getSession(req: Request): Promise<Session | null> {
  const token = readCookie(req)
  if (!token) return null
  try {
    const { payload } = await jwtVerify(token, secret(), { algorithms: ['HS256'] })
    return typeof payload.email === 'string' ? { email: payload.email } : null
  } catch {
    return null
  }
}

export async function requireSession(req: Request): Promise<Session> {
  const session = await getSession(req)
  if (!session) throw new HttpError(401, 'Tenés que iniciar sesión')
  return session
}

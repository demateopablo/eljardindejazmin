/** Helpers de respuesta para las Functions (firma Web: Request → Response). */

export function json(body: unknown, status = 200, headers: Record<string, string> = {}): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store', ...headers },
  })
}

export class HttpError extends Error {
  status: number
  constructor(status: number, message: string) {
    super(message)
    this.status = status
  }
}

/** Envuelve un handler: convierte HttpError en JSON y cualquier otra excepción en 500. */
export function handle(fn: (req: Request) => Promise<Response>): (req: Request) => Promise<Response> {
  return async (req) => {
    try {
      return await fn(req)
    } catch (err) {
      if (err instanceof HttpError) return json({ error: err.message }, err.status)
      console.error(err)
      return json({ error: 'Error interno' }, 500)
    }
  }
}

/**
 * Defensa CSRF para escrituras: el Origin del navegador tiene que coincidir
 * con el host que sirve el panel. (La cookie es SameSite=Lax; esto suma una capa.)
 */
export function assertSameOrigin(req: Request): void {
  const origin = req.headers.get('origin')
  const host = req.headers.get('x-forwarded-host') ?? req.headers.get('host')
  if (!origin || !host) throw new HttpError(403, 'Origen no permitido')
  if (new URL(origin).host !== host) throw new HttpError(403, 'Origen no permitido')
}

export async function readJson(req: Request): Promise<unknown> {
  if (!req.headers.get('content-type')?.includes('application/json')) {
    throw new HttpError(415, 'Se esperaba JSON')
  }
  try {
    return await req.json()
  } catch {
    throw new HttpError(400, 'JSON inválido')
  }
}

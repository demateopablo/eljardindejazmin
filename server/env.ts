/** Lectura de variables de entorno con error claro si falta alguna. */
export function requireEnv(name: string): string {
  const value = process.env[name]
  if (!value) throw new Error(`Falta la variable de entorno ${name}`)
  return value
}

/** Emails autorizados a usar el panel (ADMIN_EMAILS="a@x.com,b@y.com"). */
export function adminEmails(): string[] {
  return requireEnv('ADMIN_EMAILS')
    .split(',')
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean)
}

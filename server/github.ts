import { requireEnv } from './env.js'
import { HttpError } from './http.js'

/**
 * Commit de varios archivos en un solo commit usando la Git Data API de GitHub
 * (blobs → tree → commit → ref). El push dispara el deploy en Vercel.
 */

export type FileToCommit =
  | {
      /** Ruta relativa al repo, ej. "src/data/products.json" */
      path: string
      /** Texto UTF-8 o base64 (indicar encoding) */
      content: string
      encoding: 'utf-8' | 'base64'
    }
  | { path: string; delete: true }

interface CommitOptions {
  message: string
  files: FileToCommit[]
  author: { name: string; email: string }
}

const API = 'https://api.github.com'

const repo = () => requireEnv('GITHUB_REPO')
const branch = () => process.env.GITHUB_BRANCH || 'main'

function headers(accept = 'application/vnd.github+json'): Record<string, string> {
  return {
    accept,
    authorization: `Bearer ${requireEnv('GITHUB_TOKEN')}`,
    'x-github-api-version': '2022-11-28',
    'user-agent': 'eljardindejazmin-admin',
  }
}

async function gh<T>(path: string, init: RequestInit = {}): Promise<T> {
  const res = await fetch(`${API}${path}`, {
    ...init,
    headers: {
      ...headers(),
      ...(init.body ? { 'content-type': 'application/json' } : {}),
      ...init.headers,
    },
  })
  if (!res.ok) {
    const text = await res.text()
    console.error(`GitHub ${init.method ?? 'GET'} ${path} → ${res.status}: ${text}`)
    throw new HttpError(502, 'No se pudo guardar en GitHub')
  }
  return (await res.json()) as T
}

export async function commitFiles({ message, files, author }: CommitOptions): Promise<{ sha: string; url: string }> {
  const base = `/repos/${repo()}`

  const ref = await gh<{ object: { sha: string } }>(`${base}/git/ref/heads/${branch()}`)
  const headSha = ref.object.sha
  const headCommit = await gh<{ tree: { sha: string } }>(`${base}/git/commits/${headSha}`)

  const tree = await Promise.all(
    files.map(async (f) => {
      // sha: null en un tree con base_tree = borrar el archivo
      if ('delete' in f) return { path: f.path, mode: '100644', type: 'blob', sha: null }
      const blob = await gh<{ sha: string }>(`${base}/git/blobs`, {
        method: 'POST',
        body: JSON.stringify({ content: f.content, encoding: f.encoding }),
      })
      return { path: f.path, mode: '100644', type: 'blob', sha: blob.sha }
    }),
  )

  const newTree = await gh<{ sha: string }>(`${base}/git/trees`, {
    method: 'POST',
    body: JSON.stringify({ base_tree: headCommit.tree.sha, tree }),
  })

  const commit = await gh<{ sha: string; html_url: string }>(`${base}/git/commits`, {
    method: 'POST',
    body: JSON.stringify({ message, tree: newTree.sha, parents: [headSha], author }),
  })

  await gh(`${base}/git/refs/heads/${branch()}`, {
    method: 'PATCH',
    body: JSON.stringify({ sha: commit.sha, force: false }),
  })

  return { sha: commit.sha, url: commit.html_url }
}

/** Contenido actual (texto) de un archivo del repo en la rama configurada. */
export async function readRepoFile(path: string): Promise<string> {
  const res = await fetch(`${API}/repos/${repo()}/contents/${path}?ref=${branch()}`, {
    headers: headers('application/vnd.github.raw+json'),
  })
  if (!res.ok) {
    console.error(`GitHub GET contents/${path} → ${res.status}: ${await res.text()}`)
    throw new HttpError(502, 'No se pudo leer el repositorio')
  }
  return res.text()
}

/** Rutas de archivo existentes bajo un directorio del repo (para validar fotos referenciadas). */
export async function listRepoDir(dir: string): Promise<Set<string>> {
  const res = await fetch(`${API}/repos/${repo()}/contents/${dir}?ref=${branch()}`, { headers: headers() })
  if (res.status === 404) return new Set()
  if (!res.ok) throw new HttpError(502, 'No se pudo leer el repositorio')
  const entries = (await res.json()) as Array<{ path: string; type: string }>
  return new Set(entries.filter((e) => e.type === 'file').map((e) => e.path))
}

import { useEffect, useState } from 'react'
import { site } from '../data/site'
import { InstagramIcon, PlayIcon } from './Icons'
import { SectionTitle } from './SectionTitle'

/** Lo que devuelve GET /api/instagram/feed (ver server/instagram.ts). Sin zod: el sitio público no lo carga. */
interface Post {
  id: string
  permalink: string
  image: string
  caption: string
  timestamp: string
  isVideo: boolean
}

type State = { kind: 'loading' } | { kind: 'ready'; posts: Post[] } | { kind: 'hidden' }

const POSTS = 3

/**
 * Últimas publicaciones de Instagram. Es la única sección pública que llama a una Function:
 * si no hay token, falla la API o no hay posts, la sección directamente no se muestra
 * (con `npm run dev` a secas tampoco, porque no corren las Functions).
 */
export function InstagramFeed() {
  const [state, setState] = useState<State>({ kind: 'loading' })

  useEffect(() => {
    const controller = new AbortController()
    fetch('/api/instagram/feed', { signal: controller.signal })
      .then((res) => (res.ok ? res.json() : Promise.reject(new Error(String(res.status)))))
      .then((data: { posts?: Post[] }) => {
        const posts = (data.posts ?? []).slice(0, POSTS)
        setState(posts.length ? { kind: 'ready', posts } : { kind: 'hidden' })
      })
      .catch(() => {
        if (!controller.signal.aborted) setState({ kind: 'hidden' })
      })
    return () => controller.abort()
  }, [])

  if (state.kind === 'hidden') return null

  return (
    <section id="novedades" className="py-16 sm:py-24">
      <div className="mx-auto max-w-6xl px-6">
        <SectionTitle
          eyebrow="Desde Instagram"
          title={
            <>
              Lo último <em>del jardín</em>
            </>
          }
          intro="Lo que estamos haciendo estos días. Tocá una foto para verla en Instagram."
        />

        <ul
          className="mx-auto mt-10 grid max-w-3xl gap-4 sm:grid-cols-3"
          aria-busy={state.kind === 'loading'}
          aria-label="Últimas publicaciones"
        >
          {state.kind === 'loading'
            ? Array.from({ length: POSTS }, (_, i) => (
                <li key={i} aria-hidden="true">
                  <div className="overflow-hidden rounded-2xl border border-cream-300/70 bg-cream-50">
                    <div className="aspect-square animate-pulse bg-gradient-to-br from-cream-200 via-peach-200 to-sage-100" />
                    <div className="space-y-2 p-3">
                      <div className="h-3 w-5/6 rounded bg-cream-200" />
                      <div className="h-3 w-1/2 rounded bg-cream-200" />
                    </div>
                  </div>
                </li>
              ))
            : state.posts.map((post) => <PostCard key={post.id} post={post} />)}
        </ul>

        <p className="mt-8 text-center">
          <a
            href={site.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-sage-400 bg-cream-50/60 px-6 py-2.5 text-sm text-sage-700 transition-colors hover:bg-sage-100"
          >
            <InstagramIcon className="h-4 w-4" />
            Ver más en @{site.instagramHandle}
          </a>
        </p>
      </div>
    </section>
  )
}

function PostCard({ post }: { post: Post }) {
  const alt = post.caption || `Publicación de Instagram de ${site.name}`
  return (
    <li>
      <a
        href={post.permalink}
        target="_blank"
        rel="noopener noreferrer"
        className="group flex h-full flex-col overflow-hidden rounded-2xl border border-cream-300/70 bg-cream-50 shadow-[0_1px_2px_rgba(50,46,41,0.04)] transition-shadow hover:shadow-[0_6px_20px_rgba(50,46,41,0.08)]"
      >
        <div className="relative aspect-square overflow-hidden bg-cream-200">
          <img
            src={post.image}
            alt={alt}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
          {post.isVideo && (
            <span className="absolute top-2 right-2 inline-flex items-center gap-1 rounded-full bg-ink-900/60 px-2 py-0.5 text-[11px] tracking-wide text-cream-50 uppercase backdrop-blur-sm">
              <PlayIcon className="h-3 w-3" />
              Reel
            </span>
          )}
        </div>
        {/* El padding va en el wrapper: line-clamp sobre un elemento con padding deja ver la línea recortada */}
        <div className="p-3">
          {post.caption ? (
            <p className="line-clamp-2 text-sm leading-snug text-ink-500">{post.caption}</p>
          ) : (
            <p className="text-sm leading-snug text-sage-600">Ver en Instagram →</p>
          )}
        </div>
      </a>
    </li>
  )
}

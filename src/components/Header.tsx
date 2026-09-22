import logo from '../assets/logo.webp'
import { site } from '../data/site'
import { instagramDmLink } from '../lib/instagram'
import { InstagramIcon, LockIcon } from './Icons'

const links = [
  { href: '#catalogo', label: 'Catálogo' },
  { href: '#historia', label: 'Nuestra historia' },
  { href: '#como-comprar', label: 'Cómo comprar' },
]

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-cream-300/60 bg-cream-100/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <a href="#inicio" className="flex items-center" aria-label={`${site.name} — inicio`}>
          <img src={logo} alt="" className="h-11 w-auto" width="743" height="455" />
        </a>

        <nav className="hidden items-center gap-7 text-sm tracking-wide text-ink-500 md:flex" aria-label="Secciones">
          {links.map((l) => (
            <a key={l.href} href={l.href} className="transition-colors hover:text-sage-600">
              {l.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <a
            href={instagramDmLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-sage-300 px-3.5 py-1.5 text-sm text-sage-700 transition-colors hover:bg-sage-100"
          >
            <InstagramIcon className="h-4 w-4" />
            <span className="hidden sm:inline">Escribinos</span>
            <span className="sm:hidden">Instagram</span>
          </a>

          {/* Acceso al panel de Mar: discreto (solo ícono), es otra página (admin.html), no un ancla */}
          <a
            href="/admin"
            rel="nofollow"
            aria-label="Panel de administración"
            title="Panel"
            className="inline-flex h-8 w-8 items-center justify-center rounded-full text-ink-500/60 transition-colors hover:bg-sage-100 hover:text-sage-700"
          >
            <LockIcon className="h-4 w-4" />
          </a>
        </div>
      </div>
    </header>
  )
}

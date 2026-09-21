import logo from '../assets/logo.webp'
import { site } from '../data/site'

export function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer className="border-t border-cream-300/60 bg-cream-50 py-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-6 text-center">
        <img src={logo} alt={site.name} className="h-12 w-auto" width="743" height="455" loading="lazy" />
        <p className="text-xs tracking-[0.18em] text-ink-500 uppercase">{site.descriptor}</p>
        <p className="text-sm text-ink-500">
          © {year} {site.name} · {site.city}, {site.province}
        </p>
      </div>
    </footer>
  )
}

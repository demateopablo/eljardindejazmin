# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Single-page marketing/catalog site for **El Jardín de Jazmín**, a small home-based artisanal
aromatherapy business (scented candles, reed diffusers, wax melts, handmade soaps) in Tres Arroyos,
Buenos Aires, Argentina. Content and UI copy are in Argentine Spanish (voseo). Sales happen via
WhatsApp/Instagram — there is deliberately **no cart, checkout, login, or backend**.

The full original brief lives in `prompt-claude-code-el-jardin-de-jazmin.md`; the hard rules from it:

- Never show or mention a street address — only the city ("Tres Arroyos"). No map pins.
- Never invent testimonials, reviews, customer counts, or prices. Missing data stays as a visible
  placeholder in square brackets (`[Aroma]`, `$[PRECIO]`, `[Foto pendiente]`).
- Do not alter or recreate the logo; do not change its colors/typography.
- Copy must sound warm, personal and handmade, never corporate.

## Commands

```bash
npm run dev        # Vite dev server
npm run build      # tsc -b && vite build  → dist/
npm run preview    # serve dist/ (port 4173 is often taken by another local project; use --port)
npm run lint       # oxlint
npm run assets     # node scripts/build-assets.mjs — regenerates derived images (see below)
```

There is no test suite.

## Stack

Vite 8 + React 19 + TypeScript + Tailwind CSS v4 (via `@tailwindcss/vite`; theme tokens are
declared in `src/index.css` under `@theme`, there is no `tailwind.config`). Deployed as a static
site on Vercel (`vercel.json`).

## Architecture

- `src/App.tsx` composes the page top-to-bottom: `Header` (sticky) → `Hero` → `Historia` →
  `Catalogo` → `ComoComprar` → `Seguinos` → `Footer`, plus the fixed `WhatsAppFloat` button.
  Sections have `id`s used by anchor links; `section[id]` gets `scroll-margin-top` in `index.css`.
- **Content is data-driven**: `src/data/site.ts` (brand/contact constants) and
  `src/data/products.ts` (categories, products, `aromas` list, `formatPrice`). Components read
  from these; edit copy/prices there, not in JSX. The one exception is the prose in
  `Historia.tsx`. Prices are numbers in ARS formatted with `Intl.NumberFormat('es-AR')`;
  `price: null` renders "Precio a consultar" (the owner hasn't set it yet, not a bug).
- `src/lib/whatsapp.ts` builds every `wa.me` link, including the per-product prefilled message
  ("Hola! Quiero consultar por …"). It skips variants that are still `[placeholder]`s.
- `Catalogo` is the only stateful component (active tab). Category tabs use ARIA
  `tablist`/`tab`/`tabpanel`.
- Design tokens: `sage-*` (brand green), `cream-*` (backgrounds — never pure white), `blush`,
  `peach`, `gold` (soft accents), `ink-*` (warm text). Fonts: `font-display` (Cormorant Garamond,
  italic for headings) and `font-body` (Jost), loaded from Google Fonts in `index.html`.

## Images pipeline

`assets/` (repo root) holds the **source** files supplied by the owner (`logo-transparente.webp`,
`logo-fondo-crema.webp`, `og-image.png`, product photos). They are not served directly.
`scripts/build-assets.mjs` (sharp) derives:

- `src/assets/logo.webp` — transparent logo with surrounding whitespace trimmed (imported by
  Header/Hero/Footer).
- `public/og-image.jpg` — 1200×630 JPEG under 300 KB. WhatsApp link previews require JPG/PNG and
  reject images over ~300 KB, so do not switch this to WebP or the original PNG.
- `public/favicon-32.png`, `favicon-192.png`, `apple-touch-icon.png` — the jasmine branch from the
  logo on a cream background.
- `src/assets/tags/*.webp` — the printed aroma tags from `assets/tags/*_cuadrado.png`, shown in
  the "Aromas" block inside `Catalogo`. Aromas without a tag file get a text card instead.

Re-run `npm run assets` after changing anything in `assets/`. Product photos should be imported in
`products.ts` via the `@assets` alias (→ `./assets`) so Vite hashes and optimizes them.

## Analytics

Microsoft Clarity is loaded by `src/lib/clarity.ts` from `main.tsx`, only when `import.meta.env.PROD`
and `site.clarityProjectId` (in `src/data/site.ts`) is non-empty. There is no other tracking.

## SEO

`index.html` carries title/description targeting "velas aromáticas artesanales en Tres Arroyos",
Open Graph tags (image = `/og-image.jpg`), and a `LocalBusiness` JSON-LD with city-level address
only. Keep the address rule when touching it.

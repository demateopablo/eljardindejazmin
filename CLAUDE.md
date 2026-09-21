# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Single-page marketing/catalog site for **El Jardín de Jazmín**, a small home-based artisanal
aromatherapy business (scented candles, reed diffusers, wax melts, handmade soaps) in Tres Arroyos,
Buenos Aires, Argentina. Content and UI copy are in Argentine Spanish (voseo). Sales happen via
WhatsApp/Instagram — there is deliberately **no cart, checkout, or customer login**. The only
backend is a handful of Vercel Functions behind the owner's admin panel (see below).

The full original brief lives in `prompt-claude-code-el-jardin-de-jazmin.md`; the hard rules from it:

- Never show or mention a street address — only the city ("Tres Arroyos"). No map pins.
- Never invent testimonials, reviews, customer counts, or prices. Missing data stays as a visible
  placeholder (`[Foto pendiente]`, "Precio a consultar").
- Do not alter or recreate the logo; do not change its colors/typography.
- Copy must sound warm, personal and handmade, never corporate.

## Commands

```bash
npm run dev            # Vite dev server: public site at /, panel at /admin.html (API calls fail without functions)
npm run dev:full       # vercel dev — site + Functions on :3000; needs `vercel link` + `vercel env pull .env.local`
npm run build          # tsc -b && tsc -p tsconfig.api.json && vite build → dist/
npm run typecheck:api  # typecheck api/ + server/ only
npm run preview        # serve dist/ (port 4173 is often taken by another local project; use --port)
npm run lint           # oxlint
npm run assets         # node scripts/build-assets.mjs — regenerates derived images (see below)
```

There is no test suite. To exercise the API handlers without Vercel, bundle them with
`npx esbuild api/**/*.ts --bundle --platform=node --format=esm --packages=external --outdir=<tmp>`
and call the exported `POST`/`GET` with `Request` objects — auth, CSRF and validation are all
testable that way. To see the panel UI without Google/GitHub, run Vite with a throwaway config
that adds a middleware mocking `/api/auth/me` and `/api/products/save`.

## Stack

Vite 8 + React 19 + TypeScript + Tailwind CSS v4 (via `@tailwindcss/vite`; theme tokens are
declared in `src/index.css` under `@theme`, there is no `tailwind.config`). Deployed on Vercel
(`vercel.json`): static output plus Node Functions in `api/`.

## Architecture (public site)

- `src/App.tsx` composes the page top-to-bottom: `Header` (sticky) → `Hero` → `Historia` →
  `Catalogo` → `ComoComprar` → `Seguinos` → `Footer`, plus the fixed `WhatsAppFloat` button.
  Sections have `id`s used by anchor links; `section[id]` gets `scroll-margin-top` in `index.css`.
- **Content is data-driven**: `src/data/site.ts` (brand/contact constants),
  `src/data/products.json` (the editable catalog — written by the admin panel; don't hand-edit
  except for migrations) and `src/data/products.ts` (categories, `aromas` list, `formatPrice`,
  and `products` = the JSON filtered by `visible`). The prose in `Historia.tsx` is the only copy
  that lives in JSX. Prices are integer ARS formatted with `Intl.NumberFormat('es-AR')`;
  `price: null` renders "Precio a consultar".
- `src/data/productsSchema.ts` is the single zod schema for products, shared by the panel and the
  API. The public bundle deliberately does NOT import zod — `products.ts` just casts the JSON.
- `src/lib/whatsapp.ts` builds every `wa.me` link, including the per-product prefilled message
  ("Hola! Quiero consultar por …").
- `Catalogo` is the only stateful public component (active tab). Category tabs use ARIA
  `tablist`/`tab`/`tabpanel`.
- Design tokens: `sage-*` (brand green), `cream-*` (backgrounds — never pure white), `blush`,
  `peach`, `gold` (soft accents), `ink-*` (warm text). Fonts: `font-display` (Cormorant Garamond,
  italic for headings) and `font-body` (Jost), loaded from Google Fonts in `index.html`.

## Admin panel (`/admin`)

Lets the owner edit products, prices and photos without touching code. End-user guide:
`docs/panel-mar.md`.

- **Pages**: Vite multi-page build — `index.html` (public) and `admin.html` → `src/admin/`.
  Vercel `cleanUrls` serves `/admin` from `admin.html`. The admin bundle is separate; nothing
  from `src/admin/` may be imported by the public site.
- **Auth**: Google Identity Services button (`VITE_GOOGLE_CLIENT_ID`) → `POST /api/auth/login`
  verifies the ID token with `google-auth-library` against `GOOGLE_CLIENT_ID`, requires the email
  to be in `ADMIN_EMAILS`, and sets an HttpOnly JWT cookie (`jose`, `SESSION_SECRET`, 7 days,
  `Path=/api`). Also `GET /api/auth/me`, `POST /api/auth/logout`.
- **Save/publish**: `POST /api/products/save` `{ products, images: [{path, base64}] }` →
  validates with the shared schema, checks every referenced photo exists in the repo or the
  payload, then makes ONE commit via the GitHub Git Data API (`server/github.ts`) touching
  `src/data/products.json` and `public/products/*.webp`. The push triggers the Vercel deploy —
  that *is* the publish step (~1 min), so the panel warns that a reload before the deploy shows
  stale data.
- **Functions** use the Web signature (`export const POST = handle(async (req: Request) => …)`).
  Shared server code lives in `server/` (outside `api/`, so it is never exposed as a route):
  `http.ts` (`handle`, `HttpError`, `json`, `readJson`, `assertSameOrigin` for CSRF),
  `session.ts`, `github.ts`, `env.ts`. `tsconfig.api.json` typechecks `api/` + `server/` with
  Node types only.
- **Photos** are resized client-side (`src/admin/lib/image.ts`, ≤1200px WebP ~0.82) and named
  `/products/<id>-<timestamp>.webp`, so they can be cached immutably (`vercel.json`). Max 8 photos
  / 400 KB each per save (`productsSchema.ts`).
- **Env vars** (Vercel project + `.env.local`, template in `.env.example`): `GOOGLE_CLIENT_ID`,
  `VITE_GOOGLE_CLIENT_ID`, `ADMIN_EMAILS`, `SESSION_SECRET`, `GITHUB_TOKEN` (fine-grained PAT,
  this repo only, Contents read/write), `GITHUB_REPO`, `GITHUB_BRANCH` (optional, default `main`).
  `GITHUB_TOKEN` must never reach the client.
- Zod error messages are Spanish globally (`z.config(z.locales.es())` in `productsSchema.ts`).
- `erasableSyntaxOnly` is on: no TS parameter properties or enums anywhere (incl. `server/`).

## Images pipeline

`assets/` (repo root) holds the **source** files supplied by the owner (`logo-transparente.webp`,
`logo-fondo-crema.webp`, `og-image.png`, `tags/`). They are not served directly.
`scripts/build-assets.mjs` (sharp) derives:

- `src/assets/logo.webp` — transparent logo with surrounding whitespace trimmed (imported by
  Header/Hero/Footer and the admin header).
- `public/og-image.jpg` — 1200×630 JPEG under 300 KB. WhatsApp link previews require JPG/PNG and
  reject images over ~300 KB, so do not switch this to WebP or the original PNG.
- `public/favicon-32.png`, `favicon-192.png`, `apple-touch-icon.png` — the jasmine branch from the
  logo on a cream background.
- `src/assets/tags/*.webp` — the printed aroma tags from `assets/tags/*.{png,jpg}` (optional
  `_cuadrado` suffix), shown in the "Aromas" block inside `Catalogo`. Aromas without a tag file
  get a text card instead.

Re-run `npm run assets` after changing anything in `assets/`. Product photos are NOT part of this
pipeline: they come from the admin panel into `public/products/`.

## Analytics

Microsoft Clarity is loaded by `src/lib/clarity.ts` from `main.tsx`, only when `import.meta.env.PROD`
and `site.clarityProjectId` (in `src/data/site.ts`) is non-empty. Not loaded on the admin page.

## SEO

`index.html` carries title/description targeting "velas aromáticas artesanales en Tres Arroyos",
Open Graph tags (image = `/og-image.jpg`), and a `LocalBusiness` JSON-LD with city-level address
only. Keep the address rule when touching it. `/admin` is `noindex` (meta + `X-Robots-Tag`) and
excluded in `public/robots.txt`.

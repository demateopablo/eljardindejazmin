# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Single-page marketing/catalog site for **El Jardín de Jazmín**, a small home-based artisanal
aromatherapy business (scented candles, reed diffusers, wax melts, handmade soaps) in Tres Arroyos,
Buenos Aires, Argentina. Content and UI copy are in Argentine Spanish (voseo). Sales happen via
Instagram DM only — there is deliberately **no cart, checkout, or customer login**. The only
backend is a handful of Vercel Functions behind the owner's admin panel (see below).

The full original brief lives in `prompt-claude-code-el-jardin-de-jazmin.md`; the hard rules from it:

- Never show or mention a street address — only the city ("Tres Arroyos"). No map pins.
- Never publish a phone number or WhatsApp link: the owner does not want to expose her personal
  number. Every contact CTA opens the Instagram DM (`site.instagramDmUrl`, an `ig.me/m/…` link).
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

- `src/App.tsx` composes the page top-to-bottom: `Header` (sticky) → `Hero` → `AromaRibbon` →
  `Catalogo` → `Aromas` → `Souvenirs` → `Historia` → `InstagramFeed` → `ComoComprar` → `Seguinos`
  → `Footer`, plus the fixed `InstagramFloat` button. Products come first on purpose (visitors
  arrive from Instagram); the owner's letter (`Historia`) sits below as a trust block. Sections
  have `id`s used by anchor links; `section[id]` gets `scroll-margin-top` in `index.css`.
- **Visual language** ("apothecary by candlelight"): cream paper (with a subtle SVG grain overlay
  on `body::after`) contrasted with `night-*` bands lit by `ember-*` light. Recurring motifs:
  the **arch window** (`.arch` class in `index.css`: elliptical radii for 4:5 boxes; never use
  `rounded-t-full` there, the browser scales the bottom radii to zero), line-art jasmine
  (`Jasmine.tsx`: `JasmineFlower`, `JasmineSprig`, inspired by but never a copy of the logo),
  `font-hand` (Caveat) for handwritten notes, and `WaveEdge` for organic band edges.
  `CandleScene` (hero) is a pure SVG/CSS lit candle (flame flicker, rising smoke, light motes).
  `AromaRibbon` is a decorative (`aria-hidden`) marquee of aroma names. `Aromas` is its own dark
  section: the printed tags hang from threads and sway. Scroll reveals use the `.reveal` class
  (CSS `animation-timeline: view()`, no JS, progressive). All motion is transform/opacity and is
  disabled under `prefers-reduced-motion`. `SectionTitle` takes a `ReactNode` title (an `<em>`
  becomes the italic accent) and `tone="dark"` for night sections.
- Backgrounds: body `cream-100`; `Souvenirs` uses solid `blush-100` with `WaveEdge`s, `Historia`
  `sage-100/70` with the letter on `cream-50` paper, `ComoComprar` `cream-50`, `Aromas` and the
  ribbon `night-900`. Primary CTAs are `bg-night-900 text-ember-200` pills.
- `Souvenirs` (custom orders for events) lists example occasions and a 3-step "how it works".
  It deliberately publishes no minimum quantities, lead times or prices — everything is "to be
  discussed by DM" — and must not promise services the owner hasn't confirmed (named tags,
  packaging…). Its CTA copies `eventInquiryMessage()` via `useInquiry` (`src/lib/useProductInquiry.ts`).
- The header carries a discreet lock icon linking to `/admin` (the owner's panel) — keep it
  icon-only with `aria-label`.
- **Content is data-driven**: `src/data/site.ts` (brand/contact constants),
  `src/data/products.json` (the editable catalog — written by the admin panel; don't hand-edit
  except for migrations) and `src/data/products.ts` (categories, `aromas` list, `formatPrice`,
  and `products` = the JSON filtered by `visible`). The prose in `Historia.tsx` is the only copy
  that lives in JSX. Prices are integer ARS formatted with `Intl.NumberFormat('es-AR')`;
  `price: null` renders "Precio a consultar".
- `src/data/productsSchema.ts` is the single zod schema for products, shared by the panel and the
  API. The public bundle deliberately does NOT import zod — `products.ts` just casts the JSON.
- `src/lib/instagram.ts` provides the DM link (`instagramDmLink()`), the per-product message
  (`productInquiryMessage`, "Hola! Quiero consultar por …") and `copyToClipboard`. `ig.me` does
  NOT accept prefilled text, so `ProductCard` copies the message to the clipboard on click and
  lets the `<a target="_blank">` open the DM natively (no `preventDefault`/`window.open`).
- `Catalogo` (active tab + open lightbox index), `ProductCard` ("mensaje copiado" notice, via
  `src/lib/useProductInquiry.ts`, shared with the lightbox) and `InstagramFeed` are the only
  stateful public components. Category tabs use ARIA `tablist`/`tab`/`tabpanel`. Product photos
  are mostly portrait, so cards use a 4:5 arch frame; the first of `images` is the cover and a
  "N fotos" badge appears when there are more.
- **Lightbox**: product photos are buttons that open `src/components/ProductLightbox.tsx`
  (`yet-another-react-lightbox` + Zoom + Captions, themed with YARL CSS vars over the Tailwind
  tokens). `Catalogo` imports it with `React.lazy` and mounts it only while open, so the library
  and its CSS are a separate chunk that never loads on the initial visit. Slides are ALL photos of
  the active category flattened in grid order (`GallerySlide`), opening at the tapped product's
  first photo, so its other photos come next; captions show name (· n/total) · detail · price
  and the same "Consultar por Instagram" CTA.
- **Instagram feed**: `InstagramFeed` is the only public component that calls a Function
  (`GET /api/instagram/feed`, see below). It renders 3 skeleton cards while loading and returns
  `null` when the response is empty or fails (so with plain `npm run dev`, without Functions, the
  section simply doesn't show). No zod on the client — the response type is a local interface.
- Design tokens: `sage-*` (brand green), `cream-*` (backgrounds — never pure white), `blush`,
  `peach`, `gold` (soft accents), `ink-*` (warm text), `night-*` / `ember-*` (candlelight contrast).
  Fonts: `font-display` (Cormorant Garamond), `font-body` (Jost) and `font-hand` (Caveat), loaded
  from Google Fonts in `index.html` and `admin.html`.

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
- **Load**: the panel starts from `GET /api/products` (current `products.json` on GitHub, via
  `readRepoFile`), not the JSON bundled in the build, so a reload right after publishing is not
  stale. It falls back to the bundled catalog with a banner if the call fails.
- **Save/publish**: `POST /api/products/save` `{ products, images: [{path, base64}] }` →
  validates with the shared schema, checks every referenced photo exists in the repo or the
  payload, then makes ONE commit via the GitHub Git Data API (`server/github.ts`) touching
  `src/data/products.json` and `public/products/*.webp`, and **deleting** panel photos
  (`/products/<slug>-<digits>.webp`) that no product references anymore. The push triggers the
  Vercel deploy — that *is* the publish step (~1 min). A Function body caps at ~4.5 MB, so when
  there are more photos than fit, the panel first sends batches (≤ 8 photos / ~3.5 MB) to
  `POST /api/products/photos` (photos-only commit) and the last batch goes with `/save`.
- **Panel UX (mobile first)**: `Editor.tsx` holds the state; `ProductRow` edits price
  (`PriceField`, thousands separators, Enter jumps to the next price) and visibility (`Switch`)
  inline; everything else is in `ProductSheet` (full-screen sheet on phones). `PriceAdjustSheet`
  applies a % to a category or all, rounded to $100/$50/$10, with a before → after preview.
  "Ordenar" mode swaps the row controls for big ↑/↓. Sheets push a history entry so the phone's
  back button closes them (`useBackToClose`). Every tappable is ≥ 44 px and inputs are 16 px
  (iOS zooms on smaller). Unpublished changes are kept in IndexedDB (`lib/draft.ts`, photos
  included) and restored with a banner, because phones often reload the tab after using the
  camera. Deleting shows an undo toast; publishing is blocked if a visible product has price $0.
- **Instagram feed** (`docs/instagram.md` has the one-time setup): `server/instagram.ts` talks to
  the Instagram API with Instagram Login (`graph.instagram.com/v25.0/me/media`). The long-lived
  token (60 days) lives in **Vercel Edge Config** (`instagramToken`, `instagramTokenRefreshedAt`),
  read with `@vercel/edge-config`; `INSTAGRAM_ACCESS_TOKEN` is only the bootstrap/local fallback.
  `GET /api/instagram/feed` is public, returns `{ posts }` with `s-maxage=3600` (or an empty list
  with `s-maxage=300` on any error — it must never fail towards the site).
  `GET /api/cron/instagram-refresh` runs daily via `vercel.json` `crons`, requires
  `Authorization: Bearer $CRON_SECRET`, refreshes the token when it is ≥ 7 days old and writes it
  back through the Vercel REST API (`VERCEL_API_TOKEN`, `EDGE_CONFIG_ID`, optional
  `VERCEL_TEAM_ID`). Handlers can be exercised without Vercel by bundling with esbuild and
  mocking `globalThis.fetch`.
- **Functions** use the Web signature (`export const POST = handle(async (req: Request) => …)`).
  Shared server code lives in `server/` (outside `api/`, so it is never exposed as a route):
  `http.ts` (`handle`, `HttpError`, `json`, `readJson`, `assertSameOrigin` for CSRF),
  `session.ts`, `github.ts`, `env.ts`. `tsconfig.api.json` typechecks `api/` + `server/` with
  Node types only.
- **Photos**: each product has `images: string[]` (≤ `MAX_PHOTOS_PER_PRODUCT` = 6, first = cover).
  The schema's `z.preprocess` still accepts the legacy single `image` field and converts it, so a
  stale panel tab can't wipe photos. Photos are resized client-side (`src/admin/lib/image.ts`,
  ≤1200px WebP ~0.82) and named `/products/<id>-<timestamp>.webp` at submit time (with the final
  id). Max 400 KB each (`productsSchema.ts`).
- **Env vars** (Vercel project + `.env.local`, template in `.env.example`): `GOOGLE_CLIENT_ID`,
  `VITE_GOOGLE_CLIENT_ID`, `ADMIN_EMAILS`, `SESSION_SECRET`, `GITHUB_TOKEN` (fine-grained PAT,
  this repo only, Contents read/write), `GITHUB_REPO`, `GITHUB_BRANCH` (optional, default `main`).
  For the Instagram feed: `INSTAGRAM_ACCESS_TOKEN`, `EDGE_CONFIG` (injected by Vercel when the
  store is connected), `EDGE_CONFIG_ID`, `VERCEL_API_TOKEN`, `VERCEL_TEAM_ID` (optional),
  `CRON_SECRET`. `GITHUB_TOKEN` and `VERCEL_API_TOKEN` must never reach the client.
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

# El Jardín de Jazmín

Sitio web de **El Jardín de Jazmín**, emprendimiento de aromaterapia artesanal de
Tres Arroyos (Buenos Aires): velas aromáticas de diseño, difusores de aroma, wax melts
y jabones artesanales. Es una vidriera/catálogo de una sola página; la venta se hace
por mensaje directo de Instagram.

## Desarrollo

```bash
npm install
npm run dev            # sitio en /, panel en /admin.html (sin API)
npm run dev:full       # vercel dev: sitio + Functions en :3000 (requiere vercel link + env pull)
npm run build          # typecheck (sitio + api) + build a dist/
npm run preview        # sirve dist/
npm run lint           # oxlint
npm run assets         # regenera logo recortado, og-image.jpg, favicons y tags desde ./assets
```

## Dónde se editan las cosas

- `src/data/products.json` — productos, precios y fotos. **Lo escribe el panel `/admin`**; no
  editarlo a mano salvo migraciones.
- `src/data/products.ts` — categorías y lista de aromas.
- `src/data/site.ts` — nombre, taglines, link al DM de Instagram, redes, horario, ID de Clarity.
- `src/components/Historia.tsx` — texto de "Nuestra historia".
- `index.html` — title, meta description, Open Graph, JSON-LD.
- `assets/` — archivos fuente (logo, og-image, `tags/` de aromas). No se sirven directamente:
  `npm run assets` genera los derivados en `public/` y `src/assets/`.

## Panel de administración

`eljardindejazmin.com.ar/admin`, con login de Google. Permite editar productos, precios y fotos;
cada "Guardar y publicar" hace un commit en este repo (`src/data/products.json` +
`public/products/*.webp`) y Vercel redeploya. Guía de uso: `docs/panel-mar.md`.

Variables de entorno necesarias (ver `.env.example`): `GOOGLE_CLIENT_ID`, `VITE_GOOGLE_CLIENT_ID`,
`ADMIN_EMAILS`, `SESSION_SECRET`, `GITHUB_TOKEN`, `GITHUB_REPO`, `GITHUB_BRANCH`.

## Deploy

Vercel (framework preset: Vite) con dominio `eljardindejazmin.com.ar`. El sitio es estático; las
Functions de `api/` solo sirven al panel.

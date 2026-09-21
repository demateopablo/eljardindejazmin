# El Jardín de Jazmín

Sitio web de **El Jardín de Jazmín**, emprendimiento de aromaterapia artesanal de
Tres Arroyos (Buenos Aires): velas aromáticas de diseño, difusores de aroma, wax melts
y jabones artesanales. Es una vidriera/catálogo de una sola página; la venta se hace
por Instagram y WhatsApp.

## Desarrollo

```bash
npm install
npm run dev       # servidor local
npm run build     # typecheck + build a dist/
npm run preview   # sirve dist/
npm run lint      # oxlint
npm run assets    # regenera logo recortado, og-image.jpg y favicons desde ./assets
```

## Dónde se editan las cosas

- `src/data/site.ts` — nombre, taglines, WhatsApp, redes, horario.
- `src/data/products.ts` — catálogo: categorías, productos (con precio en pesos o `null`
  para "Precio a consultar") y la lista de aromas.
- `src/components/Historia.tsx` — texto de "Nuestra historia".
- `index.html` — title, meta description, Open Graph, JSON-LD.
- `assets/` — archivos fuente (logo, og-image, `tags/` de aromas, fotos de producto). No se sirven
  directamente: `npm run assets` genera los derivados en `public/` y `src/assets/`.

## Deploy

Estático, en Vercel (framework preset: Vite) con dominio `eljardindejazmin.com.ar`.

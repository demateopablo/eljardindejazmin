/**
 * Genera los assets derivados a partir de ./assets (fuente, subida por la dueña):
 *   - src/assets/logo.webp        logo transparente recortado (sin aire) para hero/header/footer
 *   - public/og-image.jpg         1200x630 JPG < 300 KB (WhatsApp/Facebook no aceptan WebP ni >300 KB)
 *   - public/favicon-32.png, favicon-192.png, apple-touch-icon.png  a partir de la rama del logo
 *   - src/assets/tags/*.webp      tags de aroma (assets/tags/*.png|jpg, sufijo _cuadrado opcional) a 240px
 *
 * Uso: npm run assets
 */
import sharp from 'sharp'
import { mkdir, readdir } from 'node:fs/promises'

const CREAM = { r: 0xf7, g: 0xf3, b: 0xec, alpha: 1 }

await mkdir('public', { recursive: true })
await mkdir('src/assets/tags', { recursive: true })

// ── Logo recortado para el sitio ────────────────────────────────────────
const trimmed = sharp('assets/logo-transparente.webp').trim({ threshold: 10 })
const { width: tw, height: th } = await trimmed.clone().toBuffer({ resolveWithObject: true }).then((r) => r.info)
await trimmed
  .clone()
  .resize({ width: Math.min(tw, 800) })
  .webp({ quality: 88, alphaQuality: 95 })
  .toFile('src/assets/logo.webp')
console.log(`logo.webp  (recorte ${tw}x${th})`)

// ── Open Graph ──────────────────────────────────────────────────────────
const og = await sharp('assets/og-image.png')
  .resize(1200, 630, { fit: 'cover', position: 'centre' })
  .flatten({ background: CREAM })
  .jpeg({ quality: 82, mozjpeg: true })
  .toFile('public/og-image.jpg')
console.log(`og-image.jpg  ${(og.size / 1024).toFixed(0)} KB`)

// ── Favicons: la rama de jazmín (mitad superior del logo) sobre crema ───
const trimmedBuf = await trimmed.clone().toBuffer()
const branchH = Math.round(th * 0.5)
const side = Math.max(tw, branchH)
const branch = await sharp(trimmedBuf)
  .extract({ left: 0, top: 0, width: tw, height: branchH })
  .toBuffer()
const square = sharp({
  create: { width: side, height: side, channels: 4, background: CREAM },
})
  .composite([{ input: branch, left: Math.round((side - tw) / 2), top: Math.round((side - branchH) / 2) }])
  .png()
const squareBuf = await square.toBuffer()

for (const [file, size] of [
  ['favicon-32.png', 32],
  ['favicon-192.png', 192],
  ['apple-touch-icon.png', 180],
]) {
  await sharp(squareBuf).resize(size, size).png({ compressionLevel: 9 }).toFile(`public/${file}`)
  console.log(file)
}

// ── Tags de aroma ───────────────────────────────────────────────────────
for (const file of await readdir('assets/tags')) {
  if (!/\.(png|jpe?g)$/i.test(file)) continue
  const slug = file.replace(/(_cuadrado)?\.(png|jpe?g)$/i, '').replace(/_/g, '-')
  await sharp(`assets/tags/${file}`)
    .resize({ width: 240, withoutEnlargement: true })
    .webp({ quality: 85 })
    .toFile(`src/assets/tags/${slug}.webp`)
  console.log(`tags/${slug}.webp`)
}

import { fileURLToPath, URL } from 'node:url'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    rollupOptions: {
      // Dos páginas: el sitio público y el panel de admin (/admin → admin.html vía cleanUrls de Vercel)
      input: {
        main: fileURLToPath(new URL('./index.html', import.meta.url)),
        admin: fileURLToPath(new URL('./admin.html', import.meta.url)),
      },
    },
  },
  resolve: {
    alias: {
      // Logo y fotos de producto viven en ./assets (raíz del repo), fuera de src/
      '@assets': fileURLToPath(new URL('./assets', import.meta.url)),
    },
  },
})

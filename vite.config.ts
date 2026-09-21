import { fileURLToPath, URL } from 'node:url'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      // Logo y fotos de producto viven en ./assets (raíz del repo), fuera de src/
      '@assets': fileURLToPath(new URL('./assets', import.meta.url)),
    },
  },
})

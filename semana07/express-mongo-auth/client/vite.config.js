import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// En desarrollo las llamadas a /api y /health se reenvían a la API (Render por defecto).
// Para usar la API local: API_URL=http://localhost:3000 pnpm dev
const target = process.env.API_URL || 'https://web-avanzado-ortiz.onrender.com'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': { target, changeOrigin: true },
      '/health': { target, changeOrigin: true },
    },
  },
})

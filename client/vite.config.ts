import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import mkcert from 'vite-plugin-mkcert'

export default defineConfig({
  plugins: [react(), mkcert()],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'https://localhost:5004',
        changeOrigin: true,
        secure: false,
      },
      '/images': {
        target: 'https://localhost:5004',
        changeOrigin: true,
        secure: false,
      },
    },
  },
  build: {
    outDir: '../api/wwwroot',
    chunkSizeWarningLimit: 1024,
    emptyOutDir: true,
  },
})
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    tailwindcss(),
    react()
  ],
  server: {
    allowedHosts: true,
    proxy: {
      '/predict': {
        target: 'http://localhost:5000',
        changeOrigin: true
      },
      '/download_report': {
        target: 'http://localhost:5000',
        changeOrigin: true
      },
      '/download_history_report': {
        target: 'http://localhost:5000',
        changeOrigin: true
      },
      '/history': {
        target: 'http://localhost:5000',
        changeOrigin: true
      },
      '/scans': {
        target: 'http://localhost:5000',
        changeOrigin: true
      }
    }
  }
})

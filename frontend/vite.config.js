import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8085', // Ton serveur Spring Boot
        changeOrigin: true,
        secure: false
      }
    }
  }
});
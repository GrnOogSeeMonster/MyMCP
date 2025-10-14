import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 4242,
    host: '0.0.0.0', // Allow access from outside the container
    proxy: {
      '/api': {
        target: 'http://localhost:8080', // For local dev, point to the API container port
        changeOrigin: true,
      },
    },
  },
})

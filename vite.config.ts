import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { cwd } from 'process';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // FIX: Replaced process.cwd() with imported cwd() to fix TypeScript type error.
  const env = loadEnv(mode, cwd(), '');
  return {
    plugins: [react()],
    server: {
      port: 4242,
      host: '0.0.0.0', // Allow access from outside the container
      proxy: {
        '/api': {
          target: `http://localhost:${env.API_PORT || 8080}`,
          changeOrigin: true,
        },
      },
    },
  }
});
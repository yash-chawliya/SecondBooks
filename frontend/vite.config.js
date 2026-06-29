import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // This tells Vite to forward any request starting with /api
      // to your backend server on port 5001.
      '/api': {
        target: 'http://localhost:5001',
        changeOrigin: true,
      },
    }
  }
})
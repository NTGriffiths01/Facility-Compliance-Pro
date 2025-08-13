import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 3000,
    allowedHosts: true,
    proxy: {
      '/api': {
        target: 'http://0.0.0.0:8001',
        changeOrigin: true,
        secure: true,
      }
    }
  },
  envPrefix: ['REACT_APP_']
})
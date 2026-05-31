import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  css: {
    // PostCSS config is auto-detected from postcss.config.cjs in the root
    // This block is here explicitly to confirm Vite is processing CSS
    devSourcemap: true,
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target:       'http://localhost:5000',
        changeOrigin: true,
      },
      '/uploads': {
        target:       'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
})
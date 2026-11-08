import { fileURLToPath, URL } from 'node:url'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    // Lets us write `@/components/...` instead of `../../components/...`
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})

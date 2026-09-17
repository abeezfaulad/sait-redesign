import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: process.env.VERCEL ? '/' : '/sait-redesign/',
  build: {
    outDir: process.env.VERCEL ? 'dist' : 'docs',
    emptyOutDir: true,
  },
})
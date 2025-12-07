import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // 生产环境部署在子路径 /epms 下
  base: process.env.NODE_ENV === 'production' ? '/epms/' : '/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
  }
})

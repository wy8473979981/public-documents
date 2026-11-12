import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { exec } from 'child_process'

// 通过 cmd start 打开浏览器，避免 Vite 默认使用 PowerShell 导致 EPERM 权限错误
function autoOpenBrowser(url: string) {
  return {
    name: 'auto-open-browser',
    configureServer() {
      exec(`start "" "${url}"`)
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  base: './',
  plugins: [react(), autoOpenBrowser('http://localhost:5173/')],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})

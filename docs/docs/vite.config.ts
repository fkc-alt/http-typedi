import { defineConfig } from 'vite'

export default defineConfig({
  resolve: {
    alias: {
      '@': './.vitepress'
    }
  },
  build: {
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    }
  }
})

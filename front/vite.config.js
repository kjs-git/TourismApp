import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'http://api', // Имя сервиса в docker-compose
        changeOrigin: true,
      },
      '/uploads': {
        target: 'http://api', // Тот же сервис API
        changeOrigin: true,
      }
    }
  }
})
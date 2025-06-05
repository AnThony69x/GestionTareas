import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  server: {
    port: 8080,
    proxy: {
      '/api': {
        target: 'https://gestiontareas-252537812380.europe-west1.run.app/api',
        changeOrigin: true,
      }
    }
  },
})

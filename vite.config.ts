import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import dns from 'dns'

// https://vitejs.dev/config/

dns.setDefaultResultOrder('verbatim')

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/oauth2': {
        target: `https://hikinamuri.amocrm.ru`,
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/oauth2/, '/oauth2')
      },
      '/api': {
        target: `https://hikinamuri.amocrm.ru`,
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/api/, '/api')
      },
    }
  }
})

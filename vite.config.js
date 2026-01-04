import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Home M3 Dashboard',
        short_name: 'Dashboard',
        description: 'Personal Home Hub',
        theme_color: '#1C1B1F', // M3 Surface Color
        background_color: '#1C1B1F',
        display: 'standalone', // THIS hides the browser URL bar
        orientation: 'landscape', // Best for tablet use
        icons: [
          { src: 'icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icon-512.png', sizes: '512x512', type: 'image/png' }
        ]
      }
    })
  ]
})
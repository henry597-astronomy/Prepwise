import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  base: './',
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: 'auto',
      includeAssets: ['icons/prepwise-mark.svg'],
      manifest: {
        name: 'Prepwise MatricMaster',
        short_name: 'Prepwise',
        description: 'Offline-first Grade 12 matric examination preparation.',
        theme_color: '#080d22',
        background_color: '#080d22',
        display: 'standalone',
        start_url: './',
        scope: './',
        icons: [
          { src: './icons/prepwise-mark.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any maskable' },
        ],
      },
      workbox: {
        navigateFallback: 'index.html',
        clientsClaim: true,
        skipWaiting: true,
        cleanupOutdatedCaches: true,
        globPatterns: ['**/*.{js,css,html,svg,png,webp}'],
      },
    }),
  ],
  resolve: {
    alias: { '@': '/src' },
  },
  server: {
    port: 3000,
    host: '0.0.0.0',
  },
});

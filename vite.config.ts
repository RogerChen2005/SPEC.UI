import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';
import vuetify from 'vite-plugin-vuetify';

export default defineConfig({
  base: './',
  build:{
    outDir: 'spec'
  },
  plugins: [
    vue(),
    vuetify({
      autoImport: true,
    })
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '~': resolve(__dirname, 'src/'),
    },
  },
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:60708',
        changeOrigin: true,
      },
    },
  },
});


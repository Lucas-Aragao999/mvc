// Configura React, publicação sob /painel/ e proxy local para o Express.
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/painel/',
  plugins: [react()],
  server: { proxy: { '/api': 'http://localhost:3000' } },
  test: { environment: 'jsdom', globals: true, maxWorkers: 1, pool: 'forks' }
});

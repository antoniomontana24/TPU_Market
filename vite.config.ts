import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// When the Node backend exists, proxy /api to it so the frontend can call fetch('/api/...')
export default defineConfig({
  plugins: [react()],
  server: { proxy: { '/api': 'http://localhost:3000' } },
});

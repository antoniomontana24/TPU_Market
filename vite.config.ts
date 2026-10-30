import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';


export default defineConfig({
  plugins: [react()],
  base: '/TPU_Market/',
  build: {
    outDir: 'docs',
  },
});

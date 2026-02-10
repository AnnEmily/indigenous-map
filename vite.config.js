import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
  ],
  build: {
    outDir: 'docs' // Output build to a folder named 'docs'
  },
  base: '/indigenous-map/', // add this before refs to assets in final URL
});

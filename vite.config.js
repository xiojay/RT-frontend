import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000', // Replace with your backend URL
        changeOrigin: true, // Adjust the origin to match the target
        rewrite: (path) => path.replace(/^\/api/, ''), // Remove '/api' prefix before forwarding
      },
    },
  },
});

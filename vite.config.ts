import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react({
      // React Compiler disabled temporarily due to build issues
      // babel: {
      //   plugins: [
      //     ['babel-plugin-react-compiler', {}],
      //   ],
      // },
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  // Development optimizations
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom'],
  },
  // Vite automatically handles SPA routing in dev mode
  // For production, use public/_redirects file for deployment platforms
});

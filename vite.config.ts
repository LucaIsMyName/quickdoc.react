import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import mdx from '@mdx-js/rollup';
import path from 'path';
import fs from 'fs';

// Custom plugin to handle raw MDX content loading
const rawMdxPlugin = () => ({
  name: 'raw-mdx',
  enforce: 'pre' as const,
  resolveId(id: string) {
    // Handle virtual modules for raw MDX
    if (id.includes('?raw-mdx')) {
      return id; // Return the ID as-is to handle in load
    }
    return null;
  },
  load(id: string) {
    // Only handle .mdx files with ?raw-mdx query
    if (id.endsWith('?raw-mdx')) {
      const filePath = id.replace('?raw-mdx', '');
      console.log('[raw-mdx plugin] Reading raw content from:', filePath);
      try {
        const content = fs.readFileSync(filePath, 'utf-8');
        console.log('[raw-mdx plugin] Content length:', content.length);
        return `export default ${JSON.stringify(content)}`;
      } catch (err) {
        console.error(`[raw-mdx plugin] Failed to read MDX file: ${filePath}`, err);
        return `export default ""`;
      }
    }
    return null;
  },
});

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    // Raw MDX plugin must come first
    rawMdxPlugin(),
    // MDX plugin must come before React plugin
    // Configure to ONLY process .mdx files, exclude .md files
    mdx({
      providerImportSource: '@mdx-js/react',
      include: /\.mdx$/,
      exclude: /\.md$/,
    }),
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

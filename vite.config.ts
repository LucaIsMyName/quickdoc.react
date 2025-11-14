import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import mdx from '@mdx-js/rollup';
import path from 'path';
import fs from 'fs';
import { validateFilePath } from './src/utils/security';

// Custom plugin to handle raw MDX content loading
// This runs BEFORE the MDX plugin to intercept .mdx?mdx-raw requests
const rawMdxPlugin = () => ({
  name: 'raw-mdx',
  enforce: 'pre' as const,
  
  // Use resolveId to intercept early
  resolveId(id: string) {
    if (id.includes('.mdx?mdx-raw')) {
      console.log('[raw-mdx plugin] resolveId intercepted:', id);
      // Return a resolved ID that Vite will recognize
      return id;
    }
    return null;
  },
  
  // Add configureServer to handle HTTP requests in dev mode
  configureServer(server) {
    server.middlewares.use((req, res, next) => {
      if (req.url?.includes('.mdx?mdx-raw')) {
        console.log('[raw-mdx plugin] HTTP request intercepted:', req.url);
        
        // Extract file path
        let filePath = req.url.split('?')[0] ?? '';
        
        // Convert to absolute path
        if (filePath.startsWith('/src/pages/')) {
          filePath = path.resolve(__dirname, '.' + filePath);
        } else if (filePath.startsWith('/pages/')) {
          filePath = path.resolve(__dirname, 'src' + filePath);
        } else {
          return next();
        }
        
        try {
          const content = fs.readFileSync(filePath, 'utf-8');
          console.log('[raw-mdx plugin] ✅ HTTP: Raw content loaded, length:', content.length);
          
          // Return as JavaScript module
          res.setHeader('Content-Type', 'application/javascript');
          res.end(`export default ${JSON.stringify(content)}`);
          return;
        } catch (err) {
          console.error('[raw-mdx plugin] ❌ HTTP failed:', err);
          return next();
        }
      }
      next();
    });
  },
  
  // Use load to provide the content
  load(id: string) {
    if (id.includes('.mdx?mdx-raw')) {
      console.log('[raw-mdx plugin] load intercepted:', id);
      
      // Extract the file path without query
      let filePath = id.split('?')[0];
      console.log('[raw-mdx plugin] Original file path:', filePath);
      
      try {
        // Validate file path to prevent path traversal attacks
        validateFilePath(filePath, ['/pages/', '/src/pages/']);
      } catch (error) {
        console.error('[raw-mdx plugin] ❌ Path validation failed:', error);
        return `export default ""`;
      }
      
      // Convert Vite's virtual path to actual file system path
      // Vite transforms /src/pages/file.mdx to /pages/file.mdx
      if (filePath.startsWith('/pages/')) {
        // This is the transformed path, convert back to src/pages
        filePath = path.resolve(__dirname, 'src' + filePath);
      } else if (filePath.startsWith('/')) {
        // Other absolute paths, resolve relative to project root
        filePath = path.resolve(__dirname, '.' + filePath);
      } else {
        // Relative paths
        filePath = path.resolve(__dirname, filePath);
      }
      
      console.log('[raw-mdx plugin] Resolved file path:', filePath);
      
      try {
        const content = fs.readFileSync(filePath, 'utf-8');
        console.log('[raw-mdx plugin] ✅ Raw content loaded, length:', content.length);
        console.log('[raw-mdx plugin] Content preview:', content.substring(0, 100));
        
        // Return the raw content as a module export
        return `export default ${JSON.stringify(content)}`;
      } catch (err) {
        console.error('[raw-mdx plugin] ❌ Failed to read:', filePath, err);
        return `export default ""`;
      }
    }
    return null;
  },
  
  // Also intercept in transform as backup
  transform(code: string, id: string) {
    if (id.includes('.mdx?mdx-raw')) {
      console.log('[raw-mdx plugin] transform intercepted:', id);
      
      // Extract the file path without query
      let filePath = id.split('?')[0];
      console.log('[raw-mdx plugin] Transform original file path:', filePath);
      
      try {
        // Validate file path to prevent path traversal attacks
        validateFilePath(filePath, ['/pages/', '/src/pages/']);
      } catch (error) {
        console.error('[raw-mdx plugin] ❌ Transform path validation failed:', error);
        return null;
      }
      
      // Convert Vite's virtual path to actual file system path
      // Vite transforms /src/pages/file.mdx to /pages/file.mdx
      if (filePath.startsWith('/pages/')) {
        // This is the transformed path, convert back to src/pages
        filePath = path.resolve(__dirname, 'src' + filePath);
      } else if (filePath.startsWith('/')) {
        // Other absolute paths, resolve relative to project root
        filePath = path.resolve(__dirname, '.' + filePath);
      } else {
        // Relative paths
        filePath = path.resolve(__dirname, filePath);
      }
      
      console.log('[raw-mdx plugin] Transform resolved file path:', filePath);
      
      try {
        const content = fs.readFileSync(filePath, 'utf-8');
        console.log('[raw-mdx plugin] ✅ Transform: Raw content loaded, length:', content.length);
        
        // Return the raw content as a module export
        return {
          code: `export default ${JSON.stringify(content)}`,
          map: null
        };
      } catch (err) {
        console.error('[raw-mdx plugin] ❌ Transform failed:', filePath, err);
        return null;
      }
    }
    return null;
  }
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
      babel: {
        plugins: [
          ['babel-plugin-react-compiler', {}],
        ],
      },
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      'react/compiler-runtime': 'react-compiler-runtime',
    },
  },
  // Development optimizations
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom'],
  },
  // Vite automatically handles SPA routing in dev mode
  // For production, use public/_redirects file for deployment platforms
});

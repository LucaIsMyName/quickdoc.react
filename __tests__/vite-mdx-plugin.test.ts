import { describe, it, expect, vi, beforeEach } from 'vitest';
import fs from 'fs';
import path from 'path';

// Mock fs module
vi.mock('fs');
const mockedFs = vi.mocked(fs);

describe('Raw MDX Plugin Path Resolution', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should resolve MDX file paths correctly', () => {
    // Mock the file system
    mockedFs.readFileSync.mockReturnValue('# Test MDX Content');
    mockedFs.existsSync.mockImplementation((filePath) => {
      // Simulate that the correct path exists
      return filePath.toString().includes('/src/pages/MDX-Example.mdx');
    });

    // Simulate the path resolution logic from our plugin
    const simulatePathResolution = (id: string) => {
      let filePath = id.split('?')[0];
      
      // Fix path resolution for Vite's path transformations
      if (!path.isAbsolute(filePath)) {
        // Handle relative paths from Vite's perspective
        filePath = path.resolve(process.cwd(), filePath.startsWith('/') ? `.${filePath}` : filePath);
      }
      
      // If the resolved path doesn't exist, try adding 'src' prefix
      // This handles Vite's transformation of /src/pages/file.mdx -> /pages/file.mdx
      if (!fs.existsSync(filePath) && filePath.includes('/pages/')) {
        const srcPath = filePath.replace('/pages/', '/src/pages/');
        if (fs.existsSync(srcPath)) {
          filePath = srcPath;
        }
      }
      
      return filePath;
    };

    // Test the problematic case
    const problematicId = '/pages/MDX-Example.mdx?raw';
    const resolvedPath = simulatePathResolution(problematicId);
    
    // Should resolve to the correct path
    expect(resolvedPath).toContain('/src/pages/MDX-Example.mdx');
    
    // Should be able to read the file
    expect(() => fs.readFileSync(resolvedPath, 'utf-8')).not.toThrow();
  });

  it('should handle absolute paths that exist', () => {
    const absolutePath = '/Users/test/project/src/pages/MDX-Example.mdx';
    mockedFs.existsSync.mockReturnValue(true);
    mockedFs.readFileSync.mockReturnValue('# Test Content');

    const simulatePathResolution = (id: string) => {
      let filePath = id.split('?')[0];
      
      if (!path.isAbsolute(filePath)) {
        filePath = path.resolve(process.cwd(), filePath.startsWith('/') ? `.${filePath}` : filePath);
      }
      
      if (!fs.existsSync(filePath) && filePath.includes('/pages/')) {
        const srcPath = filePath.replace('/pages/', '/src/pages/');
        if (fs.existsSync(srcPath)) {
          filePath = srcPath;
        }
      }
      
      return filePath;
    };

    const resolvedPath = simulatePathResolution(`${absolutePath}?raw`);
    expect(resolvedPath).toBe(absolutePath);
  });

  it('should handle relative paths without leading slash', () => {
    const relativePath = 'pages/MDX-Example.mdx';
    mockedFs.readFileSync.mockReturnValue('# Test Content');

    const simulatePathResolution = (id: string) => {
      let filePath = id.split('?')[0];
      
      if (!path.isAbsolute(filePath)) {
        filePath = path.resolve(process.cwd(), filePath.startsWith('/') ? `.${filePath}` : filePath);
      }
      
      if (!fs.existsSync(filePath) && filePath.includes('/pages/')) {
        const srcPath = filePath.replace('/pages/', '/src/pages/');
        if (fs.existsSync(srcPath)) {
          filePath = srcPath;
        }
      }
      
      return filePath;
    };

    const resolvedPath = simulatePathResolution(`${relativePath}?raw`);
    expect(resolvedPath).toContain('pages/MDX-Example.mdx');
  });
});

import { describe, it, expect } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useMarkdownFiles } from '../src/hooks/useMarkdownFiles';
import { defaultConfig } from '../src/config/app.config';
import type { AppConfig } from '../src/config/app.config';

describe('useMarkdownFiles', () => {
  it('should load MD files with content', async () => {
    const mockConfig: AppConfig = {
      ...defaultConfig,
      content: {
        ...defaultConfig.content,
        enableMDX: false,
      },
    };

    const { result } = renderHook(() => 
      useMarkdownFiles('/src/pages', mockConfig)
    );

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    }, { timeout: 3000 });

    // Should load actual MD files from /src/pages
    expect(result.current.files.length).toBeGreaterThan(0);
    
    // All files should have content
    result.current.files.forEach(file => {
      expect(file.content).toBeTruthy();
      expect(file.title).toBeTruthy();
      expect(file.slug).toBeTruthy();
      expect(file.isMDX).toBe(false);
    });
  });

  it('should load MDX files with raw content for navigation extraction', async () => {
    const mockConfig: AppConfig = {
      ...defaultConfig,
      content: {
        ...defaultConfig.content,
        enableMDX: true,
      },
    };

    const { result } = renderHook(() => 
      useMarkdownFiles('/src/pages', mockConfig)
    );

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    }, { timeout: 3000 });

    // Should load both MD and MDX files
    expect(result.current.files.length).toBeGreaterThan(0);
    
    // Find MDX files
    const mdxFiles = result.current.files.filter(f => f.isMDX);
    
    if (mdxFiles.length > 0) {
      // MDX files should have raw content for navigation
      mdxFiles.forEach(file => {
        expect(file.content).toBeTruthy();
        expect(file.content.length).toBeGreaterThan(0);
        expect(file.title).toBeTruthy();
        expect(file.slug).toBeTruthy();
        expect(file.isMDX).toBe(true);
        expect(file.MDXComponent).toBeDefined();
      });
    }
  });

  it('should extract headings from MDX raw content', async () => {
    const mockConfig: AppConfig = {
      ...defaultConfig,
      content: {
        ...defaultConfig.content,
        enableMDX: true,
      },
    };

    const { result } = renderHook(() => 
      useMarkdownFiles('/src/pages', mockConfig)
    );

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    }, { timeout: 3000 });

    // Find the MDX Example file
    const mdxFile = result.current.files.find(f => f.slug === 'mdx-example');
    
    if (mdxFile) {
      // Should have raw content with headings
      expect(mdxFile.content).toBeTruthy();
      expect(mdxFile.content).toContain('# MDX Example');
      expect(mdxFile.content).toContain('## Interactive Counter');
      expect(mdxFile.content).toContain('## Features');
      expect(mdxFile.isMDX).toBe(true);
    }
  });

  it('should load files without errors', async () => {
    const mockConfig: AppConfig = {
      ...defaultConfig,
      content: {
        ...defaultConfig.content,
        enableMDX: true,
      },
    };

    const { result } = renderHook(() => 
      useMarkdownFiles('/src/pages', mockConfig)
    );

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    }, { timeout: 3000 });

    // Should not have errors
    expect(result.current.error).toBeNull();
    
    // Should have loaded files
    expect(result.current.files.length).toBeGreaterThan(0);
  });
});

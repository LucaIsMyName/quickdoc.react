/**
 * MDX Runtime Compiler
 * Compiles MDX source code into React components at runtime
 */

import { compile } from '@mdx-js/mdx';
import React from 'react';

// Cache for compiled MDX components
const compilationCache = new Map<string, React.ComponentType>();

/**
 * Compile MDX source to a React component
 * Uses caching to avoid recompiling the same content
 */
export const compileMDX = async (
  mdxSource: string,
  cacheKey: string
): Promise<React.ComponentType> => {
  // Check cache first
  if (compilationCache.has(cacheKey)) {
    const cached = compilationCache.get(cacheKey);
    if (cached) {
      console.log(`[MDX Compiler] Using cached component for: ${cacheKey}`);
      return cached;
    }
  }

  console.log(`[MDX Compiler] Compiling MDX for: ${cacheKey}`);
  console.log(`[MDX Compiler] Source length: ${mdxSource.length} chars`);

  try {
    // Compile MDX to JavaScript
    const compiled = await compile(mdxSource, {
      outputFormat: 'function-body',
      development: false,
      jsxRuntime: 'automatic',
      jsxImportSource: 'react',
      // Remove providerImportSource to avoid _provideComponents dependency
      // providerImportSource: '@mdx-js/react',
    });

    const compiledCode = String(compiled);
    console.log(`[MDX Compiler] Compiled code length: ${compiledCode.length} chars`);
    console.log(`[MDX Compiler] Compiled code preview:`, compiledCode.substring(0, 500));

    // With automatic JSX runtime and function-body format, 
    // we can execute the compiled code directly
    const componentFunction = new Function(
      'React',
      compiledCode
    );

    // Execute the function to get the component
    const Component = componentFunction(React);

    // Cache the compiled component
    compilationCache.set(cacheKey, Component);
    console.log(`[MDX Compiler] Successfully compiled and cached: ${cacheKey}`);

    return Component;
  } catch (error) {
    console.error(`[MDX Compiler] Compilation failed for ${cacheKey}:`, error);
    
    // Return an error component
    return () => (
      React.createElement('div', {
        className: 'p-4 border border-red-500 bg-red-50 dark:bg-red-900/20 rounded',
      }, [
        React.createElement('h3', {
          key: 'title',
          className: 'text-red-700 dark:text-red-300 font-bold mb-2'
        }, 'MDX Compilation Error'),
        React.createElement('pre', {
          key: 'error',
          className: 'text-sm text-red-600 dark:text-red-400 whitespace-pre-wrap'
        }, String(error))
      ])
    );
  }
};

/**
 * Clear compilation cache (useful for development/hot reload)
 */
export const clearCompilationCache = () => {
  compilationCache.clear();
  console.log('[MDX Compiler] Cache cleared');
};

/**
 * Get cache stats
 */
export const getCacheStats = () => {
  return {
    size: compilationCache.size,
    keys: Array.from(compilationCache.keys()),
  };
};

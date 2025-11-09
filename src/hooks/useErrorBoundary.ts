import { useCallback } from 'react';

/**
 * Hook for manually triggering error boundaries
 * Useful for async operations or event handlers
 */
export const useErrorBoundary = () => {
  const throwError = useCallback((error: Error | string) => {
    const errorToThrow = typeof error === 'string' ? new Error(error) : error;
    
    // Throw error in next tick to ensure it's caught by error boundary
    setTimeout(() => {
      throw errorToThrow;
    }, 0);
  }, []);

  return { throwError };
};

/**
 * Hook for handling async errors that should be caught by error boundaries
 */
export const useAsyncError = () => {
  const { throwError } = useErrorBoundary();

  const catchAsync = useCallback(
    (asyncFn: () => Promise<any>) => {
      return asyncFn().catch((error) => {
        console.error('Async error caught:', error);
        throwError(error);
      });
    },
    [throwError]
  );

  return { catchAsync, throwError };
};

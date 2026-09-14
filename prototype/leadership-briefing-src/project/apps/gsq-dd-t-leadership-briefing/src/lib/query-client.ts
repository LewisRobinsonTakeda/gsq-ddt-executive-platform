import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Stale time: how long data is considered fresh (5 minutes)
      staleTime: 5 * 60 * 1000,
      // Cache time: how long data stays in cache when unused (10 minutes)
      gcTime: 10 * 60 * 1000,
      // Disable retries
      retry: false,
      // Don't refetch on window focus by default
      refetchOnWindowFocus: false,
      // Don't retry on mount
      retryOnMount: false,
    },
    mutations: {
      // Disable retries for mutations
      retry: false,
    },
  },
});

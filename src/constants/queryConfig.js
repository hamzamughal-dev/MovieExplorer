import { keepPreviousData } from '@tanstack/react-query';

export const REACT_QUERY_CONFIG = {
  DEFAULT: {
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
    retry: 1,
  },
  REALTIME: {
    staleTime: 0,
    gcTime: 0,
    refetchOnWindowFocus: false,
    retry: 0,
  },
  STATIC: {
    staleTime: Infinity,
    gcTime: Infinity,
    refetchOnWindowFocus: false,
    retry: 0,
  },
  LONG_CACHE: {
    staleTime: 10 * 60 * 60 * 1000,
    gcTime: 20 * 60 * 60 * 1000,
    refetchOnWindowFocus: false,
    retry: 0,
  },
  NO_CACHE: {
    staleTime: 0,
    gcTime: 1000 * 60 * 5,
    refetchOnMount: true,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    placeholderData: keepPreviousData,
    retry: 1,
  },
};

import { useState, useMemo } from 'react';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';

import useAuth from './useAuth';
import { getMovies, searchMovies } from '../api/api';
import { REACT_QUERY_CONFIG } from '../constants/queryConfig';

export function useMovies(debouncedQuery = '') {
    const { isLoggedIn } = useAuth();

    const trimmedQuery = debouncedQuery.trim();

    const {
        data: movieData,
        fetchNextPage,
        hasNextPage,
        isLoading,
        isFetchingNextPage,
        error
    } = useInfiniteQuery({
        queryKey: ['movies'],
        queryFn: ({ pageParam = 1 }) => getMovies(pageParam),
        initialPageParam: 1,
        getNextPageParam: (lastPage, pages) => {
            const currentPage = pages.length;
            const totalPages = lastPage?.data?.total_pages;
            return totalPages && currentPage < totalPages ? currentPage + 1 : undefined;
        },
        enabled: isLoggedIn && !trimmedQuery,
        staleTime: REACT_QUERY_CONFIG.DEFAULT.staleTime
    });

    const {
        data: searchData,
        isLoading: isSearching,
        error: searchError
    } = useQuery({
        queryKey: ['searchMovies', trimmedQuery],
        queryFn: () => searchMovies(trimmedQuery),
        enabled: isLoggedIn && trimmedQuery.length > 0,
        staleTime: REACT_QUERY_CONFIG.NO_CACHE.staleTime
    });

    const movies = Array.from(
        new Map(movieData?.pages.flatMap(p => p.data.results || []).map(m => [m.id, m])).values()
    );
    const searchResults = searchData?.data?.results ?? [];

    const isSearchMode = trimmedQuery.length > 0;
    const displayMovies = isSearchMode ? searchResults : movies;

    return {
        isLoggedIn,
        displayMovies,
        isLoading: isSearchMode ? isSearching : isLoading,
        isFetchingNextPage,
        hasNextPage,
        fetchNextPage,
        error: isSearchMode ? searchError : error,
        isSearchMode
    };
}


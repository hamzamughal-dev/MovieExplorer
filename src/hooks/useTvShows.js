import { useState } from 'react';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';

import useAuth from './useAuth';
import { getTvShows, searchMedia } from '../api/api';
import { REACT_QUERY_CONFIG } from '../constants/queryConfig';

export function useTvShows(debouncedQuery = '') {
    const { isLoggedIn } = useAuth();

    const trimmedQuery = debouncedQuery.trim();

    const {
        data: tvData,
        fetchNextPage,
        hasNextPage,
        isLoading,
        isFetchingNextPage,
        error
    } = useInfiniteQuery({
        queryKey: ['tvShows'],
        queryFn: ({ pageParam = 1 }) => getTvShows(pageParam),
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
        queryKey: ['searchTvShows', trimmedQuery],
        queryFn: () => searchMedia(trimmedQuery, 1, 'tv'),
        enabled: isLoggedIn && trimmedQuery.length > 0,
        staleTime: REACT_QUERY_CONFIG.NO_CACHE.staleTime
    });

    const tvShows = Array.from(
        new Map(tvData?.pages.flatMap(p => p.data.results || []).map(t => [t.id, t])).values()
    );
    const searchResults = searchData?.data?.results ?? [];

    const isSearchMode = trimmedQuery.length > 0;
    const displayTvShows = isSearchMode ? searchResults : tvShows;

    return {
        isLoggedIn,
        displayTvShows,
        isLoading: isSearchMode ? isSearching : isLoading,
        isFetchingNextPage,
        hasNextPage,
        fetchNextPage,
        error: isSearchMode ? searchError : error,
        isSearchMode
    };
}

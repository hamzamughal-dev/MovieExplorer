import { useInfiniteQuery } from '@tanstack/react-query';
import useAuth from './useAuth';
import { getMovies, getTvShows, searchMedia } from '../api/api';
import { REACT_QUERY_CONFIG } from '../constants/queryConfig';

export function useMediaList(type = 'movie', debouncedQuery = '') {
    const { isLoggedIn } = useAuth();
    const trimmedQuery = debouncedQuery.trim();

    const isTv = type === 'tv';
    const fetchFn = isTv ? getTvShows : getMovies;

    const {
        data: listData,
        fetchNextPage: fetchNextListPage,
        hasNextPage: hasNextListPage,
        isLoading: isListLoading,
        isFetchingNextPage: isFetchingNextListPage,
        error: listError,
    } = useInfiniteQuery({
        queryKey: ['media', 'trending', type],
        queryFn: ({ pageParam = 1 }) => fetchFn(pageParam),
        initialPageParam: 1,
        getNextPageParam: (lastPage, pages) => {
            const currentPage = pages.length;
            const totalPages = lastPage?.data?.total_pages;
            return totalPages && currentPage < totalPages ? currentPage + 1 : undefined;
        },
        enabled: isLoggedIn && !trimmedQuery,
        staleTime: REACT_QUERY_CONFIG.DEFAULT.staleTime,
    });

    const {
        data: searchData,
        fetchNextPage: fetchNextSearchPage,
        hasNextPage: hasNextSearchPage,
        isLoading: isSearching,
        isFetchingNextPage: isFetchingNextSearchPage,
        error: searchError,
    } = useInfiniteQuery({
        queryKey: ['media', 'search', type, trimmedQuery],
        queryFn: ({ pageParam = 1 }) => searchMedia(trimmedQuery, pageParam, type),
        initialPageParam: 1,
        getNextPageParam: (lastPage, pages) => {
            const currentPage = pages.length;
            const totalPages = lastPage?.data?.total_pages;
            return totalPages && currentPage < totalPages ? currentPage + 1 : undefined;
        },
        enabled: isLoggedIn && trimmedQuery.length > 0,
        staleTime: REACT_QUERY_CONFIG.NO_CACHE.staleTime,
    });

    const isSearchMode = trimmedQuery.length > 0;

    const items = Array.from(
        new Map(
            listData?.pages
                ?.flatMap((p) => p.data.results || [])
                .map((item) => [item.id, { ...item, media_type: type }]) || []
        ).values()
    );

    const searchResults = Array.from(
        new Map(
            searchData?.pages
                ?.flatMap((p) => p.data.results || [])
                .map((item) => [item.id, { ...item, media_type: type }]) || []
        ).values()
    );

    const displayItems = isSearchMode ? searchResults : items;

    return {
        isLoggedIn,
        displayItems,
        isLoading: isSearchMode ? isSearching : isListLoading,
        isFetchingNextPage: isSearchMode ? isFetchingNextSearchPage : isFetchingNextListPage,
        hasNextPage: isSearchMode ? hasNextSearchPage : hasNextListPage,
        fetchNextPage: isSearchMode ? fetchNextSearchPage : fetchNextListPage,
        error: isSearchMode ? searchError : listError,
        isSearchMode,
    };
}

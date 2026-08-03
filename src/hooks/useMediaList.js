import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import useAuth from './useAuth';
import { getMovies, getTvShows, searchMedia } from '../api/api';
import { REACT_QUERY_CONFIG } from '../constants/queryConfig';

export function useMediaList(type = 'movie', debouncedQuery = '') {
    const { isLoggedIn } = useAuth();
    const trimmedQuery = debouncedQuery.trim();

    const isTv = type === 'tv';
    const fetchFn = isTv ? getTvShows : getMovies;
    const queryKeyPrefix = isTv ? 'tvShows' : 'movies';

    const {
        data: listData,
        fetchNextPage,
        hasNextPage,
        isLoading,
        isFetchingNextPage,
        error,
    } = useInfiniteQuery({
        queryKey: [queryKeyPrefix],
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
        isLoading: isSearching,
        error: searchError,
    } = useQuery({
        queryKey: [`search_${type}`, trimmedQuery],
        queryFn: () => searchMedia(trimmedQuery, 1, type),
        enabled: isLoggedIn && trimmedQuery.length > 0,
        staleTime: REACT_QUERY_CONFIG.NO_CACHE.staleTime,
    });

    const items = Array.from(
        new Map(
            listData?.pages
                .flatMap((p) => p.data.results || [])
                .map((item) => [item.id, { ...item, media_type: type }])
        ).values()
    );

    const searchResults = (searchData?.data?.results ?? []).map((item) => ({
        ...item,
        media_type: type,
    }));

    const isSearchMode = trimmedQuery.length > 0;
    const displayItems = isSearchMode ? searchResults : items;

    return {
        isLoggedIn,
        displayItems,
        isLoading: isSearchMode ? isSearching : isLoading,
        isFetchingNextPage,
        hasNextPage,
        fetchNextPage,
        error: isSearchMode ? searchError : error,
        isSearchMode,
    };
}

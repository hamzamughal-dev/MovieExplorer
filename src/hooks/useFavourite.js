import { useInfiniteQuery } from '@tanstack/react-query';

import useAuth from './useAuth';
import { getFavourites } from '../api/api';
import { REACT_QUERY_CONFIG } from '../constants/queryConfig';

export function useFavourite() {
    const { isLoggedIn, accountID, sessionID } = useAuth();

    const {
        data: moviesData,
        fetchNextPage: fetchNextMoviePage,
        hasNextPage: hasNextMoviePage,
        isLoading: isMoviesLoading,
        isFetchingNextPage: isFetchingNextMoviePage,
        error: moviesError,
    } = useInfiniteQuery({
        queryKey: ["favourites", accountID, "movie"],
        queryFn: ({ pageParam = 1 }) => getFavourites(accountID, sessionID, "movie", pageParam),
        initialPageParam: 1,
        getNextPageParam: (lastPage, pages) => {
            const currentPage = pages.length;
            const totalPages = lastPage?.data?.total_pages;
            return totalPages && currentPage < totalPages ? currentPage + 1 : undefined;
        },
        enabled: !!accountID && !!sessionID,
        staleTime: REACT_QUERY_CONFIG.DEFAULT.staleTime,
        gcTime: REACT_QUERY_CONFIG.DEFAULT.gcTime,
    });

    const {
        data: tvData,
        fetchNextPage: fetchNextTvPage,
        hasNextPage: hasNextTvPage,
        isLoading: isTvLoading,
        isFetchingNextPage: isFetchingNextTvPage,
        error: tvError,
    } = useInfiniteQuery({
        queryKey: ["favourites", accountID, "tv"],
        queryFn: ({ pageParam = 1 }) => getFavourites(accountID, sessionID, "tv", pageParam),
        initialPageParam: 1,
        getNextPageParam: (lastPage, pages) => {
            const currentPage = pages.length;
            const totalPages = lastPage?.data?.total_pages;
            return totalPages && currentPage < totalPages ? currentPage + 1 : undefined;
        },
        enabled: !!accountID && !!sessionID,
        staleTime: REACT_QUERY_CONFIG.DEFAULT.staleTime,
        gcTime: REACT_QUERY_CONFIG.DEFAULT.gcTime,
    });

    const favoriteMovies = Array.from(
        new Map(
            moviesData?.pages
                ?.flatMap((p) => p.data.results || [])
                .map((m) => [m.id, { ...m, media_type: 'movie' }]) || []
        ).values()
    );

    const favoriteTv = Array.from(
        new Map(
            tvData?.pages
                ?.flatMap((p) => p.data.results || [])
                .map((t) => [t.id, { ...t, media_type: 'tv' }]) || []
        ).values()
    );

    const movies = [...favoriteMovies, ...favoriteTv];

    const hasNextPage = Boolean(hasNextMoviePage || hasNextTvPage);
    const isFetchingNextPage = Boolean(isFetchingNextMoviePage || isFetchingNextTvPage);

    const fetchNextPage = () => {
        if (hasNextMoviePage) fetchNextMoviePage();
        if (hasNextTvPage) fetchNextTvPage();
    };

    return {
        isLoggedIn,
        movies,
        isLoading: isMoviesLoading || isTvLoading,
        isFetchingNextPage,
        hasNextPage,
        fetchNextPage,
        error: moviesError || tvError,
    };
}

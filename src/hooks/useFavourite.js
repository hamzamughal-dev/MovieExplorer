import { useQuery } from '@tanstack/react-query';

import useAuth from './useAuth';
import { getFavourites } from '../api/api';
import { REACT_QUERY_CONFIG } from '../constants/queryConfig';

export function useFavourite() {
    const { isLoggedIn, accountID, sessionID } = useAuth();

    const {
        data: moviesData,
        isLoading: isMoviesLoading,
        error: moviesError
    } = useQuery({
        queryKey: ["favourites", accountID, "movie"],
        queryFn: () => getFavourites(accountID, sessionID, "movie"),
        enabled: !!accountID,
        staleTime: REACT_QUERY_CONFIG.DEFAULT.staleTime,
        gcTime: REACT_QUERY_CONFIG.DEFAULT.gcTime,
    });

    const {
        data: tvData,
        isLoading: isTvLoading,
        error: tvError
    } = useQuery({
        queryKey: ["favourites", accountID, "tv"],
        queryFn: () => getFavourites(accountID, sessionID, "tv"),
        enabled: !!accountID,
        staleTime: REACT_QUERY_CONFIG.DEFAULT.staleTime,
        gcTime: REACT_QUERY_CONFIG.DEFAULT.gcTime,
    });

    const favoriteMovies = (moviesData?.data?.results ?? []).map(m => ({ ...m, media_type: 'movie' }));
    const favoriteTv = (tvData?.data?.results ?? []).map(t => ({ ...t, media_type: 'tv' }));
    const movies = [...favoriteMovies, ...favoriteTv];

    return {
        isLoggedIn,
        movies,
        isLoading: isMoviesLoading || isTvLoading,
        error: moviesError || tvError
    };
}

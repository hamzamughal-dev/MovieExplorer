import { useQuery } from '@tanstack/react-query';

import useAuth from './useAuth';
import { getFavourites } from '../api/api';
import { QUERY_CONFIG } from '../constants/queryConfig';

export function useFavourite() {
    const { isLoggedIn, accountID } = useAuth();

    const {
        data: favouritesData,
        isLoading,
        error
    } = useQuery({
        queryKey: ["favourites", accountID],
        queryFn: () => getFavourites(accountID),
        enabled: !!accountID,
        staleTime: QUERY_CONFIG.FAVOURITES.staleTime,
        gcTime: QUERY_CONFIG.FAVOURITES.gcTime,
    });

    const movies = favouritesData?.data?.results ?? [];

    return {
        isLoggedIn,
        movies,
        isLoading,
        error
    };
}

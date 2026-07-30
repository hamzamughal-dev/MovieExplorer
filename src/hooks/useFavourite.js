import { useQuery } from '@tanstack/react-query';

import useAuth from './useAuth';
import { getFavourites } from '../api/api';
import { REACT_QUERY_CONFIG } from '../constants/queryConfig';

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
        staleTime: REACT_QUERY_CONFIG.DEFAULT.staleTime,
        gcTime: REACT_QUERY_CONFIG.DEFAULT.gcTime,
    });

    const movies = favouritesData?.data?.results ?? [];

    return {
        isLoggedIn,
        movies,
        isLoading,
        error
    };
}

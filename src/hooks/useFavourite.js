import { useQuery } from '@tanstack/react-query';
import { getFavourites } from '../api/api';
import useStore from '../store/authStore';

export function useFavourite() {
    const sessionID = useStore(state => state.sessionID);
    const isLoggedIn = !!sessionID;
    const accountID = useStore(state => state.accountID);

    const {
        data: favouritesData,
        isLoading,
        error
    } = useQuery({
        queryKey: ["favourites", accountID],
        queryFn: () => getFavourites(accountID),
        enabled: !!accountID,
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
    });

    const movies = favouritesData?.data?.results ?? [];

    return {
        isLoggedIn,
        movies,
        isLoading,
        error
    };
}

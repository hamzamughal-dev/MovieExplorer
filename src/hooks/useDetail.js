import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import useAuth from './useAuth';
import { getDetails, addToFavourites, removeFromFavourites, getFavourites } from '../api/api';
import { QUERY_CONFIG } from '../constants/queryConfig';

export function useDetail() {
    const { sessionID, accountID, isLoggedIn } = useAuth();
    const { id } = useParams();
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const [favError, setFavError] = useState(null);

    const {
        data: details,
        isLoading: isDetailsLoading,
        error: detailsError,
    } = useQuery({
        queryKey: ['movieDetails', id],
        queryFn: async () => {
            const res = await getDetails(id);
            return res.data;
        },
        enabled: isLoggedIn && !!id,
        staleTime: QUERY_CONFIG.DETAILS.staleTime,
    });

    const { data: favouritesData, isFetching: isFavouritesFetching } = useQuery({
        queryKey: ['favourites', accountID],
        queryFn: () => getFavourites(accountID),
        enabled: isLoggedIn && !!accountID,
        staleTime: QUERY_CONFIG.FAVOURITES.staleTime,
    });

    const favouritesList = favouritesData?.data?.results || [];
    const isFavorite = favouritesList.some((m) => Number(m.id) === Number(id));

    const { mutate: toggleFavorite, isPending: isMutationPending } = useMutation({
        mutationKey: ['toggleFavorite', id],
        mutationFn: () => {
            if (isFavorite) {
                return removeFromFavourites(accountID, id);
            }

            return addToFavourites(accountID, id);
        },
        onMutate: () => {
            setFavError(null);
        },
        onError: (err) => {
            const msg = err?.response?.data?.status_message || 'Failed to update favourites.';
            setFavError(msg);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['favourites', accountID]
            });
        },

    });

    const isFavPending = isMutationPending || isFavouritesFetching;

    const handleWatchNow = () => {
        if (!details) return;
        window.open(`https://www.youtube.com/results?search_query=${encodeURIComponent(details.title + ' trailer')}`, '_blank');
    };

    return {
        isLoggedIn,
        details,
        isDetailsLoading,
        detailsError,
        isFavorite,
        toggleFavorite,
        isFavPending,
        favError,
        handleWatchNow,
        navigate
    };
}

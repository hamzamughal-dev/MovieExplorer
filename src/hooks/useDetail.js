import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import useStore from '../store/authStore';
import { getDetails, addToFavourites, removeFromFavourites, getFavourites } from '../api/api';

export function useDetail() {
    const sessionID = useStore((state) => state.sessionID);
    const isLoggedIn = !!sessionID;
    const accountID = useStore((state) => state.accountID);
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
        staleTime: 1000 * 60 * 5,
    });

    const { data: favouritesData } = useQuery({
        queryKey: ['favourites', accountID],
        queryFn: () => getFavourites(accountID),
        enabled: isLoggedIn && !!accountID,
        staleTime: 1000 * 60 * 2,
    });

    const favouritesList = favouritesData?.data?.results || [];
    const isFavorite = favouritesList.some((m) => Number(m.id) === Number(id));

    const { mutate: toggleFavorite } = useMutation({
        mutationKey: ['toggleFavorite', id],
        mutationFn: async () => {
            if (isFavorite) {
                return await removeFromFavourites(accountID, id);
            } else {
                return await addToFavourites(accountID, id);
            }
        },
        onMutate: async () => {
            setFavError(null);
            await queryClient.cancelQueries({ queryKey: ['favourites', accountID] });
            const previousFavourites = queryClient.getQueryData(['favourites', accountID]);

            queryClient.setQueryData(['favourites', accountID], (old) => {
                if (!old?.data?.results) return old;
                const currentList = old.data.results;
                const alreadyFav = currentList.some((m) => Number(m.id) === Number(id));

                const updatedList = alreadyFav
                    ? currentList.filter((m) => Number(m.id) !== Number(id))
                    : [...currentList, { id: Number(id), title: details?.title, poster_path: details?.poster_path }];

                return {
                    ...old,
                    data: {
                        ...old.data,
                        results: updatedList,
                    },
                };
            });

            return { previousFavourites };
        },
        onError: (err, variables, context) => {
            if (context?.previousFavourites) {
                queryClient.setQueryData(['favourites', accountID], context.previousFavourites);
            }
            const msg = err?.response?.data?.status_message || 'Failed to update favourites.';
            setFavError(msg);
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['favourites', accountID] });
        },
    });

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
        favError,
        handleWatchNow,
        navigate
    };
}

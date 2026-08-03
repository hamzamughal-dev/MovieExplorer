import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import useAuth from './useAuth';
import { 
    getTrendingAll, 
    getPopularMovies, 
    getPopularTvShows, 
    getTopRatedMovies, 
    getTopRatedTvShows, 
    searchMedia 
} from '../api/api';
import { REACT_QUERY_CONFIG } from '../constants/queryConfig';

export function useHome(debouncedSearchQuery = '') {
    const { isLoggedIn } = useAuth();
    const trimmedQuery = debouncedSearchQuery.trim();

    const { data: trendingAllData, isLoading: isTrendingLoading } = useQuery({
        queryKey: ['homeTrendingAll'],
        queryFn: async () => {
            const res = await getTrendingAll(1);
            return res.data?.results || [];
        },
        enabled: isLoggedIn && !trimmedQuery,
        staleTime: REACT_QUERY_CONFIG.DEFAULT.staleTime,
    });

    const { data: popularMoviesData, isLoading: isPopMoviesLoading } = useQuery({
        queryKey: ['homePopularMovies'],
        queryFn: async () => {
            const res = await getPopularMovies(1);
            return res.data?.results || [];
        },
        enabled: isLoggedIn && !trimmedQuery,
        staleTime: REACT_QUERY_CONFIG.DEFAULT.staleTime,
    });

    const { data: popularTvData, isLoading: isPopTvLoading } = useQuery({
        queryKey: ['homePopularTv'],
        queryFn: async () => {
            const res = await getPopularTvShows(1);
            return res.data?.results || [];
        },
        enabled: isLoggedIn && !trimmedQuery,
        staleTime: REACT_QUERY_CONFIG.DEFAULT.staleTime,
    });

    const { data: topMoviesData, isLoading: isTopMoviesLoading } = useQuery({
        queryKey: ['homeTopMovies'],
        queryFn: async () => {
            const res = await getTopRatedMovies(1);
            return res.data?.results || [];
        },
        enabled: isLoggedIn && !trimmedQuery,
        staleTime: REACT_QUERY_CONFIG.DEFAULT.staleTime,
    });

    const { data: topTvData, isLoading: isTopTvLoading } = useQuery({
        queryKey: ['homeTopTv'],
        queryFn: async () => {
            const res = await getTopRatedTvShows(1);
            return res.data?.results || [];
        },
        enabled: isLoggedIn && !trimmedQuery,
        staleTime: REACT_QUERY_CONFIG.DEFAULT.staleTime,
    });

    const { data: searchData, isLoading: isSearching, error: searchError } = useQuery({
        queryKey: ['homeGlobalSearch', trimmedQuery],
        queryFn: async () => {
            const res = await searchMedia(trimmedQuery, 1, 'multi');
            return res.data?.results || [];
        },
        enabled: isLoggedIn && trimmedQuery.length > 0,
        staleTime: REACT_QUERY_CONFIG.NO_CACHE.staleTime,
    });

    const isSearchMode = trimmedQuery.length > 0;
    const isSectionsLoading = isTrendingLoading || isPopMoviesLoading || isPopTvLoading || isTopMoviesLoading || isTopTvLoading;

    const heroItem = trendingAllData && trendingAllData.length > 0 ? trendingAllData[0] : null;

    return {
        isLoggedIn,
        heroItem,
        trendingAll: trendingAllData || [],
        popularMovies: popularMoviesData || [],
        popularTv: popularTvData || [],
        topMovies: topMoviesData || [],
        topTv: topTvData || [],
        searchResults: searchData || [],
        isSectionsLoading,
        isSearching,
        isSearchMode,
        searchError,
    };
}

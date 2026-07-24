import { useState, useRef, useCallback, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import debounce from 'lodash.debounce';
import { getMovies, searchMovies } from '../api/api';
import useStore from '../store/authStore';

export function useMovies() {
    const sessionID = useStore(state => state.sessionID);
    const isLoggedIn = !!sessionID;

    const [searchParams, setSearchParams] = useSearchParams();
    const initialQuery = searchParams.get('q') ?? '';
    const [searchQuery, setSearchQuery] = useState(initialQuery);
    const [debouncedSearchQuery, setDebouncedSearchQuery] = useState(initialQuery);

    const updateSearch = useMemo(
        () =>
            debounce((value) => {
                setDebouncedSearchQuery(value);
                setSearchParams(
                    (prev) => {
                        const next = new URLSearchParams(prev);
                        if (value.trim()) {
                            next.set('q', value.trim());
                        } else {
                            next.delete('q');
                        }
                        return next;
                    },
                    { replace: true }
                );
            }, 500),
        [setSearchParams]
    );

    useEffect(() => {
        return () => updateSearch.cancel();
    }, [updateSearch]);

    const {
        data: movieData,
        fetchNextPage,
        hasNextPage,
        isLoading,
        isFetchingNextPage,
        error
    } = useInfiniteQuery({
        queryKey: ['movies'],
        queryFn: ({ pageParam = 1 }) => getMovies(pageParam),
        initialPageParam: 1,
        getNextPageParam: (lastPage, pages) => {
            const currentPage = pages.length;
            const totalPages = lastPage?.data?.total_pages;
            return totalPages && currentPage < totalPages ? currentPage + 1 : undefined;
        },
        enabled: isLoggedIn && !debouncedSearchQuery.trim(),
        staleTime: 1000 * 60 * 5
    });

    const {
        data: searchData,
        isLoading: isSearching,
        error: searchError
    } = useQuery({
        queryKey: ['searchMovies', debouncedSearchQuery.trim()],
        queryFn: () => searchMovies(debouncedSearchQuery.trim()),
        enabled: isLoggedIn && debouncedSearchQuery.trim().length > 0,
        staleTime: 1000 * 60 * 2
    });

    const movies = Array.from(
        new Map(movieData?.pages.flatMap(p => p.data.results || []).map(m => [m.id, m])).values()
    );
    const searchResults = searchData?.data?.results ?? [];

    const observer = useRef();
    const lastMovieElement = useCallback(node => {
        if (isLoading || isFetchingNextPage || debouncedSearchQuery.trim()) return;
        if (observer.current) observer.current.disconnect();

        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasNextPage) {
                fetchNextPage();
            }
        });

        if (node) observer.current.observe(node);
    }, [isLoading, isFetchingNextPage, hasNextPage, fetchNextPage, debouncedSearchQuery]);

    const handleClearSearch = () => {
        updateSearch.cancel();
        setSearchQuery('');
        setDebouncedSearchQuery('');
        setSearchParams((prev) => {
            const next = new URLSearchParams(prev);
            next.delete('q');
            return next;
        }, { replace: true });
    };

    const hasSearchInput = searchQuery.trim().length > 0;
    const isSearchMode = debouncedSearchQuery.trim().length > 0;
    const displayMovies = isSearchMode ? searchResults : movies;

    return {
        isLoggedIn,
        searchQuery,
        setSearchQuery,
        updateSearch,
        displayMovies,
        isLoading: isSearchMode ? isSearching : isLoading,
        isFetchingNextPage,
        error: isSearchMode ? searchError : error,
        lastMovieElement,
        handleClearSearch,
        hasSearchInput,
        isSearchMode
    };
}

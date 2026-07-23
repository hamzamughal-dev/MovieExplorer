import { useState, useRef, useCallback } from 'react';
import { Navigate } from 'react-router-dom';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';

import { getMovies, searchMovies } from '../api/api';
import useStore from '../store/authStore';
import MovieCard from '../components/MovieCard';
import Loader from '../components/Loader';

function Movies() {
    const sessionID = useStore(state => state.sessionID);
    const isLoggedIn = !!sessionID;

    const [searchQuery, setSearchQuery] = useState('');

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
        enabled: isLoggedIn && !searchQuery.trim(),
        staleTime: 1000 * 60 * 5
    });

    const {
        data: searchData,
        isLoading: isSearching,
        error: searchError
    } = useQuery({
        queryKey: ['searchMovies', searchQuery.trim()],
        queryFn: () => searchMovies(searchQuery.trim()),
        enabled: isLoggedIn && searchQuery.trim().length > 0,
        staleTime: 1000 * 60 * 2
    });

    const movies = Array.from(
        new Map(movieData?.pages.flatMap(p => p.data.results || []).map(m => [m.id, m])).values()
    );
    const searchResults = searchData?.data?.results ?? [];

    const observer = useRef();
    const lastMovieElement = useCallback(node => {
        if (isLoading || isFetchingNextPage || searchQuery.trim()) return;
        if (observer.current) observer.current.disconnect();

        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasNextPage) {
                fetchNextPage();
            }
        });

        if (node) observer.current.observe(node);
    }, [isLoading, isFetchingNextPage, hasNextPage, fetchNextPage, searchQuery]);

    const handleClearSearch = () => {
        setSearchQuery('');
    };

    if (!isLoggedIn) {
        return <Navigate to="/login" replace />;
    }

    const isSearchMode = searchQuery.trim().length > 0;
    const displayMovies = isSearchMode ? searchResults : movies;

    return (
        <div className="min-h-full bg-[#202731] text-white px-6 pt-5 pb-8">
            <div className="max-w-7xl mx-auto px-2 md:px-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-[32px] md:text-[38px] font-extrabold bg-gradient-to-r from-[#01b4e4] to-[#90cea1] bg-clip-text text-transparent mb-[2px] w-fit">
                        {isSearchMode ? 'Search Results' : 'Trending'}
                    </h1>
                    <p className="text-slate-400 text-[14px] md:text-[15px]">
                        {isSearchMode ? `Results for "${searchQuery}"` : 'Discover trending movies worldwide'}
                    </p>
                </div>

                <div className="relative flex-shrink-0">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </span>
                    <input
                        id="movies-search"
                        type="text"
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        placeholder="Search for movies, actors, or genres..."
                        className="pl-10 pr-8 py-[9px] w-[260px] md:w-[320px] rounded-full bg-[#181a20]/80 border border-white/10 text-white placeholder-slate-500 text-[13px] outline-none focus:border-[#01b4e4] focus:ring-1 focus:ring-[#01b4e4]/30 transition-all shadow-inner"
                    />
                    {searchQuery && (
                        <button
                            onClick={handleClearSearch}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-[16px]"
                        >
                            ×
                        </button>
                    )}
                </div>
            </div>

            {isLoading && !isSearchMode && <Loader text="Fetching movies..." />}
            {isSearching && <Loader text="Searching..." />}

            {(error || searchError) && !isLoading && !isSearching && (
                <div className="text-center p-[40px] bg-red-500/10 border border-red-500/30 rounded-[16px] text-red-400 text-[16px]">
                    ⚠️ {error?.message || searchError?.message || 'Something went wrong.'}
                </div>
            )}

            {!isLoading && !isSearching && !error && !searchError && (
                <>
                    {displayMovies.length === 0 && isSearchMode && (
                        <div className="text-center p-[40px] bg-white/5 border border-white/10 rounded-[16px] text-slate-400 text-[15px]">
                            No results for "{searchQuery}"
                        </div>
                    )}
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-6 gap-[24px]">
                        {displayMovies.map(movie => (
                            <MovieCard key={movie.id} movie={movie} />
                        ))}
                    </div>
                </>
            )}

            {!isSearchMode && (
                <div ref={lastMovieElement} className="w-full flex justify-center py-8">
                    {isFetchingNextPage && (
                        <div className="flex items-center gap-3">
                            <div className="w-[24px] h-[24px] rounded-full border-[3px] border-[#1e1e2e] border-t-[#01b4e4] animate-spin" />
                            <p className="text-slate-400 text-[14px]">Loading more...</p>
                        </div>
                    )}
                    {!hasNextPage && movies.length > 0 && (
                        <p className="text-slate-500 text-[14px]">You've reached the end of the list.</p>
                    )}
                </div>
            )}
        </div>
    );
}

export default Movies;
import { useState, useEffect, useRef, useCallback } from 'react';
import { Navigate } from 'react-router-dom';
import useStore from '../store/authStore';
import { getMovies, searchMovies } from '../api/api';
import MovieCard from '../components/MovieCard';

function Movies() {
    const isLoggedIn = useStore(state => state.isLoggedIn);

    const [movies, setMovies] = useState([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [isFetchingMore, setIsFetchingMore] = useState(false);

    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [searchError, setSearchError] = useState(null);

    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const observer = useRef();

    const lastMovieElement = useCallback(node => {
        if (isLoading || isFetchingMore || searchQuery.trim()) return;
        if (observer.current) observer.current.disconnect();

        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasMore) {
                setPage(prevPage => prevPage + 1);
            }
        });
        if (node) observer.current.observe(node);
    }, [isLoading, isFetchingMore, hasMore, searchQuery]);

    useEffect(() => {
        if (searchQuery.trim()) return;

        const fetchMovies = async () => {
            try {
                if (page === 1) setIsLoading(true);
                else setIsFetchingMore(true);

                const response = await getMovies(page);
                const results = response.data?.results ?? [];
                const totalPages = response.data?.total_pages ?? 1;

                setMovies(prev => {
                    const nextMovies = page === 1 ? results : [...prev, ...results];
                    const seen = new Set();
                    return nextMovies.filter(m => {
                        if (seen.has(m.id)) return false;
                        seen.add(m.id);
                        return true;
                    });
                });
                setHasMore(page < totalPages && results.length > 0);
            } catch (err) {
                console.error('❌ Error fetching movies:', err);
                setError('Failed to load movies. Please try again.');
            } finally {
                setIsLoading(false);
                setIsFetchingMore(false);
            }
        };

        fetchMovies();
    }, [page, searchQuery]);

    useEffect(() => {
        const query = searchQuery.trim();
        if (!query) {
            setSearchResults([]);
            setSearchError(null);
            return;
        }

        const fetchSearch = async () => {
            try {
                setIsSearching(true);
                setSearchError(null);
                const res = await searchMovies(query);
                const results = res.data?.results ?? [];
                setSearchResults(results);
            } catch (err) {
                console.error('❌ Search error:', err);
                setSearchError('Search failed. Please try again.');
            } finally {
                setIsSearching(false);
            }
        };

        fetchSearch();
    }, [searchQuery]);

    const handleClearSearch = () => {
        setSearchQuery('');
        setSearchResults([]);
        setPage(1);
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
                        {isSearchMode
                            ? `Results for "${searchQuery}"`
                            : 'Discover trending movies worldwide'}
                    </p>
                </div>

                <div className="relative flex-shrink-0">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
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
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-[16px] leading-none transition-colors"
                            aria-label="Clear search"
                        >×</button>
                    )}
                </div>
            </div>

            {isLoading && page === 1 && !isSearchMode && (
                <div className="flex flex-col items-center justify-center h-[300px] gap-4">
                    <div className="w-[48px] h-[48px] rounded-full border-[4px] border-[#1e1e2e] border-t-[#01b4e4] animate-spin" />
                    <p className="text-[#01b4e4] text-[16px]">Fetching movies...</p>
                </div>
            )}

            {isSearching && (
                <div className="flex flex-col items-center justify-center h-[300px] gap-4">
                    <div className="w-[48px] h-[48px] rounded-full border-[4px] border-[#1e1e2e] border-t-[#01b4e4] animate-spin" />
                    <p className="text-[#01b4e4] text-[16px]">Searching...</p>
                </div>
            )}

            {(error || searchError) && !isLoading && !isSearching && (
                <div className="text-center p-[40px] bg-red-500/10 border border-red-500/30 rounded-[16px] text-red-400 text-[16px]">
                    ⚠️ {error || searchError}
                </div>
            )}

            {!isLoading && !isSearching && !error && !searchError && (
                <>
                    {displayMovies.length === 0 && isSearchMode && (
                        <div className="text-center p-[40px] bg-white/5 border border-white/10 rounded-[16px] text-slate-400 text-[15px]">
                            No results for &ldquo;{searchQuery}&rdquo;
                        </div>
                    )}
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-6 gap-[24px]">
                        {displayMovies.map((movie) => (
                            <MovieCard key={movie.id} movie={movie} />
                        ))}
                    </div>
                </>
            )}

            {!isSearchMode && (
                <div ref={lastMovieElement} className="w-full flex justify-center py-8">
                    {isFetchingMore && (
                        <div className="flex items-center gap-3">
                            <div className="w-[24px] h-[24px] rounded-full border-[3px] border-[#1e1e2e] border-t-[#01b4e4] animate-spin" />
                            <p className="text-slate-400 text-[14px]">Loading more...</p>
                        </div>
                    )}
                    {!hasMore && movies.length > 0 && (
                        <p className="text-slate-500 text-[14px]">You've reached the end of the list.</p>
                    )}
                </div>
            )}
        </div>
    );
}

export default Movies;

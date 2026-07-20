import { useState, useEffect, useRef, useCallback } from 'react';
import { Navigate } from 'react-router-dom';
import useStore from '../store/store';
import { getMovies, searchMovies } from '../api/api';
import MovieCard from '../components/MovieCard';

function Dashboard() {
    const isLoggedIn = useStore(state => state.isLoggedIn);

    const [movies, setMovies] = useState([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [isFetchingMore, setIsFetchingMore] = useState(false);

    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [searchError, setSearchError] = useState(null);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const observer = useRef();

    const lastMovieElement = useCallback(node => {
        if (loading || isFetchingMore || searchQuery.trim()) return;
        if (observer.current) observer.current.disconnect();

        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasMore) {
                setPage(prevPage => prevPage + 1);
            }
        });
        if (node) observer.current.observe(node);
    }, [loading, isFetchingMore, hasMore, searchQuery]);

    useEffect(() => {
        if (searchQuery.trim()) return;

        const fetchMovies = async () => {
            try {
                if (page === 1) setLoading(true);
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
                setLoading(false);
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
                console.log('🔍 Search Results:', results);
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
        <div className="min-h-full bg-gradient-to-br from-[#0A0A0C] via-[#0f0f1a] to-[#0A0A0C] text-white px-6 py-8">

            <div className="mb-4 text-center">
                <h1 className="text-[36px] font-extrabold bg-gradient-to-r from-[#e040fb] to-[#7c4dff] bg-clip-text text-transparent mb-[6px]">
                    {isSearchMode ? 'Search Results' : 'Trending'}
                </h1>
                <p className="text-slate-400 text-[16px]">
                    {isSearchMode
                        ? `Results for "${searchQuery}"`
                        : 'Trending movies worldwide'}
                </p>
            </div>

            <div className="sticky top-0 z-20 flex justify-center mb-6 py-2">
                <div className="relative">
                    <input
                        id="dashboard-search"
                        type="text"
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        placeholder="Search movies..."
                        className="pl-4 pr-8 py-[7px] w-[200px] rounded-[10px] bg-[#0f0f1a] border border-white/10 text-white placeholder-slate-500 text-[13px] outline-none focus:border-[#7c4dff] focus:ring-1 focus:ring-[#7c4dff]/30 transition-all"
                    />
                    {searchQuery && (
                        <button
                            onClick={handleClearSearch}
                            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-[16px] leading-none transition-colors"
                            aria-label="Clear search"
                        >×</button>
                    )}
                </div>
            </div>

            {loading && page === 1 && !isSearchMode && (
                <div className="flex flex-col items-center justify-center h-[300px] gap-4">
                    <div className="w-[48px] h-[48px] rounded-full border-[4px] border-[#1e1e2e] border-t-[#7c4dff] animate-spin" />
                    <p className="text-[#7c4dff] text-[16px]">Fetching movies...</p>
                </div>
            )}

            {isSearching && (
                <div className="flex flex-col items-center justify-center h-[300px] gap-4">
                    <div className="w-[48px] h-[48px] rounded-full border-[4px] border-[#1e1e2e] border-t-[#7c4dff] animate-spin" />
                    <p className="text-[#7c4dff] text-[16px]">Searching...</p>
                </div>
            )}

            {(error || searchError) && !loading && !isSearching && (
                <div className="text-center p-[40px] bg-red-500/10 border border-red-500/30 rounded-[16px] text-red-400 text-[16px]">
                    ⚠️ {error || searchError}
                </div>
            )}

            {!loading && !isSearching && !error && !searchError && (
                <>
                    {displayMovies.length === 0 && isSearchMode && (
                        <div className="text-center p-[40px] bg-white/5 border border-white/10 rounded-[16px] text-slate-400 text-[15px]">
                            No results for &ldquo;{searchQuery}&rdquo;
                        </div>
                    )}
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-4 gap-[24px]">
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
                            <div className="w-[24px] h-[24px] rounded-full border-[3px] border-[#1e1e2e] border-t-[#7c4dff] animate-spin" />
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

export default Dashboard;

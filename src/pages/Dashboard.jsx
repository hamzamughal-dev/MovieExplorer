import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Navigate } from 'react-router-dom';
import useStore from '../store/store';
import { getMovies } from '../api/api';
import MovieCard from '../components/MovieCard';

function Dashboard() {
    const isLoggedIn = useStore(state => state.isLoggedIn);
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [isFetchingMore, setIsFetchingMore] = useState(false);

    const observer = useRef();

    const lastMovieElement = useCallback(node => {
        if (loading || isFetchingMore) return;
        if (observer.current) observer.current.disconnect();

        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasMore) {
                setPage(prevPage => prevPage + 1);
            }
        });
        if (node) observer.current.observe(node);
    }, [loading, isFetchingMore, hasMore]);

    useEffect(() => {
        const fetchMovies = async () => {
            try {
                if (page === 1) {
                    setLoading(true);
                } else {
                    setIsFetchingMore(true);
                }

                const response = await getMovies(page);
                const results = response.data?.results ?? [];
                const totalPages = response.data?.total_pages ?? 1;

                console.log('🎬 Movies Data:', results);
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
    }, [page]);

    if (!isLoggedIn) {
        return <Navigate to="/login" replace />;
    }

    return (
        <div className="min-h-full bg-gradient-to-br from-[#0A0A0C] via-[#0f0f1a] to-[#0A0A0C] text-white px-6 py-8">

            <div className="mb-8">
                <h1 className="text-[36px] font-extrabold bg-gradient-to-r from-[#e040fb] to-[#7c4dff] bg-clip-text text-transparent mb-[6px]">
                    Trending
                </h1>
                <p className="text-slate-400 text-[16px]">
                    Trending movies worldwide
                </p>
            </div>

            {loading && page === 1 && (
                <div className="flex flex-col items-center justify-center h-[300px] gap-4">
                    <div className="w-[48px] h-[48px] rounded-full border-[4px] border-[#1e1e2e] border-t-[#7c4dff] animate-spin" />
                    <p className="text-[#7c4dff] text-[16px]">Fetching movies...</p>
                </div>
            )}

            {error && !loading && (
                <div className="text-center p-[40px] bg-red-500/10 border border-red-500/30 rounded-[16px] text-red-400 text-[16px]">
                    ⚠️ {error}
                </div>
            )}

            {(!loading || page > 1) && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-4 gap-[24px]">
                    {movies.map((movie) => (
                        <MovieCard key={movie.id} movie={movie} />
                    ))}
                </div>
            )}
            
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
        </div>
    );
}

export default Dashboard;

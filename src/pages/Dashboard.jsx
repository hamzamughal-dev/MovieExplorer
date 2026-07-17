import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import useStore from '../store/store';
import { getMovies } from '../api/api';
import MovieCard from '../components/MovieCard';

function Dashboard() {
    const isLoggedIn = useStore(state => state.isLoggedIn);
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchMovies = async () => {
            try {
                setLoading(true);
                const response = await getMovies();
                const results = response.data?.results ?? [];
                console.log('🎬 Movies Data:', results);
                setMovies(results);
            } catch (err) {
                console.error('❌ Error fetching movies:', err);
                setError('Failed to load movies. Please try again.');
            } finally {
                setLoading(false);
            }
        };
        fetchMovies();
    }, []);

    if (!isLoggedIn) {
        return <Navigate to="/login" replace />;
    }

    return (
        <div className="min-h-full bg-gradient-to-br from-[#0A0A0C] via-[#0f0f1a] to-[#0A0A0C] text-white px-6 py-8">

            {/* Header */}
            <div className="mb-8">
                <h1 className="text-[36px] font-extrabold bg-gradient-to-r from-[#e040fb] to-[#7c4dff] bg-clip-text text-transparent mb-[6px]">
                    🎬 Trending Movies
                </h1>
                <p className="text-slate-400 text-[16px]">
                    Today's top trending movies worldwide
                </p>
            </div>

            {/* Loading State */}
            {loading && (
                <div className="flex flex-col items-center justify-center h-[300px] gap-4">
                    <div className="w-[48px] h-[48px] rounded-full border-[4px] border-[#1e1e2e] border-t-[#7c4dff] animate-spin" />
                    <p className="text-[#7c4dff] text-[16px]">Fetching movies...</p>
                </div>
            )}

            {/* Error State */}
            {error && !loading && (
                <div className="text-center p-[40px] bg-red-500/10 border border-red-500/30 rounded-[16px] text-red-400 text-[16px]">
                    ⚠️ {error}
                </div>
            )}

            {/* Movie Grid */}
            {!loading && !error && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-[24px]">
                    {movies.map((movie) => (
                        <MovieCard key={movie.id} movie={movie} />
                    ))}
                </div>
            )}
        </div>
    );
}

export default Dashboard;

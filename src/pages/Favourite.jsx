import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import useStore from '../store/authStore';
import { getFavourites } from '../api/api';
import MovieCard from '../components/MovieCard';

function Favourite() {
    const isLoggedIn = useStore(state => state.isLoggedIn);
    const accountID = useStore(state => state.accountID);
    const [movies, setMovies] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);


    useEffect(() => {
        const fetchFavourites = async () => {
            try {
                setIsLoading(true);
                const res = await getFavourites(accountID);
                const results = res.data?.results ?? [];

                setMovies(results);
            } catch (err) {
                console.error('❌ Error fetching favourites:', err);
                setError('Failed to load favourites. Please try again.');
            } finally {
                setIsLoading(false);
            }
        };

        if (accountID) {
            fetchFavourites();
        }
    }, [accountID]);

    if (!isLoggedIn) {
        return <Navigate to="/login" replace />;
    }

    return (
        <div className="min-h-full bg-[#202731] text-white px-6 pt-5 pb-8">

            <div className="max-w-7xl mx-auto px-2 md:px-4 mb-6">
                <h1 className="text-[32px] md:text-[38px] font-extrabold bg-gradient-to-r from-[#01b4e4] to-[#90cea1] bg-clip-text text-transparent mb-[2px] w-fit">
                    Favourites
                </h1>
                <p className="text-slate-400 text-[14px] md:text-[15px]">
                    Movies you've marked as favourites
                </p>
            </div>

            {isLoading && (
                <div className="flex flex-col items-center justify-center h-[300px] gap-4">
                    <div className="w-[48px] h-[48px] rounded-full border-[4px] border-[#1e1e2e] border-t-[#01b4e4] animate-spin" />
                    <p className="text-[#01b4e4] text-[16px]">Fetching favourites...</p>
                </div>
            )}

            {error && !isLoading && (
                <div className="text-center p-[40px] bg-red-500/10 border border-red-500/30 rounded-[16px] text-red-400 text-[16px]">
                    ⚠️ {error}
                </div>
            )}

            {!isLoading && !error && movies.length === 0 && (
                <div className="text-center p-[40px] bg-white/5 border border-white/10 rounded-[16px] text-slate-400 text-[16px]">
                    You haven't added any favourites yet.
                </div>
            )}

            {!isLoading && !error && movies.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-6 gap-[24px]">
                    {movies.map((movie) => (
                        <MovieCard key={movie.id} movie={movie} />
                    ))}
                </div>
            )}
        </div>
    );
}

export default Favourite;


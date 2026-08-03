import { Navigate } from 'react-router-dom';
import { useFavourite } from '../hooks/useFavourite';
import { useInfiniteScroll } from '../hooks/useInfiniteScroll';

import MovieCard from '../components/MovieCard';
import Loader from '../components/Loader';

function Favourite() {
    const {
        isLoggedIn,
        movies,
        isLoading,
        isFetchingNextPage,
        hasNextPage,
        fetchNextPage,
        error
    } = useFavourite();

    const lastElementRef = useInfiniteScroll({
        isLoading,
        isFetchingNextPage,
        hasNextPage,
        fetchNextPage,
    });

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
                    Movies and TV shows you've marked as favourites
                </p>
            </div>

            {isLoading && (
                <Loader text="Fetching favourites..." />
            )}

            {error && !isLoading && (
                <div className="text-center p-[40px] bg-red-500/10 border border-red-500/30 rounded-[16px] text-red-400 text-[16px]">
                    ⚠️ {error.message || 'Failed to load favourites.'}
                </div>
            )}

            {!isLoading && !error && movies.length === 0 && (
                <div className="text-center p-[40px] bg-white/5 border border-white/10 rounded-[16px] text-slate-400 text-[16px]">
                    You haven't added any favourites yet.
                </div>
            )}

            {!isLoading && !error && movies.length > 0 && (
                <>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-6 gap-[24px]">
                        {movies.map((movie, index) => {
                            if (movies.length === index + 1) {
                                return (
                                    <div ref={lastElementRef} key={`${movie.id}-${index}`}>
                                        <MovieCard movie={movie} />
                                    </div>
                                );
                            }
                            return <MovieCard key={`${movie.id}-${index}`} movie={movie} />;
                        })}
                    </div>

                    {isFetchingNextPage && (
                        <div className="mt-8 flex justify-center">
                            <Loader text="Loading more favourites..." className="h-[100px]" />
                        </div>
                    )}
                </>
            )}
        </div>
    );
}

export default Favourite;

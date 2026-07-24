import { Navigate } from 'react-router-dom';
import MovieCard from '../components/MovieCard';
import Loader from '../components/Loader';
import Input from '../components/Input';
import Button from '../components/Button';
import { useMovies } from '../hooks/useMovies';

function Movies() {
    const {
        isLoggedIn,
        searchQuery,
        setSearchQuery,
        updateSearch,
        displayMovies,
        isLoading,
        isFetchingNextPage,
        error,
        lastMovieElement,
        handleClearSearch,
        hasSearchInput,
        isSearchMode
    } = useMovies();

    if (!isLoggedIn) {
        return <Navigate to="/login" replace />;
    }

    return (
        <div className="min-h-full bg-[#202731] text-white px-6 pt-5 pb-8">
            <div className="max-w-7xl mx-auto px-2 md:px-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-[32px] md:text-[38px] font-extrabold bg-gradient-to-r from-[#01b4e4] to-[#90cea1] bg-clip-text text-transparent mb-[2px] w-fit">
                        {hasSearchInput ? 'Search Results' : 'Trending'}
                    </h1>
                    <p className="text-slate-400 text-[14px] md:text-[15px]">
                        {hasSearchInput ? `Results for "${searchQuery}"` : 'Discover trending movies worldwide'}
                    </p>
                </div>

                <Input
                    variant="search"
                    id="movies-search"
                    placeholder="Search for movies, actors, or genres..."
                    value={searchQuery}
                    onChange={(e) => {
                        const value = e.target.value;
                        setSearchQuery(value);
                        updateSearch(value);
                    }}
                    clearSlot={
                        searchQuery ? (
                            <Button
                                variant="icon"
                                onClick={handleClearSearch}
                                aria-label="Clear search"
                                className="text-slate-400 hover:text-white text-[16px] leading-none"
                            >
                                ×
                            </Button>
                        ) : null
                    }
                />
            </div>

            {isLoading && !isSearchMode && <Loader text="Fetching movies..." />}
            {isLoading && isSearchMode && <Loader text="Searching movies..." />}

            {error && (
                <div className="text-center p-[40px] bg-red-500/10 border border-red-500/30 rounded-[16px] text-red-400 text-[16px]">
                    ⚠️ {error.message || 'Something went wrong while fetching movies.'}
                </div>
            )}

            {!isLoading && !error && displayMovies.length === 0 && (
                <div className="text-center p-[40px] bg-white/5 border border-white/10 rounded-[16px] text-slate-400 text-[16px]">
                    {isSearchMode ? `No movies found matching "${searchQuery}".` : 'No movies found.'}
                </div>
            )}

            {!isLoading && !error && displayMovies.length > 0 && (
                <>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-6 gap-[24px]">
                        {displayMovies.map((movie, index) => {
                            if (!isSearchMode && displayMovies.length === index + 1) {
                                return (
                                    <div ref={lastMovieElement} key={`${movie.id}-${index}`}>
                                        <MovieCard movie={movie} />
                                    </div>
                                );
                            }
                            return <MovieCard key={`${movie.id}-${index}`} movie={movie} />;
                        })}
                    </div>

                    {isFetchingNextPage && (
                        <div className="mt-8 flex justify-center">
                            <Loader text="Loading more movies..." className="h-[100px]" />
                        </div>
                    )}
                </>
            )}
        </div>
    );
}

export default Movies;
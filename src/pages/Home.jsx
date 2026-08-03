import { useNavigate, Navigate } from 'react-router-dom';

import MovieCard from '../components/MovieCard';
import Loader from '../components/Loader';
import Input from '../components/Input';
import Button from '../components/Button';

import { useHome } from '../hooks/useHome';
import { useDebouncedSearch } from '../hooks/useDebouncedSearch';
import { BASE_IMG_ORIGINAL } from '../constants/constants';

function Home() {
    const navigate = useNavigate();
    const { searchQuery, debouncedQuery, handleSearchChange, handleClearSearch } = useDebouncedSearch('q');

    const {
        isLoggedIn,
        heroItem,
        trendingAll,
        popularMovies,
        popularTv,
        topMovies,
        topTv,
        searchResults,
        isSectionsLoading,
        isSearching,
        isSearchMode,
        searchError,
    } = useHome(debouncedQuery);

    if (!isLoggedIn) {
        return <Navigate to="/login" replace />;
    }

    const heroMediaType = heroItem?.media_type || (heroItem?.first_air_date ? 'tv' : 'movie');

    return (
        <div className="min-h-full bg-[#202731] text-white pb-12">
            <div className="max-w-7xl mx-auto px-6 pt-6 pb-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-[32px] md:text-[40px] font-extrabold bg-gradient-to-r from-[#01b4e4] to-[#90cea1] bg-clip-text text-transparent mb-1 w-fit">
                        Explore Movies & TV
                    </h1>
                    <p className="text-slate-400 text-[14px] md:text-[15px]">
                        Discover trending titles, popular shows, and top-rated entertainment.
                    </p>
                </div>

                <Input
                    variant="search"
                    id="home-global-search"
                    placeholder="Search movies, TV shows, actors..."
                    value={searchQuery}
                    onChange={handleSearchChange}
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

            {isSearchMode ? (
                <div className="max-w-7xl mx-auto px-6 pt-4">
                    <h2 className="text-2xl font-bold text-slate-100 mb-4">
                        Search Results for "{searchQuery}"
                    </h2>

                    {isSearching && <Loader text="Searching across all media..." />}

                    {searchError && (
                        <div className="text-center p-8 bg-red-500/10 border border-red-500/30 rounded-2xl text-red-400">
                            ⚠️ {searchError.message || 'Failed to execute search.'}
                        </div>
                    )}

                    {!isSearching && !searchError && searchResults.length === 0 && (
                        <div className="text-center p-12 bg-white/5 border border-white/10 rounded-2xl text-slate-400">
                            No titles or shows found matching "{searchQuery}".
                        </div>
                    )}

                    {!isSearching && !searchError && searchResults.length > 0 && (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
                            {searchResults.map((item, index) => (
                                <MovieCard key={`${item.id}-${index}`} movie={item} />
                            ))}
                        </div>
                    )}
                </div>
            ) : (
                <>
                    {heroItem && (
                        <div className="max-w-7xl mx-auto px-6 mb-10">
                            <div className="relative rounded-2xl overflow-hidden bg-[#181a20] border border-white/10 aspect-[16/9] md:aspect-[21/9] flex items-end">
                                {heroItem.backdrop_path && (
                                    <img
                                        src={`${BASE_IMG_ORIGINAL}${heroItem.backdrop_path}`}
                                        alt={heroItem.title || heroItem.name}
                                        className="absolute inset-0 w-full h-full object-cover opacity-40"
                                    />
                                )}
                                <div className="absolute inset-0 bg-gradient-to-t from-[#181a20] via-[#181a20]/60 to-transparent" />

                                <div className="relative z-10 p-6 md:p-10 max-w-2xl">
                                    <span className="inline-block px-3 py-1 bg-[#01b4e4] text-slate-950 font-bold text-xs rounded-full uppercase tracking-wider mb-3">
                                        🔥 Trending Spotlight
                                    </span>
                                    <h2 className="text-2xl md:text-4xl font-black text-white mb-2 line-clamp-1">
                                        {heroItem.title || heroItem.name}
                                    </h2>
                                    <p className="text-slate-300 text-sm md:text-base line-clamp-2 md:line-clamp-3 mb-5">
                                        {heroItem.overview}
                                    </p>
                                    <Button
                                        variant="primary"
                                        onClick={() => navigate(`/detail/${heroItem.id}?type=${heroMediaType}`)}
                                        className="rounded-xl px-6 py-2.5 font-bold shadow-lg"
                                    >
                                        View Details
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )}

                    {isSectionsLoading && <Loader text="Loading home showcase..." />}

                    {!isSectionsLoading && (
                        <div className="max-w-7xl mx-auto px-6 space-y-10">
                            <HomeSection
                                title="🔥 Trending Now"
                                subtitle="Top movies and TV series trending today"
                                items={trendingAll}
                            />

                            <HomeSection
                                title="🎬 Popular Movies"
                                subtitle="Blockbusters everyone is watching"
                                items={popularMovies.map(m => ({ ...m, media_type: 'movie' }))}
                            />

                            <HomeSection
                                title="📺 Popular TV Shows"
                                subtitle="Binge-worthy series trending globally"
                                items={popularTv.map(t => ({ ...t, media_type: 'tv' }))}
                            />

                            <HomeSection
                                title="⭐ Top Rated Movies"
                                subtitle="Critically acclaimed cinematic masterpieces"
                                items={topMovies.map(m => ({ ...m, media_type: 'movie' }))}
                            />

                            <HomeSection
                                title="🏆 Top Rated TV Shows"
                                subtitle="Highest user-rated television series"
                                items={topTv.map(t => ({ ...t, media_type: 'tv' }))}
                            />
                        </div>
                    )}
                </>
            )}
        </div>
    );
}

function HomeSection({ title, subtitle, items }) {
    if (!items || items.length === 0) return null;

    return (
        <div>
            <div className="mb-4">
                <h2 className="text-2xl font-bold text-white">{title}</h2>
                <p className="text-sm text-slate-400">{subtitle}</p>
            </div>
            <div className="flex gap-5 overflow-x-auto pb-4 pt-1 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
                {items.slice(0, 12).map((item, index) => (
                    <div key={`${item.id}-${index}`} className="w-[170px] sm:w-[190px] md:w-[200px] flex-shrink-0">
                        <MovieCard movie={item} />
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Home;

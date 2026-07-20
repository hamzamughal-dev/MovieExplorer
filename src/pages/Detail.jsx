import { useState, useEffect } from 'react';
import useStore from '../store/store';
import { Navigate, useParams, useNavigate } from 'react-router-dom';
import { getDetails, addToFavourites, removeFromFavourites, getFavourites } from '../api/api';
import { formatCurrency, formatRuntime, isValid } from '../utils/helper';

const IMAGE_BASE_W500 = 'https://image.tmdb.org/t/p/w500';
const IMAGE_BASE_ORIGINAL = 'https://image.tmdb.org/t/p/original';

function Detail() {
  const isLoggedIn = useStore((state) => state.isLoggedIn);
  const { id } = useParams();
  const navigate = useNavigate();

  const ACCOUNT_ID = import.meta.env.VITE_ACCOUNT_ID;

  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isFavorite, setIsFavorite] = useState(false);
  const [favLoading, setFavLoading] = useState(false);
  const [favError, setFavError] = useState(null);

  const checkFavouriteStatus = async (movieId) => {
    if (!ACCOUNT_ID) return;
    try {
      const res = await getFavourites(ACCOUNT_ID);
      const list = res.data?.results || [];
      setIsFavorite(list.some((m) => Number(m.id) === Number(movieId)));
    } catch (err) {
      console.warn('Could not load favourites:', err?.response?.data || err.message);
    }
  };

  const toggleFavorite = async () => {
    if (!details || favLoading) return;
    setFavLoading(true);
    setFavError(null);
    try {
      if (isFavorite) {
        await removeFromFavourites(ACCOUNT_ID, details.id);
        setIsFavorite(false);
        console.log("Removed from favourites with id ", details.id);
        console.log("Account id is ", ACCOUNT_ID);
      } else {
        await addToFavourites(ACCOUNT_ID, details.id);
        setIsFavorite(true);
        console.log("Added to favourites with id ", details.id);
        console.log("Account id is ", ACCOUNT_ID);
      }
    } catch (err) {
      const msg = err?.response?.data?.status_message || 'Failed to update favourites.';
      setFavError(msg);
      console.error('Favourite toggle error:', err);
    } finally {
      setFavLoading(false);
    }
  };

  const handleWatchNow = () => {
    if (!details) return;
    window.open(`https://www.youtube.com/results?search_query=${encodeURIComponent(details.title + ' trailer')}`, '_blank');
  };

  const fetchDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getDetails(id);
      setDetails(response.data);
      await checkFavouriteStatus(id);
    } catch (err) {
      console.error('Error fetching details:', err);
      setError('Failed to load movie details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetails();
  }, [id]);

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] gap-4 bg-[#0A0A0C] text-white">
        <div className="w-[48px] h-[48px] rounded-full border-[4px] border-[#1e1e2e] border-t-[#7c4dff] animate-spin" />
        <p className="text-[#7c4dff] text-[16px]">Loading details...</p>
      </div>
    );
  }

  if (error || !details) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] px-6 bg-[#0A0A0C] text-white">
        <div className="text-center p-[40px] bg-red-500/10 border border-red-500/30 rounded-[16px] text-red-400 text-[16px] max-w-md">
          ⚠️ {error || 'Movie details not found.'}
        </div>
        <button
          onClick={() => navigate('/dashboard')}
          className="mt-6 px-5 py-2.5 bg-gradient-to-r from-[#7c4dff] to-[#e040fb] rounded-[8px] font-semibold text-white hover:opacity-90 transition"
        >
          Go Back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0C] text-slate-100 relative pb-16">
      {isValid(details.backdrop_path) && (
        <div className="relative w-full h-[320px] md:h-[480px] overflow-hidden">
          <img
            src={`${IMAGE_BASE_ORIGINAL}${details.backdrop_path}`}
            alt=""
            className="w-full h-full object-cover opacity-25"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0C] via-transparent to-black/50" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0A0A0C]/80 via-transparent to-[#0A0A0C]/80" />
        </div>
      )}

      <div className={`max-w-6xl mx-auto px-6 relative z-20 ${isValid(details.backdrop_path) ? '-mt-[280px] md:-mt-[420px]' : 'pt-8'}`}>
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-[8px] bg-black/40 backdrop-blur-md border border-[#7c4dff]/20 text-slate-300 hover:text-white hover:border-[#7c4dff]/50 transition cursor-pointer"
        >
          ← Back
        </button>
      </div>

      <div className={`max-w-6xl mx-auto px-6 relative z-10 ${isValid(details.backdrop_path) ? 'mt-[100px] md:mt-[180px]' : 'mt-8'} grid grid-cols-1 md:grid-cols-[300px_1fr] gap-8 md:gap-12`}>

        <div className="flex flex-col items-center md:items-start gap-4">
          <div className="relative w-[230px] md:w-full aspect-[2/3] rounded-[16px] overflow-hidden shadow-[0_12px_36px_rgba(0,0,0,0.8)] border border-[#7c4dff]/15 bg-[#12121e]">
            {isValid(details.poster_path) ? (
              <img
                src={`${IMAGE_BASE_W500}${details.poster_path}`}
                alt={details.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-[64px]">🎬</div>
            )}

            {isValid(details.vote_average) && (
              <div className="absolute top-[12px] right-[12px] bg-black/85 backdrop-blur-md border border-yellow-400/30 rounded-[8px] px-2.5 py-1 text-[13px] font-bold text-yellow-400">
                ⭐ {details.vote_average.toFixed(1)}
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col justify-end">
          {isValid(details.tagline) && (
            <p className="text-[#e040fb] font-semibold text-[14px] md:text-[16px] tracking-wider uppercase mb-2">
              "{details.tagline}"
            </p>
          )}

          <h1 className="text-[32px] md:text-[48px] font-extrabold text-white leading-tight mb-4">
            {details.title}
          </h1>

          {isValid(details.genres) && (
            <div className="flex flex-wrap gap-2 mb-6">
              {details.genres.map((genre) => (
                <span
                  key={genre.id}
                  className="px-3 py-1 text-[13px] font-medium bg-[#7c4dff]/10 border border-[#7c4dff]/30 text-[#e040fb] rounded-full"
                >
                  {genre.name}
                </span>
              ))}
            </div>
          )}

          <div className="flex flex-wrap gap-4 mb-6">
            <button
              onClick={handleWatchNow}
              className="flex items-center gap-2 px-6 py-3 rounded-[12px] bg-gradient-to-r from-[#e040fb] to-[#7c4dff] text-white font-bold hover:shadow-[0_0_20px_rgba(124,77,255,0.4)] hover:scale-[1.02] active:scale-[0.98] transition cursor-pointer"
            >
              ▶️ Watch Now
            </button>
            <button
              onClick={toggleFavorite}
              disabled={favLoading}
              className={`flex items-center gap-2 px-6 py-3 rounded-[12px] border font-semibold transition cursor-pointer active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed
                ${isFavorite
                  ? 'bg-red-500/10 border-red-500/40 text-red-400 hover:bg-red-500/20'
                  : 'bg-white/5 border-slate-700 text-slate-200 hover:bg-white/10 hover:border-slate-500'
                }`}
            >
              {favLoading
                ? <span className="flex items-center gap-2"><span className="w-4 h-4 rounded-full border-2 border-current border-t-transparent animate-spin" /> Updating...</span>
                : isFavorite ? '❤️ In Favourites' : '🤍 Add to Favourites'
              }
            </button>
            {favError && (
              <p className="w-full text-[13px] text-red-400 mt-[-8px]">{favError}</p>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-[14px] text-slate-400 border-y border-[#7c4dff]/10 py-4 mb-6">
            {isValid(details.release_date) && (
              <div>
                <span className="text-slate-500 mr-1.5">Released:</span>
                <span className="text-slate-200 font-medium">
                  {new Date(details.release_date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </span>
              </div>
            )}

            {isValid(details.runtime) && (
              <div className="flex items-center gap-1.5 before:content-['•'] before:text-slate-600 before:mr-1 md:before:inline hidden md:flex">
                <span className="text-slate-500">Duration:</span>
                <span className="text-slate-200 font-medium">{formatRuntime(details.runtime)}</span>
              </div>
            )}
            {isValid(details.runtime) && (
              <div className="md:hidden">
                <span className="text-slate-500 mr-1.5">Duration:</span>
                <span className="text-slate-200 font-medium">{formatRuntime(details.runtime)}</span>
              </div>
            )}
          </div>

          {isValid(details.overview) && (
            <div className="mb-8">
              <h2 className="text-[18px] font-bold text-white mb-2">Overview</h2>
              <p className="text-slate-300 leading-relaxed text-[15px]">{details.overview}</p>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4 bg-[#12121e] border border-[#7c4dff]/10 rounded-[16px] p-6">
            {isValid(details.budget) && (
              <div>
                <span className="block text-[12px] text-slate-500 uppercase tracking-wider mb-0.5">Budget</span>
                <span className="text-slate-200 font-medium">{formatCurrency(details.budget)}</span>
              </div>
            )}

            {isValid(details.revenue) && (
              <div>
                <span className="block text-[12px] text-slate-500 uppercase tracking-wider mb-0.5">Revenue</span>
                <span className="text-slate-200 font-medium">{formatCurrency(details.revenue)}</span>
              </div>
            )}

            {isValid(details.production_companies) && (
              <div className="sm:col-span-2">
                <span className="block text-[12px] text-slate-500 uppercase tracking-wider mb-0.5">Production Companies</span>
                <span className="text-slate-200 font-medium">
                  {details.production_companies.map((c) => c.name).join(', ')}
                </span>
              </div>
            )}

            {isValid(details.production_countries) && (
              <div>
                <span className="block text-[12px] text-slate-500 uppercase tracking-wider mb-0.5">Production Countries</span>
                <span className="text-slate-200 font-medium">
                  {details.production_countries.map((c) => c.name).join(', ')}
                </span>
              </div>
            )}

            {isValid(details.spoken_languages) && (
              <div>
                <span className="block text-[12px] text-slate-500 uppercase tracking-wider mb-0.5">Spoken Languages</span>
                <span className="text-slate-200 font-medium">
                  {details.spoken_languages.map((l) => l.name).join(', ')}
                </span>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}

export default Detail;

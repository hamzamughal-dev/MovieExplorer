import { Navigate } from 'react-router-dom';

import Loader from '../components/Loader';
import Button from '../components/Button';

import { formatCurrency, formatRuntime, isValid } from '../utils/index';
import { BASE_IMG, BASE_IMG_ORIGINAL } from '../constants/constants';

import { useDetail } from '../hooks/useDetail';

function Detail() {
  const {
    isLoggedIn,
    details,
    isDetailsLoading,
    detailsError,
    isFavorite,
    toggleFavorite,
    favError,
    handleWatchNow,
    navigate
  } = useDetail();

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  if (isDetailsLoading) {
    return <Loader text="Loading details..." className="min-h-[80vh] bg-[#202731]" />;
  }

  if (detailsError || !details) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] px-6 bg-[#202731] text-white">
        <div className="text-center p-[40px] bg-red-500/10 border border-red-500/30 rounded-[16px] text-red-400 text-[16px] max-w-md">
          ⚠️ {detailsError?.message || 'Movie details not found.'}
        </div>
        <Button
          variant="primary"
          onClick={() => navigate('/movies')}
          className="mt-6 rounded-[8px] text-sm"
        >
          Go Back to Movies
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#202731] text-slate-100 relative pb-16">
      {isValid(details.backdrop_path) && (
        <div className="absolute top-0 left-0 w-full h-[320px] md:h-[480px] overflow-hidden pointer-events-none z-0">
          <img
            src={`${BASE_IMG_ORIGINAL}${details.backdrop_path}`}
            alt=""
            className="w-full h-full object-cover opacity-25"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#202731] via-transparent to-black/50" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#202731]/80 via-transparent to-[#202731]/80" />
        </div>
      )}

      <div className="max-w-6xl mx-auto px-6 relative z-10 pt-8 md:pt-12 grid grid-cols-1 md:grid-cols-[300px_1fr] gap-8 md:gap-12">
        <div className="flex flex-col items-center md:items-start gap-4">
          <div className="relative w-[230px] md:w-full aspect-[2/3] rounded-[16px] overflow-hidden shadow-[0_12px_36px_rgba(0,0,0,0.8)] border border-[#01b4e4]/20 bg-[#181a20]">
            {isValid(details.poster_path) ? (
              <img
                src={`${BASE_IMG}${details.poster_path}`}
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
            <p className="text-[#90cea1] font-semibold text-[14px] md:text-[16px] tracking-wider uppercase mb-2">
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
                  className="px-3 py-1 text-[13px] font-medium bg-[#01b4e4]/10 border border-[#01b4e4]/30 text-[#90cea1] rounded-full"
                >
                  {genre.name}
                </span>
              ))}
            </div>
          )}

          <div className="flex flex-wrap gap-4 mb-6">
            <Button
              variant="primary"
              onClick={handleWatchNow}
              className="px-6 py-3 rounded-[12px] hover:scale-[1.02] active:scale-[0.98]"
            >
              ▶️ Watch Now
            </Button>
            <button
              onClick={() => toggleFavorite()}
              className={`flex items-center gap-2 px-6 py-3 rounded-[12px] border font-semibold transition-all duration-200 cursor-pointer active:scale-[0.96] hover:scale-[1.02] ${isFavorite
                ? 'bg-red-500/20 border-red-500/50 text-red-400 shadow-[0_0_15px_rgba(239,68,68,0.25)] hover:bg-red-500/30 hover:border-red-400'
                : 'bg-white/5 border-slate-700 text-slate-200 hover:bg-white/10 hover:border-slate-500 hover:text-white'
                }`}
            >
              <span className={`transition-transform duration-200 inline-block ${isFavorite ? 'scale-110' : 'scale-100'}`}>
                {isFavorite ? '❤️' : '🤍'}
              </span>
              <span>{isFavorite ? 'In Favourites' : 'Add to Favourites'}</span>
            </button>
            {favError && (
              <p className="w-full text-[13px] text-red-400 mt-[-8px]">{favError}</p>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-[14px] text-slate-400 border-y border-white/10 py-4 mb-6">
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

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4 bg-[#181a20]/60 border border-white/5 rounded-[16px] p-6">
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

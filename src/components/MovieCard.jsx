import { Navigate, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { IMAGE_BASE } from '../utils/constants';

function getRatingColor(rating) {
    if (rating >= 7) return { text: 'text-green-400', border: 'border-green-400/20' };
    if (rating >= 5) return { text: 'text-yellow-400', border: 'border-yellow-400/20' };
    return { text: 'text-red-400', border: 'border-red-400/20' };
}

function MovieCard({ movie }) {
    const [isHovered, setIsHovered] = useState(false);
    const rating = getRatingColor(movie.vote_average);

    const navigate = useNavigate();
    const handleClick = () => {
        navigate(`/detail/${movie.id}`);
    }

    const voteAverage = movie.vote_average;
    const ratingText = voteAverage && voteAverage > 0 ? voteAverage.toFixed(1) : 'N/A';

    return (
        <div
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={() => handleClick(movie.id)}
            className={`
                relative rounded-[16px] overflow-hidden bg-[#161a23]
                border border-[#262b35]/40 cursor-pointer
                transition-all duration-300 ease-in-out
                ${isHovered
                    ? 'z-10 -translate-y-[6px] shadow-[0_15px_30px_rgba(0,0,0,0.6)] border-slate-700/60'
                    : 'z-0 translate-y-0 shadow-[0_4px_12px_rgba(0,0,0,0.3)]'
                }
            `}
        >
            <div className="relative overflow-hidden aspect-[2/3]">
                {movie.poster_path ? (
                    <img
                        src={`${IMAGE_BASE}${movie.poster_path}`}
                        alt={movie.title || movie.name}
                        className="w-full h-full object-cover block transition-transform duration-500 hover:scale-105"
                    />
                ) : (
                    <div className="w-full h-full bg-gradient-to-br from-[#1d222f] to-[#121620] flex items-center justify-center text-[48px]">
                        🎬
                    </div>
                )}

                <div className={`
                    absolute top-[10px] right-[10px]
                    bg-black/70 backdrop-blur-md
                    rounded-[8px] px-[8px] py-[3.5px]
                    text-[12px] font-bold
                    border ${rating.border} ${rating.text}
                `}>
                    ⭐ {ratingText}
                </div>
            </div>

            <div className="px-[14px] py-[12px]">
                <h3 className="text-[14px] font-bold text-slate-100 truncate mb-[6px]">
                    {movie.title || movie.name}
                </h3>
                <div className="flex items-center justify-between text-[12px] text-slate-400">
                    <span className="font-medium truncate mr-2">
                        {movie.media_type === 'tv' ? 'TV Show' : 'Movie'}
                    </span>
                    <span className="text-slate-500 flex-shrink-0">
                        {movie.release_date?.slice(0, 4) || movie.first_air_date?.slice(0, 4) || 'N/A'}
                    </span>
                </div>
            </div>
        </div>
    );
}

export default MovieCard;

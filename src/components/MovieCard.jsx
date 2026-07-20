import { Navigate, useNavigate } from 'react-router-dom';

const IMAGE_BASE = 'https://image.tmdb.org/t/p/w500';

function getRatingColor(rating) {
    if (rating >= 7) return { text: 'text-green-400', border: 'border-green-400/30' };
    if (rating >= 5) return { text: 'text-yellow-400', border: 'border-yellow-400/30' };
    return { text: 'text-red-400', border: 'border-red-400/30' };
}

function MovieCard({ movie }) {
    const [hovered, setHovered] = useState(false);
    const rating = getRatingColor(movie.vote_average);

    const navigate = useNavigate();
    const handleClick = () => {
        navigate(`/detail/${movie.id}`);
    }
    return (
        <div
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            onClick={() => handleClick(movie.id)}
            className={`
                relative rounded-[16px] overflow-hidden bg-[#12121e]
                border border-[#7c4dff]/15 cursor-pointer
                transition-all duration-300 ease-in-out
                ${hovered
                    ? 'z-10 -translate-y-[8px] shadow-[0_20px_40px_rgba(124,77,255,0.3)] border-[#7c4dff]/40'
                    : 'z-0 translate-y-0 shadow-[0_4px_12px_rgba(0,0,0,0.4)]'
                }
            `}
        >
            <div className="relative overflow-hidden aspect-[2/3]">
                {movie.poster_path ? (
                    <img
                        src={`${IMAGE_BASE}${movie.poster_path}`}
                        alt={movie.title || movie.name}
                        className="w-full h-full object-cover block"
                    />
                ) : (
                    <div className="w-full h-full bg-gradient-to-br from-[#1e1e2e] to-[#2d2d44] flex items-center justify-center text-[48px]">
                        🎬
                    </div>
                )}

                <div className={`
                    absolute top-[10px] right-[10px]
                    bg-black/75 backdrop-blur-md
                    rounded-[8px] px-[8px] py-[4px]
                    text-[12px] font-bold
                    border ${rating.border} ${rating.text}
                `}>
                    ⭐ {movie.vote_average?.toFixed(1)}
                </div>
            </div>

            <div className="px-[14px] py-[12px]">
                <h3 className="text-[14px] font-bold text-slate-100 truncate mb-[4px]">
                    {movie.title || movie.name}
                </h3>
                <div className="flex items-center justify-between">
                    <span className="text-[12px] text-[#7c4dff] font-semibold">
                        {movie.media_type === 'tv' ? '📺 TV Show' : '🎥 Movie'}
                    </span>
                    <span className="text-[12px] text-slate-500">
                        {movie.release_date?.slice(0, 4) || movie.first_air_date?.slice(0, 4) || 'N/A'}
                    </span>
                </div>
            </div>
        </div>
    );
}

export default MovieCard;

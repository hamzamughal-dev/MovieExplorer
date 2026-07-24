import { forwardRef, useState } from 'react';
import { EyeIcon, EyeOffIcon, SearchIcon } from './icons';

const Input = forwardRef(function Input(
    {
        variant = 'default',
        type = 'text',
        placeholder,
        icon,
        className = '',
        label,
        error,
        rightSlot,
        clearSlot,
        ...rest
    },
    ref
) {
    const [showPassword, setShowPassword] = useState(false);

    const isSearch = variant === 'search';
    const isPassword = type === 'password';
    const resolvedType = isPassword ? (showPassword ? 'text' : 'password') : type;

    const searchIcon = icon ?? <SearchIcon />;

    return (
        <div className={isSearch
            ? `relative flex-shrink-0 ${className}`
            : `flex flex-col gap-1.5 ${className}`
        }>
            {!isSearch && (label || rightSlot) && (
                <div className="flex items-center justify-between">
                    {label && (
                        <label className="text-xs font-semibold text-slate-300 uppercase tracking-widest">
                            {label}
                        </label>
                    )}
                    {rightSlot}
                </div>
            )}

            <div className={isSearch ? 'relative' : 'relative group'}>
                {isSearch ? (
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                        {searchIcon}
                    </span>
                ) : icon && (
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-[#01b4e4] transition-colors duration-200 pointer-events-none">
                        {icon}
                    </span>
                )}

                <input
                    ref={ref}
                    type={isSearch ? 'text' : resolvedType}
                    placeholder={placeholder}
                    className={isSearch
                        ? 'pl-10 pr-8 py-[9px] w-[260px] md:w-[320px] rounded-full bg-[#181a20]/80 border border-white/10 text-white placeholder-slate-500 text-[13px] outline-none focus:border-[#01b4e4] focus:ring-1 focus:ring-[#01b4e4]/30 transition-all shadow-inner'
                        : `w-full text-white text-sm py-3 bg-white/5 border border-white/10 rounded-xl outline-none transition-all duration-200 placeholder-slate-600 focus:bg-white/8 focus:border-[#01b4e4]/60 focus:shadow-[0_0_0_3px_rgba(1,180,228,0.12)] ${icon ? 'pl-11' : 'pl-4'} ${isPassword ? 'pr-12' : 'pr-4'}`
                    }
                    {...rest}
                />

                {isSearch
                    ? clearSlot && (
                        <span className="absolute right-3 top-1/2 -translate-y-1/2">
                            {clearSlot}
                        </span>
                    )
                    : isPassword && (
                        <button
                            type="button"
                            onClick={() => setShowPassword(v => !v)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-200 transition-colors duration-200 cursor-pointer"
                            tabIndex={-1}
                            aria-label={showPassword ? 'Hide password' : 'Show password'}
                        >
                            {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                        </button>
                    )
                }
            </div>

            {!isSearch && error && (
                <span className="text-red-400 text-[11px] flex items-center gap-1">
                    <span>⚠</span> {error.message}
                </span>
            )}
        </div>
    );
});

export default Input;

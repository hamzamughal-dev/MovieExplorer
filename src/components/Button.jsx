function Button({ variant = 'primary', type = 'button', className = '', children, ...rest }) {
    const base = 'relative inline-flex items-center justify-center gap-2 font-semibold cursor-pointer transition-all duration-300 active:translate-y-0';

    const variants = {
        primary: 'text-[#0a0d14] rounded-xl py-3 px-5 text-sm font-bold overflow-hidden group hover:shadow-[0_8px_30px_rgba(1,180,228,0.4)] hover:-translate-y-0.5',
        ghost: 'text-slate-300 rounded-xl py-2.5 px-5 text-sm border border-white/10 hover:border-[#01b4e4]/40 hover:text-white hover:bg-white/5',
        danger: 'text-red-400 rounded-[8px] py-2.5 px-4 text-sm border border-red-500/30 bg-red-500/10 hover:bg-red-500/20 hover:border-red-400 hover:text-red-300 w-full text-left',
        icon: 'text-slate-400 hover:text-white p-1',
    };


    return (
        <button
            type={type}
            className={`${base} ${variants[variant]} ${className}`}
            style={variant === 'primary' ? { background: 'linear-gradient(135deg, #01b4e4 0%, #90cea1 100%)' } : undefined}
            {...rest}
        >
            <span className="relative z-10 inline-flex items-center gap-2">{children}</span>
        </button>
    );
}

export default Button;

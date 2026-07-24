const iconProps = (size = 16) => ({
    xmlns: 'http://www.w3.org/2000/svg',
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 2,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
});

export const UserIcon = ({ size = 16, ...props }) => (
    <svg {...iconProps(size)} {...props}>
        <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
    </svg>
);

export const LockIcon = ({ size = 16, ...props }) => (
    <svg {...iconProps(size)} {...props}>
        <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
);

export const ShieldIcon = ({ size = 16, ...props }) => (
    <svg {...iconProps(size)} {...props}>
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
);

export const MailIcon = ({ size = 16, ...props }) => (
    <svg {...iconProps(size)} {...props}>
        <rect width="20" height="16" x="2" y="4" rx="2" />
        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
);

export const EyeIcon = ({ size = 16, ...props }) => (
    <svg {...iconProps(size)} {...props}>
        <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
        <circle cx="12" cy="12" r="3" />
    </svg>
);

export const EyeOffIcon = ({ size = 16, ...props }) => (
    <svg {...iconProps(size)} {...props}>
        <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
        <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
        <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
        <line x1="2" x2="22" y1="2" y2="22" />
    </svg>
);

export const SearchIcon = ({ size = 16, ...props }) => (
    <svg {...iconProps(size)} {...props}>
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.3-4.3" />
    </svg>
);

export const FilmIcon = ({ size = 18, ...props }) => (
    <svg {...iconProps(size)} {...props}>
        <rect width="18" height="18" x="3" y="3" rx="2" />
        <path d="M7 3v18" />
        <path d="M17 3v18" />
        <path d="M3 8h4" />
        <path d="M3 16h4" />
        <path d="M17 8h4" />
        <path d="M17 16h4" />
    </svg>
);

export const StarIcon = ({ size = 18, ...props }) => (
    <svg {...iconProps(size)} {...props}>
        <path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z" />
    </svg>
);

export const CalendarIcon = ({ size = 18, ...props }) => (
    <svg {...iconProps(size)} {...props}>
        <path d="M8 2v4" />
        <path d="M16 2v4" />
        <rect width="18" height="18" x="3" y="4" rx="2" />
        <path d="M3 10h18" />
        <path d="M8 14h.01" />
        <path d="M12 14h.01" />
        <path d="M16 14h.01" />
        <path d="M8 18h.01" />
        <path d="M12 18h.01" />
    </svg>
);

export const LogoIcon = ({ className = "w-[42px] h-[42px]", ...props }) => (
    <svg
        className={className}
        viewBox="0 0 200 200"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
    >
        <defs>
            <linearGradient id="movieExplorerGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#01b4e4" />
                <stop offset="100%" stopColor="#90cea1" />
            </linearGradient>
        </defs>
        <path
            fillRule="evenodd"
            fill="url(#movieExplorerGrad)"
            d="M 194 100 A 94 94 0 1 0 6 100 A 94 94 0 1 0 194 100 Z M 178 100 A 78 78 0 1 0 22 100 A 78 78 0 1 0 178 100 Z M 89.0 3.0 L 111.0 3.0 L 111.0 25.0 L 89.0 25.0 Z M 160.81 23.63 L 176.37 39.19 L 160.81 54.75 L 145.25 39.19 Z M 197.0 89.0 L 197.0 111.0 L 175.0 111.0 L 175.0 89.0 Z M 176.37 160.81 L 160.81 176.37 L 145.25 160.81 L 160.81 145.25 Z M 111.0 197.0 L 89.0 197.0 L 89.0 175.0 L 111.0 175.0 Z M 39.19 176.37 L 23.63 160.81 L 39.19 145.25 L 54.75 160.81 Z M 3.0 111.0 L 3.0 89.0 L 25.0 89.0 L 25.0 111.0 Z M 23.63 39.19 L 39.19 23.63 L 54.75 39.19 L 39.19 54.75 Z M 146 100 A 46 46 0 1 0 54 100 A 46 46 0 1 0 146 100 Z M 85 76 L 130 100 L 85 124 Z"
        />
    </svg>
);


import { useState } from 'react';
import { useForm } from "react-hook-form";
import { Navigate, Link } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import loginPoster from '../assets/images/login-poster.jpg';
import useStore from '../store/authStore';
import { getSessionID, getAccountDetails } from '../api/api';
import { LOGIN_USERNAME, LOGIN_PASSWORD } from '../utils/constants';

import Loader from '../components/Loader';
import Logo from '../components/Logo';

const EyeIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
        <circle cx="12" cy="12" r="3" />
    </svg>
);

const EyeOffIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
        <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
        <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
        <line x1="2" x2="22" y1="2" y2="22" />
    </svg>
);

const features = [
    {
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="url(#featureGrad)" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                <defs><linearGradient id="featureGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#01b4e4" /><stop offset="100%" stopColor="#90cea1" /></linearGradient></defs>
                <rect width="18" height="18" x="3" y="3" rx="2" />
                <path d="M7 3v18" /><path d="M17 3v18" /><path d="M3 8h4" /><path d="M3 16h4" /><path d="M17 8h4" /><path d="M17 16h4" />
            </svg>
        ),
        text: 'Curated movie collections'
    },
    {
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="url(#featureGrad2)" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                <defs><linearGradient id="featureGrad2" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#01b4e4" /><stop offset="100%" stopColor="#90cea1" /></linearGradient></defs>
                <path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z" />
            </svg>
        ),
        text: 'Rate & review films'
    },
    {
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="url(#featureGrad3)" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                <defs><linearGradient id="featureGrad3" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#01b4e4" /><stop offset="100%" stopColor="#90cea1" /></linearGradient></defs>
                <path d="M8 2v4" /><path d="M16 2v4" /><rect width="18" height="18" x="3" y="4" rx="2" /><path d="M3 10h18" /><path d="M8 14h.01" /><path d="M12 14h.01" /><path d="M16 14h.01" /><path d="M8 18h.01" /><path d="M12 18h.01" />
            </svg>
        ),
        text: 'Build your watchlist'
    },
    {
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="url(#featureGrad4)" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                <defs><linearGradient id="featureGrad4" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#01b4e4" /><stop offset="100%" stopColor="#90cea1" /></linearGradient></defs>
                <circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" />
            </svg>
        ),
        text: 'Advanced search & filters'
    },
];

function Login() {
    const { register, handleSubmit, formState: { errors }, reset } = useForm();

    const sessionID = useStore(state => state.sessionID);
    const setSessionID = useStore(state => state.setSessionID);
    const setAccountID = useStore(state => state.setAccountID);

    const [showPassword, setShowPassword] = useState(false);
    const isLoggedIn = !!sessionID;

    const {
        mutate: login,
        isPending: isLoading
    } = useMutation({
        mutationKey: ['login'],
        mutationFn: async () => {
            const response = await getSessionID();
            const guestSessionID = response.data?.guest_session_id;

            if (!guestSessionID) {
                throw new Error("Failed to generate guest session ID");
            }

            let accountID = null;
            try {
                const accountDetails = await getAccountDetails();
                accountID = accountDetails?.id ?? null;
            } catch (error) {
                console.error("Could not fetch account details:", error);
            }

            return { guestSessionID, accountID };
        },
        onSuccess: ({ guestSessionID, accountID }) => {
            setSessionID(guestSessionID);
            if (accountID) setAccountID(accountID);
            toast.success("Logged in successfully!", { theme: "dark" });
        },
        onError: (error) => {
            toast.error(error.message, { theme: "dark" });
            reset();
        }
    });

    const handleLogin = (data) => {
        if (data.userName !== LOGIN_USERNAME || data.password !== LOGIN_PASSWORD) {
            toast.error("Invalid Credentials", { theme: "dark" });
            reset();
            return;
        }
        login(data);
    };

    if (isLoggedIn) return <Navigate to="/movies" replace />;
    if (isLoading) return <Loader text="Logging in..." className="min-h-screen bg-[#0a0d14]" />;

    return (
        <div className="min-h-screen w-full flex overflow-hidden bg-[#0a0d14]">
            <div
                className="hidden lg:flex lg:w-[50%] relative flex-col gap-10 p-10 overflow-hidden"
                style={{
                    backgroundImage: `linear-gradient(135deg, rgba(1,11,26,0.92) 0%, rgba(1,22,45,0.85) 50%, rgba(1,50,80,0.7) 100%), url(${loginPoster})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                }}
            >
                <div className="absolute top-[-80px] left-[-80px] w-[400px] h-[400px] rounded-full bg-[#01b4e4]/10 blur-[120px] pointer-events-none" />
                <div className="absolute bottom-[-60px] right-[-60px] w-[350px] h-[350px] rounded-full bg-[#90cea1]/8 blur-[100px] pointer-events-none" />

                <div className="relative z-10 flex items-center gap-3">
                    <Logo className="w-10 h-10 drop-shadow-[0_0_16px_rgba(1,180,228,0.5)]" />
                    <span className="text-xl font-bold bg-gradient-to-r from-[#01b4e4] to-[#90cea1] bg-clip-text text-transparent tracking-wide">Movie Explorer</span>
                </div>

                <div className="relative z-10 flex flex-col gap-8">
                    <div>
                        <h1 className="text-5xl font-extrabold text-white leading-tight mb-4">
                            Your cinematic<br />
                            <span className="bg-gradient-to-r from-[#01b4e4] to-[#90cea1] bg-clip-text text-transparent">
                                universe awaits.
                            </span>
                        </h1>
                        <p className="text-slate-300 text-base leading-relaxed max-w-sm">
                            Discover, track, and discuss the films you love. Join thousands of movie enthusiasts on Movie Explorer.
                        </p>
                    </div>

                    <ul className="flex flex-col gap-3">
                        {features.map((f, i) => (
                            <li key={i} className="flex items-center gap-3">
                                <span className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center backdrop-blur-sm shrink-0">{f.icon}</span>
                                <span className="text-slate-300 text-sm">{f.text}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            <div className="flex-1 flex flex-col items-center justify-center p-6 sm:p-10 relative">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(1,180,228,0.06)_0%,_transparent_60%)] pointer-events-none" />
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_rgba(144,206,161,0.05)_0%,_transparent_60%)] pointer-events-none" />

                <div className="lg:hidden flex items-center gap-2 mb-8">
                    <Logo className="w-8 h-8" />
                    <span className="text-base font-bold bg-gradient-to-r from-[#01b4e4] to-[#90cea1] bg-clip-text text-transparent tracking-wide">Movie Explorer</span>
                </div>

                <div className="w-full max-w-[420px] relative z-10">
                    <div className="mb-8">
                        <h2 className="text-3xl font-extrabold text-white tracking-tight mb-2">Welcome back</h2>
                        <p className="text-slate-400 text-sm">Sign in to your account to continue.</p>
                    </div>

                    <form className="flex flex-col gap-5" onSubmit={handleSubmit(handleLogin)}>
                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-semibold text-slate-300 uppercase tracking-widest">Username</label>
                            <div className="relative group">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-[#01b4e4] transition-colors duration-200 pointer-events-none">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                                        <circle cx="12" cy="7" r="4" />
                                    </svg>
                                </span>
                                <input
                                    {...register("userName", { required: "Username is required" })}
                                    type="text"
                                    placeholder="e.g. john_doe"
                                    className="w-full text-white text-sm pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl outline-none transition-all duration-200 placeholder-slate-600 focus:bg-white/8 focus:border-[#01b4e4]/60 focus:shadow-[0_0_0_3px_rgba(1,180,228,0.12)]"
                                />
                            </div>
                            {errors.userName && <span className="text-red-400 text-[11px] flex items-center gap-1"><span>⚠</span>{errors.userName.message}</span>}
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <div className="flex items-center justify-between">
                                <label className="text-xs font-semibold text-slate-300 uppercase tracking-widest">Password</label>
                                <button type="button" className="text-[11px] text-[#01b4e4] hover:text-[#90cea1] transition-colors duration-200 font-medium cursor-pointer">
                                    Forgot password?
                                </button>
                            </div>
                            <div className="relative group">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-[#01b4e4] transition-colors duration-200 pointer-events-none">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                                        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                                    </svg>
                                </span>
                                <input
                                    {...register("password", { required: "Password is required" })}
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Enter your password"
                                    className="w-full text-white text-sm pl-11 pr-12 py-3 bg-white/5 border border-white/10 rounded-xl outline-none transition-all duration-200 placeholder-slate-600 focus:bg-white/8 focus:border-[#01b4e4]/60 focus:shadow-[0_0_0_3px_rgba(1,180,228,0.12)]"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(v => !v)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-200 transition-colors duration-200 cursor-pointer"
                                >
                                    {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                                </button>
                            </div>
                            {errors.password && <span className="text-red-400 text-[11px] flex items-center gap-1"><span>⚠</span>{errors.password.message}</span>}
                        </div>

                        <button
                            type="submit"
                            className="relative w-full py-3 mt-2 rounded-xl font-bold text-sm text-[#0a0d14] cursor-pointer overflow-hidden group transition-all duration-300 hover:shadow-[0_8px_30px_rgba(1,180,228,0.4)] hover:-translate-y-0.5 active:translate-y-0"
                            style={{ background: 'linear-gradient(135deg, #01b4e4 0%, #90cea1 100%)' }}
                        >
                            <span className="relative z-10">Sign In →</span>
                            <span className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </button>
                    </form>

                    <div className="flex items-center gap-3 my-6">
                        <div className="flex-1 h-px bg-white/8" />
                        <span className="text-xs text-slate-500">OR</span>
                        <div className="flex-1 h-px bg-white/8" />
                    </div>

                    <p className="text-center text-sm text-slate-400">
                        Don't have an account?{' '}
                        <Link to="/signup" className="text-[#01b4e4] font-semibold hover:text-[#90cea1] transition-colors duration-200">
                            Create one free
                        </Link>
                    </p>
                </div>
            </div>

            <ToastContainer position="top-right" autoClose={3000} theme="dark" />
        </div>
    );
}

export default Login;

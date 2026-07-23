import loginPoster from '../assets/images/login-poster.jpg'
import { useState } from 'react'
import { useForm } from "react-hook-form"
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { Navigate, Link } from 'react-router-dom'
import useStore from '../store/authStore'
import Loader from '../components/Loader'
import Logo from '../components/Logo'
import { signupSchema } from "../schemas/signupSchema";
import { zodResolver } from "@hookform/resolvers/zod";

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





function Signup() {
    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: zodResolver(signupSchema),
        defaultValues: { gender: 'male' },
    });
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const sessionID = useStore(state => state.sessionID);
    const isLoggedIn = !!sessionID;


    const handleSignup = (data) => {
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
            toast.info("Registration demo: Please use your .env credentials on Login.", { theme: "dark" });
        }, 1200);
    };

    if (isLoggedIn) return <Navigate to="/movies" replace />;
    if (isLoading) return <Loader text="Creating account..." className="min-h-screen bg-[#0a0d14]" />;

    return (
        <div className="h-screen w-full flex overflow-hidden bg-[#0a0d14]">

            <div
                className="hidden lg:flex lg:w-[50%] relative flex-col gap-10 p-10 overflow-hidden"
                style={{
                    backgroundImage: `linear-gradient(135deg, rgba(1,11,26,0.93) 0%, rgba(1,25,50,0.88) 50%, rgba(1,55,85,0.72) 100%), url(${loginPoster})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center top',
                }}
            >

                <div className="absolute top-[-100px] right-[-100px] w-[450px] h-[450px] rounded-full bg-[#01b4e4]/8 blur-[140px] pointer-events-none" />
                <div className="absolute bottom-[-80px] left-[-60px] w-[380px] h-[380px] rounded-full bg-[#90cea1]/6 blur-[120px] pointer-events-none" />


                <div className="relative z-10 flex items-center gap-3">
                    <Logo className="w-10 h-10 drop-shadow-[0_0_18px_rgba(1,180,228,0.5)]" />
                    <span className="text-xl font-bold bg-gradient-to-r from-[#01b4e4] to-[#90cea1] bg-clip-text text-transparent tracking-wide">Movie Explorer</span>
                </div>

                <div className="relative z-10">
                    <div className="mb-8">
                        <div className="inline-flex items-center gap-2 bg-[#01b4e4]/10 border border-[#01b4e4]/20 rounded-full px-3 py-1.5 text-xs text-[#01b4e4] font-medium mb-4">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#01b4e4] animate-pulse" />
                            Free to join · No credit card
                        </div>
                        <h1 className="text-4xl xl:text-5xl font-extrabold text-white leading-tight mb-4">
                            Start your<br />
                            <span className="bg-gradient-to-r from-[#01b4e4] to-[#90cea1] bg-clip-text text-transparent">
                                movie journey
                            </span>
                            <br />today.
                        </h1>
                        <p className="text-slate-300 text-sm leading-relaxed max-w-xs">
                            Create your free account and unlock a world of curated cinema, watchlists, and more.
                        </p>
                    </div>

                </div>
            </div>

            <div className="flex-1 flex flex-col items-center overflow-y-auto relative">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_rgba(1,180,228,0.05)_0%,_transparent_60%)] pointer-events-none" />
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_rgba(144,206,161,0.04)_0%,_transparent_60%)] pointer-events-none" />
                <div className="lg:hidden flex items-center gap-2 mt-8 mb-6">
                    <Logo className="w-8 h-8" />
                    <span className="text-base font-bold bg-gradient-to-r from-[#01b4e4] to-[#90cea1] bg-clip-text text-transparent tracking-wide">Movie Explorer</span>
                </div>

                <div className="w-full max-w-[440px] relative z-10 px-6 sm:px-8 xl:px-10 py-10">

                    <div className="mb-7">
                        <h2 className="text-3xl font-extrabold text-white tracking-tight mb-1.5">Create your account</h2>
                        <p className="text-slate-400 text-sm">It's free and takes less than a minute.</p>
                    </div>

                    <form className="flex flex-col gap-4" onSubmit={handleSubmit(handleSignup)}>

                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-semibold text-slate-300 uppercase tracking-widest">Username</label>
                            <div className="relative group">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-[#01b4e4] transition-colors duration-200 pointer-events-none">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
                                    </svg>
                                </span>
                                <input
                                    {...register("userName")}
                                    type="text"
                                    placeholder="Choose a username"
                                    className="w-full text-white text-sm pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl outline-none transition-all duration-200 placeholder-slate-600 focus:bg-white/8 focus:border-[#01b4e4]/60 focus:shadow-[0_0_0_3px_rgba(1,180,228,0.12)]"
                                />
                            </div>
                            {errors.userName && <span className="text-red-400 text-[11px] flex items-center gap-1">⚠ {errors.userName.message}</span>}
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-semibold text-slate-300 uppercase tracking-widest">Email</label>
                            <div className="relative group">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-[#01b4e4] transition-colors duration-200 pointer-events-none">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <rect width="20" height="16" x="2" y="4" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                                    </svg>
                                </span>
                                <input
                                    {...register("email")}
                                    type="email"
                                    placeholder="you@example.com"
                                    className="w-full text-white text-sm pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl outline-none transition-all duration-200 placeholder-slate-600 focus:bg-white/8 focus:border-[#01b4e4]/60 focus:shadow-[0_0_0_3px_rgba(1,180,228,0.12)]"
                                />
                            </div>
                            {errors.email && <span className="text-red-400 text-[11px] flex items-center gap-1">⚠ {errors.email.message}</span>}
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-semibold text-slate-300 uppercase tracking-widest">Password</label>
                            <div className="relative group">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-[#01b4e4] transition-colors duration-200 pointer-events-none">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <rect width="18" height="11" x="3" y="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
                                    </svg>
                                </span>
                                <input
                                    {...register("password")}
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Min. 8 characters"
                                    className="w-full text-white text-sm pl-11 pr-12 py-3 bg-white/5 border border-white/10 rounded-xl outline-none transition-all duration-200 placeholder-slate-600 focus:bg-white/8 focus:border-[#01b4e4]/60 focus:shadow-[0_0_0_3px_rgba(1,180,228,0.12)]"
                                />
                                <button type="button" onClick={() => setShowPassword(v => !v)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-200 transition-colors duration-200 cursor-pointer">
                                    {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                                </button>
                            </div>

                            {errors.password && <span className="text-red-400 text-[11px] flex items-center gap-1">⚠ {errors.password.message}</span>}
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-semibold text-slate-300 uppercase tracking-widest">Confirm Password</label>
                            <div className="relative group">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-[#01b4e4] transition-colors duration-200 pointer-events-none">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                                    </svg>
                                </span>
                                <input
                                    {...register("confirmPassword")}
                                    type={showConfirm ? "text" : "password"}
                                    placeholder="Re-enter your password"
                                    className="w-full text-white text-sm pl-11 pr-12 py-3 bg-white/5 border border-white/10 rounded-xl outline-none transition-all duration-200 placeholder-slate-600 focus:bg-white/8 focus:border-[#01b4e4]/60 focus:shadow-[0_0_0_3px_rgba(1,180,228,0.12)]"
                                />
                                <button type="button" onClick={() => setShowConfirm(v => !v)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-200 transition-colors duration-200 cursor-pointer">
                                    {showConfirm ? <EyeOffIcon /> : <EyeIcon />}
                                </button>
                            </div>
                            {errors.confirmPassword && <span className="text-red-400 text-[11px] flex items-center gap-1">⚠ {errors.confirmPassword.message}</span>}
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-xs font-semibold text-slate-300 uppercase tracking-widest">Gender</label>
                            <div className="grid grid-cols-3 gap-2">
                                {['male', 'female', 'other'].map((option) => (
                                    <label key={option} className="relative cursor-pointer">
                                        <input
                                            type="radio"
                                            value={option}
                                            {...register("gender")}
                                            className="peer sr-only"
                                        />
                                        <div className="py-2 px-3 bg-white/5 border border-white/10 rounded-xl text-center text-sm text-slate-400 capitalize transition-all duration-200 peer-checked:bg-[#01b4e4]/10 peer-checked:border-[#01b4e4]/50 peer-checked:text-[#01b4e4] hover:border-white/20 hover:text-slate-200">
                                            {option === 'male' ? '♂ Male' : option === 'female' ? '♀ Female' : '⚧ Other'}
                                        </div>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="relative w-full py-3 mt-1 rounded-xl font-bold text-sm text-[#0a0d14] cursor-pointer overflow-hidden group transition-all duration-300 hover:shadow-[0_8px_30px_rgba(1,180,228,0.4)] hover:-translate-y-0.5 active:translate-y-0"
                            style={{ background: 'linear-gradient(135deg, #01b4e4 0%, #90cea1 100%)' }}
                        >
                            <span className="relative z-10">Create Account →</span>
                            <span className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </button>
                    </form>

                    <div className="flex items-center gap-3 my-5">
                        <div className="flex-1 h-px bg-white/8" />
                        <span className="text-xs text-slate-500">ALREADY A MEMBER?</span>
                        <div className="flex-1 h-px bg-white/8" />
                    </div>

                    <Link
                        to="/login"
                        className="flex items-center justify-center w-full py-2.5 rounded-xl border border-white/10 text-slate-300 text-sm font-medium hover:border-[#01b4e4]/40 hover:text-white hover:bg-white/5 transition-all duration-200"
                    >
                        Sign In Instead
                    </Link>

                    <p className="mt-5 text-center text-[11px] text-slate-600">
                        By signing up you agree to our{' '}
                        <span className="text-slate-400 hover:text-[#01b4e4] cursor-pointer transition-colors">Terms of Service</span>
                        {' '}and{' '}
                        <span className="text-slate-400 hover:text-[#01b4e4] cursor-pointer transition-colors">Privacy Policy</span>.
                    </p>
                </div>
            </div>

            <ToastContainer position="top-right" autoClose={3000} theme="dark" />
        </div>
    )
}

export default Signup

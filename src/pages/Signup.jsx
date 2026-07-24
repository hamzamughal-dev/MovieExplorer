import { Navigate, Link } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import loginPoster from '../assets/images/login-poster.jpg';
import Loader from '../components/Loader';
import Input from '../components/Input';
import Button from '../components/Button';
import { UserIcon, MailIcon, LockIcon, ShieldIcon, LogoIcon } from '../components/icons';
import { useSignup } from '../hooks/useSignup';

function Signup() {
    const {
        register,
        handleSubmit,
        errors,
        isLoading,
        isLoggedIn,
        handleSignup
    } = useSignup();

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
                    <LogoIcon className="w-10 h-10 drop-shadow-[0_0_18px_rgba(1,180,228,0.5)]" />
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
                    <LogoIcon className="w-8 h-8" />
                    <span className="text-base font-bold bg-gradient-to-r from-[#01b4e4] to-[#90cea1] bg-clip-text text-transparent tracking-wide">Movie Explorer</span>
                </div>

                <div className="w-full max-w-[440px] relative z-10 px-6 sm:px-8 xl:px-10 py-10">
                    <div className="mb-7">
                        <h2 className="text-3xl font-extrabold text-white tracking-tight mb-1.5">Create your account</h2>
                        <p className="text-slate-400 text-sm">It's free and takes less than a minute.</p>
                    </div>

                    <form className="flex flex-col gap-4" onSubmit={handleSubmit(handleSignup)}>
                        <Input
                            {...register("userName")}
                            label="Username"
                            type="text"
                            placeholder="Choose a username"
                            error={errors.userName}
                            icon={<UserIcon size={15} />}
                        />

                        <Input
                            {...register("email")}
                            label="Email"
                            type="email"
                            placeholder="you@example.com"
                            error={errors.email}
                            icon={<MailIcon size={15} />}
                        />

                        <Input
                            {...register("password")}
                            label="Password"
                            type="password"
                            placeholder="Min. 8 characters"
                            error={errors.password}
                            icon={<LockIcon size={15} />}
                        />

                        <Input
                            {...register("confirmPassword")}
                            label="Confirm Password"
                            type="password"
                            placeholder="Re-enter your password"
                            error={errors.confirmPassword}
                            icon={<ShieldIcon size={15} />}
                        />

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

                        <Button type="submit" className="mt-1">Create Account →</Button>
                    </form>

                    <div className="flex items-center gap-3 my-5">
                        <div className="flex-1 h-px bg-white/8" />
                        <span className="text-xs text-slate-500">OR</span>
                        <div className="flex-1 h-px bg-white/8" />
                    </div>

                    <p className="text-center text-sm text-slate-400">
                        Already have an account?{' '}
                        <Link to="/login" className="text-[#01b4e4] font-semibold hover:text-[#90cea1] transition-colors duration-200">
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>

            <ToastContainer position="top-right" autoClose={3000} theme="dark" />
        </div>
    );
}

export default Signup;

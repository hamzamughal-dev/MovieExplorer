import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Loader from '../components/Loader';
import Input from '../components/Input';
import Button from '../components/Button';

import { useLogin } from '../hooks/useLogin';
import { loginSchema } from '../schemas/loginSchema';
import { UserIcon, LockIcon, FilmIcon, StarIcon, CalendarIcon, SearchIcon, LogoIcon } from '../components/icons';

import { LOGIN_POSTER } from '../constants/constants';

const features = [
    { icon: <FilmIcon size={18} />, text: 'Curated movie collections' },
    { icon: <StarIcon size={18} />, text: 'Rate & review films' },
    { icon: <CalendarIcon size={18} />, text: 'Build your watchlist' },
    { icon: <SearchIcon size={18} />, text: 'Advanced search & filters' },
];

const loginFields = [
    { name: 'userName', label: 'Username', type: 'text', placeholder: 'e.g. john_doe', icon: <UserIcon /> },
    { name: 'password', label: 'Password', type: 'password', placeholder: 'Enter your password', icon: <LockIcon />, rightSlot: (<button type="button" className="text-[11px] text-[#01b4e4] hover:text-[#90cea1] transition-colors duration-200 font-medium cursor-pointer">Forgot password?</button>), },
];

function Login() {
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset
    } = useForm({
        resolver: zodResolver(loginSchema),
    });

    const {
        isLoggedIn,
        isLoading,
        handleLogin
    } = useLogin();

    const onSubmit = (data) => {
        handleLogin(data, () => reset());
    };

    if (isLoggedIn) return <Navigate to="/movies" replace />;
    if (isLoading) return <Loader text="Logging in..." className="min-h-screen bg-[#0a0d14]" />;

    return (
        <div className="min-h-screen w-full flex overflow-hidden bg-[#0a0d14]">
            <div className="hidden lg:flex lg:w-[50%] relative flex-col gap-10 p-10 overflow-hidden">
                <img
                    src={LOGIN_POSTER}
                    alt="Poster"
                    className="absolute inset-0 w-full h-full object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-[#010b1a]/92 via-[#01162d]/85 to-[#013250]/70" />
                <div className="absolute top-[-80px] left-[-80px] w-[400px] h-[400px] rounded-full bg-[#01b4e4]/10 blur-[120px] pointer-events-none" />
                <div className="absolute bottom-[-60px] right-[-60px] w-[350px] h-[350px] rounded-full bg-[#90cea1]/8 blur-[100px] pointer-events-none" />

                <div className="relative z-10 flex items-center gap-3">
                    <LogoIcon className="w-10 h-10 drop-shadow-[0_0_16px_rgba(1,180,228,0.5)]" />
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
                    <LogoIcon className="w-8 h-8" />
                    <span className="text-base font-bold bg-gradient-to-r from-[#01b4e4] to-[#90cea1] bg-clip-text text-transparent tracking-wide">Movie Explorer</span>
                </div>

                <div className="w-full max-w-[420px] relative z-10">
                    <div className="mb-8">
                        <h2 className="text-3xl font-extrabold text-white tracking-tight mb-2">Welcome back</h2>
                        <p className="text-slate-400 text-sm">Sign in to your account to continue.</p>
                    </div>

                    <form className="flex flex-col gap-5" onSubmit={handleSubmit(onSubmit)}>
                        {loginFields.map((field) => (
                            <Input
                                key={field.name}
                                {...register(field.name)}
                                label={field.label}
                                type={field.type}
                                placeholder={field.placeholder}
                                error={errors[field.name]}
                                icon={field.icon}
                                rightSlot={field.rightSlot}
                            />
                        ))}

                        <Button type="submit" className="mt-2">Sign In</Button>
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

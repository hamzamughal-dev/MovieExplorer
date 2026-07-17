import loginPoster from '../assets/images/login-poster.jpg'
import { useState } from 'react'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { Navigate } from 'react-router-dom'
import useStore from '../store/store'

function Login() {

    const [userName, setUserName] = useState("");
    const [password, setPassword] = useState("");
    const trueUserName = "mughal__1234";
    const truePassword = "12345678";
    const isLoggedIn = useStore(state => state.isLoggedIn);
    const setIsLoggedIn = useStore(state => state.setIsLoggedIn);

    const Login = (e) => {
        e.preventDefault();
        if (userName === trueUserName && password === truePassword) {
            setIsLoggedIn();
            toast.success("Login successful!", { theme: "dark" });
        } else {
            toast.error("Invalid credentials", { theme: "dark" });
            setUserName("");
            setPassword("");
        }
    }

    if (isLoggedIn) {
        return <Navigate to="/dashboard" replace />;
    }

    return (
        <div className="h-full w-full flex justify-center items-center bg-cover bg-center bg-no-repeat p-5" style={{ backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.7)), url(${loginPoster})` }}>
            <div className="w-full max-w-[400px] bg-black/40 backdrop-blur-xl border border-white/10 p-8 rounded-[18px] shadow-[0_20px_40px_rgba(0,0,0,0.5)] text-center transition-all duration-300
    hover:-translate-y-1
    hover:shadow-lg">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-clapperboard-icon lucide-clapperboard w-[52px] h-[52px] p-2 text-[#00d8ff] bg-[#081a32] rounded-full cursor-pointer block mx-auto mb-4 shadow-[0_8px_18px_rgba(0,0,0,0.35)]"><path d="m12.296 3.464 3.02 3.956" /><path d="M20.2 6 3 11l-.9-2.4c-.3-1.1.3-2.2 1.3-2.5l13.5-4c1.1-.3 2.2.3 2.5 1.3z" /><path d="M3 11h18v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><path d="m6.18 5.276 3.1 3.899" /></svg>
                <h2 className="text-[28px] font-bold text-white mb-1">Welcome Back</h2>
                <p className="text-[14px] text-white mb-6">Login to continue exploring movies.</p>
                <form className="flex flex-col gap-4 " onSubmit={Login}>
                    <div className="relative">
                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                                <circle cx="12" cy="7" r="4" />
                            </svg>
                        </span>
                        <input value={userName} onChange={(e) => setUserName(e.target.value)} type="text" placeholder="Username" required className="w-full text-white pl-10 pr-4 py-3 border-2 border-[#e5e7eb]/20 bg-transparent rounded-[10px] text-base outline-none transition-all duration-300 focus:border-[#01b4e4] focus:shadow-[0_0_0_4px_rgba(1,180,228,0.15)] placeholder-slate-400" />
                    </div>
                    <div className="relative">
                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                            </svg>
                        </span>
                        <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="Password" required className="w-full text-white pl-10 pr-4 py-3 border-2 border-[#e5e7eb]/20 bg-transparent rounded-[10px] text-base outline-none transition-all duration-300 focus:border-[#01b4e4] focus:shadow-[0_0_0_4px_rgba(1,180,228,0.15)] placeholder-slate-400" />
                    </div>
                    <button type="submit" onClick={Login} className="w-full py-3 rounded-[10px] bg-gradient-to-r from-[#01b4e4] to-[#90cea1] text-slate-900 text-base font-semibold cursor-pointer transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_12px_24px_rgba(1,180,228,0.4)] hover:brightness-110 active:translate-y-0">Login</button>
                </form>
            </div>
            <ToastContainer position="top-right" autoClose={3000} theme="dark" />
        </div>
    )
}

export default Login

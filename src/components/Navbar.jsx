import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import Logo from './Logo'
import useStore from '../store/authStore'
import { LOGIN_USERNAME } from '../utils/constants'

function Navbar() {
    const navigate = useNavigate()
    const location = useLocation()
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const [isDropdownOpen, setIsDropdownOpen] = useState(false)
    const isLoggedIn = useStore(state => state.isLoggedIn)
    const setIsLoggedIn = useStore(state => state.setIsLoggedIn)

    const handleLogout = () => {
        localStorage.removeItem("session_id")
        setIsLoggedIn(false)
        navigate('/login')
    }

    const navLinks = [
        { name: 'Movies', path: '/movies' },
        { name: 'Favourites', path: '/favourite' }
    ]

    const isActive = (path) => location.pathname === path

    return (
        <nav className="sticky top-0 bg-[#242934] border-b border-white/5 px-6 md:px-[40px] py-2.5 z-50">
            <div className="relative flex items-center justify-between max-w-7xl mx-auto">


                <Link to={isLoggedIn ? "/movies" : "/login"} className="flex items-center gap-2.5 flex-shrink-0 group">
                    <Logo className="w-[42px] h-[42px] cursor-pointer transition-transform duration-300 group-hover:scale-105" />
                    <span className="text-lg md:text-xl font-bold bg-gradient-to-r from-[#01b4e4] to-[#90cea1] bg-clip-text text-transparent tracking-wide select-none">
                        Movie Explorer
                    </span>
                </Link>


                {isLoggedIn && (
                    <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 items-center gap-6">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                to={link.path}
                                className={`relative text-base font-semibold transition-all duration-300 py-1.5 px-1 ${isActive(link.path)
                                    ? 'text-[#01b4e4]'
                                    : 'text-slate-400 hover:text-white'
                                    }`}
                            >
                                {link.name}
                                {isActive(link.path) && (
                                    <span className="absolute bottom-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[#01b4e4] to-[#90cea1] rounded-full shadow-[0_0_8px_#01b4e4]" />
                                )}
                            </Link>
                        ))}
                    </div>
                )}


                <div className="flex items-center gap-3 flex-shrink-0">
                    {isLoggedIn ? (
                        <>

                            <div className="relative hidden md:block">
                                <button
                                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                    className="flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-[#181a20]/60 border border-white/10 hover:border-[#01b4e4]/50 hover:bg-[#181a20]/80 transition cursor-pointer select-none"
                                >
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#01b4e4] to-[#90cea1] flex items-center justify-center text-slate-900 font-bold text-sm uppercase">
                                        {LOGIN_USERNAME ? LOGIN_USERNAME.charAt(0) : 'U'}
                                    </div>
                                    <span className="text-sm font-semibold text-slate-200">
                                        {LOGIN_USERNAME}
                                    </span>
                                    <svg className={`w-4 h-4 text-slate-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                </button>

                                {isDropdownOpen && (
                                    <>
                                        <div
                                            className="fixed inset-0 z-10"
                                            onClick={() => setIsDropdownOpen(false)}
                                        />
                                        <div className="absolute right-0 mt-2 w-48 bg-[#181a20] border border-white/10 rounded-[12px] shadow-2xl py-1.5 z-20">
                                            <button
                                                onClick={() => {
                                                    setIsDropdownOpen(false);
                                                    handleLogout();
                                                }}
                                                className="w-full text-left px-4 py-2.5 text-sm text-red-400 hover:bg-white/5 hover:text-red-300 font-semibold transition cursor-pointer rounded-[8px]"
                                            >
                                                Logout
                                            </button>
                                        </div>
                                    </>
                                )}
                            </div>


                            <button
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                className="md:hidden p-2 text-slate-300 hover:text-white focus:outline-none transition-colors cursor-pointer"
                                aria-label="Toggle navigation menu"
                            >
                                <div className="w-6 h-5 flex flex-col justify-between items-end relative overflow-hidden">
                                    <span className={`w-6 h-[2px] bg-white rounded-full transition-transform duration-300 ${isMobileMenuOpen ? 'rotate-45 translate-y-[9px]' : ''}`} />
                                    <span className={`w-5 h-[2px] bg-white rounded-full transition-opacity duration-300 ${isMobileMenuOpen ? 'opacity-0' : 'opacity-100'}`} />
                                    <span className={`w-6 h-[2px] bg-white rounded-full transition-transform duration-300 ${isMobileMenuOpen ? '-rotate-45 -translate-y-[9px]' : ''}`} />
                                </div>
                            </button>
                        </>
                    ) : (

                        <button className="bg-gradient-to-r from-[#01b4e4] to-[#90cea1] text-slate-900 rounded-[50px] px-5 py-2 text-sm cursor-pointer transition-all duration-300 hover:scale-105 hover:-translate-y-0.5 hover:shadow-[0_6px_16px_rgba(1,180,228,0.4)] active:translate-y-0 font-semibold">
                            Signup
                        </button>
                    )}
                </div>
            </div>


            {isLoggedIn && isMobileMenuOpen && (
                <div className="md:hidden absolute top-full left-0 w-full bg-[#242934] border-b border-white/10 shadow-2xl p-6 flex flex-col gap-4 z-40">
                    <div className="flex items-center gap-3 pb-3 border-b border-white/5">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-r from-[#01b4e4] to-[#90cea1] flex items-center justify-center text-slate-900 font-bold text-sm uppercase">
                            {LOGIN_USERNAME ? LOGIN_USERNAME.charAt(0) : 'U'}
                        </div>
                        <div className="flex flex-col">
                            <span className="text-sm font-semibold text-white">{LOGIN_USERNAME}</span>
                            <span className="text-xs text-slate-400">Logged In</span>
                        </div>
                    </div>
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            to={link.path}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className={`text-base font-semibold py-1 transition-colors ${isActive(link.path) ? 'text-[#01b4e4]' : 'text-slate-300 hover:text-white'
                                }`}
                        >
                            {link.name}
                        </Link>
                    ))}
                    <button
                        onClick={() => {
                            setIsMobileMenuOpen(false);
                            handleLogout();
                        }}
                        className="bg-gradient-to-r from-[#01b4e4] to-[#90cea1] rounded-[50px] py-2.5 w-full text-center cursor-pointer transition-all duration-300 font-semibold text-slate-900 mt-2"
                    >
                        Logout
                    </button>
                </div>
            )}
        </nav>
    )
}

export default Navbar

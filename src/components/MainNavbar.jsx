import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import tmdbLogo from '../assets/icons/tmdb-icon.svg'
import useStore from '../store/store'

function MainNavbar() {
    const navigate = useNavigate()
    const location = useLocation()
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const setIsLoggedIn = useStore(state => state.setIsLoggedIn);

    const handleLogout = () => {
        localStorage.removeItem("session_id")
        setIsLoggedIn(false)
        navigate('/login')
    }

    const navLinks = [
        { name: 'Dashboard', path: '/dashboard' },
        { name: 'Favourites', path: '/favourite' }
    ]

    const isActive = (path) => location.pathname === path

    return (
        <nav className="sticky top-0 bg-neutral-900 border-b border-white/5 px-6 md:px-[60px] py-2.5 z-50">
            <div className="relative flex items-center justify-between max-w-7xl mx-auto">

                <Link to="/dashboard" className="flex items-center gap-2 flex-shrink-0">
                    <img src={tmdbLogo} className="w-[42px] h-[42px] cursor-pointer" alt="TMDB logo" />
                </Link>

                <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 items-center gap-6">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            to={link.path}
                            className={`text-base font-semibold transition-all duration-300 ${isActive(link.path)
                                ? 'text-[#01b4e4]'
                                : 'text-slate-400 hover:text-white'
                                }`}
                        >
                            {link.name}
                        </Link>
                    ))}
                </div>

                <div className="flex items-center gap-3 flex-shrink-0">
                    <button
                        onClick={handleLogout}
                        className="hidden md:block bg-gradient-to-r from-[#01b4e4] to-[#90cea1] rounded-[50px] px-5 py-2.5 cursor-pointer transition-all duration-300 hover:scale-110 hover:-translate-y-0.5 hover:shadow-[0_4px_8px_rgba(1,180,228,0.35)] hover:brightness-110 active:translate-y-0 font-semibold text-slate-900"
                    >
                        Logout
                    </button>

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
                </div>
            </div>

            {isMobileMenuOpen && (
                <div className="md:hidden absolute top-full left-0 w-full bg-neutral-900 border-b border-white/10 shadow-2xl p-6 flex flex-col gap-4 z-40">
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

export default MainNavbar

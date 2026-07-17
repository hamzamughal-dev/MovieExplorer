import React from 'react'
import { Link } from 'react-router-dom'
import tmdbLogo from '../assets/icons/tmdb-icon.svg'

function AuthNavbar() {
  return (
    <nav className="sticky top-0 bg-neutral-900 border-b border-white/5 px-6 md:px-[60px] py-2.5 z-50">
      <div className="flex justify-between items-center max-w-7xl mx-auto">
        <Link to="/login" className="flex items-center gap-2 group">
          <img src={tmdbLogo} className="w-[42px] h-[42px] transition-transform duration-300 group-hover:scale-105" alt="TMDB logo" />
          <span className="text-lg font-bold tracking-wider text-white select-none">
            Movie<span className="bg-gradient-to-r from-[#01b4e4] to-[#90cea1] bg-clip-text text-transparent">Explorer</span>
          </span>
        </Link>
        <div className="flex items-center gap-5">
          <button className="bg-gradient-to-r from-[#01b4e4] to-[#90cea1] rounded-[50px] px-5 py-2 text-sm cursor-pointer transition-all duration-300 hover:scale-105 hover:-translate-y-0.5 hover:shadow-[0_4px_8px_rgba(1,180,228,0.35)] active:translate-y-0 font-semibold text-slate-900">
            Signup
          </button>
        </div>
      </div>
    </nav>
  )
}

export default AuthNavbar

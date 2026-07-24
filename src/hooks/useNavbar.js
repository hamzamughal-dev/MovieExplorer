import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import useStore from '../store/authStore';
import { LOGIN_USERNAME } from '../utils/constants';

export function useNavbar() {
    const navigate = useNavigate();
    const location = useLocation();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const sessionID = useStore(state => state.sessionID);
    const isLoggedIn = !!sessionID;
    const setAccountID = useStore(state => state.setAccountID);
    const setSessionID = useStore(state => state.setSessionID);

    const handleLogout = () => {
        setAccountID(0);
        setSessionID("");
        localStorage.removeItem("auth-storage");
        navigate('/login');
    };

    const navLinks = [
        { name: 'Movies', path: '/movies' },
        { name: 'Favourites', path: '/favourite' }
    ];

    const isActive = (path) => location.pathname === path;

    return {
        isLoggedIn,
        isMobileMenuOpen,
        setIsMobileMenuOpen,
        isDropdownOpen,
        setIsDropdownOpen,
        handleLogout,
        navLinks,
        isActive,
        LOGIN_USERNAME
    };
}

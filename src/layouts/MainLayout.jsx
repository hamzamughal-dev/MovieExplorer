import { Outlet, useLocation } from "react-router-dom"
import Navbar from "../components/Navbar"
function MainLayout() {
    const location = useLocation();
    const isAuthPage = location.pathname === '/login' || location.pathname === '/signup';

    return (
        <div className="flex flex-col h-screen bg-[#202731]">
            {!isAuthPage && <Navbar />}
            <main className="flex-1 overflow-y-auto">
                <Outlet />
            </main>
        </div>
    )
}

export default MainLayout

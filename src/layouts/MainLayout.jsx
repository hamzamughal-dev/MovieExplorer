import React from "react"
import { Outlet } from "react-router-dom"
import MainNavbar from "../components/MainNavbar"
import useStore from "../store/store"
function MainLayout() {
    const isLoggedIn = useStore(state => state.isLoggedIn);
    return (
        <div className="flex flex-col h-screen bg-[#0A0A0C]">
            {isLoggedIn && <MainNavbar />}
            <main className="flex-1 overflow-y-auto">
                <Outlet />
            </main>
        </div>
    )
}

export default MainLayout

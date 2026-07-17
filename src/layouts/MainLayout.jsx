import React from "react"
import { Outlet } from "react-router-dom"
import MainNavbar from "../components/MainNavbar"

function MainLayout() {
    return (
        <div className="flex flex-col h-screen bg-[#0A0A0C]">
            <MainNavbar />
            <main className="flex-1 overflow-y-auto">
                <Outlet />
            </main>
        </div>
    )
}

export default MainLayout

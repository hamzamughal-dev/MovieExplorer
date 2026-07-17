import React from "react"
import { Outlet } from "react-router-dom"
import AuthNavbar from "../components/AuthNavbar"

function AuthLayout() {
    return (
        <div className="flex flex-col h-screen overflow-hidden bg-[#0A0A0C]">
            <AuthNavbar />
            <main className="flex-1 overflow-hidden">
                <Outlet />
            </main>
        </div>
    )
}

export default AuthLayout

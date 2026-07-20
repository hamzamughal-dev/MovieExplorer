import { Routes, Route, Navigate } from 'react-router-dom'
import MainLayout from '../layouts/MainLayout'
import AuthLayout from '../layouts/AuthLayout'
import Login from '../pages/Login'
import Dashboard from '../pages/Dashboard'
import Detail from '../pages/Detail'
import Favourite from '../pages/Favourite'

function AppRoutes() {
    return (
        <Routes>

            <Route element={<AuthLayout/>}>
                <Route path="/" element={<Navigate to="/login" replace />} />
                <Route path="/login" element={<Login />} />
            </Route>
            <Route element={<MainLayout />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/detail/:id" element={<Detail />} />
                <Route path="/favourite" element={<Favourite />} />
            </Route>
        </Routes>
    )
}

export default AppRoutes

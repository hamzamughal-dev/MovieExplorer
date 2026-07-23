import { Routes, Route, Navigate } from 'react-router-dom'

import MainLayout from '../layouts/MainLayout'
import Login from '../pages/Login'
import Signup from '../pages/Signup'
import Movies from '../pages/Movies'
import Detail from '../pages/Detail'
import Favourite from '../pages/Favourite'

function AppRoutes() {
    return (
        <Routes>
            <Route element={<MainLayout />}>
                <Route path="/" element={<Navigate to="/login" replace />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/movies" element={<Movies />} />
                <Route path="/detail/:id" element={<Detail />} />
                <Route path="/favourite" element={<Favourite />} />
            </Route>
        </Routes>
    )
}

export default AppRoutes

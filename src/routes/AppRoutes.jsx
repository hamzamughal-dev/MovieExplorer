import { Routes, Route, Navigate } from 'react-router-dom'

import MainLayout from '../layouts/MainLayout'
import Login from '../pages/Login'
import Signup from '../pages/Signup'
import Home from '../pages/Home'
import Movies from '../pages/Movies'
import TvShows from '../pages/TvShows'
import Detail from '../pages/Detail'
import Favourite from '../pages/Favourite'

function AppRoutes() {
    return (
        <Routes>
            <Route element={<MainLayout />}>
                <Route path="/" element={<Navigate to="/login" replace />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/home" element={<Home />} />
                <Route path="/movies" element={<Movies />} />
                <Route path="/tv" element={<TvShows />} />
                <Route path="/detail/:id" element={<Detail />} />
                <Route path="/favourite" element={<Favourite />} />
            </Route>
        </Routes>
    )
}

export default AppRoutes

import React from 'react'
import useStore from '../store/store'
import { Navigate } from 'react-router-dom'

function Favourite() {
  const isLoggedIn = useStore(state=>state.isLoggedIn);
    if (!isLoggedIn) {
        return <Navigate to="/login" replace />;
    }
  return (
    <div className="text-[25px] text-center text-[#333] flex justify-center">Favourite</div>
  )
}

export default Favourite

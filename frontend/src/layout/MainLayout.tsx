import React from 'react'
import SideBar from '../components/SideBar'
import { Outlet } from 'react-router-dom'

const MainLayout = () => {
  return (
    <div className="flex">
      <SideBar />
      <div className="p-5 flex-1">
        <Outlet />
      </div>
    </div>
  )
}

export default MainLayout

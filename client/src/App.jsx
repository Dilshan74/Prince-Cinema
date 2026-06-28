import React from 'react'
import { Route, Routes, useLocation, Navigate } from 'react-router-dom'
import Navbar from './components/Navbar'
import AdminLayout from './components/admin/AdminLayout'
import Home from './pages/Home'
import Movies from './pages/Movies'
import Favourite from './pages/Favourite'
import Login from './pages/Login'
import MovieDetails from './pages/MovieDetails'
import MyBookings from './pages/MyBookings'
import SeatLayout from './pages/SeatLayout'
import Signup from './pages/Signup'
import AddShows from './pages/Admin.jsx/AddShows'
import Dashboard from './pages/Admin.jsx/Dashboard'
import ListBookings from './pages/Admin.jsx/ListBookings'
import ListShows from './pages/Admin.jsx/ListShows'
import { Toaster } from 'react-hot-toast'
import { useAppContext } from './context/AppContext'

const App = () => {
  const location = useLocation()
  const isAdminRoute = location.pathname.startsWith('/admin')
  const { user } = useAppContext()

  return (
    <>
      <Toaster position="top-right" />
      {!isAdminRoute && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/movies" element={<Movies />} />
        <Route path="/theaters" element={<SeatLayout />} />
        <Route path="/favorites" element={<Favourite />} />
        <Route path="/favorite" element={<Favourite />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/movie/:id" element={<MovieDetails />} />
        <Route path="/my-bookings" element={<MyBookings />} />
        <Route path="/seat-layout" element={<SeatLayout />} />
        <Route
          path="/admin"
          element={
            user ? (
              <AdminLayout />
            ) : (
              <Navigate to="/login?redirect=/admin" replace />
            )
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="add-shows" element={<AddShows />} />
          <Route path="list-shows" element={<ListShows />} />
          <Route path="list-bookings" element={<ListBookings />} />
        </Route>
      </Routes>
    </>
  )
}

export default App

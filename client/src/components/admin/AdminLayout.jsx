import React from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import { Film, LayoutDashboard, ListVideo, Ticket, UserRound } from 'lucide-react'
import { assets } from '../../assets/assets'

const navigationItems = [
  {
    label: 'Dashboard',
    to: '/admin',
    end: true,
    icon: LayoutDashboard,
  },
  {
    label: 'Add Shows',
    to: '/admin/add-shows',
    icon: Film,
  },
  {
    label: 'List Shows',
    to: '/admin/list-shows',
    icon: ListVideo,
  },
  {
    label: 'List Bookings',
    to: '/admin/list-bookings',
    icon: Ticket,
  },
]

const AdminFooter = () => {
  return (
    <footer className="border-t border-white/8 px-6 py-6 text-sm text-white/40 sm:px-8 lg:px-10">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <img src={assets.logo} alt="Prince Cinema" className="h-8 w-auto" />
          <p className="mt-2 max-w-sm leading-6 text-white/35">
            Prince Cinema admin panel for managing schedules, shows, and booking activity.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <p className="text-white/70">Support</p>
            <p className="mt-1">+94 11 123 4567</p>
          </div>
          <div>
            <p className="text-white/70">Email</p>
            <p className="mt-1">support@princecinema.lk</p>
          </div>
          <div>
            <p className="text-white/70">Office</p>
            <p className="mt-1">Colombo, Sri Lanka</p>
          </div>
        </div>
      </div>

      <p className="mt-6 border-t border-white/8 pt-4 text-center text-xs text-white/30">
        Copyright 2026 Prince Cinema. All rights reserved.
      </p>
    </footer>
  )
}

const AdminLayout = () => {
  return (
    <div className="min-h-screen bg-[#05060a] text-white">
      <div className="flex min-h-screen flex-col lg:flex-row">
        <aside className="border-b border-white/8 bg-black/30 px-5 py-5 lg:min-h-screen lg:w-72 lg:border-b-0 lg:border-r">
          <div className="flex items-center justify-between gap-4 lg:block">
            <div>
              <img src={assets.logo} alt="Prince Cinema" className="h-9 w-auto" />
              <p className="mt-3 text-xs font-medium text-white/35">Admin Panel</p>
            </div>

            <div className="hidden items-center gap-3 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 sm:flex lg:hidden">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#ff4b6a]/10">
                <UserRound className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">Admin</p>
                <p className="text-xs text-white/45">Operations</p>
              </div>
            </div>
          </div>

          <div className="mt-6 hidden rounded-lg border border-white/10 bg-white/[0.03] p-4 lg:block">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#ff4b6a]/10">
                <UserRound className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">Admin</p>
                <p className="text-xs text-white/45">Prince Cinema Staff</p>
              </div>
            </div>
          </div>

          <nav className="mt-6 grid gap-2">
            {navigationItems.map(({ label, to, icon: Icon, end }) => (
              <NavLink
                key={label}
                to={to}
                end={end}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-lg border px-4 py-3 text-sm font-medium transition ${
                    isActive
                      ? 'border-[#ff4b6a]/35 bg-[#ff4b6a]/10 text-white'
                      : 'border-transparent bg-white/[0.02] text-white/70 hover:border-white/10 hover:bg-white/[0.04]'
                  }`
                }
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-md bg-black/30">
                  <Icon className="h-4 w-4" />
                </span>
                <span>{label}</span>
              </NavLink>
            ))}
          </nav>

          <div className="mt-8 rounded-lg border border-[#ff4b6a]/18 bg-[#ff4b6a]/10 p-4">
            <p className="text-sm font-semibold text-white">Today</p>
            <p className="mt-2 text-sm text-white/55">Manage shows and bookings from the menu.</p>
          </div>
        </aside>

        <main className="flex min-w-0 flex-1 flex-col">
          <div className="px-6 py-6 sm:px-8 lg:px-10">
            <div className="rounded-xl border border-white/8 bg-black/28 p-4 sm:p-6">
              <Outlet />
            </div>
          </div>

          <AdminFooter />
        </main>
      </div>
    </div>
  )
}

export default AdminLayout

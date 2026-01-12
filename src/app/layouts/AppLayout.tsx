import React from 'react'
import { Outlet, NavLink, Link, useLocation } from 'react-router-dom'
import { LayoutDashboard, Users, Map, UserCircle, LogOut, Settings, Bell } from 'lucide-react'
import { RecentTripsList } from '../../features/trips/RecentTripsList'
import { cn } from '../../lib/utils'
import { useAuthStore } from '../../store/authStore'

export const AppLayout = () => {
  const { signOut } = useAuthStore()

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 flex-col border-r border-slate-200 bg-slate-50/50">
        <div className="flex h-16 items-center border-b border-slate-200 px-6">
          <Link to="/" className="flex items-center gap-2 font-bold text-xl tracking-tight text-primary">
            <div className="h-8 w-8 rounded-lg bg-primary hidden items-center justify-center">
               <Map className="h-5 w-5 text-white" />
            </div>
            SAFAR
          </Link>
        </div>
        <div className="flex-1 overflow-y-auto py-6 flex flex-col gap-6 no-scrollbar">
          <nav className="grid items-start px-4 text-sm font-medium gap-2">
            <SidebarItem to="/dashboard" icon={LayoutDashboard} label="Dashboard" />
            <SidebarItem to="/drivers" icon={Users} label="Drivers" />
            <SidebarItem to="/trips" icon={Map} label="Trips" />
            <SidebarItem to="/profile" icon={UserCircle} label="Profile" />
          </nav>

          {/* Recent Activity in Sidebar */}
          <div className="px-4 mt-auto">
             <div className="border-t border-slate-200/60 pb-4 mx-2"></div>
             <div className="mb-3 flex items-center justify-between px-2">
                <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Recent Activity</h3>
                <Link to="/trips" className="text-[10px] font-medium text-blue-600 hover:text-blue-700 hover:underline">
                   View All
                </Link>
             </div>
             <div className="space-y-1">
                <RecentTripsList limit={3} compact />
             </div>
          </div>
        </div>
        <div className="border-t border-slate-200 p-4">
           <button 
             onClick={() => signOut()}
             className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition-all hover:text-red-600 hover:bg-red-50"
           >
             <LogOut className="h-4 w-4" />
             Sign Out
           </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex flex-col flex-1 bg-slate-50/30">
        {/* Mobile Header */}
        <header className="md:hidden sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="flex h-14 items-center justify-between px-4">
            <span className="text-lg font-bold tracking-tight text-primary">SAFAR</span>
            <button className="h-8 w-8 rounded-full bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors">
                <Bell className="h-5 w-5 text-muted-foreground" />
            </button>
            </div>
        </header>

        {/* Desktop Header (Breadcrumbs/Profile) */}
        <header className="hidden md:flex h-16 items-center justify-between border-b border-slate-200 px-8 bg-white/80 backdrop-blur">
           <h1 className="text-xl font-semibold text-slate-900 tracking-tight">Overview</h1>
           <div className="flex items-center gap-4">
              <Link 
                to="/drivers" 
                className="hidden md:inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground shadow hover:bg-primary/90 h-9 px-4 py-2"
              >
                + Add Driver
              </Link>
           </div>
        </header>

        <main className="flex-1 overflow-y-auto"> 
            <div className="mx-auto max-w-7xl px-4 md:px-8 py-8 space-y-8">
            <Outlet />
            </div>
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 border-t bg-background h-16 px-6 pb-2 safe-area-bottom">
        <div className="flex h-full items-center justify-between mx-auto max-w-md">
          <NavItem to="/dashboard" icon={LayoutDashboard} label="Home" />
          <NavItem to="/drivers" icon={Users} label="Drivers" />
          <NavItem to="/trips" icon={Map} label="Trips" />
          <NavItem to="/profile" icon={UserCircle} label="Profile" />
        </div>
      </nav>
    </div>
  )
}

const NavItem = ({ to, icon: Icon, label }: { to: string; icon: React.ElementType; label: string }) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        cn(
          "flex flex-col items-center justify-center w-full h-full space-y-1 text-muted-foreground transition-colors hover:text-primary",
          isActive && "text-primary"
        )
      }
    >
      <Icon className="h-5 w-5" />
      <span className="text-[10px] font-medium">{label}</span>
    </NavLink>
  )
}

const SidebarItem = ({ to, icon: Icon, label }: { to: string; icon: React.ElementType; label: string }) => {
  return (
     <NavLink
        to={to}
        className={({ isActive }) =>
           cn(
             "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary hover:bg-primary/5",
             isActive && "bg-primary/10 text-primary font-semibold"
           )
        }
     >
        <Icon className="h-4 w-4" />
        {label}
     </NavLink>
  )
}

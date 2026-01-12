import React from 'react'
import { Link } from 'react-router-dom'
import { ActiveTripCard } from './ActiveTripCard'
import { RecentTripsList } from '../trips/RecentTripsList'
import { DashboardStats } from './DashboardStats'
import { ArrowRight } from 'lucide-react'

export const DashboardPage = () => {
  return (
    <div className="h-[calc(100vh-9rem)] flex flex-col">
      {/* Stats Row */}
      <DashboardStats />

      {/* Main Grid content */}
      <div className="flex-1 min-h-0">
        {/* Quick Actions (Start Trip) - Full Width */}
        <div className="h-full">
           <ActiveTripCard />
        </div>

        {/* Recent Activity - Mobile Only */}
        <div className="md:hidden mt-8">
           <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-slate-900">Recent Activity</h3>
              <Link to="/trips" className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1">
                View All <ArrowRight className="h-3 w-3" />
              </Link>
           </div>
           <RecentTripsList limit={5} />
        </div>
      </div>
    </div>
  )
}

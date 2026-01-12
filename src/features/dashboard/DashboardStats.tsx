import React from 'react'
import { Card, CardContent } from '../../components/ui/Card'
import { Car, Users, Activity, TrendingUp } from 'lucide-react'
import { useTripStore } from '../../store/tripStore'
import { useDriverStore } from '../../store/driverStore'

export const DashboardStats = () => {
  const { trips } = useTripStore()
  const { drivers } = useDriverStore()

  // Derived stats
  const activeTrips = trips.length // In real app, filter by status
  const totalDrivers = drivers.length
  
  const stats = [
    {
      label: "Total Drivers",
      value: totalDrivers,
      icon: Users,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
      trend: "+2 this week"
    },
    {
      label: "Active Trips",
      value: activeTrips,
      icon: Car,
      color: "text-green-500",
      bg: "bg-green-500/10",
      trend: "Now active"
    },
    {
      label: "Efficiency",
      value: "94%",
      icon: Activity,
      color: "text-purple-500",
      bg: "bg-purple-500/10",
      trend: "+4.5%"
    },
    {
      label: "Total Distance",
      value: "1,204 km",
      icon: TrendingUp,
      color: "text-orange-500",
      bg: "bg-orange-500/10",
      trend: "Last 7 days"
    }
  ]

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {stats.map((stat, i) => (
        <Card key={i} className="border-slate-100 shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">{stat.label}</p>
              <h3 className="text-2xl font-bold text-slate-900 mt-1">{stat.value}</h3>
              <p className="text-xs text-slate-400 mt-1">{stat.trend}</p>
            </div>
            <div className={`h-12 w-12 rounded-xl ${stat.bg} flex items-center justify-center`}>
              <stat.icon className={`h-6 w-6 ${stat.color}`} />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

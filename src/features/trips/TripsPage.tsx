import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader } from '../../components/ui/Card'
import { Map } from 'lucide-react'



import { useTripStore } from '../../store/tripStore'

export const TripsPage = () => {
  const { trips, loading, fetchTrips } = useTripStore()

  useEffect(() => {
    fetchTrips()
  }, [fetchTrips])

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold tracking-tight">Trip History</h1>
      {loading ? (
        <div className="text-center py-10 text-muted-foreground">Loading trips...</div>
      ) : trips.length === 0 ? (
         <div className="text-center py-12 bg-white rounded-lg border border-dashed border-slate-300">
           <Map className="mx-auto h-12 w-12 text-slate-400 mb-3" />
           <h3 className="text-lg font-medium text-slate-900">No trips yet</h3>
           <p className="text-slate-500 mt-1">Start a new journey from the dashboard to see it here.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trips.map((trip) => (
             <Card key={trip.id} className="overflow-hidden flex flex-col justify-between hover:shadow-md transition-shadow">
                <CardHeader className="pb-3 bg-slate-50/50 border-b border-slate-100">
                   <div className="flex items-center justify-between">
                      <span className="text-xs font-medium px-2 py-1 rounded-full bg-blue-100 text-blue-700 uppercase tracking-wide">
                        Scheduled
                      </span>
                      <span className="text-xs text-slate-500 font-mono">
                        {new Date(trip.created_at).toLocaleDateString()}
                      </span>
                   </div>
                </CardHeader>
                <CardContent className="pt-4 space-y-4">
                   <div className="flex items-start gap-3">
                      <div className="mt-1 flex flex-col items-center gap-1">
                         <div className="h-2 w-2 rounded-full bg-blue-500 ring-2 ring-blue-100" />
                         <div className="h-8 w-0.5 bg-slate-200" />
                         <div className="h-2 w-2 rounded-full bg-slate-300" />
                      </div>
                      <div className="space-y-4 flex-1">
                         <div>
                            <p className="text-xs text-slate-500 uppercase font-semibold">From</p>
                            <p className="font-medium text-slate-900 line-clamp-1">{trip.from_location}</p>
                         </div>
                         <div>
                            <p className="text-xs text-slate-500 uppercase font-semibold">To</p>
                            <p className="font-medium text-slate-900 line-clamp-1">{trip.to_location}</p>
                         </div>
                      </div>
                   </div>
                   
                   {trip.driver && (
                     <div className="flex items-center gap-2 pt-3 border-t border-slate-100">
                        <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                           {trip.driver.name.charAt(0)}
                        </div>
                        <span className="text-sm text-slate-600 truncate">{trip.driver.name}</span>
                     </div>
                   )}
                </CardContent>
             </Card>
          ))}
        </div>
      )}
    </div>
  )
}

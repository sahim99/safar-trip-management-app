import React, { useEffect } from 'react'
import { useTripStore } from '../../store/tripStore'
import { Card, CardContent } from '../../components/ui/Card'
import { MapPin, Calendar, User, Trash2 } from 'lucide-react'
import { Button } from '../../components/ui/Button'

export const RecentTripsList = ({ limit, compact = false }: { limit?: number, compact?: boolean }) => {
  const { trips, fetchTrips, deleteTrip } = useTripStore()

  useEffect(() => {
    fetchTrips()
  }, [fetchTrips])

  const displayTrips = limit ? trips.slice(0, limit) : trips

  if (trips.length === 0) {
    return <div className="text-center text-muted-foreground text-xs py-2">No recent trips.</div>
  }

  return (
    <div className={compact ? "space-y-2" : "space-y-3"}>
       {displayTrips.map(trip => (
         <Card key={trip.id} className={`overflow-hidden border-0 shadow-none bg-slate-50/50 hover:bg-slate-100 transition-colors ${compact ? 'bg-transparent hover:bg-slate-100/50' : ''}`}>
           <CardContent className={compact ? "p-2 relative" : "p-3 relative"}>
             <div className="flex items-start justify-between mb-1">
               <div className="flex items-center gap-1 text-[10px] font-medium text-slate-500">
                 <Calendar className="h-3 w-3" />
                 {new Date(trip.trip_date).toLocaleDateString()}
               </div>
               {!compact && (
                <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-6 w-6 text-muted-foreground hover:text-destructive absolute top-2 right-2"
                    onClick={() => deleteTrip(trip.id)}
                >
                    <Trash2 className="h-3 w-3" />
                </Button>
               )}
             </div>
             
             <div className={`flex flex-col gap-0.5 ${compact ? 'mb-1' : 'mb-3'}`}>
               <div className="flex items-center gap-2">
                 <div className="h-1.5 w-1.5 bg-blue-500 rounded-full" />
                 <span className={`font-medium ${compact ? 'text-xs truncate max-w-[140px]' : ''}`}>{trip.from_location}</span>
               </div>
               <div className="ml-[2.5px] border-l border-dashed h-2 border-slate-300" />
               <div className="flex items-center gap-2">
                 <div className="h-1.5 w-1.5 bg-red-500 rounded-full" />
                 <span className={`font-medium ${compact ? 'text-xs truncate max-w-[140px]' : ''}`}>{trip.to_location}</span>
               </div>
             </div>

             {!compact && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/50 p-2 rounded-lg">
                    <User className="h-3 w-3" />
                    <span>Driver: <span className="text-foreground font-medium">{trip.driver?.name || 'Unknown'}</span></span>
                </div>
             )}
           </CardContent>
         </Card>
       ))}
    </div>
  )
}

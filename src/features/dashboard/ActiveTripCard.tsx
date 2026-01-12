import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { useDriverStore } from '../../store/driverStore'
import { useTripStore } from '../../store/tripStore'
import { Car, Calendar, Clock, MapPin, Sparkles } from 'lucide-react'
import { TripContactModal } from '../trips/TripContactModal'

export const ActiveTripCard = () => {
  const navigate = useNavigate()
  const { drivers, fetchDrivers } = useDriverStore()
  const { createTrip } = useTripStore()
  
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [time, setTime] = useState(new Date().toTimeString().split(' ')[0].slice(0, 5))
  const [loading, setLoading] = useState(false)
  
  // Modal State
  const [showContactModal, setShowContactModal] = useState(false)
  const [currentTrip, setCurrentTrip] = useState<{
    from_location: string
    to_location: string
    trip_date: string
    trip_time: string
  } | null>(null)

  useEffect(() => {
    if (drivers.length === 0) fetchDrivers()
  }, [fetchDrivers, drivers.length])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    setLoading(true)
    await createTrip({
      from_location: from,
      to_location: to,
      trip_date: date,
      trip_time: time,
      // @ts-ignore - driver_id is now optional
      driver_id: null 
    })
    setLoading(false)
    
    // Set trip details and open modal flow
    setCurrentTrip({
      from_location: from,
      to_location: to,
      trip_date: date,
      trip_time: time
    })
    setShowContactModal(true)
  }

  const handleModalClose = () => {
    setShowContactModal(false)
    setFrom('')
    setTo('')
  }

  return (
    <>
        <div className="relative group h-full">
             <Card className="relative w-full h-full max-w-none border border-slate-200 bg-white text-slate-900 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
                <div className="flex flex-col md:flex-row h-full">
                    {/* Left Side: Form */}
                    <div className="flex-1 p-6 md:p-8 flex flex-col justify-center">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="h-10 w-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0">
                                <Sparkles className="h-5 w-5 text-blue-600" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-slate-900">New Journey</h3>
                                <p className="text-sm text-slate-500">Schedule your next trip</p>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider ml-1">Origin</label>
                                    <div className="relative group/input">
                                        <MapPin className="absolute left-3 top-3 h-5 w-5 text-slate-400 group-focus-within/input:text-blue-600 transition-colors" />
                                        <Input 
                                        placeholder="From Location" 
                                        className="pl-10 h-12 bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-blue-500 focus:ring-blue-500/20 transition-all rounded-xl" 
                                        value={from}
                                        onChange={(e) => setFrom(e.target.value)}
                                        required
                                        />
                                    </div>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider ml-1">Destination</label>
                                    <div className="relative group/input">
                                        <MapPin className="absolute left-3 top-3 h-5 w-5 text-slate-400 group-focus-within/input:text-blue-600 transition-colors" />
                                        <Input 
                                        placeholder="To Destination" 
                                        className="pl-10 h-12 bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-blue-500 focus:ring-blue-500/20 transition-all rounded-xl" 
                                        value={to}
                                        onChange={(e) => setTo(e.target.value)}
                                        required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider ml-1">Date</label>
                                    <div className="relative group/input">
                                        <Calendar className="absolute left-3 top-3 h-5 w-5 text-slate-400 group-focus-within/input:text-blue-600 transition-colors" />
                                        <Input 
                                            type="date" 
                                            className="pl-10 h-12 bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-blue-500 focus:ring-blue-500/20 transition-all rounded-xl cursor-pointer"
                                            value={date}
                                            onChange={(e) => setDate(e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider ml-1">Time</label>
                                    <div className="relative group/input">
                                        <Clock className="absolute left-3 top-3 h-5 w-5 text-slate-400 group-focus-within/input:text-blue-600 transition-colors" />
                                        <Input 
                                            type="time" 
                                            className="pl-10 h-12 bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-blue-500 focus:ring-blue-500/20 transition-all rounded-xl cursor-pointer"
                                            value={time}
                                            onChange={(e) => setTime(e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            <Button type="submit" className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-lg shadow-blue-500/20 rounded-xl transition-all hover:scale-[1.01] active:scale-[0.99] mt-2 text-base" isLoading={loading}>
                                Start Trip
                            </Button>
                        </form>
                    </div>

                    {/* Right Side: Visual Map Context */}
                    <div className="hidden md:flex w-5/12 bg-slate-50 border-l border-slate-100 relative items-center justify-center overflow-hidden">
                        <div className="absolute inset-0 opacity-[0.6]" 
                             style={{backgroundImage: 'radial-gradient(#cbd5e1 1.5px, transparent 1.5px)', backgroundSize: '24px 24px'}}>
                        </div>
                        
                        {/* Abstract Route Graphic */}
                        <div className="relative w-full max-w-[320px] aspect-sqaure p-8 scale-110">
                             {/* Path Line */}
                             <svg className="absolute top-0 left-0 w-full h-full z-0 overflow-visible">
                                <path d="M 60 80 Q 140 40 220 120" fill="none" stroke="#2563EB" strokeWidth="3" strokeDasharray="6 6" className="animate-pulse" />
                             </svg>

                             {/* Point A */}
                             <div className="absolute top-[60px] left-[40px] z-10 flex flex-col items-center gap-2">
                                 <div className="h-4 w-4 rounded-full bg-blue-100 border-4 border-blue-600 shadow-sm animate-bounce"></div>
                                 <div className="bg-white px-2 py-1 rounded-md text-[10px] font-bold shadow-sm border border-slate-100 text-slate-600 whitespace-nowrap">
                                    {from || 'Origin'}
                                 </div>
                             </div>

                             {/* Point B */}
                             <div className="absolute top-[100px] right-[40px] z-10 flex flex-col items-center gap-2">
                                 <div className="h-4 w-4 rounded-full bg-red-100 border-4 border-red-500 shadow-sm"></div>
                                 <div className="bg-white px-2 py-1 rounded-md text-[10px] font-bold shadow-sm border border-slate-100 text-slate-600 whitespace-nowrap">
                                    {to || 'Destination'}
                                 </div>
                             </div>
                             
                             {/* Car Icon Moving (Simulated) */}
                             <div className="absolute top-[50px] left-[130px] bg-white p-2 rounded-full shadow-md border border-slate-100 z-20">
                                <Car className="h-5 w-5 text-blue-600" />
                             </div>
                        </div>
                    </div>
                </div>
            </Card>
        </div>

        <TripContactModal 
            isOpen={showContactModal} 
            onClose={handleModalClose}
            tripDetails={currentTrip}
        />
    </>
  )
}

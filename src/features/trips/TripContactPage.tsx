import React, { useEffect, useState, useRef } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useDriverStore } from '../../store/driverStore'
import { Card, CardContent } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { Phone, MessageCircle, MapPin, Search, ArrowLeft, Send, Check } from 'lucide-react'
import { Input } from '../../components/ui/Input'

export const TripContactPage = () => {
  const { state } = useLocation()
  const navigate = useNavigate()
  const { drivers, fetchDrivers } = useDriverStore()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedDrivers, setSelectedDrivers] = useState<Set<string>>(new Set())
  const hasInitialized = useRef(false)
  
  // Broadcast State
  const [broadcastQueue, setBroadcastQueue] = useState<string[]>([])
  const [currentBroadcastIndex, setCurrentBroadcastIndex] = useState(0)
  const [isBroadcasting, setIsBroadcasting] = useState(false)

  // Trip details passed from the previous page
  const tripDetails = state?.trip || null
  
  useEffect(() => {
    fetchDrivers()
  }, [])
  
  useEffect(() => {
    if (drivers.length > 0 && !hasInitialized.current) {
        setSelectedDrivers(new Set(drivers.map(d => d.id)))
        hasInitialized.current = true
    }
  }, [drivers])
  
  const filteredDrivers = drivers.filter(d => 
    d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.phone.includes(searchQuery)
  )

  const toggleDriver = (id: string) => {
    const newSelected = new Set(selectedDrivers)
    if (newSelected.has(id)) {
      newSelected.delete(id)
    } else {
      newSelected.add(id)
    }
    setSelectedDrivers(newSelected)
  }

  const toggleSelectAll = () => {
    if (selectedDrivers.size === filteredDrivers.length) {
      setSelectedDrivers(new Set())
    } else {
      setSelectedDrivers(new Set(filteredDrivers.map(d => d.id)))
    }
  }

  const handleCall = (phone: string) => {
    window.location.href = `tel:${phone}`
  }

  const getWhatsAppLink = (phone: string) => {
    let text = `Hello, I have a new trip.`
    
    if (tripDetails) {
      const { from_location, to_location, trip_date, trip_time } = tripDetails
      text = `*New Trip Assignment Request* 🚗\n\n` +
             `📍 *From:* ${from_location}\n` +
             `🏁 *To:* ${to_location}\n` +
             `📅 *Date:* ${trip_date}\n` +
             `⏰ *Time:* ${trip_time}\n\n` +
             `Are you available for this trip?`
    }
    
    const encodedText = encodeURIComponent(text)
    return `https://wa.me/${phone}?text=${encodedText}`
  }

  const handleWhatsApp = (phone: string) => {
    window.open(getWhatsAppLink(phone), '_blank')
  }

  const startBroadcast = () => {
    if (selectedDrivers.size === 0) return alert('Please select at least one driver.')
    
    const queue = Array.from(selectedDrivers)
    setBroadcastQueue(queue)
    setCurrentBroadcastIndex(0)
    setIsBroadcasting(true)
  }

  const sendToNext = () => {
    // Send to current
    const driverId = broadcastQueue[currentBroadcastIndex]
    const driver = drivers.find(d => d.id === driverId)
    
    if (driver) {
       handleWhatsApp(driver.whatsapp || driver.phone)
    }

    // Move to next
    if (currentBroadcastIndex < broadcastQueue.length - 1) {
        setCurrentBroadcastIndex(prev => prev + 1)
    } else {
        setIsBroadcasting(false) // Done
        // Maybe show success toast?
    }
  }

  const skipCurrent = () => {
    if (currentBroadcastIndex < broadcastQueue.length - 1) {
        setCurrentBroadcastIndex(prev => prev + 1)
    } else {
        setIsBroadcasting(false)
    }
  }

  // Current driver for modal
  const currentDriver = isBroadcasting 
    ? drivers.find(d => d.id === broadcastQueue[currentBroadcastIndex]) 
    : null

  return (
    <div className="space-y-8 max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20 md:pb-8 relative px-4 sm:px-6 py-6 font-sans">
      
      {/* Broadcast Modal Overlay */}
      {isBroadcasting && currentDriver && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in zoom-in-95 duration-200">
             <Card className="w-full max-w-md shadow-2xl border-0 ring-1 ring-white/10 overflow-hidden bg-white/95 backdrop-blur">
                <div className="h-1.5 bg-green-500 w-full" />
                <CardContent className="p-8 space-y-8">
                    <div className="text-center space-y-3">
                        <div className="mx-auto h-16 w-16 rounded-full bg-green-50 flex items-center justify-center text-green-600 mb-4 shadow-sm ring-1 ring-green-100">
                            <MessageCircle className="h-8 w-8" />
                        </div>
                        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Sending Broadcast</h2>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-sm font-medium text-slate-600">
                            <span>Driver {currentBroadcastIndex + 1}</span>
                            <span className="text-slate-300">/</span>
                            <span>{broadcastQueue.length}</span>
                        </div>
                    </div>

                    <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 flex items-center gap-5 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-1 h-full bg-blue-500 rounded-l-2xl"/>
                        <div className="h-14 w-14 rounded-full bg-white border-2 border-white shadow-md flex items-center justify-center text-slate-700 font-bold text-xl">
                            {currentDriver.name.charAt(0)}
                        </div>
                        <div className="space-y-0.5">
                            <h3 className="font-bold text-lg text-slate-900">{currentDriver.name}</h3>
                            <div className="flex items-center gap-1.5 text-slate-500">
                                <Phone className="h-3.5 w-3.5" />
                                <span className="text-sm font-medium tabular-nums">{currentDriver.phone}</span>
                            </div>
                        </div>
                    </div>

                    <div className="grid gap-3 pt-2">
                        <Button 
                            onClick={sendToNext} 
                            size="lg" 
                            className="w-full h-12 text-base bg-green-600 hover:bg-green-700 text-white gap-2 shadow-lg shadow-green-200 transition-all hover:scale-[1.02] active:scale-[0.98]"
                        >
                            <Send className="h-5 w-5" /> Send WhatsApp & Next
                        </Button>
                        <Button onClick={skipCurrent} variant="outline" className="w-full h-11 border-slate-200">
                            Skip this driver
                        </Button>
                        <Button 
                            onClick={() => setIsBroadcasting(false)} 
                            variant="ghost" 
                            className="w-full text-slate-400 hover:text-slate-600 hover:bg-transparent"
                        >
                            Cancel Broadcast
                        </Button>
                    </div>
                </CardContent>
             </Card>
        </div>
      )}

      {/* Header Area */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3 group">
            <Button 
                variant="ghost" 
                className="h-10 w-10 p-0 rounded-full border border-slate-200 text-slate-500 hover:text-slate-900 hover:border-slate-300 hover:bg-white transition-all shadow-sm" 
                onClick={() => navigate('/dashboard')}
            >
               <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
               <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Contact Drivers</h1>
               <p className="text-slate-500 text-sm">Select drivers to broadcast the trip request</p>
            </div>
          </div>
          
          {/* Main Action for Desktop */}
          {filteredDrivers.length > 0 && (
             <Button 
                onClick={startBroadcast} 
                disabled={selectedDrivers.size === 0}
                className="hidden md:flex bg-slate-900 hover:bg-slate-800 text-white gap-2 px-6 h-11 shadow-lg shadow-slate-200 transition-all hover:-translate-y-0.5"
             >
                <div className="relative">
                    <Send className="h-4 w-4" />
                    {selectedDrivers.size > 0 && (
                        <span className="absolute -top-2 -right-2 h-2.5 w-2.5 bg-green-500 rounded-full border border-slate-900"/>
                    )}
                </div>
                <span>Broadcast ({selectedDrivers.size})</span>
             </Button>
          )}
      </div>

      <div className="grid lg:grid-cols-[1.5fr,2.5fr] gap-8 items-start">
          
          {/* Left Column: Trip Details */}
          <div className="space-y-6 lg:sticky lg:top-24">
              {tripDetails ? (
                <Card className="bg-white border-blue-100 shadow-xl shadow-blue-500/5 ring-1 ring-blue-50 overflow-hidden">
                   <div className="h-1.5 w-full bg-gradient-to-r from-blue-500 via-indigo-500 to-blue-500 bg-[length:200%_auto] animate-gradient" />
                   <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-6">
                          <h3 className="font-bold text-slate-900 flex items-center gap-2">
                             <MapPin className="h-4 w-4 text-blue-500" /> Trip Details
                          </h3>
                          <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-wider">
                              New Request
                          </span>
                      </div>
                      
                      <div className="space-y-6 relative">
                         {/* Connecting Line */}
                         <div className="absolute left-[7px] top-3 bottom-12 w-0.5 bg-slate-100" />
                         
                         <div className="relative pl-6">
                            <div className="absolute left-0 top-1.5 h-3.5 w-3.5 rounded-full border-2 border-slate-300 bg-white z-10" />
                            <label className="text-xs font-medium text-slate-400 uppercase tracking-wide">From</label>
                            <p className="text-base font-semibold text-slate-900 mt-0.5">{tripDetails.from_location}</p>
                         </div>
                         
                         <div className="relative pl-6">
                            <div className="absolute left-0 top-1.5 h-3.5 w-3.5 rounded-full border-2 border-slate-900 bg-slate-900 z-10 shadow-sm" />
                            <label className="text-xs font-medium text-slate-400 uppercase tracking-wide">To</label>
                            <p className="text-base font-semibold text-slate-900 mt-0.5">{tripDetails.to_location}</p>
                         </div>

                         <div className="pt-4 mt-6 border-t border-slate-100 grid grid-cols-2 gap-4">
                             <div>
                                <label className="text-xs font-medium text-slate-400">Date</label>
                                <p className="font-medium text-slate-700">{tripDetails.trip_date}</p>
                             </div>
                             <div>
                                <label className="text-xs font-medium text-slate-400">Time</label>
                                <p className="font-medium text-slate-700">{tripDetails.trip_time}</p>
                             </div>
                         </div>
                      </div>
                   </CardContent>
                </Card>
              ) : (
                <div className="p-6 rounded-xl border-2 border-dashed border-slate-200 text-center text-slate-400">
                    No trip details available
                </div>
              )}
              
              {/* Mobile Broadcast Button Sticky */}
              <div className="md:hidden sticky top-20 z-10 w-full">
                 <Button 
                    onClick={startBroadcast} 
                    disabled={selectedDrivers.size === 0}
                    className="w-full bg-slate-900 text-white h-12 shadow-xl shadow-slate-900/10"
                 >
                    <Send className="h-4 w-4 mr-2" />
                    Broadcast to {selectedDrivers.size} Drivers
                 </Button>
              </div>
          </div>

          {/* Right Column: Drivers List */}
          <div className="space-y-4">
              {/* Controls */}
              <div className="flex items-center gap-3 bg-white p-2 rounded-xl border border-slate-200 shadow-sm sticky top-0 z-20 md:static">
                  <div className="relative flex-1">
                     <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                     <input 
                       placeholder="Search drivers..." 
                       className="w-full h-10 pl-10 pr-4 bg-transparent text-sm outline-none placeholder:text-slate-400"
                       value={searchQuery}
                       onChange={(e) => setSearchQuery(e.target.value)}
                     />
                  </div>
                  <div className="w-px h-6 bg-slate-200" />
                  <Button 
                    variant="ghost" 
                    onClick={toggleSelectAll} 
                    className="text-slate-600 hover:text-slate-900 hover:bg-slate-50 text-sm font-medium px-4"
                  >
                     {selectedDrivers.size === filteredDrivers.length && filteredDrivers.length > 0 ? 'Deselect All' : 'Select All'}
                  </Button>
              </div>

              {/* Grid */}
              <div className="grid sm:grid-cols-2 gap-3">
                {filteredDrivers.map((driver) => {
                  const isSelected = selectedDrivers.has(driver.id)
                  return (
                  <div 
                    key={driver.id} 
                    onClick={() => toggleDriver(driver.id)}
                    className={`
                        group relative p-4 rounded-xl border-2 transition-all duration-200 cursor-pointer overflow-hidden
                        ${isSelected 
                            ? 'bg-blue-50/50 border-blue-500 shadow-md shadow-blue-500/10' 
                            : 'bg-white border-slate-100 hover:border-slate-200 hover:shadow-lg hover:shadow-slate-200/50'
                        }
                    `}
                  >
                    {/* Selection Checkmark */}
                    <div className={`
                        absolute top-3 right-3 h-6 w-6 rounded-full border-2 flex items-center justify-center transition-all duration-200
                        ${isSelected
                            ? 'bg-blue-500 border-blue-500 scale-100'
                            : 'bg-transparent border-slate-200 scale-90 opacity-0 group-hover:opacity-100 group-hover:scale-100'
                        }
                    `}>
                        <Check className="h-3.5 w-3.5 text-white" strokeWidth={3} />
                    </div>

                    <div className="flex items-start gap-4">
                       <div className={`
                           h-12 w-12 rounded-full flex items-center justify-center text-lg font-bold border-2 transition-colors
                           ${isSelected ? 'bg-white border-blue-200 text-blue-600' : 'bg-slate-50 border-slate-100 text-slate-500'}
                       `}>
                          {driver.name.charAt(0)}
                       </div>
                       
                       <div className="flex-1 min-w-0 pt-0.5">
                          <h3 className={`font-semibold text-base truncate ${isSelected ? 'text-blue-900' : 'text-slate-900'}`}>{driver.name}</h3>
                          <div className="flex items-center gap-1.5 text-slate-500 mt-1">
                             <Phone className="h-3 w-3" />
                             <span className="text-xs font-medium tabular-nums">{driver.phone}</span>
                          </div>
                       </div>
                    </div>
                    
                    {/* Quick Actions */}
                    <div className="grid grid-cols-2 gap-2 mt-5" onClick={(e) => e.stopPropagation()}>
                       <Button 
                         variant="outline" 
                         size="sm"
                         className="h-9 w-full gap-2 border-slate-200 hover:bg-slate-50 text-slate-600 hover:text-slate-900 font-medium"
                         onClick={() => handleCall(driver.phone)}
                       >
                          <Phone className="h-3.5 w-3.5" /> Call
                       </Button>
                       <Button 
                         size="sm"
                         className="h-9 w-full gap-2 bg-green-500 hover:bg-green-600 text-white border-0 shadow-sm font-medium"
                         onClick={() => handleWhatsApp(driver.whatsapp || driver.phone)}
                       >
                          <MessageCircle className="h-3.5 w-3.5" /> WhatsApp
                       </Button>
                    </div>
                  </div>
                )})}
                
                {filteredDrivers.length === 0 && (
                    <div className="col-span-full py-16 text-center">
                        <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-slate-50 mb-3">
                            <Search className="h-6 w-6 text-slate-300" />
                        </div>
                        <p className="text-slate-500 font-medium">No drivers found</p>
                        <p className="text-slate-400 text-sm">Try adjusting your search</p>
                    </div>
                )}
              </div>
          </div>
      </div>
    </div>
  )
}

import React, { useEffect, useState, useRef } from 'react'
import { useDriverStore } from '../../store/driverStore'
import { Card, CardContent } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { Phone, MessageCircle, MapPin, Search, Send, Check, X } from 'lucide-react'
import { Input } from '../../components/ui/Input'

interface TripContactModalProps {
  isOpen: boolean
  onClose: () => void
  tripDetails: {
    from_location: string
    to_location: string
    trip_date: string
    trip_time: string
  } | null
}

export const TripContactModal = ({ isOpen, onClose, tripDetails }: TripContactModalProps) => {
  const { drivers, fetchDrivers } = useDriverStore()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedDrivers, setSelectedDrivers] = useState<Set<string>>(new Set())
  const hasInitialized = useRef(false)
  
  // Broadcast State
  const [broadcastQueue, setBroadcastQueue] = useState<string[]>([])
  const [currentBroadcastIndex, setCurrentBroadcastIndex] = useState(0)
  const [isBroadcasting, setIsBroadcasting] = useState(false)

  useEffect(() => {
    if (isOpen) {
        fetchDrivers()
    }
  }, [isOpen])
  
  useEffect(() => {
    if (isOpen && drivers.length > 0 && !hasInitialized.current) {
        setSelectedDrivers(new Set(drivers.map(d => d.id)))
        hasInitialized.current = true
    }
    if (!isOpen) {
        hasInitialized.current = false
    }
  }, [drivers, isOpen])
  
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
      text = `🆕 *New Trip Request*\n\n` +
             `📍 *From:* ${from_location}\n` +
             `📍 *To:* ${to_location}\n\n` +
             `📅 *Date:* ${trip_date}\n` +
             `🕒 *Time:* ${trip_time}\n\n` +
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
    
    // Send to first driver immediately
    const firstDriverId = queue[0]
    const firstDriver = drivers.find(d => d.id === firstDriverId)
    if (firstDriver) {
       handleWhatsApp(firstDriver.whatsapp || firstDriver.phone)
    }

    // If more drivers, setup wizard for the rest starting from index 1
    if (queue.length > 1) {
        setBroadcastQueue(queue)
        setCurrentBroadcastIndex(1)
        setIsBroadcasting(true)
    }
  }

  const sendToNext = () => {
    const driverId = broadcastQueue[currentBroadcastIndex]
    const driver = drivers.find(d => d.id === driverId)
    
    if (driver) {
       handleWhatsApp(driver.whatsapp || driver.phone)
    }

    if (currentBroadcastIndex < broadcastQueue.length - 1) {
        setCurrentBroadcastIndex(prev => prev + 1)
    } else {
        setIsBroadcasting(false)
        onClose() // Close main modal after broadcast is done? Or stay open? Let's stay open for now or close.
        // Usually better to stay open or show success. Let's just finish the broadcast loop.
    }
  }

  const skipCurrent = () => {
    if (currentBroadcastIndex < broadcastQueue.length - 1) {
        setCurrentBroadcastIndex(prev => prev + 1)
    } else {
        setIsBroadcasting(false)
    }
  }

  const currentDriver = isBroadcasting 
    ? drivers.find(d => d.id === broadcastQueue[currentBroadcastIndex]) 
    : null

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-5xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200 border border-slate-200 max-h-[90vh]">
        
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between shrink-0 bg-white z-10">
            <div>
               <h2 className="text-xl font-bold text-slate-900 tracking-tight">Contact Drivers</h2>
               <p className="text-sm text-slate-500">Broadcast your new trip request</p>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600">
                <X className="h-5 w-5" />
            </Button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-hidden flex flex-col md:flex-row relative">
            
            {/* Inner Broadcast Modal Overlay */}
            {isBroadcasting && currentDriver && (
                <div className="absolute inset-0 z-50 flex items-center justify-center bg-white/90 backdrop-blur-md">
                    <Card className="w-full max-w-sm shadow-2xl border-0 ring-1 ring-slate-200 bg-white m-4">
                        <div className="h-1.5 bg-green-500 w-full rounded-t-xl" />
                        <CardContent className="p-6 space-y-6">
                            <div className="text-center">
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-xs font-semibold text-slate-600 mb-3">
                                    Sending {currentBroadcastIndex + 1} of {broadcastQueue.length}
                                </span>
                                <h2 className="text-xl font-bold text-slate-900">Broadcast in Progress</h2>
                            </div>

                            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex items-center gap-4">
                                <div className="h-12 w-12 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-700 font-bold text-lg shadow-sm">
                                    {currentDriver.name.charAt(0)}
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-900">{currentDriver.name}</h3>
                                    <div className="flex items-center gap-1.5 text-slate-500 text-sm">
                                        <Phone className="h-3.5 w-3.5" /> {currentDriver.phone}
                                    </div>
                                </div>
                            </div>

                            <div className="grid gap-2.5">
                                <Button 
                                    onClick={sendToNext} 
                                    size="lg" 
                                    className="w-full bg-green-600 hover:bg-green-700 text-white gap-2 shadow-lg shadow-green-200"
                                >
                                    <Send className="h-4 w-4" /> Send WhatsApp
                                </Button>
                                <div className="grid grid-cols-2 gap-2.5">
                                    <Button onClick={skipCurrent} variant="outline" className="w-full text-xs">
                                        Skip Driver
                                    </Button>
                                    <Button onClick={() => setIsBroadcasting(false)} variant="ghost" className="w-full text-xs text-red-500 hover:text-red-600 hover:bg-red-50">
                                        Cancel
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* Left Column: Trip Summary (Compact) */}
            <div className="md:w-[320px] shrink-0 bg-slate-50 border-r border-slate-200 p-5 flex flex-col gap-4 overflow-y-auto">
                {tripDetails && (
                    <Card className="bg-white border-blue-100 shadow-sm overflow-hidden">
                        <div className="h-1 w-full bg-gradient-to-r from-blue-500 to-indigo-500" />
                        <CardContent className="p-4 space-y-4">
                            <div className="flex items-center gap-2 text-sm font-bold text-blue-900">
                                <MapPin className="h-4 w-4 text-blue-500" /> Trip Details
                            </div>
                            
                            <div className="relative pl-3 border-l-2 border-slate-100 space-y-4 ml-1">
                                <div className="relative">
                                    <div className="absolute -left-[17px] top-1 h-2.5 w-2.5 rounded-full border-2 border-slate-300 bg-white" />
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-0.5">From</label>
                                    <p className="text-sm font-semibold text-slate-900 leading-tight">{tripDetails.from_location}</p>
                                </div>
                                <div className="relative">
                                    <div className="absolute -left-[17px] top-1 h-2.5 w-2.5 rounded-full border-2 border-slate-900 bg-slate-900" />
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-0.5">To</label>
                                    <p className="text-sm font-semibold text-slate-900 leading-tight">{tripDetails.to_location}</p>
                                </div>
                            </div>

                            <div className="pt-3 border-t border-slate-50 grid grid-cols-2 gap-2">
                                <div className="bg-slate-50 p-2 rounded-md">
                                    <span className="block text-[10px] text-slate-400 font-bold uppercase">Date</span>
                                    <span className="text-xs font-semibold text-slate-700">{tripDetails.trip_date}</span>
                                </div>
                                <div className="bg-slate-50 p-2 rounded-md">
                                    <span className="block text-[10px] text-slate-400 font-bold uppercase">Time</span>
                                    <span className="text-xs font-semibold text-slate-700">{tripDetails.trip_time}</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Broadcast Status / CTA */}
                <div className="mt-auto pt-4 md:sticky md:bottom-0">
                    <Button 
                        onClick={startBroadcast} 
                        disabled={selectedDrivers.size === 0}
                        className="w-full bg-slate-900 hover:bg-slate-800 text-white gap-2 shadow-xl"
                        size="lg"
                    >
                        <div className="relative">
                            <Send className="h-4 w-4" />
                            {selectedDrivers.size > 0 && (
                                <span className="absolute -top-1.5 -right-1.5 h-2.5 w-2.5 bg-green-500 rounded-full border border-slate-900"/>
                            )}
                        </div>
                        <span className="font-semibold">Broadcast ({selectedDrivers.size})</span>
                    </Button>
                </div>
            </div>

            {/* Right Column: Drivers List */}
            <div className="flex-1 flex flex-col h-full overflow-hidden bg-white">
                {/* Search & Actions Header */}
                <div className="p-4 border-b border-slate-100 flex items-center gap-3 bg-white/50 backdrop-blur-sm z-10 sticky top-0">
                    <div className="relative flex-1 group">
                        <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                        <input 
                            placeholder="Search drivers..." 
                            className="w-full h-9 pl-9 pr-4 bg-slate-50 hover:bg-slate-100 focus:bg-white border-0 rounded-lg text-sm outline-none ring-1 ring-slate-100 focus:ring-2 focus:ring-blue-100 transition-all font-medium placeholder:text-slate-400"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={toggleSelectAll} 
                        className="text-slate-500 hover:text-slate-900 hover:bg-slate-50 font-medium px-3 h-9"
                    >
                        {selectedDrivers.size === filteredDrivers.length && filteredDrivers.length > 0 ? 'None' : 'All'}
                    </Button>
                </div>

                {/* Scrollable Grid */}
                <div className="flex-1 overflow-y-auto p-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-3">
                        {filteredDrivers.map((driver) => {
                        const isSelected = selectedDrivers.has(driver.id)
                        return (
                        <div 
                            key={driver.id} 
                            onClick={() => toggleDriver(driver.id)}
                            className={`
                                group relative p-3 rounded-xl border-2 transition-all duration-200 cursor-pointer select-none
                                ${isSelected 
                                    ? 'bg-blue-50/40 border-blue-500 shadow-sm' 
                                    : 'bg-white border-slate-100 hover:border-slate-200 hover:shadow-md'
                                }
                            `}
                        >
                            {/* Selection Checkmark */}
                            <div className={`
                                absolute top-3 right-3 h-5 w-5 rounded-full border-2 flex items-center justify-center transition-all duration-200 z-10
                                ${isSelected
                                    ? 'bg-blue-500 border-blue-500 scale-100'
                                    : 'bg-transparent border-slate-200 scale-100 group-hover:border-slate-300'
                                }
                            `}>
                                {isSelected && <Check className="h-3 w-3 text-white" strokeWidth={3} />}
                            </div>

                            <div className="flex items-center gap-3 mb-3">
                                <div className={`
                                    h-10 w-10 shrink-0 rounded-full flex items-center justify-center text-sm font-bold border transition-colors
                                    ${isSelected ? 'bg-white border-blue-200 text-blue-600' : 'bg-slate-50 border-slate-100 text-slate-500'}
                                `}>
                                    {driver.name.charAt(0)}
                                </div>
                                <div className="min-w-0 pr-6">
                                    <h3 className={`font-semibold text-sm truncate ${isSelected ? 'text-blue-900' : 'text-slate-900'}`}>
                                        {driver.name}
                                    </h3>
                                    <div className="flex items-center gap-1 text-slate-500 text-xs mt-0.5">
                                        <Phone className="h-3 w-3" />
                                        <span className="tabular-nums">{driver.phone}</span>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Quick Actions (Prevent Propagation) */}
                            <div className="grid grid-cols-2 gap-2" onClick={(e) => e.stopPropagation()}>
                                <button 
                                    className="flex items-center justify-center gap-1.5 h-8 rounded-lg bg-white border border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50 text-xs font-medium transition-colors"
                                    onClick={() => handleCall(driver.phone)}
                                >
                                    <Phone className="h-3 w-3" /> Call
                                </button>
                                <button 
                                    className="flex items-center justify-center gap-1.5 h-8 rounded-lg bg-green-50 border border-green-100 text-green-700 hover:bg-green-100 hover:border-green-200 text-xs font-medium transition-colors"
                                    onClick={() => handleWhatsApp(driver.whatsapp || driver.phone)}
                                >
                                    <MessageCircle className="h-3 w-3" /> WhatsApp
                                </button>
                            </div>
                        </div>
                        )})}
                        
                        {filteredDrivers.length === 0 && (
                            <div className="col-span-full py-12 text-center text-slate-400">
                                <p>No drivers found</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

        </div>
      </div>
    </div>
  )
}

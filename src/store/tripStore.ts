import { create } from 'zustand'
import { supabase } from '../lib/supabase'
import { toast } from 'sonner'

export interface Trip {
  id: string
  from_location: string
  to_location: string
  trip_date: string
  trip_time: string
  driver_id?: string | null
  driver?: { name: string } // Joined data
  created_at: string
}

interface TripState {
  trips: Trip[]
  recentTrips: Trip[]
  loading: boolean
  error: string | null
  fetchTrips: () => Promise<void>
  createTrip: (trip: Omit<Trip, 'id' | 'created_at' | 'driver'>) => Promise<void>
  deleteTrip: (id: string) => Promise<void>
}

export const useTripStore = create<TripState>((set) => ({
  trips: [],
  recentTrips: [],
  loading: false,
  error: null,

  fetchTrips: async () => {
    set({ loading: true, error: null })
    const { data, error } = await supabase
      .from('trips')
      .select('*, driver:drivers(name)')
      .order('trip_date', { ascending: false })
      .order('trip_time', { ascending: false })

    if (error) {
      set({ error: error.message, loading: false })
    } else {
      // @ts-ignore - Supabase types are inferred as array but we know the shape
      const typedData = data as Trip[]
      set({ 
        trips: typedData, 
        recentTrips: typedData.slice(0, 5), // Keep top 5 for recent
        loading: false 
      })
    }
  },

  createTrip: async (newTrip) => {
    set({ loading: true, error: null })

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
        set({ error: 'User not authenticated', loading: false })
        return
    }

    const { data, error } = await supabase
      .from('trips')
      .insert([{ ...newTrip, owner_id: user.id }])
      .select('*, driver:drivers(name)')
      .single()

    if (error) {
      set({ error: error.message, loading: false })
    } else {
      set((state) => {
        const updatedTrips = [data as Trip, ...state.trips]
        // Sort again just in case
        updatedTrips.sort((a, b) => new Date(b.trip_date).getTime() - new Date(a.trip_date).getTime())
        toast.success('Trip created successfully')
        return {
          trips: updatedTrips,
          recentTrips: updatedTrips.slice(0, 5),
          loading: false
        }
      })
    }
  },

  deleteTrip: async (id) => {
    set({ loading: true, error: null })
    const { error } = await supabase
      .from('trips')
      .delete()
      .eq('id', id)

    if (error) {
      set({ error: error.message, loading: false })
    } else {
      set((state) => {
        const updatedTrips = state.trips.filter((t) => t.id !== id)
        return {
          trips: updatedTrips,
          recentTrips: updatedTrips.slice(0, 5),
          loading: false
        }
      })
    }
  },
}))

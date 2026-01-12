import { create } from 'zustand'
import { supabase } from '../lib/supabase'
import { toast } from 'sonner'

export interface Driver {
  id: string
  name: string
  phone: string
  whatsapp?: string
  created_at: string
}

interface DriverState {
  drivers: Driver[]
  loading: boolean
  error: string | null
  fetchDrivers: () => Promise<void>
  addDriver: (driver: { name: string; phone: string; whatsapp?: string }) => Promise<{ error?: any; data?: any }>
  updateDriver: (id: string, updates: { name: string; phone: string; whatsapp?: string }) => Promise<{ error?: any }>
  deleteDriver: (id: string) => Promise<void>
}

export const useDriverStore = create<DriverState>((set, get) => ({
  drivers: [],
  loading: false,
  error: null,

  fetchDrivers: async () => {
    set({ loading: true, error: null })
    const { data, error } = await supabase
      .from('drivers')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      set({ error: error.message, loading: false })
    } else {
      set({ drivers: data || [], loading: false })
    }
  },

  addDriver: async (newDriver) => {
    set({ loading: true, error: null })
    
    // Get current user for owner_id
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
        set({ error: 'User not authenticated', loading: false })
        return { error: 'User not authenticated' }
    }

    const { data, error } = await supabase
      .from('drivers')
      .insert([{ ...newDriver, owner_id: user.id }])
      .select()
      .single()

    if (error) {
      console.error('Error adding driver:', error)
      set({ error: error.message, loading: false })
      return { error }
    } else {
      set((state) => ({ 
        drivers: [data, ...state.drivers], 
        loading: false 
      }))
      toast.success('Driver added successfully')
      return { data }
    }
  },

  updateDriver: async (id, updates) => {
    set({ loading: true, error: null })
    const { error } = await supabase
      .from('drivers')
      .update(updates)
      .eq('id', id)

    if (error) {
      console.error('Error updating driver:', error)
      set({ error: error.message, loading: false })
      return { error }
    } else {
      set((state) => ({
        drivers: state.drivers.map((d) => (d.id === id ? { ...d, ...updates } : d)),
        loading: false,
      }))
      return {}
    }
  },

  deleteDriver: async (id) => {
    set({ loading: true, error: null })
    const { error } = await supabase
      .from('drivers')
      .delete()
      .eq('id', id)

    if (error) {
      set({ error: error.message, loading: false })
    } else {
      set((state) => ({
        drivers: state.drivers.filter((d) => d.id !== id),
        loading: false,
      }))
    }
  },
}))

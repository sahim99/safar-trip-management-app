import React, { useEffect, useState } from 'react'
import { Plus, UserPlus } from 'lucide-react'
import { useDriverStore } from '../../store/driverStore'
import { DriverCard } from './DriverCard'
import { Button } from '../../components/ui/Button'
import { DriverForm } from './DriverForm'

export const DriversPage = () => {
  const { drivers, loading, fetchDrivers } = useDriverStore()
  const [showAddForm, setShowAddForm] = useState(false)

  useEffect(() => {
    fetchDrivers()
  }, [fetchDrivers])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Drivers</h1>
        <Button size="sm" onClick={() => setShowAddForm(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Driver
        </Button>
      </div>

      {loading ? (
        <div className="text-center py-10 text-muted-foreground">Loading drivers...</div>
      ) : drivers.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg border border-dashed border-slate-300">
           <div className="mx-auto h-12 w-12 text-slate-400 mb-3">
             <UserPlus className="h-full w-full" />
           </div>
           <h3 className="text-lg font-medium text-slate-900">No drivers yet</h3>
           <p className="text-slate-500 max-w-sm mx-auto mt-1 mb-4">
             Add your first driver to start assigning trips and managing your fleet.
           </p>
           <Button onClick={() => setShowAddForm(true)}>Add Driver</Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {drivers.map(driver => (
            <DriverCard 
              key={driver.id} 
              driver={driver} 
            />
          ))}
        </div>
      )}

      {showAddForm && (
        <DriverForm onClose={() => setShowAddForm(false)} />
      )}
    </div>
  )
}

import React, { useState } from 'react'
import { Driver, useDriverStore } from '../../store/driverStore'
import { Card, CardContent } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { Phone, MessageCircle, Edit2, Trash2 } from 'lucide-react'
import { DriverForm } from './DriverForm'

interface DriverCardProps {
  driver: Driver
}

export const DriverCard = ({ driver }: DriverCardProps) => {
  const [isEditing, setIsEditing] = useState(false)
  const { deleteDriver } = useDriverStore()

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this driver?')) {
      await deleteDriver(driver.id)
    }
  }

  if (isEditing) {
    return (
      <DriverForm 
        onClose={() => setIsEditing(false)} 
        editId={driver.id} 
        initialData={{ name: driver.name, phone: driver.phone, whatsapp: driver.whatsapp }} 
      />
    )
  }

  // Use whatsapp if available, otherwise fallback to phone
  const whatsappNumber = driver.whatsapp || driver.phone

  return (
    <Card>
      <CardContent className="p-4 flex flex-col gap-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-bold text-lg">{driver.name}</h3>
            <p className="text-sm text-muted-foreground">{driver.phone}</p>
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground" onClick={() => setIsEditing(true)}>
              <Edit2 className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={handleDelete}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          <Button variant="outline" className="w-full" onClick={() => window.location.href = `tel:${driver.phone}`}>
            <Phone className="mr-2 h-4 w-4" />
            Call
          </Button>
          <Button variant="outline" className="w-full" onClick={() => window.open(`https://wa.me/${whatsappNumber}`, '_blank')}>
            <MessageCircle className="mr-2 h-4 w-4 text-green-600" />
            WhatsApp
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

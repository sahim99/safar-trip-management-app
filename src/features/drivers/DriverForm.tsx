import React, { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../components/ui/Dialog'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { useDriverStore } from '../../store/driverStore'
import { X, MessageCircle } from 'lucide-react'

interface DriverFormProps {
  onClose: () => void
  editId?: string 
  initialData?: { name: string; phone: string; whatsapp?: string }
}

export const DriverForm = ({ onClose, editId, initialData }: DriverFormProps) => {
  const [name, setName] = useState(initialData?.name || '')
  const [phone, setPhone] = useState(initialData?.phone || '')
  const [whatsapp, setWhatsapp] = useState(initialData?.whatsapp || '')
  const [loading, setLoading] = useState(false)
  
  const { addDriver, updateDriver } = useDriverStore()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    const waValue = whatsapp || phone 
    
    let result
    if (editId) {
      // @ts-ignore
      result = await updateDriver(editId, { name, phone, whatsapp: waValue })
    } else {
      // @ts-ignore
      result = await addDriver({ name, phone, whatsapp: waValue })
    }
    
    setLoading(false)
    
    if (result && result.error) {
      alert(`Error: ${result.error.message || 'Failed to save driver'}`)
      return
    }
    
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-in fade-in">
      <div className="w-full max-w-sm rounded-xl bg-background p-6 shadow-lg border border-border">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">{editId ? 'Edit Driver' : 'Add New Driver'}</h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            placeholder="Driver Name"
          />
          <Input
            label="Phone"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
            placeholder="+1 234 567 890"
          />
          <div className="relative">
             <Input
              label="WhatsApp (Optional)"
              type="tel"
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
              placeholder="Same as phone if empty"
            />
            <MessageCircle className="absolute right-3 top-9 h-4 w-4 text-green-600 opacity-50" />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
            <Button type="submit" isLoading={loading}>{editId ? 'Save Changes' : 'Add Driver'}</Button>
          </div>
        </form>
      </div>
    </div>
  )
}

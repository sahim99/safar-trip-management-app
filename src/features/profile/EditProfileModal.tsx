import React, { useState } from 'react'
import { supabase } from '../../lib/supabase'
import { toast } from 'sonner'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { X } from 'lucide-react'

interface EditProfileModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  initialData: {
    full_name: string
    phone: string
  }
}

export const EditProfileModal = ({ isOpen, onClose, onSuccess, initialData }: EditProfileModalProps) => {
  const [fullName, setFullName] = useState(initialData.full_name)
  const [phone, setPhone] = useState(initialData.phone)
  const [loading, setLoading] = useState(false)

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('No user found')

      const { error } = await supabase
        .from('owners')
        .update({
          full_name: fullName,
          phone: phone,
        })
        .eq('id', user.id)

      if (error) throw error

      // Also update auth metadata to keep it in sync (optional but good)
      await supabase.auth.updateUser({
        data: { full_name: fullName, phone: phone }
      })

      toast.success('Profile updated successfully')
      onSuccess()
      onClose()
    } catch (error: any) {
      toast.error(error.message || 'Failed to update profile')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-slate-50/50">
          <h2 className="text-lg font-semibold text-slate-900">Edit Profile</h2>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onClose}
            className="h-8 w-8 p-0 rounded-full hover:bg-slate-200/50"
          >
            <X className="h-4 w-4 text-slate-500" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <Input
            label="Full Name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Enter your full name"
            required
          />
          
          <Input
            label="Phone Number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Enter your phone number"
            type="tel"
            required
          />

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" isLoading={loading} className="bg-primary text-primary-foreground shadow-lg shadow-primary/20">
              Save Changes
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

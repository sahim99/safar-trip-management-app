import React from 'react'
import { Button } from '../../components/ui/Button'
import { UserPlus, MessageSquare } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export const QuickActions = () => {
  const navigate = useNavigate()

  return (
    <div className="grid grid-cols-2 gap-4">
      <Button variant="secondary" className="h-auto py-4 flex flex-col gap-2 shadow-sm" onClick={() => navigate('/drivers')}>
        <UserPlus className="h-6 w-6 text-primary" />
        <span>Add Driver</span>
      </Button>
      <Button variant="secondary" className="h-auto py-4 flex flex-col gap-2 shadow-sm" onClick={() => navigate('/drivers')}>
        <MessageSquare className="h-6 w-6 text-green-600" />
        <span>Message</span>
      </Button>
    </div>
  )
}

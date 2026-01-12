import React, { useEffect, useState } from 'react'
import { useAuthStore } from '../../store/authStore'
import { supabase } from '../../lib/supabase'
import { Button } from '../../components/ui/Button'
import { UserCircle, LogOut, Mail, Phone, Shield, CreditCard, Crown, Edit2 } from 'lucide-react'
import { EditProfileModal } from './EditProfileModal'

interface OwnerProfile {
  full_name: string
  phone: string
  role: string
  subscription_plan: string
  subscription_status: string
}

export const ProfilePage = () => {
  const { session, signOut } = useAuthStore()
  const user = session?.user
  
  const [profile, setProfile] = useState<OwnerProfile | null>(null)
  const [loading, setLoading] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)

  useEffect(() => {
    if (user) {
      fetchProfile()
    }
  }, [user])

  const fetchProfile = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('owners')
      .select('*')
      .eq('id', user?.id)
      .single()
    
    if (!error && data) {
      setProfile(data)
    }
    setLoading(false)
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <UserCircle className="h-10 w-10" />
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-semibold text-slate-900">{profile?.full_name || 'My Profile'}</h1>
                <button 
                  onClick={() => setIsEditModalOpen(true)}
                  className="p-1.5 hover:bg-slate-200 rounded-full text-slate-400 hover:text-primary transition-colors"
                  title="Edit Profile"
                >
                  <Edit2 className="h-4 w-4" />
                </button>
              </div>
              <div className="flex items-center gap-2 mt-1">
                 <span className="text-sm text-slate-500">{user?.email}</span>
                 {profile?.role && (
                   <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 capitalize">
                     {profile.role}
                   </span>
                 )}
              </div>
            </div>
          </div>
          <Button 
            variant="outline" 
            className="hidden sm:flex items-center gap-2 text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
            onClick={() => signOut()}
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </Button>
        </div>

        {/* Content Grid */}
        <div className="p-6 grid gap-8 md:grid-cols-2">
            {/* Account Info */}
            <div className="space-y-4">
                <h2 className="text-sm font-semibold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                    <UserCircle className="h-4 w-4" /> Account Details
                </h2>
                
                <div className="space-y-3">
                    <div className="p-3 rounded-lg bg-slate-50 border border-slate-100 space-y-1">
                        <span className="text-xs text-slate-500 font-medium flex items-center gap-2">
                            <UserCircle className="h-3 w-3" /> Full Name
                        </span>
                        <p className="text-sm text-slate-900 font-medium pl-5">{profile?.full_name || 'Not set'}</p>
                    </div>

                    <div className="p-3 rounded-lg bg-slate-50 border border-slate-100 space-y-1">
                        <span className="text-xs text-slate-500 font-medium flex items-center gap-2">
                            <Mail className="h-3 w-3" /> Email Address
                        </span>
                        <p className="text-sm text-slate-900 font-medium pl-5">{user?.email}</p>
                    </div>

                    <div className="p-3 rounded-lg bg-slate-50 border border-slate-100 space-y-1">
                        <span className="text-xs text-slate-500 font-medium flex items-center gap-2">
                            <Phone className="h-3 w-3" /> Phone
                        </span>
                        <p className="text-sm text-slate-900 font-medium pl-5">{profile?.phone || 'Not set'}</p>
                    </div>
                </div>
            </div>

            {/* Subscription Info */}
            <div className="space-y-4">
                <h2 className="text-sm font-semibold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                    <Crown className="h-4 w-4" /> Subscription
                </h2>
                
                <div className="p-4 rounded-xl border border-indigo-100 bg-indigo-50/30 space-y-4">
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-xs text-indigo-600 font-bold uppercase tracking-wide mb-1">Current Plan</p>
                            <h3 className="text-xl font-bold text-slate-900 capitalize">{profile?.subscription_plan || 'Free'} Plan</h3>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${
                            profile?.subscription_status === 'active' 
                                ? 'bg-green-100 text-green-700' 
                                : 'bg-slate-200 text-slate-600'
                        }`}>
                            {profile?.subscription_status || 'Inactive'}
                        </span>
                    </div>
                    
                    <div className="pt-2">
                        <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-200">
                            Upgrade Plan
                        </Button>
                    </div>
                </div>

                <div className="p-3 rounded-lg bg-slate-50 border border-slate-100 space-y-1">
                    <span className="text-xs text-slate-500 font-medium flex items-center gap-2">
                        <Shield className="h-3 w-3" /> Account ID
                    </span>
                    <p className="text-xs font-mono text-slate-600 pl-5 break-all">{user?.id}</p>
                </div>
            </div>
        </div>
        
        {/* Mobile Sign Out */}
        <div className="p-6 border-t border-gray-100 sm:hidden">
            <Button 
            variant="outline" 
            className="w-full flex items-center justify-center gap-2 text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
            onClick={() => signOut()}
            >
            <LogOut className="h-4 w-4" />
            Sign Out
            </Button>
        </div>
      </div>

      <EditProfileModal 
        isOpen={isEditModalOpen} 
        onClose={() => setIsEditModalOpen(false)} 
        onSuccess={fetchProfile}
        initialData={{
          full_name: profile?.full_name || '',
          phone: profile?.phone || ''
        }}
      />
    </div>
  )
}


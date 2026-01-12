import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'sonner'
import { AuthLayout } from './app/layouts/AuthLayout'
import { AppLayout } from './app/layouts/AppLayout'
import { ProtectedRoute } from './app/routes/ProtectedRoute'
import { LoginPage } from './features/auth/LoginPage'
import { SignupPage } from './features/auth/SignupPage'
import { useAuthStore } from './store/authStore'
import { supabase } from './lib/supabase'

import { LandingPage } from './pages/LandingPage'

import { DashboardPage } from './features/dashboard/DashboardPage'
import { DriversPage } from './features/drivers/DriversPage'
import { TripsPage } from './features/trips/TripsPage'
import { ProfilePage } from './features/profile/ProfilePage'

function App() {
  const initializeAuth = useAuthStore((state) => state.initialize)

  useEffect(() => {
    initializeAuth()
    
    // Verify Supabase connection
    const checkConnection = async () => {
      const { data, error } = await supabase.from('drivers').select('*')
      console.log('Supabase test:', data, error)
    }
    checkConnection()

  }, [initializeAuth])
  
  return (
    <BrowserRouter>
      <Toaster position="top-right" richColors />
      <Routes>
        {/* Public Landing Page */}
        <Route path="/" element={<LandingPage />} />

        {/* Auth Routes */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
        </Route>

        {/* Protected App Routes */}
        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/drivers" element={<DriversPage />} />
            <Route path="/trips" element={<TripsPage />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Route>
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App

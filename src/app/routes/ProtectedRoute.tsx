import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'

export const ProtectedRoute = () => {
  const { session, loading } = useAuthStore()
  const location = useLocation()

  if (loading) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>
  }

  if (!session) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return <Outlet />
}

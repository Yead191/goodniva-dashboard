import { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import type { ModuleKey } from '@/types/permissions'

interface ProtectedRouteProps {
  children: ReactNode
  requiredModule?: ModuleKey
}

const ProtectedRoute = ({ children, requiredModule }: ProtectedRouteProps) => {
  const { isAuthenticated, hasPermission } = useAuth()
  const location = useLocation()

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  if (requiredModule && !hasPermission(requiredModule)) {
    return <Navigate to="/dashboard" replace />
  }

  return <>{children}</>
}

export default ProtectedRoute

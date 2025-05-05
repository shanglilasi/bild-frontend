//components/ProtectRoute.tsx

import { Navigate } from 'react-router-dom'
import { useStore } from '../store/StoreContext'
import React from 'react'

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { authStore } = useStore()

  if (authStore.isLoading) {
    return <div className="p-4 text-gray-500">🔄 Sitzung wird geprüft...</div>
  }

  if (!authStore.isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return <>{children}</>
}

export default ProtectedRoute
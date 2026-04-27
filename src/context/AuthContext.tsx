import React, { createContext, useContext, useState, ReactNode } from 'react'
import type { AdminRole, ModuleKey } from '@/types/permissions'
import { ALL_MODULE_KEYS } from '@/types/permissions'

interface AdminUser {
  name: string
  email: string
  avatar: string
  role: AdminRole
  permissions: ModuleKey[]
}

interface AuthContextValue {
  user: AdminUser | null
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  hasPermission: (module: ModuleKey) => boolean
  isSuperAdmin: boolean
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

const DEFAULT_USER: AdminUser = {
  name: 'Super Admin',
  email: 'admin@goodniva.com',
  avatar: 'https://i.pravatar.cc/80?img=60',
  role: 'super_admin',
  permissions: ALL_MODULE_KEYS,
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AdminUser | null>(() => {
    const stored = localStorage.getItem('goodniva_auth')
    if (!stored) return null
    const parsed = JSON.parse(stored) as Partial<AdminUser>
    // Backfill role/permissions for sessions saved before RBAC shipped
    return {
      name: parsed.name ?? DEFAULT_USER.name,
      email: parsed.email ?? DEFAULT_USER.email,
      avatar: parsed.avatar ?? DEFAULT_USER.avatar,
      role: parsed.role ?? 'super_admin',
      permissions: parsed.permissions ?? ALL_MODULE_KEYS,
    }
  })

  const login = async (_email: string, _password: string): Promise<void> => {
    await new Promise((resolve) => setTimeout(resolve, 600))
    setUser(DEFAULT_USER)
    localStorage.setItem('goodniva_auth', JSON.stringify(DEFAULT_USER))
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('goodniva_auth')
  }

  const isSuperAdmin = user?.role === 'super_admin'

  const hasPermission = (module: ModuleKey): boolean => {
    if (!user) return false
    if (user.role === 'super_admin') return true
    return user.permissions.includes(module)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        logout,
        hasPermission,
        isSuperAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = (): AuthContextValue => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}

import React, { createContext, useContext, useState, ReactNode } from 'react'

interface AdminUser {
  name: string
  email: string
  avatar: string
  role: string
}

interface AuthContextValue {
  user: AdminUser | null
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

const DEFAULT_USER: AdminUser = {
  name: 'Super Admin',
  email: 'admin@goodniva.com',
  avatar: 'https://i.pravatar.cc/80?img=60',
  role: 'Global Access',
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AdminUser | null>(() => {
    // Persist login across page refreshes
    const stored = localStorage.getItem('goodniva_auth')
    return stored ? JSON.parse(stored) : null
  })

  const login = async (_email: string, _password: string): Promise<void> => {
    // Mock authentication — replace with real API call
    await new Promise((resolve) => setTimeout(resolve, 600))
    setUser(DEFAULT_USER)
    localStorage.setItem('goodniva_auth', JSON.stringify(DEFAULT_USER))
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('goodniva_auth')
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = (): AuthContextValue => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}

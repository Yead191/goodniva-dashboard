import React, { createContext, useContext, useState, ReactNode, useMemo } from 'react'
import { notificationsSeed } from '@/data/broadcasts'
import type { AdminNotification } from '@/types'

interface NotificationsContextValue {
  notifications: AdminNotification[]
  unreadCount: number
  markAsRead: (id: number) => void
  markAllRead: () => void
  removeNotification: (id: number) => void
  addNotification: (n: Omit<AdminNotification, 'id'>) => void
}

const NotificationsContext = createContext<NotificationsContextValue | undefined>(undefined)

export const NotificationsProvider = ({ children }: { children: ReactNode }) => {
  const [notifications, setNotifications] = useState<AdminNotification[]>(notificationsSeed)

  const unreadCount = useMemo(
    () => notifications.filter((n) => !n.read).length,
    [notifications],
  )

  const markAsRead = (id: number) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)))
  }

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
  }

  const removeNotification = (id: number) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id))
  }

  const addNotification = (n: Omit<AdminNotification, 'id'>) => {
    setNotifications((prev) => [{ ...n, id: Date.now() }, ...prev])
  }

  return (
    <NotificationsContext.Provider
      value={{ notifications, unreadCount, markAsRead, markAllRead, removeNotification, addNotification }}
    >
      {children}
    </NotificationsContext.Provider>
  )
}

export const useNotifications = (): NotificationsContextValue => {
  const ctx = useContext(NotificationsContext)
  if (!ctx) throw new Error('useNotifications must be used within NotificationsProvider')
  return ctx
}

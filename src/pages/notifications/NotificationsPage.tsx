import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Bell, Shield, HelpCircle, TrendingUp, Users, Megaphone, UsersRound, CreditCard, Info, CheckCircle2, X, ArrowUpRight } from 'lucide-react'
import PageHeader from '@/components/layout/PageHeader'
import { Card, SecondaryButton } from '@/components/common'
import { useNotifications } from '@/context/NotificationsContext'
import { useToast } from '@/context/ToastContext'
import { colors } from '@/utils/colors'
import type { AdminNotification, NotificationType } from '@/types'

type FilterKey = 'all' | 'unread' | NotificationType

const FILTERS: { key: FilterKey; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'unread', label: 'Unread' },
  { key: 'safety', label: 'Safety' },
  { key: 'support', label: 'Support' },
  { key: 'revenue', label: 'Revenue' },
  { key: 'user', label: 'Users' },
]

const iconMap: Record<NotificationType, { Icon: React.ComponentType<{ size?: number }>; bg: string; color: string }> = {
  safety: { Icon: Shield, bg: colors.dangerLight, color: colors.danger },
  support: { Icon: HelpCircle, bg: colors.infoLight, color: colors.info },
  revenue: { Icon: TrendingUp, bg: colors.successLight, color: colors.success },
  user: { Icon: Users, bg: colors.primaryLight, color: colors.primary },
  broadcast: { Icon: Megaphone, bg: '#FCE7F3', color: '#9D174D' },
  community: { Icon: UsersRound, bg: '#FEF3C7', color: colors.warning },
  billing: { Icon: CreditCard, bg: colors.warningLight, color: colors.warning },
  system: { Icon: Info, bg: colors.bgInput, color: colors.textSecondary },
}

const actionRouteMap: Record<string, string> = {
  safety: '/safety',
  support: '/support',
  revenue: '/revenue',
  users: '/users',
  broadcast: '/broadcast',
  community: '/community',
  dashboard: '/dashboard',
}

const NotificationsPage = () => {
  const { notifications, unreadCount, markAsRead, markAllRead, removeNotification } = useNotifications()
  const { showToast } = useToast()
  const navigate = useNavigate()
  const [filter, setFilter] = useState<FilterKey>('all')

  const filtered = notifications.filter((n) => {
    if (filter === 'all') return true
    if (filter === 'unread') return !n.read
    return n.type === filter
  })

  const getCount = (key: FilterKey) => {
    if (key === 'all') return notifications.length
    if (key === 'unread') return unreadCount
    return notifications.filter((n) => n.type === key).length
  }

  const handleClick = (n: AdminNotification) => {
    markAsRead(n.id)
    const route = actionRouteMap[n.actionKey]
    if (route) navigate(route)
  }

  const handleMarkAll = () => {
    markAllRead()
    showToast('All notifications marked as read', 'success')
  }

  return (
    <div className="py-7 px-8">
      <PageHeader
        title="Notifications"
        subtitle={unreadCount === 0 ? "You're all caught up!" : `You have ${unreadCount} unread notification${unreadCount === 1 ? '' : 's'}`}
        action={unreadCount > 0 ? <SecondaryButton Icon={CheckCircle2} label="Mark all as read" onClick={handleMarkAll} /> : undefined}
      />

      <Card>
        <div className="flex gap-[6px] pb-4 mb-2 border-b border-line-light flex-wrap">
          {FILTERS.map((f) => {
            const count = getCount(f.key)
            const isActive = filter === f.key
            return (
              <button key={f.key} onClick={() => setFilter(f.key)}
                className={`inline-flex items-center gap-[6px] py-[7px] px-[14px] rounded-pill text-[13px] font-semibold cursor-pointer transition-all duration-150 ${
                  isActive
                    ? 'border-2 border-primary bg-primary-light text-primary'
                    : 'border border-line bg-surface text-ink-secondary'
                }`}>
                {f.label}
                {count > 0 && (
                  <span className={`py-[1px] px-2 rounded-pill text-[11px] font-bold ${isActive ? 'bg-primary text-white' : 'bg-surface-input text-ink-muted'}`}>
                    {count}
                  </span>
                )}
              </button>
            )
          })}
        </div>

        <div className="flex flex-col">
          {filtered.length === 0 ? (
            <div className="py-[60px] px-5 text-center">
              <div className="w-16 h-16 rounded-full bg-surface-subtle text-ink-muted inline-flex items-center justify-center mb-3">
                <Bell size={26} />
              </div>
              <div className="text-[15px] font-semibold text-ink-primary mb-1">No notifications</div>
              <div className="text-[13px] text-ink-secondary">You'll see new notifications here</div>
            </div>
          ) : filtered.map((n) => (
            <NotificationItem
              key={n.id}
              notification={n}
              onClick={() => handleClick(n)}
              onRemove={() => removeNotification(n.id)}
            />
          ))}
        </div>
      </Card>
    </div>
  )
}

const NotificationItem = ({ notification, onClick, onRemove }: { notification: AdminNotification; onClick: () => void; onRemove: () => void }) => {
  const [hover, setHover] = useState(false)
  const cfg = iconMap[notification.type]

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className="relative py-4 px-[18px] border-b border-line-light cursor-pointer transition-colors duration-150 flex items-start gap-[14px]"
      style={{
        background: hover
          ? colors.bgSubtle
          : !notification.read
          ? `${colors.primaryLight}55`
          : 'transparent',
      }}
    >
      {!notification.read && (
        <div className="absolute left-0 top-4 bottom-4 w-[3px] bg-primary rounded-r-[3px]" />
      )}

      <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0" style={{ background: cfg.bg, color: cfg.color }}>
        <cfg.Icon size={20} />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className={`text-sm text-ink-primary ${notification.read ? 'font-medium' : 'font-bold'}`}>{notification.title}</span>
          {!notification.read && <span className="w-[7px] h-[7px] rounded-full bg-primary" />}
        </div>
        <div className="text-[13px] text-ink-secondary leading-relaxed mb-[6px]">{notification.message}</div>
        <div className="flex items-center gap-[10px]">
          {notification.actor && (
            <div className="inline-flex items-center gap-[6px]">
              <img src={notification.actor.avatar} alt="" className="w-5 h-5 rounded-full" />
              <span className="text-xs text-ink-muted">{notification.actor.name}</span>
            </div>
          )}
          <span className="text-xs text-ink-muted">{notification.time}</span>
          <span className="inline-flex items-center gap-[3px] text-xs font-semibold text-primary ml-auto">
            {notification.actionLabel} <ArrowUpRight size={12} />
          </span>
        </div>
      </div>

      {hover && (
        <button
          onClick={(e) => { e.stopPropagation(); onRemove() }}
          className="absolute top-3 right-3 w-7 h-7 rounded-lg border-none bg-surface text-ink-muted cursor-pointer flex items-center justify-center shadow-[0_2px_8px_rgba(15,23,42,0.08)] hover:text-danger hover:bg-danger-light transition-colors"
        >
          <X size={14} />
        </button>
      )}
    </div>
  )
}

export default NotificationsPage

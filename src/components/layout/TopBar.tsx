import { Bell, Search } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { useNotifications } from '@/context/NotificationsContext'

const TopBar = () => {
  const { user } = useAuth()
  const { unreadCount } = useNotifications()
  const navigate = useNavigate()

  return (
    <div className="h-20 bg-surface border-b border-line-light flex items-center gap-5 px-7 sticky top-0 z-10">
      <div className="flex-1 max-w-[520px] relative flex items-center">
        <Search size={16} className="absolute left-4 pointer-events-none text-ink-muted" />
        <input
          placeholder="Search reports, users, or logs..."
          className="w-full h-[42px] rounded-pill border-none bg-surface-input pl-[42px] pr-4 text-sm text-ink-primary outline-none"
        />
      </div>

      <div className="flex-1" />

      <button
        onClick={() => navigate('/notifications')}
        title="Notifications"
        className="w-10 h-10 rounded-pill border-none bg-transparent cursor-pointer flex items-center justify-center text-ink-secondary relative hover:bg-surface-input transition-colors"
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span
            className="absolute top-[6px] min-w-[18px] h-[18px] px-[5px] rounded-pill bg-danger text-white text-[10px] font-bold flex items-center justify-center border-2 border-surface tabular-nums"
            style={{ right: unreadCount > 9 ? 4 : 7 }}
          >
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {user && (
        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="text-sm font-bold text-ink-primary">{user.name}</div>
            <div className="text-xs text-ink-muted">{user.role}</div>
          </div>
          <img
            src={user.avatar}
            alt={user.name}
            className="w-10 h-10 rounded-full object-cover border-2 border-line-light"
          />
        </div>
      )}
    </div>
  )
}

export default TopBar

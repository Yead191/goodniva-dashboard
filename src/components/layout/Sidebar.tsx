import { NavLink, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard,
  Users,
  Map,
  UsersRound,
  Command,
  Crown,
  TrendingUp,
  Shield,
  Bell,
  HelpCircle,
  Settings as SettingsIcon,
  LogOut,
  LucideIcon,
} from 'lucide-react'
import Logo from '@/components/common/Logo'
import { useAuth } from '@/context/AuthContext'

interface NavItem {
  to: string
  label: string
  Icon: LucideIcon
}

const NAV_ITEMS: NavItem[] = [
  { to: '/dashboard', label: 'Dashboard', Icon: LayoutDashboard },
  { to: '/users', label: 'User Management', Icon: Users },
  { to: '/plans', label: 'Plans', Icon: Map },
  { to: '/community', label: 'Community', Icon: UsersRound },
  { to: '/interest', label: 'Interest', Icon: Command },
  { to: '/subscriptions', label: 'Subscriptions', Icon: Crown },
  { to: '/revenue', label: 'Revenue', Icon: TrendingUp },
  { to: '/safety', label: 'Safety Triage', Icon: Shield },
  { to: '/broadcast', label: 'Broadcast', Icon: Bell },
  { to: '/support', label: 'Support', Icon: HelpCircle },
  { to: '/settings', label: 'Settings', Icon: SettingsIcon },
]

const Sidebar = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <aside className="w-[260px] bg-surface border-r border-line-light flex flex-col shrink-0 h-screen sticky top-0">
      <div className="p-6 shrink-0 flex justify-center items-center">
        <img src="/logo.svg" alt="" className='h-24' />
      </div>

      <nav className="flex-1 px-[14px] overflow-y-auto overflow-x-hidden">
        {NAV_ITEMS.map(({ to, label, Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 py-[11px] px-[14px] rounded-[10px] mb-0.5 text-sm no-underline transition-all duration-150 relative
              ${isActive
                ? 'bg-primary-light text-primary font-semibold'
                : 'bg-transparent text-ink-secondary font-medium hover:bg-surface-input'
              }`
            }
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <span className="absolute -right-[14px] top-2 bottom-2 w-[3px] bg-primary rounded-l-[3px]" />
                )}
                <Icon size={18} strokeWidth={isActive ? 2.2 : 1.8} />
                {label}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="px-[14px] pb-[14px] pt-3 border-t border-line-light shrink-0">
        {user && (
          <div className="flex items-center gap-[10px] p-[10px_12px] mb-2 rounded-[10px] bg-surface-subtle">
            <img
              src={user.avatar}
              alt={user.name}
              className="w-9 h-9 rounded-full object-cover shrink-0"
            />
            <div className="min-w-0 flex-1">
              <div className="text-[13px] font-bold text-ink-primary truncate">{user.name}</div>
              <div className="text-[11px] text-ink-muted truncate">{user.email}</div>
            </div>
            <div className="w-[7px] h-[7px] rounded-full bg-success shrink-0" title="Online" />
          </div>
        )}
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 py-[11px] px-[14px] rounded-[10px] border-none bg-transparent text-ink-secondary text-sm font-medium cursor-pointer text-left transition-colors duration-150 hover:bg-surface-input"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </aside>
  )
}

export default Sidebar

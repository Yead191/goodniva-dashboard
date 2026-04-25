import { useEffect, useRef, useState } from 'react'
import {
  AlertTriangle,
  Ban,
  CircleSlash,
  Eye,
  Lock,
  MoreVertical,
  ShieldCheck,
  ShieldOff,
  Trash2,
  UserX,
  type LucideIcon,
} from 'lucide-react'
import PageHeader from '@/components/layout/PageHeader'
import { Card, Badge, IconButton } from '@/components/common'
import UserDetailsModal from '@/components/modals/UserDetailsModal'
import ConfirmDialog, { ConfirmAction } from '@/components/modals/ConfirmDialog'
import { usersSeed } from '@/data/users'
import { useToast } from '@/context/ToastContext'
import { colors } from '@/utils/colors'
import type { User, UserAccountStatus } from '@/types'

interface ConfirmState {
  action: ConfirmAction
  user: User
}

const UsersPage = () => {
  const [users, setUsers] = useState<User[]>(usersSeed)
  const [selected, setSelected] = useState<User | null>(null)
  const [confirm, setConfirm] = useState<ConfirmState | null>(null)
  const { showToast } = useToast()

  const handleConfirm = () => {
    if (!confirm) return
    const { action, user } = confirm

    if (action === 'delete') {
      setUsers((prev) => prev.filter((u) => u.id !== user.id))
      showToast(`${user.name} has been deleted`, 'danger')
    } else {
      setUsers((prev) => prev.map((u) => (u.id === user.id ? applyAction(u, action) : u)))
      showToast(actionToastMessage(user.name, action), actionToastTone(action))
    }

    setConfirm(null)
  }

  return (
    <div className="py-7 px-8">
      <PageHeader title="Users" subtitle="Manage and monitor all users" />

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-surface-subtle">
                {['USER', 'EMAIL', 'LOCATION', 'SUBSCRIPTION', 'STATUS', 'VERIFICATION', 'ACTION'].map((h) => (
                  <th key={h} className="text-left py-[14px] px-4 text-[11px] font-bold text-ink-secondary tracking-[0.6px]">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <UserRow
                  key={user.id}
                  user={user}
                  onView={() => setSelected(user)}
                  onAction={(action) => setConfirm({ action, user })}
                />
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {selected && <UserDetailsModal user={selected} onClose={() => setSelected(null)} />}
      {confirm && (
        <ConfirmDialog
          action={confirm.action}
          userName={confirm.user.name}
          onCancel={() => setConfirm(null)}
          onConfirm={handleConfirm}
        />
      )}
    </div>
  )
}

interface UserRowProps {
  user: User
  onView: () => void
  onAction: (action: ConfirmAction) => void
}

const UserRow = ({ user, onView, onAction }: UserRowProps) => {
  const hasRestriction = user.restrictions.joining || user.restrictions.hosting
  const canRemoveRestriction =
    hasRestriction || user.accountStatus === 'warned' || user.accountStatus === 'suspended'

  return (
    <tr className="hover:bg-surface-subtle transition-colors duration-150">
      <td className="py-[14px] px-4 border-b border-line-light">
        <div className="flex items-center gap-3">
          <img src={user.avatar} alt="" className="w-9 h-9 rounded-full object-cover" />
          <div className="text-sm font-semibold text-ink-primary">{user.name}</div>
        </div>
      </td>
      <td className="py-[14px] px-4 border-b border-line-light text-[13px] text-ink-secondary">{user.email}</td>
      <td className="py-[14px] px-4 border-b border-line-light text-[13px] text-ink-secondary">{user.location}</td>
      <td className="py-[14px] px-4 border-b border-line-light">
        <Badge text={user.subscription} bg={colors.primaryLight} color={colors.primary} />
      </td>
      <td className="py-[14px] px-4 border-b border-line-light">
        <StatusCell status={user.accountStatus} restrictions={user.restrictions} />
      </td>
      <td className="py-[14px] px-4 border-b border-line-light">
        {user.verified ? (
          <Badge text="• Verified" bg={colors.successLight} color={colors.successText} />
        ) : (
          <Badge text="• Not Verified" bg={colors.dangerLight} color={colors.dangerText} />
        )}
      </td>
      <td className="py-[14px] px-4 border-b border-line-light">
        <div className="flex gap-1 items-center">
          <IconButton Icon={Eye} tooltip="View" onClick={onView} />
          <ActionsMenu user={user} canRemoveRestriction={canRemoveRestriction} onAction={onAction} />
          <IconButton Icon={Trash2} tooltip="Delete" danger onClick={() => onAction('delete')} />
        </div>
      </td>
    </tr>
  )
}

const StatusCell = ({
  status,
  restrictions,
}: {
  status: UserAccountStatus
  restrictions: User['restrictions']
}) => {
  const pills: { text: string; bg: string; color: string }[] = []

  if (status === 'banned') {
    pills.push({ text: '• Banned', bg: colors.dangerLight, color: colors.dangerText })
  } else if (status === 'suspended') {
    pills.push({ text: '• Suspended', bg: colors.warningLight, color: colors.warningText })
  } else if (status === 'warned') {
    pills.push({ text: '• Warned', bg: colors.warningLight, color: colors.warningText })
  } else {
    pills.push({ text: '• Active', bg: colors.successLight, color: colors.successText })
  }

  if (restrictions.joining) {
    pills.push({ text: 'No Joining', bg: colors.bgInput, color: colors.textSecondary })
  }
  if (restrictions.hosting) {
    pills.push({ text: 'No Hosting', bg: colors.bgInput, color: colors.textSecondary })
  }

  return (
    <div className="flex flex-wrap gap-[6px]">
      {pills.map((p) => (
        <Badge key={p.text} text={p.text} bg={p.bg} color={p.color} />
      ))}
    </div>
  )
}

interface ActionsMenuProps {
  user: User
  canRemoveRestriction: boolean
  onAction: (action: ConfirmAction) => void
}

interface MenuItem {
  key: ConfirmAction
  label: string
  Icon: LucideIcon
  tone: 'warning' | 'danger' | 'success'
  disabled?: boolean
}

const ActionsMenu = ({ user, canRemoveRestriction, onAction }: ActionsMenuProps) => {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const onDocClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onDocClick)
    return () => document.removeEventListener('mousedown', onDocClick)
  }, [open])

  const isBanned = user.accountStatus === 'banned'

  const items: MenuItem[] = [
    { key: 'warn', label: 'Warn', Icon: AlertTriangle, tone: 'warning', disabled: isBanned },
    {
      key: 'restrictJoin',
      label: user.restrictions.joining ? 'Joining Restricted' : 'Restrict Joining',
      Icon: CircleSlash,
      tone: 'warning',
      disabled: isBanned || user.restrictions.joining,
    },
    {
      key: 'restrictHost',
      label: user.restrictions.hosting ? 'Hosting Restricted' : 'Restrict Hosting',
      Icon: ShieldOff,
      tone: 'warning',
      disabled: isBanned || user.restrictions.hosting,
    },
    {
      key: 'suspend',
      label: 'Suspend',
      Icon: Lock,
      tone: 'warning',
      disabled: isBanned || user.accountStatus === 'suspended',
    },
    { key: 'ban', label: 'Ban', Icon: Ban, tone: 'danger', disabled: isBanned },
    {
      key: 'removeRestriction',
      label: 'Remove Restriction',
      Icon: ShieldCheck,
      tone: 'success',
      disabled: !canRemoveRestriction,
    },
  ]

  const toneClass = (tone: MenuItem['tone'], disabled?: boolean) => {
    if (disabled) return 'text-ink-muted cursor-not-allowed'
    if (tone === 'danger') return 'text-danger hover:bg-danger-light cursor-pointer'
    if (tone === 'success') return 'text-success hover:bg-surface-subtle cursor-pointer'
    return 'text-ink-primary hover:bg-surface-subtle cursor-pointer'
  }

  return (
    <div className="relative" ref={ref}>
      <IconButton Icon={MoreVertical} tooltip="More actions" onClick={() => setOpen((o) => !o)} />
      {open && (
        <div className="absolute right-0 top-full mt-1 w-[208px] bg-surface rounded-[12px] border border-line-light shadow-modal z-20 py-1 animate-[fadeIn_0.15s_ease]">
          {items.map((item) => (
            <button
              key={item.key}
              disabled={item.disabled}
              onClick={() => {
                if (item.disabled) return
                setOpen(false)
                onAction(item.key)
              }}
              className={`w-full flex items-center gap-2 px-3 py-2 text-[13px] font-medium text-left bg-transparent border-none transition-colors ${toneClass(item.tone, item.disabled)}`}
            >
              <item.Icon size={15} />
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

const applyAction = (user: User, action: ConfirmAction): User => {
  switch (action) {
    case 'warn':
      return { ...user, accountStatus: 'warned' }
    case 'restrictJoin':
      return { ...user, restrictions: { ...user.restrictions, joining: true } }
    case 'restrictHost':
      return { ...user, restrictions: { ...user.restrictions, hosting: true } }
    case 'suspend':
      return { ...user, accountStatus: 'suspended' }
    case 'ban':
      return {
        ...user,
        accountStatus: 'banned',
        restrictions: { joining: true, hosting: true },
      }
    case 'removeRestriction':
      return {
        ...user,
        accountStatus: 'active',
        restrictions: { joining: false, hosting: false },
      }
    default:
      return user
  }
}

const actionToastMessage = (name: string, action: ConfirmAction): string => {
  switch (action) {
    case 'warn':
      return `Warning sent to ${name}`
    case 'restrictJoin':
      return `${name} restricted from joining plans`
    case 'restrictHost':
      return `${name} restricted from hosting plans`
    case 'suspend':
      return `${name}'s account suspended`
    case 'ban':
      return `${name} has been banned`
    case 'removeRestriction':
      return `Restrictions removed for ${name}`
    default:
      return ''
  }
}

const actionToastTone = (action: ConfirmAction): 'success' | 'warning' | 'danger' => {
  if (action === 'ban') return 'danger'
  if (action === 'removeRestriction') return 'success'
  return 'warning'
}

export default UsersPage

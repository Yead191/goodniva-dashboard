import { useState } from 'react'
import { Trash2, Eye, Lock } from 'lucide-react'
import PageHeader from '@/components/layout/PageHeader'
import { Card, Badge, IconButton } from '@/components/common'
import UserDetailsModal from '@/components/modals/UserDetailsModal'
import ConfirmDialog, { ConfirmAction } from '@/components/modals/ConfirmDialog'
import { usersSeed } from '@/data/users'
import { useToast } from '@/context/ToastContext'
import { colors } from '@/utils/colors'
import type { User } from '@/types'

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
    if (confirm.action === 'delete') {
      setUsers((prev) => prev.filter((u) => u.id !== confirm.user.id))
      showToast(`${confirm.user.name} has been deleted`, 'danger')
    } else if (confirm.action === 'lock') {
      showToast(`${confirm.user.name}'s account locked`, 'warning')
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
                {['USER', 'EMAIL', 'LOCATION', 'COMMUNITY', 'SUBSCRIPTION', 'VERIFICATION', 'ACTION'].map((h) => (
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
                  onDelete={() => setConfirm({ action: 'delete', user })}
                  onLock={() => setConfirm({ action: 'lock', user })}
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
  onDelete: () => void
  onLock: () => void
}

const UserRow = ({ user, onView, onDelete, onLock }: UserRowProps) => (
  <tr className="hover:bg-surface-subtle transition-colors duration-150">
    <td className="py-[14px] px-4 border-b border-line-light">
      <div className="flex items-center gap-3">
        <img src={user.avatar} alt="" className="w-9 h-9 rounded-full object-cover" />
        <div className="text-sm font-semibold text-ink-primary">{user.name}</div>
      </div>
    </td>
    <td className="py-[14px] px-4 border-b border-line-light text-[13px] text-ink-secondary">{user.email}</td>
    <td className="py-[14px] px-4 border-b border-line-light text-[13px] text-ink-secondary">{user.location}</td>
    <td className="py-[14px] px-4 border-b border-line-light text-[13px] text-ink-secondary">Hyde Park</td>
    <td className="py-[14px] px-4 border-b border-line-light">
      <Badge text={user.subscription} bg={colors.primaryLight} color={colors.primary} />
    </td>
    <td className="py-[14px] px-4 border-b border-line-light">
      {user.verified ? (
        <Badge text="• Verified" bg={colors.successLight} color={colors.successText} />
      ) : (
        <Badge text="• Not Verified" bg={colors.dangerLight} color={colors.dangerText} />
      )}
    </td>
    <td className="py-[14px] px-4 border-b border-line-light">
      <div className="flex gap-1">
        <IconButton Icon={Trash2} tooltip="Delete" danger onClick={onDelete} />
        <IconButton Icon={Eye} tooltip="View" onClick={onView} />
        <IconButton Icon={Lock} tooltip="Lock" onClick={onLock} />
      </div>
    </td>
  </tr>
)

export default UsersPage

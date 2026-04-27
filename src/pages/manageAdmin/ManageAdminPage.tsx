import { useMemo, useState } from 'react'
import {
  Edit2,
  Lock,
  Plus,
  Search,
  ShieldCheck,
  ShieldOff,
  Trash2,
  UserCog,
} from 'lucide-react'
import PageHeader from '@/components/layout/PageHeader'
import {
  Badge,
  Card,
  IconButton,
  PillInput,
  PrimaryButton,
} from '@/components/common'
import AdminFormModal from '@/components/modals/AdminFormModal'
import ConfirmDialog, { ConfirmAction } from '@/components/modals/ConfirmDialog'
import { adminsSeed } from '@/data/admins'
import { useToast } from '@/context/ToastContext'
import { useAuth } from '@/context/AuthContext'
import { colors } from '@/utils/colors'
import { MODULES } from '@/types/permissions'
import type { Admin, AdminRole, ModuleKey } from '@/types/permissions'

interface ConfirmState {
  action: Extract<ConfirmAction, 'deleteAdmin' | 'suspendAdmin' | 'reactivateAdmin'>
  admin: Admin
}

const moduleLabel = (key: ModuleKey) =>
  MODULES.find((m) => m.key === key)?.label ?? key

const ManageAdminPage = () => {
  const { user } = useAuth()
  const { showToast } = useToast()

  const [admins, setAdmins] = useState<Admin[]>(adminsSeed)
  const [query, setQuery] = useState('')
  const [roleFilter, setRoleFilter] = useState<AdminRole | 'all'>('all')
  const [mode, setMode] = useState<'create' | 'edit' | null>(null)
  const [editing, setEditing] = useState<Admin | null>(null)
  const [confirm, setConfirm] = useState<ConfirmState | null>(null)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return admins.filter((a) => {
      if (roleFilter !== 'all' && a.role !== roleFilter) return false
      if (!q) return true
      return (
        a.name.toLowerCase().includes(q) ||
        a.email.toLowerCase().includes(q)
      )
    })
  }, [admins, query, roleFilter])

  const stats = useMemo(() => {
    const total = admins.length
    const supers = admins.filter((a) => a.role === 'super_admin').length
    const active = admins.filter((a) => a.status === 'Active').length
    return { total, supers, active }
  }, [admins])

  const handleCreate = (data: Omit<Admin, 'id' | 'createdAt'>) => {
    const newAdmin: Admin = {
      ...data,
      id: Date.now(),
      createdAt: new Date().toISOString().slice(0, 10),
    }
    setAdmins((prev) => [newAdmin, ...prev])
    setMode(null)
    showToast(`${newAdmin.name} added as ${roleLabel(newAdmin.role)}`, 'success')
  }

  const handleUpdate = (data: Omit<Admin, 'id' | 'createdAt'>) => {
    if (!editing) return
    setAdmins((prev) =>
      prev.map((a) => (a.id === editing.id ? { ...a, ...data } : a))
    )
    setMode(null)
    setEditing(null)
    showToast(`${data.name}'s access updated`, 'success')
  }

  const handleConfirm = () => {
    if (!confirm) return
    const { action, admin } = confirm

    if (action === 'deleteAdmin') {
      setAdmins((prev) => prev.filter((a) => a.id !== admin.id))
      showToast(`${admin.name} removed from admins`, 'danger')
    } else if (action === 'suspendAdmin') {
      setAdmins((prev) =>
        prev.map((a) => (a.id === admin.id ? { ...a, status: 'Suspended' } : a))
      )
      showToast(`${admin.name} has been suspended`, 'warning')
    } else if (action === 'reactivateAdmin') {
      setAdmins((prev) =>
        prev.map((a) => (a.id === admin.id ? { ...a, status: 'Active' } : a))
      )
      showToast(`${admin.name} reactivated`, 'success')
    }

    setConfirm(null)
  }

  const isSelf = (admin: Admin) => admin.email === user?.email

  return (
    <div className="py-7 px-8">
      <PageHeader
        title="Manage Admin"
        subtitle="Create admins and control which modules each one can access"
        action={
          <PrimaryButton
            Icon={Plus}
            label="Add Admin"
            onClick={() => {
              setEditing(null)
              setMode('create')
            }}
          />
        }
      />

      <div className="grid grid-cols-3 gap-4 mb-5">
        <StatTile label="Total Admins" value={stats.total} tone="primary" Icon={UserCog} />
        <StatTile label="Super Admins" value={stats.supers} tone="success" Icon={ShieldCheck} />
        <StatTile label="Active" value={stats.active} tone="info" Icon={ShieldCheck} />
      </div>

      <Card>
        <div className="flex items-center gap-3 mb-4 flex-wrap">
          <div className="flex-1 min-w-[260px]">
            <PillInput
              value={query}
              onChange={setQuery}
              placeholder="Search by name or email"
              iconLeft={Search}
            />
          </div>
          <div className="flex gap-2">
            <FilterPill
              active={roleFilter === 'all'}
              label="All"
              onClick={() => setRoleFilter('all')}
            />
            <FilterPill
              active={roleFilter === 'super_admin'}
              label="Super Admin"
              onClick={() => setRoleFilter('super_admin')}
            />
            <FilterPill
              active={roleFilter === 'admin'}
              label="Admin"
              onClick={() => setRoleFilter('admin')}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-surface-subtle">
                {['ADMIN', 'EMAIL', 'ROLE', 'MODULE ACCESS', 'STATUS', 'ADDED', 'ACTIONS'].map((h) => (
                  <th
                    key={h}
                    className="text-left py-[14px] px-4 text-[11px] font-bold text-ink-secondary tracking-[0.6px]"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-sm text-ink-muted">
                    No admins match your filters
                  </td>
                </tr>
              )}
              {filtered.map((admin) => (
                <AdminRow
                  key={admin.id}
                  admin={admin}
                  isSelf={isSelf(admin)}
                  onEdit={() => {
                    setEditing(admin)
                    setMode('edit')
                  }}
                  onAction={(action) => setConfirm({ action, admin })}
                />
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {mode && (
        <AdminFormModal
          mode={mode}
          initialData={editing ?? undefined}
          onCancel={() => {
            setMode(null)
            setEditing(null)
          }}
          onSubmit={mode === 'edit' ? handleUpdate : handleCreate}
        />
      )}

      {confirm && (
        <ConfirmDialog
          action={confirm.action}
          userName={confirm.admin.name}
          onCancel={() => setConfirm(null)}
          onConfirm={handleConfirm}
        />
      )}
    </div>
  )
}

const roleLabel = (role: AdminRole) => (role === 'super_admin' ? 'Super Admin' : 'Admin')

interface AdminRowProps {
  admin: Admin
  isSelf: boolean
  onEdit: () => void
  onAction: (action: ConfirmState['action']) => void
}

const AdminRow = ({ admin, isSelf, onEdit, onAction }: AdminRowProps) => {
  const isSuper = admin.role === 'super_admin'
  const previewModules = admin.permissions.slice(0, 3)
  const overflow = admin.permissions.length - previewModules.length

  return (
    <tr className="hover:bg-surface-subtle transition-colors duration-150">
      <td className="py-[14px] px-4 border-b border-line-light">
        <div className="flex items-center gap-3">
          <img src={admin.avatar} alt="" className="w-9 h-9 rounded-full object-cover" />
          <div className="min-w-0">
            <div className="text-sm font-semibold text-ink-primary truncate">
              {admin.name}
              {isSelf && (
                <span className="ml-2 text-[10px] font-bold text-primary bg-primary-light rounded-pill px-2 py-[2px]">
                  YOU
                </span>
              )}
            </div>
          </div>
        </div>
      </td>

      <td className="py-[14px] px-4 border-b border-line-light text-[13px] text-ink-secondary">
        {admin.email}
      </td>

      <td className="py-[14px] px-4 border-b border-line-light">
        <Badge
          text={roleLabel(admin.role)}
          bg={isSuper ? colors.primaryLight : colors.bgInput}
          color={isSuper ? colors.primary : colors.textSecondary}
        />
      </td>

      <td className="py-[14px] px-4 border-b border-line-light">
        {isSuper ? (
          <Badge
            text="All modules"
            bg={colors.successLight}
            color={colors.successText}
          />
        ) : (
          <div className="flex flex-wrap gap-[6px]">
            {previewModules.map((k) => (
              <Badge
                key={k}
                text={moduleLabel(k)}
                bg={colors.bgInput}
                color={colors.textSecondary}
              />
            ))}
            {overflow > 0 && (
              <Badge
                text={`+${overflow}`}
                bg={colors.primaryLight}
                color={colors.primary}
              />
            )}
            {admin.permissions.length === 0 && (
              <span className="text-[12px] text-ink-muted italic">No access</span>
            )}
          </div>
        )}
      </td>

      <td className="py-[14px] px-4 border-b border-line-light">
        {admin.status === 'Active' ? (
          <Badge text="• Active" bg={colors.successLight} color={colors.successText} />
        ) : (
          <Badge text="• Suspended" bg={colors.warningLight} color={colors.warningText} />
        )}
      </td>

      <td className="py-[14px] px-4 border-b border-line-light text-[13px] text-ink-secondary">
        {admin.createdAt}
      </td>

      <td className="py-[14px] px-4 border-b border-line-light">
        <div className="flex gap-1 items-center">
          <IconButton Icon={Edit2} tooltip="Edit access" onClick={onEdit} />
          {admin.status === 'Active' ? (
            <IconButton
              Icon={Lock}
              tooltip="Suspend"
              onClick={() => !isSelf && onAction('suspendAdmin')}
            />
          ) : (
            <IconButton
              Icon={ShieldOff}
              tooltip="Reactivate"
              onClick={() => onAction('reactivateAdmin')}
            />
          )}
          <IconButton
            Icon={Trash2}
            tooltip={isSelf ? "You can't remove yourself" : 'Delete'}
            danger
            onClick={() => !isSelf && onAction('deleteAdmin')}
          />
        </div>
      </td>
    </tr>
  )
}

interface StatTileProps {
  label: string
  value: number
  tone: 'primary' | 'success' | 'info'
  Icon: typeof ShieldCheck
}

const StatTile = ({ label, value, tone, Icon }: StatTileProps) => {
  const palette = {
    primary: { bg: colors.primaryLight, color: colors.primary },
    success: { bg: colors.successLight, color: colors.successText },
    info: { bg: colors.infoLight, color: colors.infoText },
  }[tone]

  return (
    <Card>
      <div className="flex items-center gap-4">
        <div
          className="w-12 h-12 rounded-[14px] flex items-center justify-center"
          style={{ background: palette.bg, color: palette.color }}
        >
          <Icon size={20} />
        </div>
        <div>
          <div className="text-[12px] font-semibold text-ink-secondary uppercase tracking-[0.6px]">
            {label}
          </div>
          <div className="text-[24px] font-bold text-ink-primary tabular-nums">
            {value}
          </div>
        </div>
      </div>
    </Card>
  )
}

interface FilterPillProps {
  active: boolean
  label: string
  onClick: () => void
}

const FilterPill = ({ active, label, onClick }: FilterPillProps) => (
  <button
    onClick={onClick}
    className="h-[40px] px-4 rounded-pill text-[13px] font-semibold cursor-pointer border transition-colors"
    style={{
      background: active ? colors.primary : colors.bgCard,
      color: active ? '#fff' : colors.textSecondary,
      borderColor: active ? colors.primary : colors.border,
    }}
  >
    {label}
  </button>
)

export default ManageAdminPage

import { useMemo, useState } from 'react'
import { X, Check, ShieldCheck, UserCog } from 'lucide-react'
import { colors } from '@/utils/colors'
import { PillInput, PrimaryButton, SecondaryButton, FieldWithLabel } from '@/components/common'
import { MODULES, ALL_MODULE_KEYS } from '@/types/permissions'
import type { Admin, AdminRole, ModuleKey } from '@/types/permissions'

interface AdminFormModalProps {
  mode: 'create' | 'edit'
  initialData?: Admin
  onCancel: () => void
  onSubmit: (data: Omit<Admin, 'id' | 'createdAt'>) => void
}

const AdminFormModal = ({ mode, initialData, onCancel, onSubmit }: AdminFormModalProps) => {
  const isEdit = mode === 'edit'
  const [name, setName] = useState(initialData?.name ?? '')
  const [email, setEmail] = useState(initialData?.email ?? '')
  const [avatar, setAvatar] = useState(
    initialData?.avatar ?? `https://i.pravatar.cc/80?u=${Date.now()}`
  )
  const [role, setRole] = useState<AdminRole>(initialData?.role ?? 'admin')
  const [permissions, setPermissions] = useState<ModuleKey[]>(
    initialData?.permissions ?? ['dashboard']
  )

  const isSuperAdminRole = role === 'super_admin'

  const togglePermission = (key: ModuleKey) => {
    setPermissions((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    )
  }

  const selectAll = () => setPermissions(ALL_MODULE_KEYS)
  const clearAll = () => setPermissions([])

  const valid = useMemo(() => {
    if (!name.trim()) return false
    if (!/^\S+@\S+\.\S+$/.test(email)) return false
    if (!isSuperAdminRole && permissions.length === 0) return false
    return true
  }, [name, email, isSuperAdminRole, permissions])

  const handleSubmit = () => {
    if (!valid) return
    onSubmit({
      name: name.trim(),
      email: email.trim(),
      avatar,
      role,
      permissions: isSuperAdminRole ? ALL_MODULE_KEYS : permissions,
      status: initialData?.status ?? 'Active',
    })
  }

  return (
    <>
      <div
        onClick={onCancel}
        className="fixed inset-0 bg-[rgba(15,23,42,0.45)] backdrop-blur-sm z-[100] animate-[fadeIn_0.2s_ease]"
      />
      <div className="fixed inset-0 z-[101] flex items-center justify-center p-5 pointer-events-none">
        <div className="bg-surface rounded-[20px] w-full max-w-[640px] max-h-[92vh] flex flex-col pointer-events-auto shadow-modal animate-[modalSlide_0.25s_ease]">
          <div className="py-[22px] px-7 flex justify-between items-center shrink-0 border-b border-line-light">
            <div>
              <h2 className="text-xl font-bold text-ink-primary m-0">
                {isEdit ? 'Edit Admin' : 'Add New Admin'}
              </h2>
              <p className="text-[13px] text-ink-secondary mt-1 mb-0">
                {isEdit
                  ? 'Update profile, role, and module access'
                  : 'Invite a new admin and choose what they can access'}
              </p>
            </div>
            <button
              onClick={onCancel}
              className="w-9 h-9 rounded-lg border-none bg-transparent cursor-pointer flex items-center justify-center text-ink-secondary hover:bg-surface-input transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          <div className="flex-1 overflow-auto px-7 py-5">
            <div className="flex items-center gap-4 mb-5 p-4 rounded-[14px] bg-surface-subtle">
              <img
                src={avatar}
                alt=""
                className="w-14 h-14 rounded-full object-cover border-2 border-surface"
              />
              <div className="flex-1">
                <PillInput
                  value={avatar}
                  onChange={setAvatar}
                  placeholder="Avatar URL"
                />
                <div className="text-[11px] text-ink-muted mt-1 px-2">
                  Paste an image URL for the admin's profile picture
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-[14px]">
              <FieldWithLabel label="Full Name">
                <PillInput value={name} onChange={setName} placeholder="e.g. Sara Khan" />
              </FieldWithLabel>
              <FieldWithLabel label="Email Address">
                <PillInput value={email} onChange={setEmail} placeholder="name@goodniva.com" />
              </FieldWithLabel>
            </div>

            <div className="mb-[14px]">
              <label className="block text-[13px] font-semibold text-ink-primary mb-2">
                Role
              </label>
              <div className="grid grid-cols-2 gap-3">
                <RoleCard
                  active={role === 'super_admin'}
                  Icon={ShieldCheck}
                  title="Super Admin"
                  description="Full access to every module and admin management"
                  onClick={() => setRole('super_admin')}
                />
                <RoleCard
                  active={role === 'admin'}
                  Icon={UserCog}
                  title="Admin"
                  description="Custom access — choose which modules they can use"
                  onClick={() => setRole('admin')}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-[13px] font-semibold text-ink-primary">
                  Module Access
                </label>
                {!isSuperAdminRole && (
                  <div className="flex gap-2 text-[12px]">
                    <button
                      onClick={selectAll}
                      className="text-primary font-semibold bg-transparent border-none cursor-pointer hover:underline"
                    >
                      Select all
                    </button>
                    <span className="text-ink-muted">·</span>
                    <button
                      onClick={clearAll}
                      className="text-ink-secondary font-semibold bg-transparent border-none cursor-pointer hover:underline"
                    >
                      Clear
                    </button>
                  </div>
                )}
              </div>

              {isSuperAdminRole ? (
                <div className="rounded-[14px] bg-primary-light text-primary text-[13px] font-semibold p-4 flex items-center gap-2">
                  <ShieldCheck size={16} /> Super Admin has full access to all modules
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  {MODULES.map((m) => {
                    const checked = permissions.includes(m.key)
                    return (
                      <button
                        key={m.key}
                        onClick={() => togglePermission(m.key)}
                        className="flex items-start gap-3 p-3 rounded-[12px] border text-left cursor-pointer transition-all duration-150"
                        style={{
                          borderColor: checked ? colors.primary : colors.border,
                          background: checked ? colors.primaryLight : colors.bgCard,
                        }}
                      >
                        <div
                          className="w-5 h-5 rounded-md flex items-center justify-center shrink-0 mt-0.5"
                          style={{
                            background: checked ? colors.primary : colors.bgInput,
                            color: '#fff',
                          }}
                        >
                          {checked && <Check size={14} strokeWidth={3} />}
                        </div>
                        <div>
                          <div className="text-[13px] font-semibold text-ink-primary">
                            {m.label}
                          </div>
                          <div className="text-[11px] text-ink-muted leading-snug">
                            {m.description}
                          </div>
                        </div>
                      </button>
                    )
                  })}
                </div>
              )}
            </div>
          </div>

          <div className="py-[18px] px-7 border-t border-line-light flex gap-[10px] justify-end shrink-0">
            <SecondaryButton label="Cancel" onClick={onCancel} />
            <PrimaryButton
              label={isEdit ? 'Save Changes' : 'Create Admin'}
              onClick={handleSubmit}
              disabled={!valid}
            />
          </div>
        </div>
      </div>
    </>
  )
}

interface RoleCardProps {
  active: boolean
  Icon: typeof ShieldCheck
  title: string
  description: string
  onClick: () => void
}

const RoleCard = ({ active, Icon, title, description, onClick }: RoleCardProps) => (
  <button
    onClick={onClick}
    className="text-left p-4 rounded-[14px] border cursor-pointer transition-all duration-150 flex gap-3 items-start"
    style={{
      borderColor: active ? colors.primary : colors.border,
      background: active ? colors.primaryLight : colors.bgCard,
    }}
  >
    <div
      className="w-10 h-10 rounded-[10px] flex items-center justify-center shrink-0"
      style={{
        background: active ? colors.primary : colors.bgInput,
        color: active ? '#fff' : colors.textSecondary,
      }}
    >
      <Icon size={18} />
    </div>
    <div>
      <div className="text-[14px] font-bold text-ink-primary">{title}</div>
      <div className="text-[12px] text-ink-secondary leading-snug mt-0.5">
        {description}
      </div>
    </div>
  </button>
)

export default AdminFormModal

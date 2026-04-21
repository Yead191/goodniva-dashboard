import { useState } from 'react'
import { Eye, Edit2, Lock } from 'lucide-react'
import PageHeader from '@/components/layout/PageHeader'
import { Card, Badge, IconButton, PrimaryButton } from '@/components/common'
import SubscriptionFormModal from '@/components/modals/SubscriptionFormModal'
import SubscriptionDetailsModal from '@/components/modals/SubscriptionDetailsModal'
import ConfirmDialog from '@/components/modals/ConfirmDialog'
import { subscriptionsSeed } from '@/data/subscriptions'
import { useToast } from '@/context/ToastContext'
import { colors } from '@/utils/colors'
import type { Subscription } from '@/types'

const SubscriptionsPage = () => {
  const [subs, setSubs] = useState<Subscription[]>(subscriptionsSeed)
  const [showCreate, setShowCreate] = useState(false)
  const [editing, setEditing] = useState<Subscription | null>(null)
  const [selected, setSelected] = useState<Subscription | null>(null)
  const [confirming, setConfirming] = useState<Subscription | null>(null)
  const { showToast } = useToast()

  const handleCreate = (data: Omit<Subscription, 'id' | 'status'>) => {
    setSubs((prev) => [...prev, { ...data, id: Date.now(), status: 'Active' }])
    setShowCreate(false)
    showToast(`Plan "${data.planName}" created`, 'success')
  }

  const handleUpdate = (data: Omit<Subscription, 'id' | 'status'>) => {
    if (!editing) return
    setSubs((prev) => prev.map((s) => (s.id === editing.id ? { ...s, ...data } : s)))
    setEditing(null)
    showToast(`Plan "${data.planName}" updated`, 'success')
  }

  const handleHide = () => {
    if (!confirming) return
    showToast(`"${confirming.planName}" has been hidden from public`, 'warning')
    setConfirming(null)
  }

  return (
    <div className="py-7 px-8">
      <PageHeader
        title="Subscriptions"
        subtitle="Manage user plans and subscription status across the platform."
        action={<PrimaryButton label="Create New" onClick={() => setShowCreate(true)} />}
      />

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-surface-subtle">
                {['PLAN NAME', 'PRICE', 'DURATION', 'FEATURES', 'ACTIONS'].map((h) => (
                  <th key={h} className="text-left py-[14px] px-4 text-[11px] font-bold text-ink-secondary tracking-[0.6px]">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {subs.map((sub) => (
                <SubRow
                  key={sub.id}
                  sub={sub}
                  onView={() => setSelected(sub)}
                  onEdit={() => setEditing(sub)}
                  onHide={() => setConfirming(sub)}
                />
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {showCreate && (
        <SubscriptionFormModal mode="create" onCancel={() => setShowCreate(false)} onSubmit={handleCreate} />
      )}
      {editing && (
        <SubscriptionFormModal mode="edit" initialData={editing} onCancel={() => setEditing(null)} onSubmit={handleUpdate} />
      )}
      {selected && <SubscriptionDetailsModal sub={selected} onClose={() => setSelected(null)} />}
      {confirming && (
        <ConfirmDialog action="hide" userName={confirming.planName}
          onCancel={() => setConfirming(null)} onConfirm={handleHide} />
      )}
    </div>
  )
}

interface SubRowProps {
  sub: Subscription
  onView: () => void
  onEdit: () => void
  onHide: () => void
}

const SubRow = ({ sub, onView, onEdit, onHide }: SubRowProps) => (
  <tr className="hover:bg-surface-subtle transition-colors duration-150">
    <td className="py-[18px] px-4 border-b border-line-light text-sm font-semibold text-ink-primary">{sub.planName}</td>
    <td className="py-[18px] px-4 border-b border-line-light text-sm font-semibold text-ink-primary tabular-nums">{sub.price}</td>
    <td className="py-[18px] px-4 border-b border-line-light text-sm text-ink-primary">{sub.duration}</td>
    <td className="py-[18px] px-4 border-b border-line-light">
      <Badge text={`${sub.features.length} Feature`} bg={colors.primaryLight} color={colors.primary} />
    </td>
    <td className="py-[18px] px-4 border-b border-line-light">
      <div className="flex gap-1">
        <IconButton Icon={Eye} tooltip="View" onClick={onView} />
        <IconButton Icon={Edit2} tooltip="Edit" onClick={onEdit} />
        <IconButton Icon={Lock} tooltip="Hide from public" onClick={onHide} />
      </div>
    </td>
  </tr>
)

export default SubscriptionsPage

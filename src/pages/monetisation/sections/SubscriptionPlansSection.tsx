import { useState } from 'react'
import { Eye, Edit2 } from 'lucide-react'
import { Card, Badge, IconButton, PrimaryButton, Toggle } from '@/components/common'
import SubscriptionFormModal from '@/components/modals/SubscriptionFormModal'
import SubscriptionDetailsModal from '@/components/modals/SubscriptionDetailsModal'
import { subscriptionsSeed } from '@/data/subscriptions'
import { useMonetisation } from '@/context/MonetisationContext'
import { useToast } from '@/context/ToastContext'
import { colors } from '@/utils/colors'
import type { Subscription } from '@/types'
import { SectionTitle, DataTable, Td } from '../_shared'

const SubscriptionPlansSection = () => {
  const { audit, canEdit } = useMonetisation()
  const { showToast } = useToast()
  const [subs, setSubs] = useState<Subscription[]>(subscriptionsSeed)
  const [showCreate, setShowCreate] = useState(false)
  const [editing, setEditing] = useState<Subscription | null>(null)
  const [selected, setSelected] = useState<Subscription | null>(null)

  const handleCreate = (data: Omit<Subscription, 'id' | 'status'>) => {
    setSubs((prev) => [...prev, { ...data, id: Date.now(), status: 'Active' }])
    setShowCreate(false)
    audit('Subscription Pricing', 'Created plan', `${data.planName} — ${data.price} / ${data.duration}`)
    showToast(`Plan "${data.planName}" created`, 'success')
  }

  const handleUpdate = (data: Omit<Subscription, 'id' | 'status'>) => {
    if (!editing) return
    setSubs((prev) => prev.map((s) => (s.id === editing.id ? { ...s, ...data } : s)))
    setEditing(null)
    audit('Subscription Pricing', 'Edited plan', `${data.planName} — ${data.price} / ${data.duration}`)
    showToast(`Plan "${data.planName}" updated`, 'success')
  }

  const handleVisibilityToggle = (sub: Subscription, visible: boolean) => {
    const nextStatus: Subscription['status'] = visible ? 'Active' : 'Hidden'
    setSubs((prev) => prev.map((s) => (s.id === sub.id ? { ...s, status: nextStatus } : s)))
    audit(
      'Subscription Pricing',
      visible ? 'Showed plan publicly' : 'Hid plan from public',
      sub.planName,
    )
    showToast(
      visible ? `"${sub.planName}" is now visible` : `"${sub.planName}" hidden from public`,
      visible ? 'success' : 'warning',
    )
  }

  return (
    <div>
      <SectionTitle
        title="Subscription Pricing"
        subtitle="The GoodNiva plan catalogue — names, prices, durations and feature lists shown to users."
        action={<PrimaryButton label="New Plan" onClick={() => canEdit && setShowCreate(true)} />}
      />

      <Card>
        <DataTable headers={['PLAN NAME', 'PRICE', 'DURATION', 'FEATURES', 'ACTIONS']}>
          {subs.map((sub) => (
            <tr key={sub.id} className="hover:bg-surface-subtle transition-colors duration-150">
              <Td>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-semibold text-ink-primary">{sub.planName}</span>
                  {sub.trialDays ? <Badge text={`${sub.trialDays}-day free trial`} bg={colors.successLight} color={colors.successText} /> : null}
                  {sub.status === 'Hidden' ? <Badge text="Hidden" bg={colors.warningLight} color={colors.warningText} /> : null}
                </div>
              </Td>
              <Td className="font-semibold tabular-nums">{sub.price}</Td>
              <Td>{sub.duration}</Td>
              <Td><Badge text={`${sub.features.length} Feature`} bg={colors.primaryLight} color={colors.primary} /></Td>
              <Td>
                <div className="flex gap-2 items-center">
                  <IconButton Icon={Eye} tooltip="View" onClick={() => setSelected(sub)} />
                  <IconButton Icon={Edit2} tooltip="Edit" onClick={() => canEdit && setEditing(sub)} />
                  <Toggle
                    checked={sub.status !== 'Hidden'}
                    onChange={(visible) => handleVisibilityToggle(sub, visible)}
                    canEdit={canEdit}
                  />
                </div>
              </Td>
            </tr>
          ))}
        </DataTable>
      </Card>

      {showCreate && <SubscriptionFormModal mode="create" onCancel={() => setShowCreate(false)} onSubmit={handleCreate} />}
      {editing && <SubscriptionFormModal mode="edit" initialData={editing} onCancel={() => setEditing(null)} onSubmit={handleUpdate} />}
      {selected && <SubscriptionDetailsModal sub={selected} onClose={() => setSelected(null)} />}
    </div>
  )
}

export default SubscriptionPlansSection

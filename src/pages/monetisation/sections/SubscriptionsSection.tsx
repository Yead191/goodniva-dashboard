import { useMemo, useState } from 'react'
import { Crown, XCircle, RotateCcw } from 'lucide-react'
import { Card, StatCard, Badge, IconButton, SegmentedTabs } from '@/components/common'
import { colors } from '@/utils/colors'
import { useMonetisation } from '@/context/MonetisationContext'
import { useToast } from '@/context/ToastContext'
import ConfirmDialog from '@/components/modals/ConfirmDialog'
import { SectionTitle, DataTable, Td, UserCell, StatusPill, EmptyRow } from '../_shared'
import type { PlusStatus, PlusMember } from '@/types/monetisation'

type Filter = 'all' | 'Active' | 'Cancelled' | 'Past Due' | 'Refunded' | 'Expired'

const SubscriptionsSection = () => {
  const { plusMembers, setPlusMembers, audit, canEdit } = useMonetisation()
  const { showToast } = useToast()
  const [filter, setFilter] = useState<Filter>('all')
  const [confirming, setConfirming] = useState<{ member: PlusMember; action: 'cancel' | 'refund' } | null>(null)

  const stats = useMemo(() => {
    const active = plusMembers.filter((m) => m.status === 'Active').length
    const cancelled = plusMembers.filter((m) => m.status === 'Cancelled').length
    const pastDue = plusMembers.filter((m) => m.status === 'Past Due').length
    const refunded = plusMembers.filter((m) => m.status === 'Refunded').length
    return { active, cancelled, pastDue, refunded }
  }, [plusMembers])

  const rows = filter === 'all' ? plusMembers : plusMembers.filter((m) => m.status === filter)

  const setStatus = (id: number, status: PlusStatus, extra: Partial<{ refundedAmount: number; cancelledAt: string }> = {}) =>
    setPlusMembers((prev) => prev.map((m) => (m.id === id ? { ...m, status, ...extra } : m)))

  const handleCancel = (m: PlusMember) => {
    setStatus(m.id, 'Cancelled', { cancelledAt: 'Today' })
    audit('Plus Members', 'Cancelled subscription', `${m.user.name} — ${m.plan}`)
    showToast(`${m.user.name}'s subscription cancelled`, 'warning')
  }

  const handleRefund = (m: PlusMember) => {
    setStatus(m.id, 'Refunded', { refundedAmount: m.amount })
    audit('Plus Members', 'Issued refund', `${m.user.name} — £${m.amount.toFixed(2)} (${m.plan})`)
    showToast(`Refund of £${m.amount.toFixed(2)} issued to ${m.user.name}`, 'success')
  }

  const handleConfirm = () => {
    if (!confirming) return
    if (confirming.action === 'cancel') handleCancel(confirming.member)
    else handleRefund(confirming.member)
    setConfirming(null)
  }

  return (
    <div>
      <SectionTitle title="Plus Members" subtitle="GoodNiva Plus members — status, renewals, cancellations, refunds and expiry." />

      <div className="grid grid-cols-4 gap-4 mb-5">
        <StatCard Icon={Crown} iconBg={colors.primaryLight} iconColor={colors.primary} label="Active Plus" value={stats.active} badge="Paying" badgeTone="success" />
        <StatCard Icon={XCircle} iconBg={colors.dangerLight} iconColor={colors.danger} label="Cancelled" value={stats.cancelled} badge="Churn" badgeTone="danger" />
        <StatCard Icon={RotateCcw} iconBg={colors.warningLight} iconColor={colors.warning} label="Past Due" value={stats.pastDue} badge="At risk" badgeTone="warning" />
        <StatCard Icon={RotateCcw} iconBg={colors.bgInput} iconColor={colors.textSecondary} label="Refunded" value={stats.refunded} />
      </div>

      <Card>
        <div className="flex justify-end mb-4">
          <SegmentedTabs<Filter>
            value={filter}
            onChange={setFilter}
            options={[
              { key: 'all', label: 'All' },
              { key: 'Active', label: 'Active' },
              { key: 'Cancelled', label: 'Cancelled' },
              { key: 'Past Due', label: 'Past Due' },
              { key: 'Refunded', label: 'Refunded' },
              { key: 'Expired', label: 'Expired' },
            ]}
          />
        </div>

        <DataTable headers={['MEMBER', 'PLAN', 'AMOUNT', 'RENEWAL / EXPIRY', 'STATUS', 'ACTIONS']}>
          {rows.length === 0 ? (
            <EmptyRow colSpan={6} message="No members match this filter." />
          ) : (
            rows.map((m) => (
              <tr key={m.id} className="hover:bg-surface-subtle transition-colors duration-150">
                <Td><UserCell {...m.user} /></Td>
                <Td><Badge text={m.plan} bg={colors.primaryLight} color={colors.primary} /></Td>
                <Td className="font-bold tabular-nums">
                  £{m.amount.toFixed(2)}
                  {m.refundedAmount ? <span className="block text-[11px] text-danger font-semibold">−£{m.refundedAmount.toFixed(2)} refunded</span> : null}
                </Td>
                <Td>
                  <span className="text-ink-secondary">{m.renewalDate}</span>
                  {m.cancelledAt ? <span className="block text-[11px] text-ink-muted">Cancelled {m.cancelledAt}</span> : null}
                </Td>
                <Td><StatusPill status={m.status} /></Td>
                <Td>
                  <div className="flex gap-1">
                    <IconButton Icon={XCircle} tooltip="Cancel subscription" onClick={() => canEdit && setConfirming({ member: m, action: 'cancel' })} />
                    <IconButton Icon={RotateCcw} tooltip="Issue refund" onClick={() => canEdit && setConfirming({ member: m, action: 'refund' })} />
                  </div>
                </Td>
              </tr>
            ))
          )}
        </DataTable>
      </Card>

      {confirming && (
        <ConfirmDialog
          action={confirming.action === 'cancel' ? 'cancelSubscription' : 'refundSubscription'}
          userName={confirming.member.user.name}
          onCancel={() => setConfirming(null)}
          onConfirm={handleConfirm}
        />
      )}
    </div>
  )
}

export default SubscriptionsSection

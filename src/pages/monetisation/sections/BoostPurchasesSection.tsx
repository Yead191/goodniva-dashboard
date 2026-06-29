import { useMemo, useState } from 'react'
import { ShoppingBag, RotateCcw, Coins } from 'lucide-react'
import { Card, StatCard, Badge, IconButton, SegmentedTabs } from '@/components/common'
import { colors } from '@/utils/colors'
import { useMonetisation } from '@/context/MonetisationContext'
import { useToast } from '@/context/ToastContext'
import ConfirmDialog from '@/components/modals/ConfirmDialog'
import { SectionTitle, DataTable, Td, UserCell, StatusPill, EmptyRow } from '../_shared'
import type { BoostPurchase } from '@/types/monetisation'

type Filter = 'all' | 'Completed' | 'Refunded' | 'Pending'

const BoostPurchasesSection = () => {
  const { boostPurchases, setBoostPurchases, audit, canEdit } = useMonetisation()
  const { showToast } = useToast()
  const [filter, setFilter] = useState<Filter>('all')
  const [confirming, setConfirming] = useState<BoostPurchase | null>(null)

  const stats = useMemo(() => {
    const revenue = boostPurchases.filter((p) => p.status === 'Completed').reduce((s, p) => s + p.amount, 0)
    const refunded = boostPurchases.filter((p) => p.status === 'Refunded').reduce((s, p) => s + p.amount, 0)
    const creditsUsed = boostPurchases.reduce((s, p) => s + p.creditsUsed, 0)
    const creditsSold = boostPurchases.reduce((s, p) => s + p.creditsPurchased, 0)
    return { revenue, refunded, creditsUsed, creditsSold }
  }, [boostPurchases])

  const rows = filter === 'all' ? boostPurchases : boostPurchases.filter((p) => p.status === filter)

  const handleRefund = () => {
    const p = confirming
    if (!p || !canEdit) return
    setBoostPurchases((prev) => prev.map((x) => (x.id === p.id ? { ...x, status: 'Refunded' } : x)))
    audit('Boost Purchases', 'Refunded purchase', `${p.id} — ${p.user.name} (£${p.amount.toFixed(2)})`)
    showToast(`Refunded ${p.id}`, 'success')
    setConfirming(null)
  }

  return (
    <div>
      <SectionTitle title="Boost Purchases" subtitle="Track Boost purchases, refunds and credit usage." />

      <div className="grid grid-cols-4 gap-4 mb-5">
        <StatCard Icon={ShoppingBag} iconBg={colors.successLight} iconColor={colors.success} label="Boost Revenue" value={`£${stats.revenue.toFixed(2)}`} badge="Completed" badgeTone="success" />
        <StatCard Icon={RotateCcw} iconBg={colors.dangerLight} iconColor={colors.danger} label="Refunded" value={`£${stats.refunded.toFixed(2)}`} />
        <StatCard Icon={Coins} iconBg={colors.primaryLight} iconColor={colors.primary} label="Credits Sold" value={stats.creditsSold} badge="Total" badgeTone="info" />
        <StatCard Icon={Coins} iconBg={colors.warningLight} iconColor={colors.warning} label="Credits Used" value={stats.creditsUsed} badge={`${stats.creditsSold ? Math.round((stats.creditsUsed / stats.creditsSold) * 100) : 0}%`} badgeTone="warning" />
      </div>

      <Card>
        <div className="flex justify-end mb-4">
          <SegmentedTabs<Filter>
            value={filter}
            onChange={setFilter}
            options={[
              { key: 'all', label: 'All' },
              { key: 'Completed', label: 'Completed' },
              { key: 'Pending', label: 'Pending' },
              { key: 'Refunded', label: 'Refunded' },
            ]}
          />
        </div>

        <DataTable headers={['ID', 'BUYER', 'PRODUCT', 'AMOUNT', 'CREDITS (USED/BOUGHT)', 'DATE', 'STATUS', 'ACTIONS']}>
          {rows.length === 0 ? (
            <EmptyRow colSpan={8} message="No purchases match this filter." />
          ) : (
            rows.map((p) => (
              <tr key={p.id} className="hover:bg-surface-subtle transition-colors duration-150">
                <Td className="font-semibold text-ink-secondary">{p.id}</Td>
                <Td><UserCell {...p.user} /></Td>
                <Td><div className="text-sm text-ink-primary">{p.product}</div><Badge text={p.type} bg={p.type === 'Access' ? colors.primaryLight : colors.warningLight} color={p.type === 'Access' ? colors.primary : colors.warningText} /></Td>
                <Td className="font-bold tabular-nums">£{p.amount.toFixed(2)}</Td>
                <Td className="tabular-nums">{p.creditsUsed} / {p.creditsPurchased}</Td>
                <Td className="text-ink-secondary">{p.date}</Td>
                <Td><StatusPill status={p.status} /></Td>
                <Td>{p.status === 'Completed' ? <IconButton Icon={RotateCcw} tooltip="Refund" onClick={() => canEdit && setConfirming(p)} /> : <span className="text-ink-muted">—</span>}</Td>
              </tr>
            ))
          )}
        </DataTable>
      </Card>

      {confirming && (
        <ConfirmDialog
          action="refundBoost"
          userName={confirming.user.name}
          onCancel={() => setConfirming(null)}
          onConfirm={handleRefund}
        />
      )}
    </div>
  )
}

export default BoostPurchasesSection

import { useMemo, useState } from 'react'
import {
  AlertTriangle,
  Ban,
  CircleSlash,
  Lock,
  RotateCcw,
  ShieldOff,
  type LucideIcon,
} from 'lucide-react'
import PageHeader from '@/components/layout/PageHeader'
import { Card, Badge, IconButton, StatCard } from '@/components/common'
import ConfirmDialog from '@/components/modals/ConfirmDialog'
import { actionCentreSeed } from '@/data/actionCentre'
import { useToast } from '@/context/ToastContext'
import { colors } from '@/utils/colors'
import type {
  ActionCentreCategory,
  ActionCentreEntry,
  ActionCentreType,
} from '@/types'

const CATEGORIES: (ActionCentreCategory | 'All')[] = [
  'All',
  'Warnings',
  'Restrictions',
  'Suspensions',
  'Bans',
  'Reversals',
]

const ActionCentrePage = () => {
  const [entries, setEntries] = useState<ActionCentreEntry[]>(actionCentreSeed)
  const [filter, setFilter] = useState<(typeof CATEGORIES)[number]>('All')
  const [confirm, setConfirm] = useState<ActionCentreEntry | null>(null)
  const { showToast } = useToast()

  const counts = useMemo(() => buildCounts(entries), [entries])
  const visible = useMemo(
    () => entries.filter((e) => matchesFilter(e, filter)).sort(byNewest),
    [entries, filter],
  )

  const handleReverse = () => {
    if (!confirm) return
    const target = confirm
    const now = nowLabel()
    setEntries((prev) => {
      const updated = prev.map((e) =>
        e.id === target.id
          ? {
              ...e,
              status: 'Reversed' as const,
              reversedBy: 'Mod: You',
              reversedAt: now,
              reversalReason: 'Reversed via Action Centre',
            }
          : e,
      )
      const reversalEntry: ActionCentreEntry = {
        id: Date.now(),
        type: 'reversal',
        target: target.target,
        reason: `Reversed: ${describeAction(target.type)} — ${target.reason}`,
        source: `Action #${target.id}`,
        appliedBy: 'Mod: You',
        appliedAt: now,
        status: 'Active',
        reversedBy: 'Mod: You',
        reversedAt: now,
        reversalOf: target.id,
      }
      return [reversalEntry, ...updated]
    })
    showToast(`Action against ${target.target.name} reversed`, 'success')
    setConfirm(null)
  }

  return (
    <div className="py-7 px-8">
      <PageHeader title="Action Centre" subtitle="Audit log of warnings, restrictions, suspensions, bans, and reversals" />

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        <StatCard
          Icon={AlertTriangle}
          iconBg={colors.warningLight}
          iconColor={colors.warning}
          label="Active Warnings"
          value={counts.warnings}
        />
        <StatCard
          Icon={CircleSlash}
          iconBg={colors.warningLight}
          iconColor={colors.warning}
          label="Active Restrictions"
          value={counts.restrictions}
        />
        <StatCard
          Icon={Lock}
          iconBg={colors.warningLight}
          iconColor={colors.warning}
          label="Active Suspensions"
          value={counts.suspensions}
        />
        <StatCard
          Icon={Ban}
          iconBg={colors.dangerLight}
          iconColor={colors.danger}
          label="Active Bans"
          value={counts.bans}
        />
        <StatCard
          Icon={RotateCcw}
          iconBg={colors.successLight}
          iconColor={colors.success}
          label="Reversals (30d)"
          value={counts.reversals}
        />
      </div>

      <div className="flex gap-2 mb-4 flex-wrap">
        {CATEGORIES.map((c) => (
          <button
            key={c}
            onClick={() => setFilter(c)}
            className={`h-9 px-4 rounded-pill border text-[13px] font-semibold cursor-pointer transition-colors ${
              filter === c
                ? 'bg-primary text-white border-primary'
                : 'bg-surface text-ink-secondary border-line hover:bg-surface-subtle'
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-surface-subtle">
                {['USER', 'ACTION', 'REASON / SOURCE', 'APPLIED BY', 'APPLIED', 'STATUS', ''].map((h) => (
                  <th key={h} className="text-left py-[14px] px-4 text-[11px] font-bold text-ink-secondary tracking-[0.6px]">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {visible.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-[13px] text-ink-muted">
                    No actions in this category.
                  </td>
                </tr>
              ) : (
                visible.map((e) => (
                  <ActionRow
                    key={e.id}
                    entry={e}
                    onReverse={() => setConfirm(e)}
                  />
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {confirm && (
        <ConfirmDialog
          action="reverseAction"
          userName={confirm.target.name}
          onCancel={() => setConfirm(null)}
          onConfirm={handleReverse}
        />
      )}
    </div>
  )
}

interface ActionRowProps {
  entry: ActionCentreEntry
  onReverse: () => void
}

const ActionRow = ({ entry, onReverse }: ActionRowProps) => {
  const meta = actionMeta(entry.type)
  const status = statusStyle(entry.status)
  const reversible = entry.status === 'Active' && entry.type !== 'reversal'

  return (
    <tr className="hover:bg-surface-subtle transition-colors duration-150">
      <td className="py-[14px] px-4 border-b border-line-light">
        <div className="flex items-center gap-3">
          <img src={entry.target.avatar} alt="" className="w-9 h-9 rounded-full object-cover" />
          <div className="min-w-0">
            <div className="text-sm font-semibold text-ink-primary truncate">{entry.target.name}</div>
            <div className="text-[12px] text-ink-muted">{entry.target.handle}</div>
          </div>
        </div>
      </td>
      <td className="py-[14px] px-4 border-b border-line-light">
        <div className="inline-flex items-center gap-2 py-[5px] px-[12px] rounded-pill" style={{ background: meta.bg, color: meta.color }}>
          <meta.Icon size={13} />
          <span className="text-[12px] font-bold">{meta.label}</span>
        </div>
      </td>
      <td className="py-[14px] px-4 border-b border-line-light">
        <div className="text-sm text-ink-primary max-w-[360px]">{entry.reason}</div>
        {entry.source && <div className="text-[12px] text-ink-muted mt-[2px]">{entry.source}</div>}
        {entry.expiresAt && entry.status === 'Active' && (
          <div className="text-[12px] text-warning-text mt-[2px]">Expires {entry.expiresAt}</div>
        )}
        {entry.status === 'Reversed' && entry.reversedAt && (
          <div className="text-[12px] text-success mt-[2px]">
            Reversed {entry.reversedAt}{entry.reversedBy ? ` by ${entry.reversedBy}` : ''}
          </div>
        )}
      </td>
      <td className="py-[14px] px-4 border-b border-line-light text-[13px] text-ink-secondary">{entry.appliedBy}</td>
      <td className="py-[14px] px-4 border-b border-line-light text-[13px] text-ink-secondary">{entry.appliedAt}</td>
      <td className="py-[14px] px-4 border-b border-line-light">
        <Badge text={entry.status} bg={status.bg} color={status.color} />
      </td>
      <td className="py-[14px] px-4 border-b border-line-light">
        {reversible ? (
          <IconButton Icon={RotateCcw} tooltip="Reverse action" onClick={onReverse} />
        ) : (
          <span className="text-[12px] text-ink-muted">—</span>
        )}
      </td>
    </tr>
  )
}

const actionMeta = (
  type: ActionCentreType,
): { label: string; Icon: LucideIcon; bg: string; color: string } => {
  switch (type) {
    case 'warn':
      return { label: 'Warning', Icon: AlertTriangle, bg: colors.warningLight, color: colors.warningText }
    case 'restrictJoin':
      return { label: 'Restrict Join', Icon: CircleSlash, bg: colors.warningLight, color: colors.warningText }
    case 'restrictHost':
      return { label: 'Restrict Host', Icon: ShieldOff, bg: colors.warningLight, color: colors.warningText }
    case 'suspend':
      return { label: 'Suspension', Icon: Lock, bg: colors.warningLight, color: colors.warningText }
    case 'ban':
      return { label: 'Ban', Icon: Ban, bg: colors.dangerLight, color: colors.dangerText }
    case 'reversal':
      return { label: 'Reversal', Icon: RotateCcw, bg: colors.successLight, color: colors.successText }
  }
}

const statusStyle = (status: ActionCentreEntry['status']) => {
  if (status === 'Active') return { bg: colors.infoLight, color: colors.infoText }
  if (status === 'Reversed') return { bg: colors.successLight, color: colors.successText }
  return { bg: colors.bgInput, color: colors.textSecondary }
}

const matchesFilter = (
  e: ActionCentreEntry,
  filter: (typeof CATEGORIES)[number],
): boolean => {
  if (filter === 'All') return true
  if (filter === 'Warnings') return e.type === 'warn'
  if (filter === 'Restrictions') return e.type === 'restrictJoin' || e.type === 'restrictHost'
  if (filter === 'Suspensions') return e.type === 'suspend'
  if (filter === 'Bans') return e.type === 'ban'
  if (filter === 'Reversals') return e.type === 'reversal' || e.status === 'Reversed'
  return true
}

const buildCounts = (entries: ActionCentreEntry[]) => ({
  warnings: entries.filter((e) => e.type === 'warn' && e.status === 'Active').length,
  restrictions: entries.filter(
    (e) => (e.type === 'restrictJoin' || e.type === 'restrictHost') && e.status === 'Active',
  ).length,
  suspensions: entries.filter((e) => e.type === 'suspend' && e.status === 'Active').length,
  bans: entries.filter((e) => e.type === 'ban' && e.status === 'Active').length,
  reversals: entries.filter((e) => e.type === 'reversal' || e.status === 'Reversed').length,
})

const describeAction = (type: ActionCentreType): string => {
  switch (type) {
    case 'warn':
      return 'Warning'
    case 'restrictJoin':
      return 'Joining restriction'
    case 'restrictHost':
      return 'Hosting restriction'
    case 'suspend':
      return 'Suspension'
    case 'ban':
      return 'Ban'
    case 'reversal':
      return 'Reversal'
  }
}

const byNewest = (a: ActionCentreEntry, b: ActionCentreEntry) =>
  Date.parse(b.appliedAt) - Date.parse(a.appliedAt) || b.id - a.id

const nowLabel = () =>
  new Date().toLocaleString('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })

export default ActionCentrePage

import { ReactNode } from 'react'
import { colors } from '@/utils/colors'

/** Status pill palette covering all monetisation statuses. */
const STATUS_MAP: Record<string, { bg: string; text: string; dot: string }> = {
  Active: { bg: colors.successLight, text: colors.successText, dot: colors.success },
  Approved: { bg: colors.successLight, text: colors.successText, dot: colors.success },
  Live: { bg: colors.successLight, text: colors.successText, dot: colors.success },
  Completed: { bg: colors.successLight, text: colors.successText, dot: colors.success },
  Converted: { bg: colors.successLight, text: colors.successText, dot: colors.success },
  Cancelled: { bg: colors.dangerLight, text: colors.dangerText, dot: colors.danger },
  Rejected: { bg: colors.dangerLight, text: colors.dangerText, dot: colors.danger },
  Refunded: { bg: colors.dangerLight, text: colors.dangerText, dot: colors.danger },
  'Past Due': { bg: colors.warningLight, text: colors.warningText, dot: colors.warning },
  Paused: { bg: colors.warningLight, text: colors.warningText, dot: colors.warning },
  Pending: { bg: colors.warningLight, text: colors.warningText, dot: colors.warning },
  'Pending Approval': { bg: colors.warningLight, text: colors.warningText, dot: colors.warning },
  Scheduled: { bg: colors.infoLight, text: colors.infoText, dot: colors.info },
  Expired: { bg: colors.bgInput, text: colors.textMuted, dot: colors.textMuted },
  Ended: { bg: colors.bgInput, text: colors.textMuted, dot: colors.textMuted },
  Disabled: { bg: colors.bgInput, text: colors.textMuted, dot: colors.textMuted },
}

export const StatusPill = ({ status }: { status: string }) => {
  const s = STATUS_MAP[status] || { bg: colors.bgInput, text: colors.textSecondary, dot: colors.textMuted }
  return (
    <span className="inline-flex items-center gap-[6px] py-1 px-3 rounded-pill text-xs font-bold whitespace-nowrap" style={{ background: s.bg, color: s.text }}>
      <span className="w-[6px] h-[6px] rounded-full" style={{ background: s.dot }} />
      {status}
    </span>
  )
}

interface SectionTitleProps {
  title: string
  subtitle?: string
  action?: ReactNode
}

export const SectionTitle = ({ title, subtitle, action }: SectionTitleProps) => (
  <div className="flex justify-between items-start gap-4 mb-5 flex-wrap">
    <div>
      <h2 className="text-[20px] font-bold text-ink-primary m-0">{title}</h2>
      {subtitle && <p className="text-[13px] text-ink-secondary mt-1 mb-0">{subtitle}</p>}
    </div>
    {action && <div className="shrink-0">{action}</div>}
  </div>
)

interface DataTableProps {
  headers: string[]
  children: ReactNode
}

export const DataTable = ({ headers, children }: DataTableProps) => (
  <div className="overflow-x-auto">
    <table className="w-full border-collapse">
      <thead>
        <tr className="bg-surface-subtle">
          {headers.map((h) => (
            <th key={h} className="text-left py-[14px] px-4 text-[11px] font-bold text-ink-secondary tracking-[0.6px] whitespace-nowrap">
              {h}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>{children}</tbody>
    </table>
  </div>
)

export const Td = ({ children, className = '' }: { children: ReactNode; className?: string }) => (
  <td className={`py-[14px] px-4 border-b border-line-light text-sm text-ink-primary ${className}`}>{children}</td>
)

export const UserCell = ({ name, email, avatar }: { name: string; email: string; avatar: string }) => (
  <div className="flex items-center gap-3">
    <img src={avatar} alt="" className="w-9 h-9 rounded-full object-cover shrink-0" />
    <div className="min-w-0">
      <div className="text-sm font-semibold text-ink-primary truncate">{name}</div>
      <div className="text-xs text-ink-muted truncate">{email}</div>
    </div>
  </div>
)

/** Empty-state row spanning the whole table. */
export const EmptyRow = ({ colSpan, message }: { colSpan: number; message: string }) => (
  <tr>
    <td colSpan={colSpan} className="py-12 text-center text-sm text-ink-muted border-b border-line-light">
      {message}
    </td>
  </tr>
)

/** Maps an ISO/short currency code to its symbol. */
export const currencySymbol = (currency: string): string =>
  ({ GBP: '£', USD: '$', EUR: '€' }[currency] ?? '£')

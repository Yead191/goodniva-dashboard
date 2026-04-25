import { useEffect, useRef, useState } from 'react'
import {
  Ban,
  CircleSlash,
  Eye,
  History,
  Lock,
  MoreVertical,
  ShieldCheck,
  ShieldOff,
  type LucideIcon,
} from 'lucide-react'
import PageHeader from '@/components/layout/PageHeader'
import { Card, Badge, IconButton } from '@/components/common'
import ReportDetailsModal from '@/components/modals/ReportDetailsModal'
import ReportHistoryModal from '@/components/modals/ReportHistoryModal'
import ConfirmDialog, { ConfirmAction } from '@/components/modals/ConfirmDialog'
import { triageSeed } from '@/data/safety'
import { useToast } from '@/context/ToastContext'
import { colors } from '@/utils/colors'
import { getStatusStyle, getUrgencyStyle } from '@/utils/statusStyles'
import type { TriageChatMessage, TriageReport } from '@/types'

type ModerationAction = Extract<
  ConfirmAction,
  'restrictJoin' | 'restrictHost' | 'suspend' | 'ban' | 'removeRestriction'
>

interface ConfirmState {
  action: ModerationAction
  report: TriageReport
}

const SafetyTriagePage = () => {
  const [reports, setReports] = useState<TriageReport[]>(triageSeed)
  const [viewReport, setViewReport] = useState<TriageReport | null>(null)
  const [historyReport, setHistoryReport] = useState<TriageReport | null>(null)
  const [confirm, setConfirm] = useState<ConfirmState | null>(null)
  const { showToast } = useToast()

  const handleConfirm = () => {
    if (!confirm) return
    const { report, action } = confirm
    setReports((prev) =>
      prev.map((r) => (r.id === report.id ? { ...r, status: 'RESOLVED' } : r)),
    )
    showToast(actionToast(report.reportedUser.name, action), actionTone(action))
    setConfirm(null)
    setViewReport(null)
  }

  const handleMarkResolved = (report: TriageReport) => {
    setReports((prev) => prev.map((r) => (r.id === report.id ? { ...r, status: 'RESOLVED' } : r)))
    setViewReport(null)
    showToast('Report marked as resolved', 'success')
  }

  const handleSendChat = (report: TriageReport, text: string) => {
    const newMsg: TriageChatMessage = {
      id: Date.now(),
      from: 'admin',
      authorName: 'Mod: You',
      avatar: 'https://i.pravatar.cc/80?img=20',
      text,
      time: new Date().toLocaleString('en-US', {
        month: 'short',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      }),
    }
    setReports((prev) =>
      prev.map((r) =>
        r.id === report.id ? { ...r, reporterChat: [...(r.reporterChat ?? []), newMsg] } : r,
      ),
    )
    setViewReport((prev) =>
      prev && prev.id === report.id
        ? { ...prev, reporterChat: [...(prev.reporterChat ?? []), newMsg] }
        : prev,
    )
  }

  return (
    <div className="py-7 px-8">
      <PageHeader title="Safety Triage" subtitle="Manage and monitor all reports" />

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-surface-subtle">
                {['REPORTER / TARGET', 'REASON', 'URGENCY', 'DATE & TIME', 'STATUS', 'ACTION'].map((h) => (
                  <th key={h} className="text-left py-[14px] px-4 text-[11px] font-bold text-ink-secondary tracking-[0.6px]">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {reports.map((row) => (
                <SafetyRow
                  key={row.id}
                  row={row}
                  onHistory={() => setHistoryReport(row)}
                  onView={() => setViewReport(row)}
                  onAction={(action) => setConfirm({ report: row, action })}
                />
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {viewReport && (
        <ReportDetailsModal
          report={viewReport}
          onClose={() => setViewReport(null)}
          onAction={(action) => setConfirm({ report: viewReport, action })}
          onResolve={() => handleMarkResolved(viewReport)}
          onSendChat={(text) => handleSendChat(viewReport, text)}
        />
      )}
      {historyReport && <ReportHistoryModal report={historyReport} onClose={() => setHistoryReport(null)} />}
      {confirm && (
        <ConfirmDialog
          action={confirm.action}
          userName={confirm.report.reportedUser.name}
          onCancel={() => setConfirm(null)}
          onConfirm={handleConfirm}
        />
      )}
    </div>
  )
}

interface SafetyRowProps {
  row: TriageReport
  onHistory: () => void
  onView: () => void
  onAction: (action: ModerationAction) => void
}

const SafetyRow = ({ row, onHistory, onView, onAction }: SafetyRowProps) => {
  const urgency = getUrgencyStyle(row.urgency)
  const status = getStatusStyle(row.status)
  const reasonMap: Record<string, { bg: string; text: string }> = {
    STALKING: { bg: '#FCE7F3', text: '#9D174D' },
    HARASSMENT: { bg: '#FFE4E6', text: '#9F1239' },
    SPAM: { bg: colors.infoLight, text: colors.infoText },
    INAPPROPRIATE: { bg: colors.dangerLight, text: colors.dangerText },
  }
  const reason = reasonMap[row.reason] || { bg: colors.bgInput, text: colors.textSecondary }

  return (
    <tr className="hover:bg-surface-subtle transition-colors duration-150">
      <td className="p-4 border-b border-line-light">
        <div className="flex items-center gap-3">
          <img src={row.reportedUser.avatar} alt="" className="w-10 h-10 rounded-full object-cover" />
          <div>
            <div className="text-sm font-semibold text-ink-primary">{row.reportedUser.name}</div>
            <div className="text-xs text-ink-muted">Reported by {row.reporter.name}</div>
          </div>
        </div>
      </td>
      <td className="p-4 border-b border-line-light">
        <Badge text={row.reason} bg={reason.bg} color={reason.text} />
      </td>
      <td className="p-4 border-b border-line-light">
        <Badge text={row.urgency} bg={urgency.bg} color={urgency.text} solid />
      </td>
      <td className="p-4 border-b border-line-light text-[13px] text-ink-secondary">{row.date}</td>
      <td className="p-4 border-b border-line-light">
        <Badge
          text={row.status === 'PENDING' ? 'Pending' : row.status === 'REVIEWED' ? 'Reviewed' : 'Resolved'}
          bg={status.bg}
          color={status.text}
        />
      </td>
      <td className="p-4 border-b border-line-light">
        <div className="flex gap-1 items-center">
          <IconButton Icon={History} tooltip="View history" onClick={onHistory} />
          <IconButton Icon={Eye} tooltip="Report details" onClick={onView} />
          <ModerationMenu onAction={onAction} />
        </div>
      </td>
    </tr>
  )
}

interface ModerationMenuProps {
  onAction: (action: ModerationAction) => void
  buttonNode?: React.ReactNode
  placement?: 'down' | 'up'
}

interface MenuItem {
  key: ModerationAction
  label: string
  Icon: LucideIcon
  tone: 'warning' | 'danger' | 'success'
}

export const moderationMenuItems: MenuItem[] = [
  { key: 'restrictJoin', label: 'Restrict Joining', Icon: CircleSlash, tone: 'warning' },
  { key: 'restrictHost', label: 'Restrict Hosting', Icon: ShieldOff, tone: 'warning' },
  { key: 'suspend', label: 'Suspend', Icon: Lock, tone: 'warning' },
  { key: 'ban', label: 'Ban', Icon: Ban, tone: 'danger' },
  { key: 'removeRestriction', label: 'Remove Restriction', Icon: ShieldCheck, tone: 'success' },
]

export const ModerationMenu = ({ onAction, buttonNode, placement = 'down' }: ModerationMenuProps) => {
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

  const toneClass = (tone: MenuItem['tone']) => {
    if (tone === 'danger') return 'text-danger hover:bg-danger-light'
    if (tone === 'success') return 'text-success hover:bg-surface-subtle'
    return 'text-ink-primary hover:bg-surface-subtle'
  }

  return (
    <div className="relative" ref={ref}>
      {buttonNode ? (
        <div onClick={() => setOpen((o) => !o)}>{buttonNode}</div>
      ) : (
        <IconButton Icon={MoreVertical} tooltip="Moderation actions" onClick={() => setOpen((o) => !o)} />
      )}
      {open && (
        <div className={`absolute right-0 w-[208px] bg-surface rounded-[12px] border border-line-light shadow-modal z-20 py-1 animate-[fadeIn_0.15s_ease] ${placement === 'up' ? 'bottom-full mb-1' : 'top-full mt-1'}`}>
          {moderationMenuItems.map((item) => (
            <button
              key={item.key}
              onClick={() => {
                setOpen(false)
                onAction(item.key)
              }}
              className={`w-full flex items-center gap-2 px-3 py-2 text-[13px] font-medium text-left bg-transparent border-none cursor-pointer transition-colors ${toneClass(item.tone)}`}
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

const actionToast = (name: string, action: ModerationAction): string => {
  switch (action) {
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
  }
}

const actionTone = (action: ModerationAction): 'success' | 'warning' | 'danger' => {
  if (action === 'ban') return 'danger'
  if (action === 'removeRestriction') return 'success'
  return 'warning'
}

export default SafetyTriagePage

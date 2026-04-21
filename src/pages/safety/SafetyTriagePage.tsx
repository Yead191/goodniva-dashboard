import { useState } from 'react'
import { History, Eye, UserX } from 'lucide-react'
import PageHeader from '@/components/layout/PageHeader'
import { Card, Badge, IconButton } from '@/components/common'
import ReportDetailsModal from '@/components/modals/ReportDetailsModal'
import ReportHistoryModal from '@/components/modals/ReportHistoryModal'
import ConfirmDialog from '@/components/modals/ConfirmDialog'
import { triageSeed } from '@/data/safety'
import { useToast } from '@/context/ToastContext'
import { colors } from '@/utils/colors'
import { getStatusStyle, getUrgencyStyle } from '@/utils/statusStyles'
import type { TriageReport } from '@/types'

const SafetyTriagePage = () => {
  const [reports, setReports] = useState<TriageReport[]>(triageSeed)
  const [viewReport, setViewReport] = useState<TriageReport | null>(null)
  const [historyReport, setHistoryReport] = useState<TriageReport | null>(null)
  const [confirm, setConfirm] = useState<TriageReport | null>(null)
  const { showToast } = useToast()

  const handleBlock = () => {
    if (!confirm) return
    setReports((prev) => prev.map((r) => (r.id === confirm.id ? { ...r, status: 'RESOLVED' } : r)))
    showToast(`${confirm.reportedUser.name} has been blocked`, 'danger')
    setConfirm(null)
  }

  const handleMarkResolved = (report: TriageReport) => {
    setReports((prev) => prev.map((r) => (r.id === report.id ? { ...r, status: 'RESOLVED' } : r)))
    setViewReport(null)
    showToast('Report marked as resolved', 'success')
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
                <SafetyRow key={row.id} row={row}
                  onHistory={() => setHistoryReport(row)}
                  onView={() => setViewReport(row)}
                  onBlock={() => setConfirm(row)} />
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {viewReport && (
        <ReportDetailsModal report={viewReport} onClose={() => setViewReport(null)}
          onBlock={() => { setViewReport(null); setConfirm(viewReport) }}
          onResolve={() => handleMarkResolved(viewReport)} />
      )}
      {historyReport && <ReportHistoryModal report={historyReport} onClose={() => setHistoryReport(null)} />}
      {confirm && (
        <ConfirmDialog action="blockUser" userName={confirm.reportedUser.name}
          onCancel={() => setConfirm(null)} onConfirm={handleBlock} />
      )}
    </div>
  )
}

interface SafetyRowProps {
  row: TriageReport
  onHistory: () => void
  onView: () => void
  onBlock: () => void
}

const SafetyRow = ({ row, onHistory, onView, onBlock }: SafetyRowProps) => {
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
        <Badge text={row.status === 'PENDING' ? 'Pending' : row.status === 'REVIEWED' ? 'Reviewed' : 'Resolved'} bg={status.bg} color={status.text} />
      </td>
      <td className="p-4 border-b border-line-light">
        <div className="flex gap-1">
          <IconButton Icon={History} tooltip="View history" onClick={onHistory} />
          <IconButton Icon={Eye} tooltip="Report details" onClick={onView} />
          <IconButton Icon={UserX} tooltip="Block user" danger onClick={onBlock} />
        </div>
      </td>
    </tr>
  )
}

export default SafetyTriagePage

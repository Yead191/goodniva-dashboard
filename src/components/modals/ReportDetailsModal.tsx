import { X, Ban, CheckCircle2 } from 'lucide-react'
import { DangerButton, SuccessButton } from '@/components/common'
import { capitalize } from '@/utils/formatters'
import type { TriageReport, TriageUser } from '@/types'

interface ReportDetailsModalProps {
  report: TriageReport
  onClose: () => void
  onBlock: () => void
  onResolve: () => void
}

const ReportDetailsModal = ({ report, onClose, onBlock, onResolve }: ReportDetailsModalProps) => (
  <>
    <div onClick={onClose} className="fixed inset-0 bg-[rgba(15,23,42,0.45)] backdrop-blur-sm z-[100] animate-[fadeIn_0.2s_ease]" />
    <div className="fixed inset-0 z-[101] flex items-center justify-center p-5 pointer-events-none">
      <div className="bg-surface rounded-[20px] w-full max-w-[720px] max-h-[92vh] flex flex-col pointer-events-auto shadow-modal animate-[modalSlide_0.25s_ease]">
        <div className="py-[22px] px-7 flex justify-between items-start shrink-0">
          <div>
            <h2 className="text-xl font-bold text-ink-primary m-0">Report Details</h2>
            <p className="text-[13px] text-ink-secondary mt-1 mb-0">Reviewing reported behavior and history</p>
          </div>
          <button onClick={onClose} className="w-9 h-9 rounded-lg border-none bg-transparent cursor-pointer flex items-center justify-center text-ink-secondary hover:bg-surface-input transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-auto px-7 pb-5">
          <div className="grid grid-cols-2 gap-4 mb-5">
            <UserCard label="Reported User" user={report.reportedUser} />
            <UserCard label="Reporter" user={report.reporter} />
          </div>

          <div className="mb-5">
            <label className="block text-[13px] font-bold text-ink-primary mb-[10px]">Reported Content Preview</label>
            <div className="bg-surface-subtle border border-line-light rounded-[14px] py-4 px-5 text-sm text-ink-primary italic leading-[1.65]">
              {report.contentPreview}
            </div>
          </div>

          <div>
            <label className="block text-[13px] font-bold text-ink-primary mb-[10px]">Details</label>
            <div className="bg-surface-subtle border border-line-light rounded-[14px] py-3 px-5">
              <DetailRow label="Urgency Level" value={capitalize(report.urgency)} />
              <DetailRow label="Reason" value={capitalize(report.reason)} />
              <DetailRow label="Status" value={capitalize(report.status)} />
              <DetailRow label="Date & Time" value={report.date} last />
            </div>
          </div>
        </div>

        <div className="py-[18px] px-7 border-t border-line-light flex gap-[10px] justify-end shrink-0">
          <DangerButton Icon={Ban} label="Block User" onClick={onBlock} />
          <SuccessButton Icon={CheckCircle2} label="Mark Resolved" onClick={onResolve} />
        </div>
      </div>
    </div>
  </>
)

const UserCard = ({ label, user }: { label: string; user: TriageUser }) => (
  <div>
    <label className="block text-[13px] font-bold text-ink-primary mb-[10px]">{label}</label>
    <div className="bg-surface-subtle border border-line-light rounded-[14px] py-[14px] px-[18px] flex items-center gap-3">
      <img src={user.avatar} alt="" className="w-11 h-11 rounded-full object-cover" />
      <div>
        <div className="text-[15px] font-bold text-ink-primary">{user.name}</div>
        <div className="text-xs text-ink-secondary">ID: {user.handle}</div>
      </div>
    </div>
  </div>
)

const DetailRow = ({ label, value, last }: { label: string; value: string; last?: boolean }) => (
  <div className={`flex justify-between py-[10px] ${last ? '' : 'border-b border-line-light'}`}>
    <span className="text-[13px] text-ink-secondary">{label}</span>
    <span className="text-sm font-bold text-ink-primary">{value}</span>
  </div>
)

export default ReportDetailsModal

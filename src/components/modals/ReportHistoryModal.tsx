import { X } from 'lucide-react'
import { PrimaryButton } from '@/components/common'
import type { TriageReport, TriageHistoryEvent } from '@/types'

const ReportHistoryModal = ({ report, onClose }: { report: TriageReport; onClose: () => void }) => (
  <>
    <div onClick={onClose} className="fixed inset-0 bg-[rgba(15,23,42,0.45)] backdrop-blur-sm z-[100] animate-[fadeIn_0.2s_ease]" />
    <div className="fixed inset-0 z-[101] flex items-center justify-center p-5 pointer-events-none">
      <div className="bg-surface rounded-[20px] w-full max-w-[560px] max-h-[92vh] flex flex-col pointer-events-auto shadow-modal animate-[modalSlide_0.25s_ease]">
        <div className="py-[22px] px-7 flex justify-between items-start shrink-0">
          <div>
            <h2 className="text-xl font-bold text-ink-primary m-0">User History</h2>
            <p className="text-[13px] text-ink-secondary mt-1 mb-0">Activity timeline for {report.reportedUser.name}</p>
          </div>
          <button onClick={onClose} className="w-9 h-9 rounded-lg border-none bg-transparent cursor-pointer flex items-center justify-center text-ink-secondary hover:bg-surface-input transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="px-7 pb-5">
          <div className="bg-surface-subtle border border-line-light rounded-[14px] py-[14px] px-[18px] flex items-center gap-3">
            <img src={report.reportedUser.avatar} alt="" className="w-11 h-11 rounded-full" />
            <div>
              <div className="text-[15px] font-bold text-ink-primary">{report.reportedUser.name}</div>
              <div className="text-xs text-ink-secondary">ID: {report.reportedUser.handle}</div>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-auto px-7 pb-5">
          {report.history.length === 0 ? (
            <div className="py-10 px-5 text-center bg-surface-subtle rounded-[14px] border border-line-light">
              <div className="text-[40px] mb-[10px]">📋</div>
              <div className="text-sm font-semibold text-ink-primary">No history yet</div>
              <div className="text-[13px] text-ink-secondary mt-1">This is the first report against this user.</div>
            </div>
          ) : (
            <div className="relative pl-6">
              <div className="absolute left-[7px] top-2 bottom-2 w-0.5 bg-line-light" />
              {report.history.map((h, i) => (
                <TimelineItem key={i} event={h} isLast={i === report.history.length - 1} />
              ))}
            </div>
          )}
        </div>

        <div className="py-[18px] px-7 border-t border-line-light flex justify-end shrink-0">
          <PrimaryButton label="Close" onClick={onClose} />
        </div>
      </div>
    </div>
  </>
)

const TimelineItem = ({ event, isLast }: { event: TriageHistoryEvent; isLast: boolean }) => (
  <div className={`relative ${isLast ? '' : 'pb-5'}`}>
    <div className="absolute -left-6 top-1 w-4 h-4 rounded-full bg-surface border-[3px] border-primary" />
    <div>
      <div className="flex items-center gap-2 mb-1">
        <span className="text-sm font-bold text-ink-primary">{event.action}</span>
        <span className="text-[11px] font-semibold text-ink-muted tracking-[0.3px]">• {event.by}</span>
      </div>
      <div className="text-[13px] text-ink-secondary leading-[1.5]">{event.note}</div>
      <div className="text-[11px] text-ink-muted mt-1 tabular-nums">{event.date}</div>
    </div>
  </div>
)

export default ReportHistoryModal

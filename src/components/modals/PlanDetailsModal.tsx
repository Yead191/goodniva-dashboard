import {
  AlertTriangle,
  Calendar,
  CheckCircle2,
  CircleSlash,
  FileText,
  Flag,
  MapPin,
  MessageSquareWarning,
  ShieldCheck,
  Star,
  Users,
  X,
  type LucideIcon,
} from 'lucide-react'
import { colors } from '@/utils/colors'
import { Badge, PrimaryButton } from '@/components/common'
import { getStatusStyle } from '@/utils/statusStyles'
import type {
  HostReliability,
  Plan,
  PlanCancellationEvent,
  PlanComplaint,
  PlanModerationNote,
  PlanParticipant,
  PlanReportRef,
} from '@/types'

const PlanDetailsModal = ({ plan, onClose }: { plan: Plan; onClose: () => void }) => {
  const status = getStatusStyle(plan.status)
  const reliability = plan.hostReliability
  const reports = plan.reports ?? []
  const cancellations = plan.cancellations ?? []
  const complaints = plan.complaints ?? []
  const notes = plan.moderationNotes ?? []
  const participants = plan.participantList ?? []
  const noShows = participants.filter((p) => p.outcome === 'No-Show')

  return (
    <>
      <div onClick={onClose} className="fixed inset-0 bg-[rgba(15,23,42,0.45)] backdrop-blur-sm z-[100] animate-[fadeIn_0.2s_ease]" />
      <div className="fixed inset-y-0 right-0 z-[101] w-full max-w-[680px] flex flex-col bg-surface shadow-modal animate-[drawerSlide_0.28s_ease]">
        <div className="py-[22px] px-7 flex justify-between items-center shrink-0 border-b border-line-light">
          <h2 className="text-xl font-bold text-ink-primary m-0">Plan Details</h2>
          <button onClick={onClose} className="w-9 h-9 rounded-lg border-none bg-transparent cursor-pointer flex items-center justify-center text-ink-secondary hover:bg-surface-input transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-auto px-7 py-5">
          <img src={plan.avatar} alt={plan.name} className="w-full h-[180px] rounded-[14px] object-cover mb-4" />

          <div className="flex gap-2 mb-3 flex-wrap">
            <Badge text={plan.category} bg={colors.primaryLight} color={colors.primary} />
            <Badge text={plan.status} bg={status.bg} color={status.text} />
            {plan.flagged && (
              <Badge text="• Flagged" bg={colors.dangerLight} color={colors.dangerText} />
            )}
          </div>

          <h3 className="text-[22px] font-bold text-ink-primary m-0 mb-1">{plan.name}</h3>
          <div className="text-[13px] text-ink-secondary mb-4">
            {plan.participants.joined}/{plan.participants.total} joined
          </div>

          {plan.flagged && plan.flagReason && (
            <div className="bg-danger-light border border-line-light rounded-[14px] p-4 mb-4 flex gap-3 items-start">
              <Flag size={18} color={colors.danger} className="shrink-0 mt-[2px]" />
              <div>
                <div className="text-[13px] font-bold text-danger-text mb-[2px]">Plan flagged</div>
                <div className="text-[13px] text-ink-secondary">{plan.flagReason}</div>
              </div>
            </div>
          )}

          <Section title="Host">
            <div className="flex items-center gap-3">
              <div className="relative">
                <img src={plan.host.avatar} alt="" className="w-12 h-12 rounded-full object-cover" />
                {plan.host.verified && (
                  <div className="absolute -bottom-0.5 -right-0.5 w-5 h-5 rounded-full bg-success text-white border-2 border-surface flex items-center justify-center">
                    <CheckCircle2 size={10} />
                  </div>
                )}
              </div>
              <div>
                <div className="text-[15px] font-bold text-ink-primary">{plan.host.name}</div>
                <div className="text-xs text-ink-secondary">Host</div>
              </div>
            </div>
          </Section>

          <Section title="Schedule">
            <DetailRow Icon={Calendar} label="Date" value={plan.date} />
            {plan.location && <DetailRow Icon={MapPin} label="Location" value={plan.location} last />}
          </Section>

          {plan.description && (
            <Section title="About">
              <p className="text-sm text-ink-secondary m-0 leading-relaxed">{plan.description}</p>
            </Section>
          )}

          {reliability && (
            <Section title="Host Reliability" icon={ShieldCheck}>
              <ReliabilityCard data={reliability} />
            </Section>
          )}

          <Section title={`Participants (${participants.length})`} icon={Users}>
            <ParticipantList list={participants} />
          </Section>

          <Section title={`Attendance Outcomes`} icon={CheckCircle2}>
            <AttendanceSummary list={participants} />
          </Section>

          <Section title={`No-Shows (${noShows.length})`} icon={CircleSlash} tone="warning">
            {noShows.length === 0 ? (
              <EmptyHint text="No no-shows on this plan." />
            ) : (
              <ParticipantList list={noShows} />
            )}
          </Section>

          <Section title={`Linked Reports (${reports.length})`} icon={Flag} tone="danger">
            <ReportList reports={reports} />
          </Section>

          <Section title={`Cancellations History (${cancellations.length})`} icon={AlertTriangle} tone="warning">
            <CancellationList list={cancellations} />
          </Section>

          <Section title={`Complaints (${complaints.length})`} icon={MessageSquareWarning} tone="danger">
            <ComplaintList list={complaints} />
          </Section>

          <Section title={`Moderation Notes (${notes.length})`} icon={FileText}>
            <NoteList notes={notes} />
          </Section>
        </div>

        <div className="py-[18px] px-7 border-t border-line-light flex justify-end shrink-0">
          <PrimaryButton label="Close" onClick={onClose} />
        </div>
      </div>
    </>
  )
}

const Section = ({
  title,
  icon: Icon,
  tone,
  children,
}: {
  title: string
  icon?: LucideIcon
  tone?: 'warning' | 'danger'
  children: React.ReactNode
}) => {
  const titleColor =
    tone === 'danger' ? 'text-danger' : tone === 'warning' ? 'text-warning' : 'text-ink-secondary'
  return (
    <div className="mb-4">
      <div className={`text-[11px] font-bold tracking-[0.6px] mb-[10px] uppercase flex items-center gap-[6px] ${titleColor}`}>
        {Icon && <Icon size={13} />}
        {title}
      </div>
      <div className="bg-surface-subtle border border-line-light rounded-[14px] py-3 px-[18px]">
        {children}
      </div>
    </div>
  )
}

const DetailRow = ({ Icon, label, value, last }: { Icon: LucideIcon; label: string; value: string; last?: boolean }) => (
  <div className={`flex items-center gap-[10px] py-[10px] ${last ? '' : 'border-b border-line-light'}`}>
    <Icon size={15} color={colors.textMuted} />
    <span className="text-[13px] text-ink-secondary flex-1">{label}</span>
    <span className="text-sm font-semibold text-ink-primary">{value}</span>
  </div>
)

const EmptyHint = ({ text }: { text: string }) => (
  <div className="text-[13px] text-ink-muted py-2">{text}</div>
)

const ReliabilityCard = ({ data }: { data: HostReliability }) => {
  const ratingTone =
    data.rating >= 4.5 ? colors.success : data.rating >= 3.5 ? colors.warning : colors.danger
  const noShowTone =
    data.noShowRate <= 10 ? colors.success : data.noShowRate <= 25 ? colors.warning : colors.danger

  return (
    <div className="grid grid-cols-2 gap-3">
      <Stat label="Rating" value={`${data.rating.toFixed(1)} ★`} tone={ratingTone} />
      <Stat label="No-Show Rate" value={`${data.noShowRate}%`} tone={noShowTone} />
      <Stat label="Total Hosted" value={`${data.totalHosted}`} />
      <Stat label="Completed" value={`${data.completed}`} />
      <Stat label="Cancelled (all-time)" value={`${data.cancelled}`} />
      <Stat label="Cancellations (30d)" value={`${data.cancellationsLast30d}`} tone={data.cancellationsLast30d > 0 ? colors.warning : undefined} />
    </div>
  )
}

const Stat = ({ label, value, tone }: { label: string; value: string; tone?: string }) => (
  <div className="bg-surface border border-line-light rounded-[10px] px-3 py-[10px]">
    <div className="text-[11px] font-bold uppercase tracking-[0.4px] text-ink-secondary mb-[2px]">{label}</div>
    <div className="text-base font-bold" style={{ color: tone ?? colors.textPrimary }}>{value}</div>
  </div>
)

const ParticipantList = ({ list }: { list: PlanParticipant[] }) => {
  if (list.length === 0) return <EmptyHint text="No participants yet." />
  return (
    <div className="flex flex-col">
      {list.map((p, i) => (
        <div
          key={p.id}
          className={`flex items-center justify-between gap-3 py-[10px] ${i === list.length - 1 ? '' : 'border-b border-line-light'}`}
        >
          <div className="flex items-center gap-3 min-w-0">
            <img src={p.avatar} alt="" className="w-8 h-8 rounded-full object-cover" />
            <div className="min-w-0">
              <div className="text-sm font-semibold text-ink-primary truncate">{p.name}</div>
              <div className="text-[12px] text-ink-secondary">Joined {p.joinedAt}</div>
            </div>
          </div>
          <Badge {...outcomeStyle(p.outcome)} />
        </div>
      ))}
    </div>
  )
}

const AttendanceSummary = ({ list }: { list: PlanParticipant[] }) => {
  if (list.length === 0) return <EmptyHint text="Attendance not yet recorded." />
  const counts = list.reduce(
    (acc, p) => ({ ...acc, [p.outcome]: (acc[p.outcome] ?? 0) + 1 }),
    {} as Record<PlanParticipant['outcome'], number>,
  )
  const order: PlanParticipant['outcome'][] = ['Attended', 'No-Show', 'Cancelled', 'Pending']
  return (
    <div className="flex flex-col">
      {order
        .filter((o) => counts[o])
        .map((o, i, arr) => (
          <div
            key={o}
            className={`flex items-center justify-between py-[10px] ${i === arr.length - 1 ? '' : 'border-b border-line-light'}`}
          >
            <Badge {...outcomeStyle(o)} />
            <span className="text-sm font-bold text-ink-primary">{counts[o]}</span>
          </div>
        ))}
    </div>
  )
}

const ReportList = ({ reports }: { reports: PlanReportRef[] }) => {
  if (reports.length === 0) return <EmptyHint text="No reports linked to this plan." />
  return (
    <div className="flex flex-col">
      {reports.map((r, i) => (
        <div
          key={r.id}
          className={`py-[10px] ${i === reports.length - 1 ? '' : 'border-b border-line-light'}`}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="text-sm font-semibold text-ink-primary">{r.reason}</div>
              <div className="text-[12px] text-ink-secondary mt-[2px]">
                Reported by {r.reporter} · {r.date}
              </div>
            </div>
            <Badge {...reportStatusStyle(r.status)} />
          </div>
        </div>
      ))}
    </div>
  )
}

const CancellationList = ({ list }: { list: PlanCancellationEvent[] }) => {
  if (list.length === 0) return <EmptyHint text="No cancellations on record." />
  return (
    <div className="flex flex-col">
      {list.map((c, i) => (
        <div
          key={`${c.date}-${i}`}
          className={`py-[10px] ${i === list.length - 1 ? '' : 'border-b border-line-light'}`}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="text-sm font-semibold text-ink-primary">{c.reason}</div>
              <div className="text-[12px] text-ink-secondary mt-[2px]">{c.date}</div>
            </div>
            <Badge text={`By ${c.by}`} bg={colors.bgInput} color={colors.textSecondary} />
          </div>
        </div>
      ))}
    </div>
  )
}

const ComplaintList = ({ list }: { list: PlanComplaint[] }) => {
  if (list.length === 0) return <EmptyHint text="No complaints filed." />
  return (
    <div className="flex flex-col">
      {list.map((c, i) => (
        <div
          key={c.id}
          className={`py-[10px] ${i === list.length - 1 ? '' : 'border-b border-line-light'}`}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="text-sm text-ink-primary">{c.text}</div>
              <div className="text-[12px] text-ink-secondary mt-[4px]">
                From {c.from} · {c.date}
              </div>
            </div>
            <Badge {...complaintStatusStyle(c.status)} />
          </div>
        </div>
      ))}
    </div>
  )
}

const NoteList = ({ notes }: { notes: PlanModerationNote[] }) => {
  if (notes.length === 0) return <EmptyHint text="No moderation notes." />
  return (
    <div className="flex flex-col">
      {notes.map((n, i) => (
        <div
          key={n.id}
          className={`py-[10px] ${i === notes.length - 1 ? '' : 'border-b border-line-light'}`}
        >
          <div className="text-sm text-ink-primary">{n.text}</div>
          <div className="text-[12px] text-ink-secondary mt-[4px]">
            {n.author} · {n.date}
          </div>
        </div>
      ))}
    </div>
  )
}

const outcomeStyle = (outcome: PlanParticipant['outcome']) => {
  if (outcome === 'Attended') return { text: outcome, bg: colors.successLight, color: colors.successText }
  if (outcome === 'No-Show') return { text: outcome, bg: colors.dangerLight, color: colors.dangerText }
  if (outcome === 'Cancelled') return { text: outcome, bg: colors.bgInput, color: colors.textSecondary }
  return { text: outcome, bg: colors.infoLight, color: colors.infoText }
}

const reportStatusStyle = (status: PlanReportRef['status']) => {
  if (status === 'Pending') return { text: status, bg: colors.warningLight, color: colors.warningText }
  if (status === 'Dismissed') return { text: status, bg: colors.bgInput, color: colors.textSecondary }
  return { text: status, bg: colors.infoLight, color: colors.infoText }
}

const complaintStatusStyle = (status: PlanComplaint['status']) => {
  if (status === 'Open') return { text: status, bg: colors.warningLight, color: colors.warningText }
  return { text: status, bg: colors.successLight, color: colors.successText }
}

// re-exporting Star to keep tree-shaking happy where used elsewhere
export { Star }

export default PlanDetailsModal

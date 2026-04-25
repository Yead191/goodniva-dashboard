import {
  AlertTriangle,
  Calendar,
  CheckCircle2,
  CircleSlash,
  Crown,
  FileText,
  Flag,
  MapPin,
  ShieldOff,
  UserPlus,
  Star,
  X,
} from 'lucide-react'
import { colors } from '@/utils/colors'
import { Badge, PrimaryButton } from '@/components/common'
import type {
  AttendanceRecord,
  ModeratorNote,
  User,
  UserPlanRef,
  UserReport,
} from '@/types'

interface UserDetailsModalProps {
  user: User
  onClose: () => void
}

const UserDetailsModal = ({ user, onClose }: UserDetailsModalProps) => {
  const activity = user.activity
  const noShows = activity?.attendance.filter((a) => a.outcome === 'No-Show') ?? []
  const restrictionPills = buildRestrictionPills(user)

  return (
    <>
      <div onClick={onClose} className="fixed inset-0 bg-[rgba(15,23,42,0.45)] backdrop-blur-sm z-[100] animate-[fadeIn_0.2s_ease]" />
      <div className="fixed inset-y-0 right-0 z-[101] w-full max-w-[640px] flex flex-col bg-surface shadow-modal animate-[drawerSlide_0.28s_ease]">
        <div className="flex flex-col h-full">
          <div className="py-[22px] px-7 flex justify-between items-center shrink-0 border-b border-line-light">
            <h2 className="text-xl font-bold text-ink-primary m-0">User Details</h2>
            <button onClick={onClose} className="w-9 h-9 rounded-lg border-none bg-transparent cursor-pointer flex items-center justify-center text-ink-secondary hover:bg-surface-input transition-colors">
              <X size={20} />
            </button>
          </div>

          <div className="flex-1 overflow-auto px-7 py-5">
            <div className="text-center mb-6">
              <div className="relative inline-block mb-3">
                <img src={user.avatar} alt={user.name} className="w-24 h-24 rounded-full object-cover" />
                {user.verified && (
                  <div className="absolute bottom-1 right-1 w-7 h-7 rounded-full bg-success text-white border-[3px] border-surface flex items-center justify-center">
                    <CheckCircle2 size={14} />
                  </div>
                )}
              </div>
              <h3 className="text-xl font-bold text-ink-primary m-0">{user.name}</h3>
              <div className="inline-flex items-center gap-1 py-1 px-3 rounded-pill bg-primary-light text-primary text-xs font-bold mt-2">
                <Crown size={12} />
                {user.subscription}
              </div>
              <div className="text-[13px] text-ink-secondary mt-[6px]">{user.email}</div>
              {activity?.city && (
                <div className="text-[13px] text-ink-secondary mt-[4px] inline-flex items-center gap-1">
                  <MapPin size={13} /> {activity.city}
                </div>
              )}
            </div>

            <Section title="Restrictions" icon={ShieldOff}>
              {restrictionPills.length === 0 ? (
                <EmptyHint text="No active restrictions. Account in good standing." />
              ) : (
                <div className="flex flex-wrap gap-2">
                  {restrictionPills.map((p) => (
                    <Badge key={p.text} text={p.text} bg={p.bg} color={p.color} />
                  ))}
                </div>
              )}
            </Section>

            {user.identityInfo && (
              <Section title="Identity Info">
                <InfoRow label="Full Name" value={user.identityInfo.fullName} />
                <InfoRow label="Date of Birth" value={user.identityInfo.dateOfBirth} />
                <InfoRow label="ID Type" value={user.identityInfo.idType} />
                <InfoRow label="ID Number" value={user.identityInfo.idNumber} last />
              </Section>
            )}

            {user.interestInfo && (
              <Section title="Interests & Activity">
                <InfoRow label="Interests" value={user.interestInfo.interests.join(', ')} />
                <InfoRow label="Hobbies" value={user.interestInfo.hobbies.join(', ')} />
                <InfoRow label="Joined" value={user.interestInfo.joinedDate} last />
              </Section>
            )}

            {activity && (
              <>
                <Section title={`Joined Plans (${activity.joinedPlans.length})`} icon={UserPlus}>
                  <PlanList plans={activity.joinedPlans} emptyText="Not joined any plan yet." />
                </Section>

                <Section title={`Hosted Plans (${activity.hostedPlans.length})`} icon={Star}>
                  <PlanList plans={activity.hostedPlans} emptyText="Not hosted any plan yet." />
                </Section>

                <Section title={`Attendance History (${activity.attendance.length})`} icon={Calendar}>
                  <AttendanceList records={activity.attendance} />
                </Section>

                <Section title={`No-Show History (${noShows.length})`} icon={CircleSlash} tone="warning">
                  {noShows.length === 0 ? (
                    <EmptyHint text="No no-shows on record." />
                  ) : (
                    <AttendanceList records={noShows} />
                  )}
                </Section>

                <Section title={`Report History (${activity.reports.length})`} icon={Flag} tone="danger">
                  <ReportList reports={activity.reports} />
                </Section>

                <Section title={`Moderator Notes (${activity.moderatorNotes.length})`} icon={FileText}>
                  <ModNoteList notes={activity.moderatorNotes} />
                </Section>
              </>
            )}
          </div>

          <div className="py-[18px] px-7 border-t border-line-light flex justify-end shrink-0">
            <PrimaryButton label="Close" onClick={onClose} />
          </div>
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
  icon?: typeof AlertTriangle
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

const InfoRow = ({ label, value, last }: { label: string; value: string; last?: boolean }) => (
  <div className={`flex justify-between py-[10px] ${last ? '' : 'border-b border-line-light'}`}>
    <span className="text-[13px] text-ink-secondary">{label}</span>
    <span className="text-sm font-semibold text-ink-primary text-right">{value}</span>
  </div>
)

const EmptyHint = ({ text }: { text: string }) => (
  <div className="text-[13px] text-ink-muted py-2">{text}</div>
)

const PlanList = ({ plans, emptyText }: { plans: UserPlanRef[]; emptyText: string }) => {
  if (plans.length === 0) return <EmptyHint text={emptyText} />
  return (
    <div className="flex flex-col">
      {plans.map((p, i) => (
        <div
          key={p.id}
          className={`flex items-center justify-between py-[10px] gap-3 ${i === plans.length - 1 ? '' : 'border-b border-line-light'}`}
        >
          <div className="min-w-0">
            <div className="text-sm font-semibold text-ink-primary truncate">{p.title}</div>
            <div className="text-[12px] text-ink-secondary mt-[2px]">
              {p.category} · {p.date}
            </div>
          </div>
          <Badge {...planStatusStyle(p.status)} />
        </div>
      ))}
    </div>
  )
}

const AttendanceList = ({ records }: { records: AttendanceRecord[] }) => {
  if (records.length === 0) return <EmptyHint text="No attendance recorded." />
  return (
    <div className="flex flex-col">
      {records.map((r, i) => (
        <div
          key={`${r.planId}-${i}`}
          className={`flex items-center justify-between py-[10px] gap-3 ${i === records.length - 1 ? '' : 'border-b border-line-light'}`}
        >
          <div className="min-w-0">
            <div className="text-sm font-semibold text-ink-primary truncate">{r.planTitle}</div>
            <div className="text-[12px] text-ink-secondary mt-[2px]">{r.date}</div>
          </div>
          <Badge {...attendanceStyle(r.outcome)} />
        </div>
      ))}
    </div>
  )
}

const ReportList = ({ reports }: { reports: UserReport[] }) => {
  if (reports.length === 0) return <EmptyHint text="No reports filed against this user." />
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

const ModNoteList = ({ notes }: { notes: ModeratorNote[] }) => {
  if (notes.length === 0) return <EmptyHint text="No moderator notes." />
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

const buildRestrictionPills = (user: User) => {
  const pills: { text: string; bg: string; color: string }[] = []
  if (user.accountStatus === 'banned') {
    pills.push({ text: '• Banned', bg: colors.dangerLight, color: colors.dangerText })
  } else if (user.accountStatus === 'suspended') {
    pills.push({ text: '• Suspended', bg: colors.warningLight, color: colors.warningText })
  } else if (user.accountStatus === 'warned') {
    pills.push({ text: '• Warned', bg: colors.warningLight, color: colors.warningText })
  }
  if (user.restrictions.joining) {
    pills.push({ text: 'No Joining', bg: colors.bgInput, color: colors.textSecondary })
  }
  if (user.restrictions.hosting) {
    pills.push({ text: 'No Hosting', bg: colors.bgInput, color: colors.textSecondary })
  }
  return pills
}

const planStatusStyle = (status: UserPlanRef['status']) => {
  if (status === 'Completed') return { text: status, bg: colors.successLight, color: colors.successText }
  if (status === 'Cancelled') return { text: status, bg: colors.dangerLight, color: colors.dangerText }
  return { text: status, bg: colors.infoLight, color: colors.infoText }
}

const attendanceStyle = (outcome: AttendanceRecord['outcome']) => {
  if (outcome === 'Attended') return { text: outcome, bg: colors.successLight, color: colors.successText }
  if (outcome === 'No-Show') return { text: outcome, bg: colors.dangerLight, color: colors.dangerText }
  return { text: outcome, bg: colors.bgInput, color: colors.textSecondary }
}

const reportStatusStyle = (status: UserReport['status']) => {
  if (status === 'Pending') return { text: status, bg: colors.warningLight, color: colors.warningText }
  if (status === 'Dismissed') return { text: status, bg: colors.bgInput, color: colors.textSecondary }
  return { text: status, bg: colors.infoLight, color: colors.infoText }
}

export default UserDetailsModal

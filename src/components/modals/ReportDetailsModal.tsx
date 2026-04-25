import { useEffect, useRef, useState } from 'react'
import {
  Calendar,
  CheckCircle2,
  ChevronDown,
  FileImage,
  FileText,
  Link2,
  MessageSquare,
  Send,
  ShieldAlert,
  X,
  type LucideIcon,
} from 'lucide-react'
import { capitalize } from '@/utils/formatters'
import { colors } from '@/utils/colors'
import { SuccessButton } from '@/components/common'
import { ModerationMenu } from '@/pages/safety/SafetyTriagePage'
import type {
  TriageChatMessage,
  TriageEvidence,
  TriageEvidenceKind,
  TriageLinkedPlan,
  TriageReport,
  TriageUser,
} from '@/types'
import type { ConfirmAction } from '@/components/modals/ConfirmDialog'

type ModerationAction = Extract<
  ConfirmAction,
  'restrictJoin' | 'restrictHost' | 'suspend' | 'ban' | 'removeRestriction'
>

interface ReportDetailsModalProps {
  report: TriageReport
  onClose: () => void
  onAction: (action: ModerationAction) => void
  onResolve: () => void
  onSendChat: (text: string) => void
}

const ReportDetailsModal = ({ report, onClose, onAction, onResolve, onSendChat }: ReportDetailsModalProps) => {
  const linkedPlan = report.linkedPlan
  const evidence = report.evidence ?? []
  const chat = report.reporterChat ?? []

  return (
    <>
      <div onClick={onClose} className="fixed inset-0 bg-[rgba(15,23,42,0.45)] backdrop-blur-sm z-[100] animate-[fadeIn_0.2s_ease]" />
      <div className="fixed inset-0 z-[101] flex items-center justify-center p-5 pointer-events-none">
        <div className="bg-surface rounded-[20px] w-full max-w-[760px] max-h-[92vh] flex flex-col pointer-events-auto shadow-modal animate-[modalSlide_0.25s_ease]">
          <div className="py-[22px] px-7 flex justify-between items-start shrink-0 border-b border-line-light">
            <div>
              <h2 className="text-xl font-bold text-ink-primary m-0">Report Details</h2>
              <p className="text-[13px] text-ink-secondary mt-1 mb-0">Reviewing reported behavior and history</p>
            </div>
            <button onClick={onClose} className="w-9 h-9 rounded-lg border-none bg-transparent cursor-pointer flex items-center justify-center text-ink-secondary hover:bg-surface-input transition-colors">
              <X size={20} />
            </button>
          </div>

          <div className="flex-1 overflow-auto px-7 py-5">
            <div className="grid grid-cols-2 gap-4 mb-5">
              <UserCard label="Reported User" user={report.reportedUser} />
              <UserCard label="Reporter" user={report.reporter} />
            </div>

            <Section title="Reported Content Preview">
              <div className="text-sm text-ink-primary italic leading-[1.65]">
                {report.contentPreview}
              </div>
            </Section>

            <Section title="Details">
              <DetailRow label="Urgency Level" value={capitalize(report.urgency)} />
              <DetailRow label="Reason" value={capitalize(report.reason)} />
              <DetailRow label="Status" value={capitalize(report.status)} />
              <DetailRow label="Date & Time" value={report.date} last />
            </Section>

            {linkedPlan && (
              <Section title="Linked Plan" icon={Calendar}>
                <LinkedPlanCard plan={linkedPlan} />
              </Section>
            )}

            <Section title={`Evidence / Context (${evidence.length})`} icon={ShieldAlert}>
              <EvidenceList items={evidence} />
            </Section>

            <Section title="Chat with Reporter" icon={MessageSquare}>
              <ChatThread messages={chat} onSend={onSendChat} reporter={report.reporter} />
            </Section>
          </div>

          <div className="py-[18px] px-7 border-t border-line-light flex gap-[10px] justify-end shrink-0">
            <ModerationMenu
              placement="up"
              onAction={onAction}
              buttonNode={
                <button className="inline-flex items-center justify-center gap-2 h-11 px-[22px] rounded-pill border-none text-sm font-semibold text-white cursor-pointer transition-colors duration-150 bg-danger hover:bg-[#DC2626]">
                  <ShieldAlert size={16} />
                  Take Action
                  <ChevronDown size={14} />
                </button>
              }
            />
            <SuccessButton Icon={CheckCircle2} label="Mark Resolved" onClick={onResolve} />
          </div>
        </div>
      </div>
    </>
  )
}

const Section = ({
  title,
  icon: Icon,
  children,
}: {
  title: string
  icon?: LucideIcon
  children: React.ReactNode
}) => (
  <div className="mb-5">
    <div className="text-[11px] font-bold tracking-[0.6px] mb-[10px] uppercase flex items-center gap-[6px] text-ink-secondary">
      {Icon && <Icon size={13} />}
      {title}
    </div>
    <div className="bg-surface-subtle border border-line-light rounded-[14px] py-3 px-[18px]">
      {children}
    </div>
  </div>
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

const LinkedPlanCard = ({ plan }: { plan: TriageLinkedPlan }) => (
  <div className="flex items-center gap-3 py-1">
    <img src={plan.avatar} alt="" className="w-12 h-12 rounded-[10px] object-cover" />
    <div className="min-w-0">
      <div className="text-sm font-bold text-ink-primary truncate">{plan.name}</div>
      <div className="text-[12px] text-ink-secondary mt-[2px]">
        {plan.category ? `${plan.category} · ` : ''}{plan.date}
      </div>
    </div>
  </div>
)

const EvidenceList = ({ items }: { items: TriageEvidence[] }) => {
  if (items.length === 0) {
    return <div className="text-[13px] text-ink-muted py-2">No evidence attached. Use the chat below to request more from the reporter.</div>
  }
  return (
    <div className="flex flex-col">
      {items.map((e, i) => (
        <div
          key={e.id}
          className={`flex items-start gap-3 py-[10px] ${i === items.length - 1 ? '' : 'border-b border-line-light'}`}
        >
          <div className="w-8 h-8 rounded-lg bg-surface flex items-center justify-center text-ink-secondary border border-line-light shrink-0">
            <EvidenceIcon kind={e.kind} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm text-ink-primary">{e.caption}</div>
            <div className="text-[12px] text-ink-secondary mt-[2px]">
              {capitalize(e.kind)} · {e.addedAt}
            </div>
            {e.url && (
              <a
                href={e.url}
                target="_blank"
                rel="noreferrer"
                className="text-[12px] text-primary hover:underline inline-flex items-center gap-1 mt-1"
              >
                <Link2 size={12} /> Open
              </a>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}

const EvidenceIcon = ({ kind }: { kind: TriageEvidenceKind }) => {
  if (kind === 'screenshot') return <FileImage size={15} />
  if (kind === 'chat') return <MessageSquare size={15} />
  if (kind === 'link') return <Link2 size={15} />
  return <FileText size={15} />
}

const ChatThread = ({
  messages,
  onSend,
  reporter,
}: {
  messages: TriageChatMessage[]
  onSend: (text: string) => void
  reporter: TriageUser
}) => {
  const [draft, setDraft] = useState('')
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight })
  }, [messages.length])

  const submit = () => {
    const trimmed = draft.trim()
    if (!trimmed) return
    onSend(trimmed)
    setDraft('')
  }

  return (
    <div>
      <div
        ref={scrollRef}
        className="max-h-[260px] overflow-auto flex flex-col gap-3 py-1"
      >
        {messages.length === 0 ? (
          <div className="text-[13px] text-ink-muted py-2">
            No messages yet. Send a note to {reporter.name} to request screenshots, dates, or context.
          </div>
        ) : (
          messages.map((m) => <ChatBubble key={m.id} msg={m} />)
        )}
      </div>
      <div className="mt-3 flex items-center gap-2 bg-surface border border-line-light rounded-[12px] py-[6px] px-[10px]">
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault()
              submit()
            }
          }}
          placeholder={`Message ${reporter.name}…`}
          className="flex-1 border-none outline-none bg-transparent text-sm text-ink-primary placeholder:text-ink-muted py-2"
        />
        <button
          onClick={submit}
          disabled={!draft.trim()}
          className="w-9 h-9 rounded-full border-none bg-primary text-white flex items-center justify-center cursor-pointer hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Send size={15} />
        </button>
      </div>
    </div>
  )
}

const ChatBubble = ({ msg }: { msg: TriageChatMessage }) => {
  const isAdmin = msg.from === 'admin'
  return (
    <div className={`flex gap-2 ${isAdmin ? 'flex-row-reverse' : ''}`}>
      <img src={msg.avatar} alt="" className="w-7 h-7 rounded-full object-cover shrink-0" />
      <div className={`max-w-[75%] ${isAdmin ? 'items-end' : 'items-start'} flex flex-col`}>
        <div
          className="rounded-[14px] py-2 px-[14px] text-sm leading-relaxed"
          style={{
            background: isAdmin ? colors.primary : colors.bgCard,
            color: isAdmin ? '#FFFFFF' : colors.textPrimary,
            border: isAdmin ? 'none' : `1px solid ${colors.border}`,
          }}
        >
          {msg.text}
        </div>
        <div className="text-[11px] text-ink-muted mt-1 px-1">
          {msg.authorName} · {msg.time}
        </div>
      </div>
    </div>
  )
}

export default ReportDetailsModal

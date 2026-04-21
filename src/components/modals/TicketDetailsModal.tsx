import { useState, useRef, useEffect } from 'react'
import { X, User, Tag, Clock, Send, CheckCircle2, type LucideIcon } from 'lucide-react'
import { getStatusStyle } from '@/utils/statusStyles'
import type { SupportTicket, SupportMessage } from '@/types'

interface TicketDetailsModalProps {
  ticket: SupportTicket
  onClose: () => void
  onReply: (text: string) => void
  onStatusChange: (status: SupportTicket['status']) => void
}

const TicketDetailsModal = ({ ticket, onClose, onReply, onStatusChange }: TicketDetailsModalProps) => {
  const [reply, setReply] = useState('')
  const threadRef = useRef<HTMLDivElement>(null)
  const status = getStatusStyle(ticket.status)

  useEffect(() => {
    if (threadRef.current) threadRef.current.scrollTop = threadRef.current.scrollHeight
  }, [ticket.messages.length])

  const handleSend = () => {
    if (!reply.trim()) return
    onReply(reply.trim())
    setReply('')
  }

  return (
    <>
      <div onClick={onClose} className="fixed inset-0 bg-[rgba(15,23,42,0.45)] backdrop-blur-sm z-[100] animate-[fadeIn_0.2s_ease]" />
      <div className="fixed inset-0 z-[101] flex items-center justify-center p-5 pointer-events-none">
        <div className="bg-surface rounded-[20px] w-full max-w-[720px] max-h-[92vh] flex flex-col pointer-events-auto shadow-modal animate-[modalSlide_0.25s_ease]">
          <div className="py-[22px] px-7 border-b border-line-light shrink-0">
            <div className="flex justify-between items-start mb-3">
              <div>
                <div className="flex items-center gap-2 mb-[6px]">
                  <span className="text-xs font-bold text-primary font-mono">{ticket.id}</span>
                  <span
                    className="inline-flex items-center gap-[6px] py-[3px] px-[10px] rounded-pill text-[11px] font-bold"
                    style={{ background: status.bg, color: status.text }}
                  >
                    <span className="w-[5px] h-[5px] rounded-full" style={{ background: status.dot }} />
                    {ticket.status}
                  </span>
                </div>
                <h2 className="text-[19px] font-bold text-ink-primary m-0">{ticket.subject}</h2>
              </div>
              <button onClick={onClose} className="w-9 h-9 rounded-lg border-none bg-transparent cursor-pointer flex items-center justify-center text-ink-secondary hover:bg-surface-input transition-colors">
                <X size={20} />
              </button>
            </div>
            <div className="flex gap-4 flex-wrap items-center">
              <MetaItem Icon={User} label={ticket.user.name} />
              <MetaItem Icon={Tag} label={ticket.category} />
              <MetaItem Icon={Clock} label={ticket.createdAt} />
            </div>
          </div>

          <div ref={threadRef} className="flex-1 overflow-auto py-5 px-7 bg-surface-subtle">
            <div className="flex flex-col gap-[14px]">
              {ticket.messages.map((msg, i) => <MessageBubble key={i} message={msg} />)}
            </div>
          </div>

          <div className="py-4 px-7 border-t border-line-light shrink-0 bg-surface">
            {ticket.status !== 'Resolved' ? (
              <>
                <div className="flex gap-[10px] items-end">
                  <textarea
                    value={reply}
                    onChange={(e) => setReply(e.target.value)}
                    placeholder="Type your reply..."
                    rows={2}
                    onKeyDown={(e) => { if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) handleSend() }}
                    className="flex-1 rounded-[14px] border-2 border-transparent bg-surface-input py-3 px-4 text-sm text-ink-primary outline-none resize-none leading-[1.5]"
                  />
                  <button
                    onClick={handleSend}
                    disabled={!reply.trim()}
                    className="w-12 h-12 rounded-full border-none text-white flex items-center justify-center shrink-0 transition-colors duration-150 disabled:bg-line disabled:cursor-not-allowed bg-primary hover:bg-primary-dark"
                  >
                    <Send size={18} />
                  </button>
                </div>
                <div className="flex justify-between items-center mt-[10px]">
                  <span className="text-[11px] text-ink-muted">Press ⌘+Enter to send</span>
                  <div className="flex gap-2">
                    {ticket.status === 'Open' && (
                      <button
                        onClick={() => onStatusChange('In Progress')}
                        className="py-[6px] px-[14px] rounded-pill border border-line bg-surface text-ink-secondary text-xs font-semibold cursor-pointer hover:bg-surface-subtle transition-colors"
                      >
                        Mark In Progress
                      </button>
                    )}
                    <button
                      onClick={() => onStatusChange('Resolved')}
                      className="py-[6px] px-[14px] rounded-pill border-none bg-success text-white text-xs font-semibold cursor-pointer inline-flex items-center gap-[6px] hover:bg-success/90 transition-colors"
                    >
                      <CheckCircle2 size={12} /> Mark Resolved
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-[10px] py-3 px-4 bg-success-light rounded-xl">
                <CheckCircle2 size={18} className="text-success" />
                <div className="flex-1">
                  <div className="text-[13px] font-bold text-success-text">This ticket is resolved</div>
                </div>
                <button
                  onClick={() => onStatusChange('Open')}
                  className="py-[6px] px-[14px] rounded-pill border border-success bg-surface text-success-text text-xs font-semibold cursor-pointer hover:bg-success-light transition-colors"
                >
                  Reopen
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

const MetaItem = ({ Icon, label }: { Icon: LucideIcon; label: string }) => (
  <span className="inline-flex items-center gap-[5px] text-xs text-ink-secondary">
    <Icon size={13} className="text-ink-muted" />
    {label}
  </span>
)

const MessageBubble = ({ message }: { message: SupportMessage }) => {
  const isAdmin = message.from === 'admin'
  return (
    <div className={`flex gap-[10px] ${isAdmin ? 'flex-row-reverse' : 'flex-row'}`}>
      <img src={message.avatar} alt="" className="w-9 h-9 rounded-full shrink-0" />
      <div className={`max-w-[75%] flex flex-col ${isAdmin ? 'items-end' : 'items-start'}`}>
        <div className="text-xs font-semibold text-ink-secondary mb-1">
          {message.name}
          {isAdmin && (
            <span className="ml-[6px] py-px px-[6px] bg-primary-light text-primary rounded text-[10px] font-bold tracking-[0.3px]">
              ADMIN
            </span>
          )}
        </div>
        <div
          className={`py-3 px-4 text-sm leading-[1.55] whitespace-pre-wrap break-words ${
            isAdmin
              ? 'bg-primary text-white border-none rounded-[14px] rounded-br-[4px]'
              : 'bg-surface text-ink-primary border border-line-light rounded-[14px] rounded-bl-[4px]'
          }`}
        >
          {message.text}
        </div>
        <div className="text-[11px] text-ink-muted mt-1">{message.time}</div>
      </div>
    </div>
  )
}

export default TicketDetailsModal

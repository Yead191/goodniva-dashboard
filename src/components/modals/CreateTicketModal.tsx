import { useState } from 'react'
import { X, AlertCircle } from 'lucide-react'
import { PillInput, SelectPill, FieldWithLabel, PrimaryButton, SecondaryButton } from '@/components/common'
import { getPriorityStyle } from '@/utils/statusStyles'
import { useAuth } from '@/context/AuthContext'
import type { SupportTicket } from '@/types'

type CreateData = Omit<SupportTicket, 'id' | 'status' | 'createdAt' | 'lastUpdated' | 'messages'>

interface CreateTicketModalProps {
  onCancel: () => void
  onSubmit: (ticket: CreateData) => void
}

const CATEGORIES = ['Account', 'Billing', 'Bug', 'Feature Request', 'Safety']
const PRIORITIES: SupportTicket['priority'][] = ['Low', 'Medium', 'High']

const CreateTicketModal = ({ onCancel, onSubmit }: CreateTicketModalProps) => {
  const { user } = useAuth()
  const [subject, setSubject] = useState('')
  const [category, setCategory] = useState('Account')
  const [priority, setPriority] = useState<SupportTicket['priority']>('Medium')
  const [description, setDescription] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = () => {
    setError('')
    if (!subject.trim()) { setError('Subject is required'); return }
    if (!description.trim() || description.length < 20) { setError('Description must be at least 20 characters'); return }

    onSubmit({
      subject,
      category,
      priority,
      description,
      user: {
        name: user?.name || 'Admin User',
        email: user?.email || 'admin@goodniva.com',
        avatar: user?.avatar || 'https://i.pravatar.cc/80?img=11',
      },
    })
  }

  return (
    <>
      <div onClick={onCancel} className="fixed inset-0 bg-[rgba(15,23,42,0.45)] backdrop-blur-sm z-[100] animate-[fadeIn_0.2s_ease]" />
      <div className="fixed inset-0 z-[101] flex items-center justify-center p-5 pointer-events-none">
        <div className="bg-surface rounded-[20px] w-full max-w-[560px] max-h-[92vh] flex flex-col pointer-events-auto shadow-modal animate-[modalSlide_0.25s_ease]">
          <div className="py-[22px] px-7 flex justify-between items-center shrink-0">
            <div>
              <h2 className="text-xl font-bold text-ink-primary m-0">New Support Ticket</h2>
              <p className="text-[13px] text-ink-secondary mt-[3px] mb-0">Describe your issue and we'll get back to you</p>
            </div>
            <button onClick={onCancel} className="w-9 h-9 rounded-lg border-none bg-transparent cursor-pointer flex items-center justify-center text-ink-secondary hover:bg-surface-input transition-colors">
              <X size={20} />
            </button>
          </div>

          <div className="flex-1 overflow-auto px-7 pb-5">
            <FieldWithLabel label="Subject">
              <PillInput value={subject} onChange={setSubject} placeholder="Brief summary of your issue" />
            </FieldWithLabel>

            <div className="grid grid-cols-2 gap-[14px] mb-4">
              <FieldWithLabel label="Category">
                <SelectPill value={category} onChange={setCategory} options={CATEGORIES} />
              </FieldWithLabel>
              <div>
                <label className="block text-[13px] font-semibold text-ink-primary mb-[6px]">Priority</label>
                <div className="flex gap-[6px]">
                  {PRIORITIES.map((p) => {
                    const style = getPriorityStyle(p)
                    const active = priority === p
                    return (
                      <button
                        key={p}
                        onClick={() => setPriority(p)}
                        style={active ? { border: `2px solid ${style.text}`, background: style.bg, color: style.text } : undefined}
                        className={`flex-1 h-[46px] rounded-pill text-[13px] font-semibold cursor-pointer transition-all duration-150 ${
                          active ? '' : 'border border-line bg-surface text-ink-secondary hover:bg-surface-subtle'
                        }`}
                      >
                        {p}
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-[6px]">
                <label className="text-[13px] font-semibold text-ink-primary">Description</label>
                <span className="text-[11px] text-ink-muted">{description.length} / 500</span>
              </div>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value.slice(0, 500))}
                placeholder="Provide as much detail as possible about your issue..."
                rows={6}
                className="w-full rounded-[14px] border-2 border-transparent bg-surface-input py-[14px] px-[18px] text-sm text-ink-primary outline-none resize-y leading-[1.5]"
              />
            </div>

            {error && (
              <div className="mt-[14px] py-[10px] px-[14px] rounded-[10px] bg-danger-light text-danger-text text-[13px] font-medium flex items-center gap-2">
                <AlertCircle size={16} />
                {error}
              </div>
            )}
          </div>

          <div className="py-[18px] px-7 border-t border-line-light flex gap-[10px] justify-end shrink-0">
            <SecondaryButton label="Cancel" onClick={onCancel} />
            <PrimaryButton label="Submit Ticket" onClick={handleSubmit} />
          </div>
        </div>
      </div>
    </>
  )
}

export default CreateTicketModal

import { useState } from 'react'
import { Plus, Trash2, ChevronDown, AlertCircle } from 'lucide-react'
import { PillInput, FieldWithLabel, PrimaryButton, SecondaryButton } from '@/components/common'
import { faqSeed } from '@/data/faq'
import { useToast } from '@/context/ToastContext'
import type { FaqItem } from '@/types'

const FaqSection = () => {
  const [faqs, setFaqs] = useState<FaqItem[]>(faqSeed)
  const [expanded, setExpanded] = useState<number | null>(null)
  const [adding, setAdding] = useState(false)
  const [question, setQuestion] = useState('')
  const [answer, setAnswer] = useState('')
  const [error, setError] = useState('')
  const { showToast } = useToast()

  const handleAdd = () => {
    setError('')
    if (!question.trim() || !answer.trim()) { setError('Both fields are required'); return }
    const newFaq: FaqItem = { id: Date.now(), question: question.trim(), answer: answer.trim() }
    setFaqs((prev) => [...prev, newFaq])
    setQuestion(''); setAnswer(''); setAdding(false)
    showToast('FAQ added successfully', 'success')
  }

  const handleDelete = (id: number) => {
    setFaqs((prev) => prev.filter((f) => f.id !== id))
    showToast('FAQ deleted', 'danger')
  }

  return (
    <div>
      <div className="mb-6 pb-4 border-b border-line-light flex justify-between items-start gap-4 flex-wrap">
        <div>
          <h3 className="text-[18px] font-bold text-ink-primary m-0">FAQ</h3>
          <p className="text-[13px] text-ink-secondary mt-1 mb-0">Frequently asked questions visible to your users</p>
        </div>
        {!adding && <PrimaryButton Icon={Plus} label="Add FAQ" onClick={() => setAdding(true)} />}
      </div>

      {adding && (
        <div className="bg-primary-light border border-primary rounded-[14px] p-[18px] mb-[18px]">
          <div className="text-sm font-bold text-primary mb-[14px]">New FAQ</div>
          <FieldWithLabel label="Question">
            <PillInput value={question} onChange={setQuestion} placeholder="Enter the question" />
          </FieldWithLabel>
          <div>
            <label className="block text-[13px] font-semibold text-ink-primary mb-[6px]">Answer</label>
            <textarea value={answer} onChange={(e) => setAnswer(e.target.value)} placeholder="Provide a clear, helpful answer..." rows={4}
              className="w-full rounded-[14px] border-2 border-transparent bg-surface py-[14px] px-[18px] text-sm text-ink-primary outline-none resize-y leading-relaxed" />
          </div>
          {error && (
            <div className="mt-[10px] py-2 px-3 rounded-[10px] bg-danger-light text-danger-text text-[13px] flex items-center gap-2">
              <AlertCircle size={15} /> {error}
            </div>
          )}
          <div className="flex justify-end gap-[10px] mt-[14px]">
            <SecondaryButton label="Cancel" onClick={() => { setAdding(false); setQuestion(''); setAnswer(''); setError('') }} />
            <PrimaryButton label="Add FAQ" onClick={handleAdd} />
          </div>
        </div>
      )}

      <div className="flex flex-col gap-2">
        {faqs.length === 0 ? (
          <div className="p-10 text-center text-ink-muted text-sm bg-surface-subtle rounded-[14px]">
            No FAQs yet. Add your first one above.
          </div>
        ) : faqs.map((faq) => {
          const isOpen = expanded === faq.id
          return (
            <div key={faq.id} className="bg-surface-subtle border border-line-light rounded-xl overflow-hidden">
              <button onClick={() => setExpanded(isOpen ? null : faq.id)}
                className="w-full py-4 px-[18px] flex justify-between items-center gap-3 bg-transparent border-none text-left cursor-pointer">
                <span className="text-sm font-semibold text-ink-primary flex-1">{faq.question}</span>
                <div className="flex items-center gap-2">
                  <button onClick={(e) => { e.stopPropagation(); handleDelete(faq.id) }}
                    className="w-[30px] h-[30px] rounded-lg border-none bg-transparent text-danger cursor-pointer flex items-center justify-center hover:bg-danger-light transition-colors">
                    <Trash2 size={14} />
                  </button>
                  <ChevronDown size={18} className={`text-ink-muted transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
                </div>
              </button>
              {isOpen && (
                <div className="px-[18px] pb-4 pt-[14px] text-[13px] text-ink-secondary leading-[1.65] border-t border-line-light">
                  {faq.answer}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default FaqSection

import { useState } from 'react'
import { X, Plus, CheckCircle2, Trash2, Calendar, CircleDashed } from 'lucide-react'
import { colors } from '@/utils/colors'
import { PillInput, FieldWithLabel, PrimaryButton, DangerButton } from '@/components/common'
import type { Subscription } from '@/types'

interface SubscriptionFormModalProps {
  mode: 'create' | 'edit'
  initialData?: Subscription
  onCancel: () => void
  onSubmit: (data: Omit<Subscription, 'id' | 'status'>) => void
}

const SubscriptionFormModal = ({ mode, initialData, onCancel, onSubmit }: SubscriptionFormModalProps) => {
  const [planName, setPlanName] = useState(initialData?.planName ?? 'Premium')
  const [price, setPrice] = useState(initialData?.price ?? '$30.00')
  const [duration, setDuration] = useState(initialData?.duration ?? '30 days')
  const [features, setFeatures] = useState<string[]>(
    initialData?.features ?? ['Up to 25 active users', 'Advanced analytics dashboard'],
  )
  const [newFeature, setNewFeature] = useState('')

  const isEdit = mode === 'edit'

  const handleAddFeature = () => {
    const trimmed = newFeature.trim()
    if (!trimmed) return
    setFeatures([...features, trimmed])
    setNewFeature('')
  }

  const handleRemoveFeature = (idx: number) => {
    setFeatures(features.filter((_, i) => i !== idx))
  }

  const handleSubmit = () => {
    if (!planName.trim()) return
    onSubmit({ planName, price, duration, features })
  }

  return (
    <>
      <div onClick={onCancel} className="fixed inset-0 bg-[rgba(15,23,42,0.45)] backdrop-blur-sm z-[100] animate-[fadeIn_0.2s_ease]" />
      <div className="fixed inset-0 z-[101] flex items-center justify-center p-5 pointer-events-none">
        <div className="bg-surface rounded-[20px] w-full max-w-[540px] max-h-[92vh] flex flex-col pointer-events-auto shadow-modal animate-[modalSlide_0.25s_ease]">
          <div className="py-[22px] px-7 flex justify-between items-center shrink-0">
            <h2 className="text-xl font-bold text-ink-primary m-0">
              {isEdit ? 'Edit Plan' : 'Create New'}
            </h2>
            <button onClick={onCancel} className="w-9 h-9 rounded-lg border-none bg-transparent cursor-pointer flex items-center justify-center text-ink-secondary hover:bg-surface-input transition-colors">
              <X size={20} />
            </button>
          </div>

          <div className="flex-1 overflow-auto px-7 pb-5">
            <FieldWithLabel label="Plan Name">
              <PillInput value={planName} onChange={setPlanName} placeholder="e.g. Premium" />
            </FieldWithLabel>

            <div className="grid grid-cols-2 gap-[14px] mb-5">
              <FieldWithLabel label="Price">
                <PillInput value={price} onChange={setPrice} placeholder="$0.00" />
              </FieldWithLabel>
              <FieldWithLabel label="Duration">
                <PillInput value={duration} onChange={setDuration} placeholder="30 days" iconRight={Calendar} />
              </FieldWithLabel>
            </div>

            <div className="mb-4">
              <div className="flex justify-between items-center mb-[10px]">
                <label className="text-[13px] font-bold text-ink-primary">Features & Limits</label>
                <button
                  onClick={() => document.getElementById('new-feature-input')?.focus()}
                  className="inline-flex items-center gap-1 bg-transparent border-none text-primary text-[13px] font-semibold cursor-pointer"
                >
                  <Plus size={14} /> Add Feature
                </button>
              </div>

              <div className="flex flex-col gap-[10px]">
                {features.map((f, i) => (
                  <div key={i} className="flex items-center gap-[10px]">
                    <div className="flex-1 h-[46px] rounded-pill bg-surface-input flex items-center px-5 gap-3">
                      <CheckCircle2 size={16} color={colors.primary} className="shrink-0" />
                      <span className="text-sm text-ink-primary flex-1">{f}</span>
                    </div>
                    <button
                      onClick={() => handleRemoveFeature(i)}
                      className="w-9 h-9 rounded-lg border-none bg-transparent text-danger cursor-pointer flex items-center justify-center shrink-0 hover:bg-danger-light transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}

                <div className="relative h-[46px] rounded-pill bg-surface-input flex items-center">
                  <CircleDashed size={16} className="absolute left-[18px] text-ink-muted pointer-events-none" />
                  <input
                    id="new-feature-input"
                    value={newFeature}
                    onChange={(e) => setNewFeature(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAddFeature()}
                    placeholder="Add another perk..."
                    className="w-full h-full border-none outline-none bg-transparent pl-11 pr-[18px] text-sm text-ink-primary rounded-pill"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="py-[18px] px-7 border-t border-line-light flex gap-[10px] justify-end shrink-0">
            <DangerButton label="Cancel" onClick={onCancel} />
            <PrimaryButton label={isEdit ? 'Update' : 'Create'} onClick={handleSubmit} />
          </div>
        </div>
      </div>
    </>
  )
}

export default SubscriptionFormModal

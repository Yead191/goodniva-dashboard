import { X, CheckCircle2, Calendar } from 'lucide-react'
import { colors } from '@/utils/colors'
import { PrimaryButton } from '@/components/common'
import type { Subscription } from '@/types'

interface SubscriptionDetailsModalProps {
  sub: Subscription
  onClose: () => void
}

const SubscriptionDetailsModal = ({ sub, onClose }: SubscriptionDetailsModalProps) => (
  <>
    <div onClick={onClose} className="fixed inset-0 bg-[rgba(15,23,42,0.45)] backdrop-blur-sm z-[100] animate-[fadeIn_0.2s_ease]" />
    <div className="fixed inset-0 z-[101] flex items-center justify-center p-5 pointer-events-none">
      <div className="bg-surface rounded-[20px] w-full max-w-[540px] max-h-[92vh] flex flex-col pointer-events-auto shadow-modal animate-[modalSlide_0.25s_ease]">
        <div className="py-[22px] px-7 flex justify-between items-center shrink-0">
          <h2 className="text-xl font-bold text-ink-primary m-0">Plan Details</h2>
          <button onClick={onClose} className="w-9 h-9 rounded-lg border-none bg-transparent cursor-pointer flex items-center justify-center text-ink-secondary hover:bg-surface-input transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-auto px-7 pb-5">
          <ReadonlyField label="Plan Name"><ReadonlyValue>{sub.planName}</ReadonlyValue></ReadonlyField>
          <div className="grid grid-cols-2 gap-[14px] mb-5">
            <ReadonlyField label="Price"><ReadonlyValue>{sub.price}</ReadonlyValue></ReadonlyField>
            <ReadonlyField label="Duration"><ReadonlyValue iconRight>{sub.duration}</ReadonlyValue></ReadonlyField>
          </div>

          <div className="mb-4">
            <label className="block text-[13px] font-bold text-ink-primary mb-[10px]">Features & Limits</label>
            <div className="flex flex-col gap-[10px]">
              {sub.features.map((f, i) => (
                <div key={i} className="h-[46px] rounded-pill bg-surface-input flex items-center px-5 gap-3">
                  <CheckCircle2 size={16} color={colors.primary} className="shrink-0" />
                  <span className="text-sm text-ink-primary flex-1">{f}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="py-[18px] px-7 border-t border-line-light flex gap-[10px] justify-end shrink-0">
          <PrimaryButton label="Close" onClick={onClose} />
        </div>
      </div>
    </div>
  </>
)

const ReadonlyField = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div className="mb-4">
    <label className="block text-[13px] font-semibold text-ink-primary mb-[6px]">{label}</label>
    {children}
  </div>
)

const ReadonlyValue = ({ children, iconRight }: { children: React.ReactNode; iconRight?: boolean }) => (
  <div className={`relative h-[46px] rounded-pill bg-surface-input flex items-center ${iconRight ? 'pl-5 pr-11' : 'px-5'}`}>
    <span className="text-sm text-ink-primary font-medium">{children}</span>
    {iconRight && (
      <div className="absolute right-[18px] text-ink-muted flex">
        <Calendar size={16} />
      </div>
    )}
  </div>
)

export default SubscriptionDetailsModal

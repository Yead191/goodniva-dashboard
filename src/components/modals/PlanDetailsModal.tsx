import { X, CheckCircle2, MapPin, Calendar, type LucideIcon } from 'lucide-react'
import { colors } from '@/utils/colors'
import { Badge, PrimaryButton } from '@/components/common'
import { getStatusStyle } from '@/utils/statusStyles'
import type { Plan } from '@/types'

const PlanDetailsModal = ({ plan, onClose }: { plan: Plan; onClose: () => void }) => {
  const status = getStatusStyle(plan.status)
  return (
    <>
      <div onClick={onClose} className="fixed inset-0 bg-[rgba(15,23,42,0.45)] backdrop-blur-sm z-[100] animate-[fadeIn_0.2s_ease]" />
      <div className="fixed inset-0 z-[101] flex items-center justify-center p-5 pointer-events-none">
        <div className="bg-surface rounded-[20px] w-full max-w-[580px] max-h-[92vh] flex flex-col pointer-events-auto shadow-modal animate-[modalSlide_0.25s_ease]">
          <div className="py-[22px] px-7 flex justify-between items-start shrink-0">
            <h2 className="text-xl font-bold text-ink-primary m-0">Plan Details</h2>
            <button onClick={onClose} className="w-9 h-9 rounded-lg border-none bg-transparent cursor-pointer flex items-center justify-center text-ink-secondary hover:bg-surface-input transition-colors">
              <X size={20} />
            </button>
          </div>

          <div className="flex-1 overflow-auto px-7 pb-5">
            <img src={plan.avatar} alt={plan.name} className="w-full h-[180px] rounded-[14px] object-cover mb-4" />

            <div className="flex gap-2 mb-3">
              <Badge text={plan.category} bg={colors.primaryLight} color={colors.primary} />
              <Badge text={plan.status} bg={status.bg} color={status.text} />
            </div>

            <h3 className="text-[22px] font-bold text-ink-primary m-0 mb-4">{plan.name}</h3>

            <div className="bg-surface-subtle border border-line-light rounded-[14px] p-4 mb-4">
              <div className="text-[11px] font-bold text-ink-secondary tracking-[0.6px] mb-[10px]">HOST</div>
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
            </div>

            <div className="bg-surface-subtle border border-line-light rounded-[14px] py-3 px-[18px] mb-4">
              <DetailRow Icon={Calendar} label="Date" value={plan.date} />
              {plan.location && <DetailRow Icon={MapPin} label="Location" value={plan.location} last />}
            </div>

            {plan.description && (
              <div>
                <div className="text-[11px] font-bold text-ink-secondary tracking-[0.6px] mb-2">ABOUT</div>
                <p className="text-sm text-ink-secondary m-0 leading-relaxed">{plan.description}</p>
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
}

const DetailRow = ({ Icon, label, value, last }: { Icon: LucideIcon; label: string; value: string; last?: boolean }) => (
  <div className={`flex items-center gap-[10px] py-[10px] ${last ? '' : 'border-b border-line-light'}`}>
    <Icon size={15} color={colors.textMuted} />
    <span className="text-[13px] text-ink-secondary flex-1">{label}</span>
    <span className="text-sm font-semibold text-ink-primary">{value}</span>
  </div>
)

export default PlanDetailsModal

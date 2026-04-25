import { useState } from 'react'
import { Eye, Ban } from 'lucide-react'
import PageHeader from '@/components/layout/PageHeader'
import { Card, Badge, IconButton } from '@/components/common'
import PlanDetailsModal from '@/components/modals/PlanDetailsModal'
import ConfirmDialog from '@/components/modals/ConfirmDialog'
import { plansSeed } from '@/data/plans'
import { useToast } from '@/context/ToastContext'
import { colors } from '@/utils/colors'
import { getStatusStyle } from '@/utils/statusStyles'
import type { Plan } from '@/types'

const PlansPage = () => {
  const [plans, setPlans] = useState<Plan[]>(plansSeed)
  const [selected, setSelected] = useState<Plan | null>(null)
  const [confirming, setConfirming] = useState<Plan | null>(null)
  const { showToast } = useToast()

  const handleBlock = () => {
    if (!confirming) return
    setPlans((prev) => prev.map((p) => (p.id === confirming.id ? { ...p, status: 'Cancelled' } : p)))
    showToast(`"${confirming.name}" has been blocked`, 'danger')
    setConfirming(null)
  }

  return (
    <div className="py-7 px-8">
      <PageHeader title="Plans Management" subtitle="Oversee all scheduled meetups on the platform" />

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-surface-subtle">
                {['PLAN', 'HOST', 'CATEGORY', 'PARTICIPANTS', 'DATE', 'STATUS', 'ACTIONS'].map((h) => (
                  <th key={h} className="text-left py-[14px] px-4 text-[11px] font-bold text-ink-secondary tracking-[0.6px]">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {plans.map((plan) => (
                <PlanRow key={plan.id} plan={plan}
                  onView={() => setSelected(plan)}
                  onBlock={() => setConfirming(plan)} />
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {selected && <PlanDetailsModal plan={selected} onClose={() => setSelected(null)} />}
      {confirming && (
        <ConfirmDialog action="block" userName={confirming.name}
          onCancel={() => setConfirming(null)} onConfirm={handleBlock} />
      )}
    </div>
  )
}

const PlanRow = ({ plan, onView, onBlock }: { plan: Plan; onView: () => void; onBlock: () => void }) => {
  const status = getStatusStyle(plan.status)
  return (
    <tr className="hover:bg-surface-subtle transition-colors duration-150">
      <td className="py-[14px] px-4 border-b border-line-light">
        <div className="flex items-center gap-3">
          <img src={plan.avatar} alt="" className="w-10 h-10 rounded-[10px] object-cover" />
          <div className="min-w-0">
            <div className="text-sm font-semibold text-ink-primary">{plan.name}</div>
            {plan.flagged && (
              <div className="mt-[3px]">
                <Badge text="• Flagged" bg={colors.dangerLight} color={colors.dangerText} />
              </div>
            )}
          </div>
        </div>
      </td>
      <td className="py-[14px] px-4 border-b border-line-light">
        <div className="flex items-center gap-2">
          <img src={plan.host.avatar} alt="" className="w-7 h-7 rounded-full" />
          <span className="text-[13px] text-ink-primary">{plan.host.name}</span>
        </div>
      </td>
      <td className="py-[14px] px-4 border-b border-line-light">
        <Badge text={plan.category} bg={colors.primaryLight} color={colors.primary} />
      </td>
      <td className="py-[14px] px-4 border-b border-line-light">
        <RosterStack participants={plan.participants} />
      </td>
      <td className="py-[14px] px-4 border-b border-line-light text-[13px] text-ink-secondary">{plan.date}</td>
      <td className="py-[14px] px-4 border-b border-line-light">
        <Badge text={plan.status} bg={status.bg} color={status.text} />
      </td>
      <td className="py-[14px] px-4 border-b border-line-light">
        <div className="flex gap-1">
          <IconButton Icon={Eye} tooltip="View" onClick={onView} />
          <IconButton Icon={Ban} tooltip="Block" danger onClick={onBlock} />
        </div>
      </td>
    </tr>
  )
}

const RosterStack = ({ participants }: { participants: Plan['participants'] }) => (
  <div className="flex items-center gap-2">
    <div className="flex">
      {participants.avatars.slice(0, 3).map((a, i) => (
        <img
          key={i}
          src={a}
          alt=""
          className="w-[26px] h-[26px] rounded-full border-2 border-surface object-cover"
          style={{ marginLeft: i > 0 ? -8 : 0 }}
        />
      ))}
    </div>
    <span className="text-xs font-bold text-ink-secondary">
      {participants.joined}/{participants.total} JOINED
    </span>
  </div>
)

export default PlansPage

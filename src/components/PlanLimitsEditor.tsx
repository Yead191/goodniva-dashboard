import { Infinity as InfinityIcon } from 'lucide-react'
import { Toggle, FieldWithLabel, PillInput } from '@/components/common'
import type { PlanLimits } from '@/types'
import { UNLIMITED } from '@/types'

interface PlanLimitsEditorProps {
  value: PlanLimits
  onChange: (next: PlanLimits) => void
  canEdit?: boolean
}

/** Premium "creation" extras — gate who can create plans, groups, competitions, etc. */
const CREATION_BOOLS: { key: keyof PlanLimits; label: string; description: string }[] = [
  { key: 'canCreatePlans', label: 'Create plans', description: 'Allow creating new plans.' },
  { key: 'canCreateGroups', label: 'Create groups', description: 'Allow creating new groups.' },
  { key: 'canCreateCompetitions', label: 'Create competitions', description: 'Allow creating new competitions.' },
  { key: 'canCreateCommunities', label: 'Create communities', description: 'Allow creating new communities.' },
]

const BOOLS: { key: keyof PlanLimits; label: string; description: string }[] = [
  { key: 'priorityPlacement', label: 'Priority placement', description: 'Boost this plan’s members higher in discovery.' },
  { key: 'advancedFilters', label: 'Advanced filters & search', description: 'Unlock the full set of discovery filters.' },
  { key: 'seeWhoViewed', label: 'See who viewed your plans', description: 'Show the list of profiles that viewed a plan.' },
  { key: 'adFree', label: 'Ad-free experience', description: 'Suppress native ads for these members.' },
  { key: 'prioritySupport', label: 'Priority support', description: 'Route support tickets to the priority queue.' },
]

/**
 * Edits the machine-readable entitlements for a plan (or the free trial).
 * Numeric caps support an "Unlimited" toggle that maps to -1.
 */
const PlanLimitsEditor = ({ value, onChange, canEdit = true }: PlanLimitsEditorProps) => {
  const set = <K extends keyof PlanLimits>(k: K, v: PlanLimits[K]) => onChange({ ...value, [k]: v })

  const NumericLimit = ({ k, label, hint }: { k: 'weeklyPlanJoins' | 'monthlyPlansHosted'; label: string; hint: string }) => {
    const unlimited = value[k] === UNLIMITED
    return (
      <FieldWithLabel label={label}>
        <div className="flex items-center gap-2">
          <div className="flex-1">
            <PillInput
              value={unlimited ? '' : String(value[k])}
              onChange={(v) => canEdit && set(k, Number(v.replace(/[^0-9]/g, '')) || 0)}
              placeholder={unlimited ? 'Unlimited' : hint}
            />
          </div>
          <button
            type="button"
            disabled={!canEdit}
            onClick={() => canEdit && set(k, unlimited ? 0 : UNLIMITED)}
            className={`h-[46px] px-4 rounded-pill text-[13px] font-semibold border-2 inline-flex items-center gap-1 transition-colors shrink-0 ${
              unlimited ? 'border-primary bg-primary-light text-primary' : 'border-line bg-surface text-ink-secondary'
            } ${canEdit ? 'cursor-pointer' : 'cursor-not-allowed opacity-60'}`}
          >
            <InfinityIcon size={15} /> Unlimited
          </button>
        </div>
      </FieldWithLabel>
    )
  }

  return (
    <div>
      <div className="grid grid-cols-2 gap-[14px]">
        <NumericLimit k="weeklyPlanJoins" label="Plan joins per week" hint="3" />
        <NumericLimit k="monthlyPlansHosted" label="Plans hosted per month" hint="0 = none" />
      </div>

      <div className="mt-3 mb-1 text-[11px] font-bold text-ink-muted tracking-[0.6px] uppercase">Creation permissions (premium extras)</div>
      <div className="rounded-2xl bg-surface-input px-4">
        {CREATION_BOOLS.map((b) => (
          <Toggle
            key={b.key}
            canEdit={canEdit}
            checked={value[b.key] as boolean}
            onChange={(v) => set(b.key, v)}
            label={b.label}
            description={b.description}
          />
        ))}
      </div>

      <div className="mt-3 mb-1 text-[11px] font-bold text-ink-muted tracking-[0.6px] uppercase">Other entitlements</div>
      <div className="rounded-2xl bg-surface-input px-4">
        {BOOLS.map((b) => (
          <Toggle
            key={b.key}
            canEdit={canEdit}
            checked={value[b.key] as boolean}
            onChange={(v) => set(b.key, v)}
            label={b.label}
            description={b.description}
          />
        ))}
      </div>
    </div>
  )
}

export default PlanLimitsEditor

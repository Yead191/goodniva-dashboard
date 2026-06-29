import { useState } from 'react'
import { Card, FieldWithLabel, PillInput, SelectPill, PrimaryButton, Toggle, MoneyInput } from '@/components/common'
import PlanLimitsEditor from '@/components/PlanLimitsEditor'
import { useMonetisation } from '@/context/MonetisationContext'
import { useToast } from '@/context/ToastContext'
import { SectionTitle, currencySymbol } from '../_shared'
import type { PricingConfig } from '@/types/monetisation'
import type { PlanLimits } from '@/types'

const numeric = (v: string) => v.replace(/[^0-9.]/g, '')

const PricingSection = () => {
  const { pricing, setPricing, audit, canEdit } = useMonetisation()
  const { showToast } = useToast()
  const [draft, setDraft] = useState<PricingConfig>(pricing)

  const set = <K extends keyof PricingConfig>(key: K, value: PricingConfig[K]) =>
    setDraft((d) => ({ ...d, [key]: value }))

  const dirty = JSON.stringify(draft) !== JSON.stringify(pricing)

  const handleSave = () => {
    if (!canEdit) return
    const changes: string[] = []
    if (draft.amount !== pricing.amount) changes.push(`monthly ${currencySymbol(pricing.currency)}${pricing.amount} → ${currencySymbol(draft.currency)}${draft.amount}`)
    if (draft.annualAmount !== pricing.annualAmount) changes.push(`annual ${currencySymbol(pricing.currency)}${pricing.annualAmount} → ${currencySymbol(draft.currency)}${draft.annualAmount}`)
    if (draft.currency !== pricing.currency) changes.push(`currency ${pricing.currency} → ${draft.currency}`)
    if (draft.billingPeriod !== pricing.billingPeriod) changes.push(`billing ${pricing.billingPeriod} → ${draft.billingPeriod}`)
    if (draft.trialEnabled !== pricing.trialEnabled) changes.push(`trial ${draft.trialEnabled ? 'enabled' : 'disabled'}`)
    if (draft.trialLengthDays !== pricing.trialLengthDays) changes.push(`trial length ${pricing.trialLengthDays}d → ${draft.trialLengthDays}d`)
    if (JSON.stringify(draft.trialLimits) !== JSON.stringify(pricing.trialLimits)) changes.push('trial limits updated')
    if (draft.savingsNudgeThreshold !== pricing.savingsNudgeThreshold) changes.push(`savings nudge ${pricing.savingsNudgeThreshold} → ${draft.savingsNudgeThreshold}`)
    if (draft.displayText !== pricing.displayText) changes.push('display text updated')

    setPricing(draft)
    audit('Subscription Pricing', 'Updated pricing config', changes.length ? changes.join('; ') : 'No field changes')
    showToast('Subscription pricing updated', 'success')
  }

  const sym = currencySymbol(draft.currency)

  return (
    <div>
      <SectionTitle title="Subscription Pricing" subtitle="Edit the GoodNiva Plus price display and configuration. Changes are audit-logged and take effect without an app release." />

      <Card>
        <h3 className="text-base font-bold text-ink-primary m-0 mb-4">Price &amp; billing</h3>
        <div className="grid grid-cols-3 gap-[14px]">
          <FieldWithLabel label="Monthly amount">
            <MoneyInput value={draft.amount} onChange={(v) => set('amount', v)} placeholder="9.99" />
          </FieldWithLabel>
          <FieldWithLabel label="Annual amount">
            <MoneyInput value={draft.annualAmount} onChange={(v) => set('annualAmount', v)} placeholder="99.99" />
          </FieldWithLabel>
          <FieldWithLabel label="Currency">
            <SelectPill value={draft.currency} onChange={(v) => set('currency', v as PricingConfig['currency'])} options={['GBP', 'USD', 'EUR']} />
          </FieldWithLabel>
        </div>
        <div className="grid grid-cols-3 gap-[14px]">
          <FieldWithLabel label="Default billing period">
            <SelectPill value={draft.billingPeriod} onChange={(v) => set('billingPeriod', v as PricingConfig['billingPeriod'])} options={['Monthly', 'Annual']} />
          </FieldWithLabel>
          <FieldWithLabel label="Plus savings nudge threshold (£ saved)">
            <PillInput value={String(draft.savingsNudgeThreshold)} onChange={(v) => set('savingsNudgeThreshold', Number(numeric(v)) || 0)} placeholder="20" />
          </FieldWithLabel>
          <div className="flex items-end pb-[14px]">
            <div className="text-[13px] text-ink-secondary">
              Display: <span className="font-bold text-ink-primary">{sym}{draft.amount}/mo</span> · <span className="font-bold text-ink-primary">{sym}{draft.annualAmount}/yr</span>
            </div>
          </div>
        </div>
      </Card>

      <div className="mt-5">
        <Card>
          <h3 className="text-base font-bold text-ink-primary m-0 mb-2">Free trial</h3>
          <Toggle
            canEdit={canEdit}
            checked={draft.trialEnabled}
            onChange={(v) => set('trialEnabled', v)}
            label="Enable free trial"
            description="Offer new users a time-limited free trial before billing starts. The trial has its own limits below — it does not unlock full GoodNiva Plus."
          />
          <div className="mt-4 max-w-[260px]">
            <FieldWithLabel label="Trial length (days)">
              <PillInput value={String(draft.trialLengthDays)} onChange={(v) => set('trialLengthDays', Number(v.replace(/[^0-9]/g, '')) || 0)} placeholder="7" />
            </FieldWithLabel>
          </div>

          <div className={`mt-4 pt-4 border-t border-line-light ${draft.trialEnabled ? '' : 'opacity-50 pointer-events-none'}`}>
            <label className="block text-[13px] font-bold text-ink-primary mb-[2px]">Trial limits &amp; entitlements</label>
            <p className="text-xs text-ink-muted mt-0 mb-3">Decide exactly what free trial users can do — including premium extras like creating groups, competitions and communities. Anything left off stays exclusive to paid GoodNiva Plus members.</p>
            <PlanLimitsEditor
              value={draft.trialLimits}
              onChange={(v: PlanLimits) => set('trialLimits', v)}
              canEdit={canEdit && draft.trialEnabled}
            />
          </div>
        </Card>
      </div>

      <div className="mt-5">
        <Card>
          <h3 className="text-base font-bold text-ink-primary m-0 mb-3">Display text</h3>
          <textarea
            value={draft.displayText}
            onChange={(e) => set('displayText', e.target.value)}
            disabled={!canEdit}
            rows={3}
            className="w-full rounded-2xl border-2 border-transparent bg-surface-input p-4 text-sm text-ink-primary outline-none focus:border-primary focus:bg-surface resize-none disabled:opacity-60"
            placeholder="Paywall headline shown to users…"
          />
        </Card>
      </div>

      <div className="flex justify-end mt-5">
        <PrimaryButton label="Save Pricing" onClick={handleSave} disabled={!canEdit || !dirty} />
      </div>
    </div>
  )
}

export default PricingSection

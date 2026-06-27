import { useState } from 'react'
import { X, Plus, Gift } from 'lucide-react'
import { Card, Toggle, FieldWithLabel, PillInput, SelectPill, PrimaryButton, Badge } from '@/components/common'
import { colors } from '@/utils/colors'
import { useMonetisation } from '@/context/MonetisationContext'
import { useToast } from '@/context/ToastContext'
import { SectionTitle } from '../_shared'
import type { RewardedAdsConfig } from '@/types/monetisation'

const RewardedAdsSection = () => {
  const { rewarded, setRewarded, audit, canEdit } = useMonetisation()
  const { showToast } = useToast()
  const [newReward, setNewReward] = useState('')

  const set = <K extends keyof RewardedAdsConfig>(k: K, v: RewardedAdsConfig[K], label: string, detail: string) => {
    setRewarded((r) => ({ ...r, [k]: v }))
    audit('Rewarded Ads', label, detail)
  }

  const addReward = () => {
    const r = newReward.trim()
    if (!r || !canEdit) return
    setRewarded((prev) => ({ ...prev, allowedRewards: [...prev.allowedRewards, r] }))
    audit('Rewarded Ads', 'Added allowed reward', r)
    setNewReward('')
  }

  const removeReward = (r: string) => {
    setRewarded((prev) => ({ ...prev, allowedRewards: prev.allowedRewards.filter((x) => x !== r) }))
    audit('Rewarded Ads', 'Removed allowed reward', r)
  }

  return (
    <div>
      <SectionTitle title="Rewarded Ads" subtitle="Future feature — configure rewards, daily caps and provider settings ahead of launch." />

      {!rewarded.enabled && (
        <div className="mb-5 flex items-center gap-3 p-4 rounded-2xl border border-line-light bg-surface-subtle">
          <Gift size={18} className="text-ink-muted shrink-0" />
          <span className="text-[13px] text-ink-secondary">Rewarded ads are currently <strong>disabled</strong>. Configure the settings below and enable when ready to launch.</span>
        </div>
      )}

      <Card>
        <Toggle
          canEdit={canEdit}
          checked={rewarded.enabled}
          onChange={(v) => { set('enabled', v, `${v ? 'Enabled' : 'Disabled'} rewarded ads`, `Rewarded ads turned ${v ? 'ON' : 'OFF'}`); showToast(`Rewarded ads ${v ? 'enabled' : 'disabled'}`, v ? 'success' : 'warning') }}
          label="Enable rewarded ads"
          description="Allow users to watch a rewarded ad in exchange for credits."
        />
        <div className="grid grid-cols-2 gap-[14px] mt-4">
          <FieldWithLabel label="Provider">
            <SelectPill value={rewarded.provider} onChange={(v) => set('provider', v as RewardedAdsConfig['provider'], 'Changed provider', `Provider → ${v}`)} options={['AdMob', 'AppLovin', 'Unity Ads']} />
          </FieldWithLabel>
          <FieldWithLabel label="Daily cap (per user)">
            <PillInput value={String(rewarded.dailyCap)} onChange={(v) => set('dailyCap', Number(v.replace(/[^0-9]/g, '')) || 0, 'Changed daily cap', `Daily cap → ${v}`)} placeholder="5" />
          </FieldWithLabel>
        </div>
      </Card>

      <div className="mt-5">
        <Card>
          <h3 className="text-base font-bold text-ink-primary m-0 mb-3">Allowed rewards</h3>
          <div className="flex flex-wrap gap-2 mb-4">
            {rewarded.allowedRewards.length === 0 && <span className="text-[13px] text-ink-muted">No rewards configured yet.</span>}
            {rewarded.allowedRewards.map((r) => (
              <span key={r} className="inline-flex items-center gap-2 py-[6px] px-3 rounded-pill text-[13px] font-semibold" style={{ background: colors.primaryLight, color: colors.primary }}>
                {r}
                {canEdit && <button onClick={() => removeReward(r)} className="bg-transparent border-none cursor-pointer text-primary flex p-0"><X size={14} /></button>}
              </span>
            ))}
          </div>
          {canEdit && (
            <div className="flex gap-[10px] items-end max-w-[480px]">
              <div className="flex-1"><FieldWithLabel label="Add reward"><PillInput value={newReward} onChange={setNewReward} placeholder="e.g. Access credit" /></FieldWithLabel></div>
              <div className="pb-[14px]"><PrimaryButton Icon={Plus} label="Add" onClick={addReward} /></div>
            </div>
          )}
        </Card>
      </div>

      <div className="mt-4">
        <Badge text="Reporting level: configuration only — no live traffic" bg={colors.bgInput} color={colors.textSecondary} />
      </div>
    </div>
  )
}

export default RewardedAdsSection

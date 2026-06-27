import { useState } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import { Card, Badge, Toggle, IconButton, FieldWithLabel, PillInput, SelectPill, PrimaryButton } from '@/components/common'
import { colors } from '@/utils/colors'
import { useMonetisation } from '@/context/MonetisationContext'
import { useToast } from '@/context/ToastContext'
import { SectionTitle, DataTable, Td } from '../_shared'
import type { AdsConfig, AdUnit, Platform } from '@/types/monetisation'

const AdsSection = () => {
  const { ads, setAds, audit, canEdit } = useMonetisation()
  const { showToast } = useToast()
  const [draftIds, setDraftIds] = useState<Record<number, string>>({})
  const [adding, setAdding] = useState<{ platform: Platform; placement: string }>({ platform: 'iOS', placement: '' })

  const toggle = (key: keyof AdsConfig, label: string) => (v: boolean) => {
    setAds((a) => ({ ...a, [key]: v }))
    audit('Native Ads / AdMob', `${v ? 'Enabled' : 'Disabled'} ${label}`, `${label} turned ${v ? 'ON' : 'OFF'}`)
  }

  const commitAdUnitId = (unit: AdUnit) => {
    const next = draftIds[unit.id]
    if (next === undefined || next === unit.adUnitId) return
    setAds((a) => ({ ...a, adUnits: a.adUnits.map((u) => (u.id === unit.id ? { ...u, adUnitId: next } : u)) }))
    audit('Native Ads / AdMob', 'Updated ad unit ID', `${unit.platform} · ${unit.placement} → ${next}`)
    showToast(`${unit.platform} ${unit.placement} ad unit updated`, 'success')
  }

  const removeUnit = (unit: AdUnit) => {
    setAds((a) => ({ ...a, adUnits: a.adUnits.filter((u) => u.id !== unit.id) }))
    audit('Native Ads / AdMob', 'Removed ad unit', `${unit.platform} · ${unit.placement}`)
  }

  const addUnit = () => {
    if (!adding.placement.trim()) return
    const unit: AdUnit = { id: Date.now(), platform: adding.platform, placement: adding.placement.trim(), adUnitId: '' }
    setAds((a) => ({ ...a, adUnits: [...a.adUnits, unit] }))
    audit('Native Ads / AdMob', 'Added ad unit placement', `${unit.platform} · ${unit.placement}`)
    setAdding({ platform: 'iOS', placement: '' })
    showToast('Ad unit placement added', 'success')
  }

  return (
    <div>
      <SectionTitle title="Native Ads / AdMob" subtitle="Manage native ad placements, AdMob state, ad unit IDs, mediation and first-session suppression." />

      <Card>
        <h3 className="text-base font-bold text-ink-primary m-0 mb-2">Ad delivery</h3>
        <Toggle canEdit={canEdit} checked={ads.nativeAdsEnabled} onChange={toggle('nativeAdsEnabled', 'native ads')} label="Enable native ads" description="Show native ad cards within the feed and plan details." />
        <Toggle canEdit={canEdit} checked={ads.admobFallbackEnabled} onChange={toggle('admobFallbackEnabled', 'AdMob fallback')} label="Enable AdMob fallback" description="Fall back to AdMob when no native/sponsored inventory is available." />
        <Toggle canEdit={canEdit} checked={ads.mediationEnabled} onChange={toggle('mediationEnabled', 'mediation')} label="Mediation enabled" description="Route AdMob requests through the mediation waterfall." />
        <Toggle canEdit={canEdit} checked={ads.firstSessionSuppression} onChange={toggle('firstSessionSuppression', 'first-session suppression')} label="First-session suppression" description="Hide all ads during a user's very first session." />
      </Card>

      <div className="mt-5">
        <Card>
          <h3 className="text-base font-bold text-ink-primary m-0 mb-4">Ad unit IDs by platform &amp; placement</h3>
          <DataTable headers={['PLATFORM', 'PLACEMENT', 'AD UNIT ID', '']}>
            {ads.adUnits.map((u) => (
              <tr key={u.id} className="hover:bg-surface-subtle transition-colors duration-150">
                <Td><Badge text={u.platform} bg={u.platform === 'iOS' ? colors.infoLight : colors.successLight} color={u.platform === 'iOS' ? colors.infoText : colors.successText} /></Td>
                <Td className="font-semibold">{u.placement}</Td>
                <Td>
                  <input
                    value={draftIds[u.id] ?? u.adUnitId}
                    disabled={!canEdit}
                    onChange={(e) => setDraftIds((d) => ({ ...d, [u.id]: e.target.value }))}
                    onBlur={() => commitAdUnitId(u)}
                    placeholder="ca-app-pub-…"
                    className="w-full max-w-[360px] h-[40px] rounded-pill border-2 border-transparent bg-surface-input px-4 text-[13px] font-mono text-ink-primary outline-none focus:border-primary focus:bg-surface disabled:opacity-60"
                  />
                </Td>
                <Td><IconButton Icon={Trash2} tooltip="Remove" danger onClick={() => canEdit && removeUnit(u)} /></Td>
              </tr>
            ))}
          </DataTable>

          {canEdit && (
            <div className="grid grid-cols-[140px_1fr_auto] gap-[14px] items-end mt-4 pt-4 border-t border-line-light">
              <FieldWithLabel label="Platform"><SelectPill value={adding.platform} onChange={(v) => setAdding((a) => ({ ...a, platform: v as Platform }))} options={['iOS', 'Android']} /></FieldWithLabel>
              <FieldWithLabel label="Placement"><PillInput value={adding.placement} onChange={(v) => setAdding((a) => ({ ...a, placement: v }))} placeholder="e.g. Search Results" /></FieldWithLabel>
              <PrimaryButton Icon={Plus} label="Add" onClick={addUnit} />
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}

export default AdsSection

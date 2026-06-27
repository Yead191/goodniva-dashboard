import { Check, Pause, Play, Ban } from 'lucide-react'
import { Card, Badge, Toggle, IconButton, FieldWithLabel, PillInput } from '@/components/common'
import { colors } from '@/utils/colors'
import { useMonetisation } from '@/context/MonetisationContext'
import { useToast } from '@/context/ToastContext'
import { SectionTitle, DataTable, Td, StatusPill } from '../_shared'
import type { CampaignsConfig, CampaignStatus } from '@/types/monetisation'

const CampaignsSection = () => {
  const { campaigns, setCampaigns, campaignsConfig, setCampaignsConfig, audit, canEdit } = useMonetisation()
  const { showToast } = useToast()

  const toggle = (key: keyof CampaignsConfig, label: string) => (v: boolean) => {
    setCampaignsConfig((c) => ({ ...c, [key]: v }))
    audit('Campaigns', `${v ? 'Enabled' : 'Disabled'} ${label}`, `${label} turned ${v ? 'ON' : 'OFF'}`)
  }

  const setNum = (key: keyof CampaignsConfig, label: string) => (v: string) => {
    const n = Number(v.replace(/[^0-9]/g, '')) || 0
    setCampaignsConfig((c) => ({ ...c, [key]: n }))
    audit('Campaigns', `Updated ${label}`, `${label} → ${n}`)
  }

  const updateStatus = (id: number, status: CampaignStatus, verb: string) => {
    const c = campaigns.find((x) => x.id === id)
    if (!c || !canEdit) return
    setCampaigns((prev) => prev.map((x) => (x.id === id ? { ...x, status } : x)))
    audit('Campaigns', `${verb} campaign`, c.name)
    showToast(`${c.name} ${verb.toLowerCase()}d`, status === 'Paused' ? 'warning' : status === 'Ended' ? 'danger' : 'success')
  }

  return (
    <div>
      <SectionTitle title="Campaigns" subtitle="Manage sponsored cards, partner venues, targeting, caps and dates." />

      <div className="grid grid-cols-2 gap-4 mb-5">
        <Card>
          <h3 className="text-base font-bold text-ink-primary m-0 mb-2">Sponsored cards &amp; venues</h3>
          <Toggle canEdit={canEdit} checked={campaignsConfig.vibeSponsoredCardsEnabled} onChange={toggle('vibeSponsoredCardsEnabled', 'Vibe sponsored cards')} label="Vibe sponsored cards" description="Show sponsored cards in the Vibe surface." />
          <Toggle canEdit={canEdit} checked={campaignsConfig.feedSponsoredCardsEnabled} onChange={toggle('feedSponsoredCardsEnabled', 'Feed sponsored cards')} label="Feed sponsored cards" description="Show sponsored cards in the main feed." />
          <Toggle canEdit={canEdit} checked={campaignsConfig.partnerVenueSuggestionsEnabled} onChange={toggle('partnerVenueSuggestionsEnabled', 'partner venue suggestions')} label="Partner venue suggestions" description="Suggest partner venues when creating plans." />
          <Toggle canEdit={canEdit} checked={campaignsConfig.competitionPartnerVenueEnabled} onChange={toggle('competitionPartnerVenueEnabled', 'competition partner venue suggestions')} label="Competition partner venue suggestions" description="Suggest partner venues for community competitions." />
        </Card>
        <Card>
          <h3 className="text-base font-bold text-ink-primary m-0 mb-4">Feed ad pacing</h3>
          <FieldWithLabel label="First ad position (card #)"><PillInput value={String(campaignsConfig.feedFirstAdPosition)} onChange={setNum('feedFirstAdPosition', 'first ad position')} placeholder="4" /></FieldWithLabel>
          <FieldWithLabel label="Repeat frequency (every N cards)"><PillInput value={String(campaignsConfig.feedRepeatFrequency)} onChange={setNum('feedRepeatFrequency', 'repeat frequency')} placeholder="8" /></FieldWithLabel>
          <FieldWithLabel label="Max ads per session"><PillInput value={String(campaignsConfig.feedMaxAdsPerSession)} onChange={setNum('feedMaxAdsPerSession', 'max ads per session')} placeholder="6" /></FieldWithLabel>
        </Card>
      </div>

      <Card>
        <h3 className="text-base font-bold text-ink-primary m-0 mb-4">Active &amp; scheduled campaigns</h3>
        <DataTable headers={['CAMPAIGN', 'PLACEMENT', 'TARGETING', 'DAILY CAP', 'DATES', 'STATUS', 'ACTIONS']}>
          {campaigns.map((c) => (
            <tr key={c.id} className="hover:bg-surface-subtle transition-colors duration-150">
              <Td><div className="font-semibold text-ink-primary">{c.name}</div><div className="text-xs text-ink-muted">{c.sponsor}</div></Td>
              <Td><Badge text={c.placement} bg={colors.primaryLight} color={colors.primary} /></Td>
              <Td className="text-ink-secondary">{c.targeting}</Td>
              <Td className="tabular-nums">{c.dailyCap.toLocaleString()}</Td>
              <Td className="text-ink-secondary whitespace-nowrap text-[13px]">{c.startDate}<br />→ {c.endDate}</Td>
              <Td><StatusPill status={c.status} /></Td>
              <Td>
                <div className="flex gap-1">
                  {c.status === 'Pending Approval' && <>
                    <IconButton Icon={Check} tooltip="Approve" onClick={() => updateStatus(c.id, 'Scheduled', 'Approve')} />
                    <IconButton Icon={Ban} tooltip="Reject" danger onClick={() => updateStatus(c.id, 'Ended', 'Reject')} />
                  </>}
                  {(c.status === 'Live' || c.status === 'Scheduled') && <IconButton Icon={Pause} tooltip="Pause" onClick={() => updateStatus(c.id, 'Paused', 'Pause')} />}
                  {c.status === 'Paused' && <IconButton Icon={Play} tooltip="Resume" onClick={() => updateStatus(c.id, 'Live', 'Resume')} />}
                  {c.status === 'Ended' && <span className="text-ink-muted text-[13px] px-2">—</span>}
                </div>
              </Td>
            </tr>
          ))}
        </DataTable>
      </Card>
    </div>
  )
}

export default CampaignsSection

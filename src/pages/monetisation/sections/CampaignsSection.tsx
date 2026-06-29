import { useState } from 'react'
import { Check, Pause, Play, Ban, Eye, X, Download, MousePointerClick, TrendingUp, MapPin, CalendarPlus, Users, Ticket } from 'lucide-react'
import { Card, Badge, Toggle, IconButton, PrimaryButton, SecondaryButton, FieldWithLabel, PillInput } from '@/components/common'
import { colors } from '@/utils/colors'
import { useMonetisation } from '@/context/MonetisationContext'
import { useToast } from '@/context/ToastContext'
import { downloadCsv } from '@/utils/download'
import { SectionTitle, DataTable, Td, StatusPill } from '../_shared'
import type { Campaign, CampaignsConfig, CampaignStatus } from '@/types/monetisation'

/** Flatten a campaign (incl. its metrics) into a single CSV row, paired with the header order below. */
const CAMPAIGN_CSV_HEADERS = [
  'Campaign', 'Sponsor', 'Package', 'Placement', 'Targeting', 'Daily Cap', 'Start Date', 'End Date', 'Status',
  'Impressions', 'Clicks', 'CTR %', 'Venue Selections', 'Plans Created', 'Users Joined', 'Offer Claims',
]

const campaignCsvRow = (c: Campaign): (string | number)[] => {
  const m = c.metrics
  const ctr = m.impressions ? ((m.clicks / m.impressions) * 100).toFixed(1) : '0.0'
  return [
    c.name, c.sponsor, c.package ?? '', c.placement, c.targeting, c.dailyCap, c.startDate, c.endDate, c.status,
    m.impressions, m.clicks, ctr, m.venueSelections, m.plansCreated, m.usersJoined, m.offerClaims,
  ]
}

/** Make a filesystem-friendly slug from a campaign name. */
const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'campaign'

const CampaignsSection = () => {
  const { campaigns, setCampaigns, campaignsConfig, setCampaignsConfig, audit, canEdit } = useMonetisation()
  const { showToast } = useToast()
  const [viewing, setViewing] = useState<Campaign | null>(null)

  const exportAll = () => {
    if (campaigns.length === 0) {
      showToast('No campaigns to export', 'warning')
      return
    }
    downloadCsv('campaigns-report.csv', CAMPAIGN_CSV_HEADERS, campaigns.map(campaignCsvRow))
    audit('Campaigns', 'Exported campaigns report', `${campaigns.length} campaigns exported (CSV)`)
    showToast('Campaigns report downloaded', 'success')
  }

  const exportOne = (c: Campaign) => {
    downloadCsv(`campaign-${slug(c.name)}.csv`, CAMPAIGN_CSV_HEADERS, [campaignCsvRow(c)])
    audit('Campaigns', 'Exported campaign report', c.name)
    showToast(`${c.name} report downloaded`, 'success')
  }

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
        <div className="flex items-center justify-between gap-3 mb-4">
          <h3 className="text-base font-bold text-ink-primary m-0">Active &amp; scheduled campaigns</h3>
          <SecondaryButton Icon={Download} label="Export Report" onClick={exportAll} />
        </div>
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
                  <IconButton Icon={Eye} tooltip="View performance" onClick={() => setViewing(c)} />
                  <IconButton Icon={Download} tooltip="Download report" onClick={() => exportOne(c)} />
                  {c.status === 'Pending Approval' && <>
                    <IconButton Icon={Check} tooltip="Approve" onClick={() => updateStatus(c.id, 'Scheduled', 'Approve')} />
                    <IconButton Icon={Ban} tooltip="Reject" danger onClick={() => updateStatus(c.id, 'Ended', 'Reject')} />
                  </>}
                  {(c.status === 'Live' || c.status === 'Scheduled') && <IconButton Icon={Pause} tooltip="Pause" onClick={() => updateStatus(c.id, 'Paused', 'Pause')} />}
                  {c.status === 'Paused' && <IconButton Icon={Play} tooltip="Resume" onClick={() => updateStatus(c.id, 'Live', 'Resume')} />}
                </div>
              </Td>
            </tr>
          ))}
        </DataTable>
      </Card>

      {viewing && <CampaignDetailModal campaign={viewing} onClose={() => setViewing(null)} onExport={() => exportOne(viewing)} />}
    </div>
  )
}

const fmt = (n: number) => n.toLocaleString()

const CampaignDetailModal = ({ campaign: c, onClose, onExport }: { campaign: Campaign; onClose: () => void; onExport: () => void }) => {
  const m = c.metrics
  const ctr = m.impressions ? ((m.clicks / m.impressions) * 100).toFixed(1) : '0.0'

  const stats = [
    { Icon: Eye, label: 'Impressions', value: fmt(m.impressions), hint: 'Users who discovered this sponsor' },
    { Icon: MousePointerClick, label: 'Clicks', value: fmt(m.clicks), hint: 'Taps on the sponsored card' },
    { Icon: TrendingUp, label: 'Click-through rate', value: `${ctr}%`, hint: 'Clicks ÷ impressions' },
    { Icon: MapPin, label: 'Venue selections', value: fmt(m.venueSelections), hint: 'Chose this venue for a plan' },
    { Icon: CalendarPlus, label: 'Plans created here', value: fmt(m.plansCreated), hint: 'Plans created at this venue' },
    { Icon: Users, label: 'Users joined plans', value: fmt(m.usersJoined), hint: 'Joined plans at this venue' },
    { Icon: Ticket, label: 'Offer claims', value: fmt(m.offerClaims), hint: 'Offers/promos claimed' },
  ]

  return (
    <>
      <div onClick={onClose} className="fixed inset-0 bg-[rgba(15,23,42,0.45)] backdrop-blur-sm z-[100]" />
      <div className="fixed inset-0 z-[101] flex items-center justify-center p-5 pointer-events-none">
        <div className="bg-surface rounded-[20px] w-full max-w-[600px] max-h-[92vh] flex flex-col pointer-events-auto shadow-modal animate-[modalSlide_0.25s_ease]">
          <div className="py-[22px] px-7 flex justify-between items-start shrink-0">
            <div>
              <h2 className="text-xl font-bold text-ink-primary m-0">{c.name}</h2>
              <div className="flex items-center gap-2 mt-1 flex-wrap">
                <span className="text-[13px] text-ink-secondary">{c.sponsor}</span>
                {c.package && <Badge text={c.package} bg={colors.primaryLight} color={colors.primary} />}
                <Badge text={c.placement} bg={colors.bgInput} color={colors.textSecondary} />
                <StatusPill status={c.status} />
              </div>
            </div>
            <button onClick={onClose} className="w-9 h-9 rounded-lg border-none bg-transparent cursor-pointer flex items-center justify-center text-ink-secondary hover:bg-surface-input transition-colors shrink-0"><X size={20} /></button>
          </div>

          <div className="flex-1 overflow-auto px-7 pb-6">
            <div className="text-[13px] text-ink-secondary mb-4">{c.targeting} · {c.startDate} → {c.endDate}</div>
            <h3 className="text-[11px] font-bold text-ink-secondary tracking-[0.6px] uppercase mb-3">Performance</h3>
            <div className="grid grid-cols-2 gap-3">
              {stats.map((s) => (
                <div key={s.label} className="rounded-2xl bg-surface-input p-4">
                  <div className="flex items-center gap-2 text-ink-muted mb-2"><s.Icon size={16} /><span className="text-[12px] font-semibold">{s.label}</span></div>
                  <div className="text-[22px] font-bold text-ink-primary tabular-nums leading-none">{s.value}</div>
                  <div className="text-[12px] text-ink-muted mt-1">{s.hint}</div>
                </div>
              ))}
            </div>
            {c.metrics.impressions === 0 && (
              <p className="text-[13px] text-ink-muted mt-4">No performance data yet — this campaign has not started delivering.</p>
            )}
          </div>

          <div className="py-[18px] px-7 border-t border-line-light flex gap-[10px] justify-end shrink-0">
            <SecondaryButton Icon={Download} label="Download Report" onClick={onExport} />
            <PrimaryButton label="Close" onClick={onClose} />
          </div>
        </div>
      </div>
    </>
  )
}

export default CampaignsSection

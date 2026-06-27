import { useMemo } from 'react'
import { Download, Crown, Zap, Megaphone, Tv } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { Card, StatCard, SecondaryButton } from '@/components/common'
import { colors } from '@/utils/colors'
import { useMonetisation } from '@/context/MonetisationContext'
import { useToast } from '@/context/ToastContext'
import { SectionTitle } from '../_shared'

const REPORTS = ['Revenue', 'Ads', 'AdMob', 'Sponsor', 'Boost', 'Trial', 'Subscription', 'Retention'] as const

const ReportsSection = () => {
  const { plusMembers, boostPurchases, campaigns, sponsors, trials, ads, audit } = useMonetisation()
  const { showToast } = useToast()

  const figures = useMemo(() => {
    const subMRR = plusMembers
      .filter((m) => m.status === 'Active')
      .reduce((s, m) => s + (m.plan === 'Plus Annual' ? m.amount / 12 : m.amount), 0)
    const boostRevenue = boostPurchases.filter((p) => p.status === 'Completed').reduce((s, p) => s + p.amount, 0)
    const sponsorRevenue = campaigns.filter((c) => c.status === 'Live').length * 750 // est. per live campaign
    const adRevenue = ads.nativeAdsEnabled ? 1240 : 0
    const finishedTrials = trials.filter((t) => t.state !== 'Active')
    const converted = trials.filter((t) => t.state === 'Converted').length
    const conversion = finishedTrials.length ? Math.round((converted / finishedTrials.length) * 100) : 0
    const activeSponsors = sponsors.filter((s) => s.status === 'Approved').length
    return { subMRR, boostRevenue, sponsorRevenue, adRevenue, conversion, activeSponsors }
  }, [plusMembers, boostPurchases, campaigns, sponsors, trials, ads])

  const chartData = [
    { stream: 'Subscriptions', value: Math.round(figures.subMRR), color: colors.primary },
    { stream: 'Boosts', value: Math.round(figures.boostRevenue), color: colors.warning },
    { stream: 'Sponsors', value: figures.sponsorRevenue, color: colors.success },
    { stream: 'Ads / AdMob', value: figures.adRevenue, color: colors.info },
  ]

  const handleExport = (report: string) => {
    audit('Reports', 'Exported report', `${report} report exported (CSV)`)
    showToast(`${report} report exported`, 'success')
  }

  return (
    <div>
      <SectionTitle
        title="Reports"
        subtitle="Revenue, ads, AdMob, sponsor, Boost, trial, subscription and retention reporting."
        action={<SecondaryButton Icon={Download} label="Export All" onClick={() => handleExport('Full monetisation')} />}
      />

      <div className="grid grid-cols-4 gap-4 mb-5">
        <StatCard Icon={Crown} iconBg={colors.primaryLight} iconColor={colors.primary} label="Subscription MRR" value={`£${figures.subMRR.toFixed(0)}`} badge="Monthly" badgeTone="info" />
        <StatCard Icon={Zap} iconBg={colors.warningLight} iconColor={colors.warning} label="Boost Revenue" value={`£${figures.boostRevenue.toFixed(0)}`} badge="Completed" badgeTone="success" />
        <StatCard Icon={Megaphone} iconBg={colors.successLight} iconColor={colors.success} label="Sponsor Revenue" value={`£${figures.sponsorRevenue.toLocaleString()}`} badge={`${figures.activeSponsors} active`} badgeTone="success" />
        <StatCard Icon={Tv} iconBg={colors.infoLight} iconColor={colors.info} label="Ad / AdMob Revenue" value={`£${figures.adRevenue.toLocaleString()}`} badge="Est." badgeTone="info" />
      </div>

      <Card>
        <h3 className="text-base font-bold text-ink-primary m-0 mb-1">Revenue by stream</h3>
        <p className="text-[13px] text-ink-secondary mt-0 mb-4">Estimated monthly contribution across monetisation streams.</p>
        <div className="h-[280px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid vertical={false} stroke={colors.borderLight} />
              <XAxis dataKey="stream" axisLine={false} tickLine={false} tick={{ fill: colors.textMuted, fontSize: 12 }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: colors.textMuted, fontSize: 12 }} tickFormatter={(v) => `£${v}`} />
              <Tooltip cursor={{ fill: colors.bgSubtle }} contentStyle={{ background: colors.bgCard, border: `1px solid ${colors.border}`, borderRadius: 10, fontSize: 13 }} formatter={(v: number) => `£${v.toLocaleString()}`} />
              <Bar dataKey="value" radius={[8, 8, 0, 0]} maxBarSize={72}>
                {chartData.map((d) => <Cell key={d.stream} fill={d.color} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <div className="mt-5">
        <Card>
          <h3 className="text-base font-bold text-ink-primary m-0 mb-1">Export reports</h3>
          <p className="text-[13px] text-ink-secondary mt-0 mb-4">Each export is recorded in the audit log. Trial conversion is currently <strong>{figures.conversion}%</strong>.</p>
          <div className="grid grid-cols-4 gap-3">
            {REPORTS.map((r) => (
              <button
                key={r}
                onClick={() => handleExport(r)}
                className="flex items-center justify-between gap-2 py-3 px-4 rounded-xl border border-line-light bg-surface-subtle hover:bg-surface-input transition-colors cursor-pointer text-left"
              >
                <span className="text-sm font-semibold text-ink-primary">{r}</span>
                <Download size={16} className="text-ink-muted shrink-0" />
              </button>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}

export default ReportsSection

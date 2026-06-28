import { useMemo, useState } from 'react'
import { Download, Crown, Zap, Megaphone, Tv, Wallet } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { Card, StatCard, SecondaryButton, SelectPill } from '@/components/common'
import { colors } from '@/utils/colors'
import { useMonetisation } from '@/context/MonetisationContext'
import { useToast } from '@/context/ToastContext'
import { SectionTitle } from '../_shared'

const REPORTS = ['Revenue', 'Ads', 'AdMob', 'Sponsor', 'Boost', 'Trial', 'Subscription', 'Retention'] as const

const PERIODS = ['This month', 'Last 30 days', 'This quarter', 'This year', 'All time'] as const
type Period = (typeof PERIODS)[number]
/** How many monthly run-rates each period represents. */
const PERIOD_MONTHS: Record<Period, number> = { 'This month': 1, 'Last 30 days': 1, 'This quarter': 3, 'This year': 12, 'All time': 12 }

/** Normalise a package's billed price to a monthly run-rate. */
const monthlyFromPackage = (price: number, billing: string) =>
  billing === 'Annual' ? price / 12 : billing === 'Quarterly' ? price / 3 : price

const ReportsSection = () => {
  const { plusMembers, boostPurchases, sponsors, packages, trials, ads, audit } = useMonetisation()
  const { showToast } = useToast()
  const [period, setPeriod] = useState<Period>('This month')
  const months = PERIOD_MONTHS[period]

  const figures = useMemo(() => {
    // Monthly run-rates per stream, then scaled to the selected period.
    const subMonthly = plusMembers
      .filter((m) => m.status === 'Active')
      .reduce((s, m) => s + (m.plan === 'Plus Annual' ? m.amount / 12 : m.amount), 0)
    // Sponsor revenue from actually-assigned, paid packages (not a flat estimate).
    const sponsorMonthly = sponsors.reduce((sum, s) => {
      const pkg = packages.find((p) => p.id === s.packageId)
      const paid = s.packagePaymentStatus === 'Paid' || s.packagePaymentStatus === 'Manually Approved'
      return pkg && paid ? sum + monthlyFromPackage(pkg.price, pkg.billingPeriod) : sum
    }, 0)
    const enabledPlacements = ads.nativeAdsEnabled ? ads.placements.filter((p) => p.enabled).length : 0
    const adMonthly = enabledPlacements * 620 // est. per enabled placement / month

    const subRevenue = subMonthly * months
    const boostRevenue = boostPurchases.filter((p) => p.status === 'Completed').reduce((s, p) => s + p.amount, 0)
    const sponsorRevenue = sponsorMonthly * months
    const adRevenue = adMonthly * months
    const total = subRevenue + boostRevenue + sponsorRevenue + adRevenue

    const finishedTrials = trials.filter((t) => t.state !== 'Active')
    const converted = trials.filter((t) => t.state === 'Converted').length
    const conversion = finishedTrials.length ? Math.round((converted / finishedTrials.length) * 100) : 0
    const activeSponsors = sponsors.filter((s) => s.status === 'Approved' || s.status === 'Active').length
    return { subRevenue, boostRevenue, sponsorRevenue, adRevenue, total, conversion, activeSponsors }
  }, [plusMembers, boostPurchases, sponsors, packages, trials, ads, months])

  const chartData = [
    { stream: 'Subscriptions', value: Math.round(figures.subRevenue), color: colors.primary },
    { stream: 'Boosts', value: Math.round(figures.boostRevenue), color: colors.warning },
    { stream: 'Sponsors', value: Math.round(figures.sponsorRevenue), color: colors.success },
    { stream: 'Ads / AdMob', value: Math.round(figures.adRevenue), color: colors.info },
  ]

  const handleExport = (report: string) => {
    audit('Reports', 'Exported report', `${report} report exported (CSV)`)
    showToast(`${report} report exported`, 'success')
  }

  return (
    <div>
      <SectionTitle
        title="Reports"
        subtitle="All monetisation revenue in one place — subscriptions, sponsorship, Native Ads / AdMob and Boosts."
        action={
          <div className="flex items-center gap-2">
            <div className="w-[160px]"><SelectPill value={period} onChange={(v) => setPeriod(v as Period)} options={[...PERIODS]} /></div>
            <SecondaryButton Icon={Download} label="Export All" onClick={() => handleExport(`Full monetisation (${period})`)} />
          </div>
        }
      />

      <Card>
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: colors.primaryLight, color: colors.primary }}><Wallet size={22} /></div>
            <div>
              <div className="text-[13px] font-semibold text-ink-secondary">Total revenue · {period}</div>
              <div className="text-[30px] font-bold text-ink-primary tabular-nums leading-tight">£{Math.round(figures.total).toLocaleString()}</div>
            </div>
          </div>
          <div className="text-[13px] text-ink-muted max-w-[280px]">Combined across all monetisation streams. Recurring streams scaled to the selected period.</div>
        </div>
      </Card>

      <div className="grid grid-cols-4 gap-4 my-5">
        <StatCard Icon={Crown} iconBg={colors.primaryLight} iconColor={colors.primary} label="Subscription Revenue" value={`£${Math.round(figures.subRevenue).toLocaleString()}`} badge={period} badgeTone="info" />
        <StatCard Icon={Zap} iconBg={colors.warningLight} iconColor={colors.warning} label="Boost Revenue" value={`£${figures.boostRevenue.toFixed(0)}`} badge="Completed" badgeTone="success" />
        <StatCard Icon={Megaphone} iconBg={colors.successLight} iconColor={colors.success} label="Sponsor Revenue" value={`£${Math.round(figures.sponsorRevenue).toLocaleString()}`} badge={`${figures.activeSponsors} active`} badgeTone="success" />
        <StatCard Icon={Tv} iconBg={colors.infoLight} iconColor={colors.info} label="Ad / AdMob Revenue" value={`£${Math.round(figures.adRevenue).toLocaleString()}`} badge="Est." badgeTone="info" />
      </div>

      <Card>
        <h3 className="text-base font-bold text-ink-primary m-0 mb-1">Revenue by stream</h3>
        <p className="text-[13px] text-ink-secondary mt-0 mb-4">Contribution across monetisation streams · {period}.</p>
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

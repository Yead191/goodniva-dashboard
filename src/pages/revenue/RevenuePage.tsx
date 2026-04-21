import { useState } from 'react'
import { Download, Wallet, TrendingUp, CreditCard, Crown, ChevronLeft, ChevronRight } from 'lucide-react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import PageHeader from '@/components/layout/PageHeader'
import { Card, Badge, StatCard, SecondaryButton, PaginationButton } from '@/components/common'
import { revenueMonthlySeed, subscribersSeed } from '@/data/revenue'
import { colors } from '@/utils/colors'
import { getStatusStyle } from '@/utils/statusStyles'
import type { Subscriber } from '@/types'

type PlanFilter = 'all' | 'Premium' | 'Professional'
type TimeRange = '3m' | '6m' | '12m'

const RevenuePage = () => {
  const [timeRange, setTimeRange] = useState<TimeRange>('12m')
  const [planFilter, setPlanFilter] = useState<PlanFilter>('all')
  const [page, setPage] = useState(1)
  const pageSize = 8

  const activeSubscribers = subscribersSeed.filter((s) => s.status === 'Active')
  const totalMRR =
    activeSubscribers.filter((s) => s.plan === 'Premium').reduce((sum, s) => sum + s.amount, 0) +
    activeSubscribers.filter((s) => s.plan === 'Professional').reduce((sum, s) => sum + s.amount / 12, 0)
  const totalRevenueYTD = revenueMonthlySeed.reduce((sum, m) => sum + m.revenue, 0)
  const currentMonth = revenueMonthlySeed[revenueMonthlySeed.length - 1].revenue
  const previousMonth = revenueMonthlySeed[revenueMonthlySeed.length - 2].revenue
  const growthPct = (((currentMonth - previousMonth) / previousMonth) * 100).toFixed(1)

  const filtered = planFilter === 'all' ? subscribersSeed : subscribersSeed.filter((s) => s.plan === planFilter)
  const totalPages = Math.ceil(filtered.length / pageSize)
  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize)

  const months = timeRange === '3m' ? 3 : timeRange === '6m' ? 6 : 12
  const chartData = revenueMonthlySeed.slice(-months)

  return (
    <div className="py-7 px-8">
      <PageHeader
        title="Revenue"
        subtitle="Track earnings and monitor active subscribers"
        action={<SecondaryButton Icon={Download} label="Export Report" />}
      />

      <div className="grid grid-cols-4 gap-4 mb-5">
        <StatCard Icon={Wallet} iconBg={colors.primaryLight} iconColor={colors.primary}
          label="Total Revenue (YTD)" value={`$${totalRevenueYTD.toLocaleString()}`}
          badge={`+${growthPct}%`} badgeTone="success" />
        <StatCard Icon={TrendingUp} iconBg={colors.successLight} iconColor={colors.success}
          label="This Month" value={`$${currentMonth.toLocaleString()}`} badge="+12.0%" badgeTone="success" />
        <StatCard Icon={CreditCard} iconBg={colors.infoLight} iconColor={colors.info}
          label="Monthly Recurring" value={`$${totalMRR.toFixed(2)}`} badge="MRR" badgeTone="info" />
        <StatCard Icon={Crown} iconBg="#FEF3C7" iconColor={colors.warning}
          label="Active Subscribers" value={activeSubscribers.length} badge="Paying" badgeTone="warning" />
      </div>

      <Card>
        <div className="flex justify-between items-start mb-5">
          <div>
            <h3 className="text-[18px] font-bold text-ink-primary m-0">Revenue Trend</h3>
            <p className="text-[13px] text-ink-secondary mt-1 mb-0">Monthly earnings across all subscription tiers</p>
          </div>
          <FilterPills value={timeRange} onChange={(v) => setTimeRange(v as TimeRange)} options={[{ key: '3m', label: '3M' }, { key: '6m', label: '6M' }, { key: '12m', label: '12M' }]} />
        </div>

        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={colors.primary} stopOpacity={0.3} />
                  <stop offset="100%" stopColor={colors.primary} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} stroke={colors.borderLight} />
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: colors.textMuted, fontSize: 12 }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: colors.textMuted, fontSize: 12 }} tickFormatter={(v) => `$${v / 1000}k`} />
              <Tooltip
                contentStyle={{ background: colors.bgCard, border: `1px solid ${colors.border}`, borderRadius: 10, fontSize: 13 }}
                formatter={(v: number) => `$${v.toLocaleString()}`}
              />
              <Area type="monotone" dataKey="revenue" stroke={colors.primary} strokeWidth={2.5}
                fill="url(#revenueGrad)" dot={{ r: 4, fill: colors.primary, strokeWidth: 2, stroke: colors.bgCard }}
                activeDot={{ r: 6, fill: colors.primary, strokeWidth: 3, stroke: colors.bgCard }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <div className="mt-5">
        <Card>
          <div className="flex justify-between items-start mb-5">
            <div>
              <h3 className="text-[18px] font-bold text-ink-primary m-0">Active Subscribers</h3>
              <p className="text-[13px] text-ink-secondary mt-1 mb-0">Users currently paying for subscription plans</p>
            </div>
            <FilterPills value={planFilter} onChange={(v) => { setPlanFilter(v as PlanFilter); setPage(1) }}
              options={[{ key: 'all', label: 'All' }, { key: 'Premium', label: 'Premium' }, { key: 'Professional', label: 'Professional' }]} />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-surface-subtle">
                  {['SUBSCRIBER', 'PLAN', 'AMOUNT', 'PAYMENT METHOD', 'NEXT BILLING', 'STATUS'].map((h) => (
                    <th key={h} className="text-left py-[14px] px-4 text-[11px] font-bold text-ink-secondary tracking-[0.6px]">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {paginated.map((sub) => <SubscriberRow key={sub.id} sub={sub} />)}
              </tbody>
            </table>
          </div>

          <div className="flex justify-between items-center mt-5 pt-4 border-t border-line-light">
            <span className="text-[13px] text-ink-secondary">
              Showing {(page - 1) * pageSize + 1}-{Math.min(page * pageSize, filtered.length)} of {filtered.length} subscribers
            </span>
            <div className="flex gap-2 items-center">
              <PaginationButton Icon={ChevronLeft} onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} />
              <span className="text-[13px] text-ink-secondary px-2">
                Page {page} of {Math.max(1, totalPages)}
              </span>
              <PaginationButton Icon={ChevronRight} onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page >= totalPages} />
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}

interface FilterPillsProps {
  value: string
  onChange: (val: string) => void
  options: { key: string; label: string }[]
}

const FilterPills = ({ value, onChange, options }: FilterPillsProps) => (
  <div className="flex gap-1 p-1 bg-surface-input rounded-pill">
    {options.map((opt) => (
      <button key={opt.key} onClick={() => onChange(opt.key)}
        className={`py-[6px] px-[14px] rounded-pill border-none text-[13px] font-semibold cursor-pointer transition-all duration-150 ${
          value === opt.key
            ? 'bg-surface text-ink-primary shadow-[0_1px_2px_rgba(15,23,42,0.08)]'
            : 'bg-transparent text-ink-secondary'
        }`}
      >
        {opt.label}
      </button>
    ))}
  </div>
)

const SubscriberRow = ({ sub }: { sub: Subscriber }) => {
  const status = getStatusStyle(sub.status)
  const planColor = sub.plan === 'Professional' ? { bg: '#FEF3C7', text: '#92400E' } : { bg: colors.primaryLight, text: colors.primary }

  return (
    <tr className="hover:bg-surface-subtle transition-colors duration-150">
      <td className="py-[14px] px-4 border-b border-line-light">
        <div className="flex items-center gap-3">
          <img src={sub.user.avatar} alt="" className="w-9 h-9 rounded-full object-cover" />
          <div>
            <div className="text-sm font-semibold text-ink-primary">{sub.user.name}</div>
            <div className="text-xs text-ink-muted">{sub.user.email}</div>
          </div>
        </div>
      </td>
      <td className="py-[14px] px-4 border-b border-line-light">
        <Badge text={sub.plan} bg={planColor.bg} color={planColor.text} />
      </td>
      <td className="py-[14px] px-4 border-b border-line-light text-sm font-bold text-ink-primary tabular-nums">
        ${sub.amount.toFixed(2)}
      </td>
      <td className="py-[14px] px-4 border-b border-line-light">
        <span className="inline-flex items-center gap-[6px] text-[13px] text-ink-secondary">
          <CreditCard size={14} /> {sub.method}
        </span>
      </td>
      <td className="py-[14px] px-4 border-b border-line-light text-[13px] text-ink-secondary">{sub.nextBilling}</td>
      <td className="py-[14px] px-4 border-b border-line-light">
        <span className="inline-flex items-center gap-[6px] py-1 px-3 rounded-pill text-xs font-bold" style={{ background: status.bg, color: status.text }}>
          <span className="w-[6px] h-[6px] rounded-full" style={{ background: status.dot }} />
          {sub.status}
        </span>
      </td>
    </tr>
  )
}

export default RevenuePage

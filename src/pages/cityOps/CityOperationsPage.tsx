import { useMemo, useState } from 'react'
import {
  Activity,
  AlertTriangle,
  CalendarDays,
  Eye,
  Flag,
  Search,
  TrendingDown,
  TrendingUp,
  UserCheck,
  Users,
} from 'lucide-react'
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis } from 'recharts'
import PageHeader from '@/components/layout/PageHeader'
import { Badge, Card, IconButton, StatCard } from '@/components/common'
import CityDetailsDrawer from '@/components/modals/CityDetailsDrawer'
import { citiesSeed } from '@/data/cityOps'
import { colors } from '@/utils/colors'
import type { CityHealth, CityOps } from '@/types'

const STATUS_FILTERS: ('All' | CityHealth)[] = ['All', 'Healthy', 'Watch', 'At Risk']

const CityOperationsPage = () => {
  const [filter, setFilter] = useState<(typeof STATUS_FILTERS)[number]>('All')
  const [country, setCountry] = useState<string>('All')
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState<CityOps | null>(null)

  const countries = useMemo(
    () => ['All', ...Array.from(new Set(citiesSeed.map((c) => c.country))).sort()],
    [],
  )

  const visible = useMemo(() => {
    return citiesSeed.filter((c) => {
      if (filter !== 'All' && c.status !== filter) return false
      if (country !== 'All' && c.country !== country) return false
      if (query && !c.name.toLowerCase().includes(query.toLowerCase())) return false
      return true
    })
  }, [filter, country, query])

  const counts = useMemo(
    () => ({
      healthy: citiesSeed.filter((c) => c.status === 'Healthy').length,
      watch: citiesSeed.filter((c) => c.status === 'Watch').length,
      atRisk: citiesSeed.filter((c) => c.status === 'At Risk').length,
      plansToday: citiesSeed.reduce((s, c) => s + c.plansToday, 0),
      flagged: citiesSeed.reduce((s, c) => s + c.flaggedPlans, 0),
    }),
    [],
  )

  return (
    <div className="py-7 px-8">
      <PageHeader
        title="City Operations"
        subtitle="Monitor each city's health, hosting activity, and risk signals"
      />

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        <StatCard Icon={Activity} iconBg={colors.successLight} iconColor={colors.success}
          label="Healthy Cities" value={counts.healthy} />
        <StatCard Icon={AlertTriangle} iconBg={colors.warningLight} iconColor={colors.warning}
          label="Watch" value={counts.watch} />
        <StatCard Icon={TrendingDown} iconBg={colors.dangerLight} iconColor={colors.danger}
          label="At Risk" value={counts.atRisk} />
        <StatCard Icon={CalendarDays} iconBg={colors.infoLight} iconColor={colors.info}
          label="Plans Today" value={counts.plansToday} />
        <StatCard Icon={Flag} iconBg={colors.dangerLight} iconColor={colors.danger}
          label="Flagged Plans" value={counts.flagged} />
      </div>

      <div className="flex flex-wrap gap-3 items-center mb-4">
        <div className="flex gap-2 flex-wrap">
          {STATUS_FILTERS.map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`h-9 px-4 rounded-pill border text-[13px] font-semibold cursor-pointer transition-colors ${
                filter === s
                  ? 'bg-primary text-white border-primary'
                  : 'bg-surface text-ink-secondary border-line hover:bg-surface-subtle'
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        <div className="flex-1 min-w-[200px]" />

        <select
          value={country}
          onChange={(e) => setCountry(e.target.value)}
          className="h-9 px-3 rounded-pill border border-line bg-surface text-[13px] text-ink-primary cursor-pointer outline-none focus:border-primary"
        >
          {countries.map((c) => (
            <option key={c} value={c}>
              {c === 'All' ? 'All countries' : c}
            </option>
          ))}
        </select>

        <div className="relative">
          <Search size={14} className="absolute left-[12px] top-1/2 -translate-y-1/2 text-ink-muted" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search city…"
            className="h-9 pl-[34px] pr-3 rounded-pill border border-line bg-surface text-[13px] text-ink-primary outline-none focus:border-primary w-[200px]"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {visible.length === 0 ? (
          <div className="col-span-full">
            <Card>
              <div className="py-10 text-center text-[13px] text-ink-muted">
                No cities match these filters.
              </div>
            </Card>
          </div>
        ) : (
          visible.map((c) => (
            <CityCard key={c.id} city={c} onView={() => setSelected(c)} />
          ))
        )}
      </div>

      {selected && <CityDetailsDrawer city={selected} onClose={() => setSelected(null)} />}
    </div>
  )
}

const CityCard = ({ city, onView }: { city: CityOps; onView: () => void }) => {
  const status = healthStyle(city.status)
  const noShowDirection = direction(city.trend.map((t) => t.noShows))
  return (
    <Card>
      <div className="p-5">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <h3 className="text-[17px] font-bold text-ink-primary m-0">{city.name}</h3>
              <span className="text-[12px] text-ink-muted">{city.country}</span>
            </div>
            <Badge text={`• ${city.status}`} bg={status.bg} color={status.text} />
          </div>
          <IconButton Icon={Eye} tooltip="City detail" onClick={onView} />
        </div>

        <div className="grid grid-cols-3 gap-2 mb-4">
          <Metric Icon={CalendarDays} label="Plans today" value={city.plansToday} />
          <Metric Icon={UserCheck} label="Active hosts" value={city.activeHosts} />
          <Metric Icon={Users} label="Joined (7d)" value={city.joinedUsersWeek.toLocaleString()} />
        </div>

        <div className="flex items-center justify-between text-[12px] text-ink-secondary mb-2">
          <span className="font-bold uppercase tracking-[0.4px]">No-show & cancel trend</span>
          <span className={`inline-flex items-center gap-1 font-bold ${trendToneClass(noShowDirection)}`}>
            {noShowDirection === 'up' ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
            {city.noShowRate7d}% no-show · {city.cancellationRate7d}% cancel
          </span>
        </div>

        <div className="h-[64px] -mx-1">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={city.trend} margin={{ top: 4, right: 8, bottom: 0, left: 8 }}>
              <defs>
                <linearGradient id={`ns-${city.id}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={colors.danger} stopOpacity={0.35} />
                  <stop offset="100%" stopColor={colors.danger} stopOpacity={0} />
                </linearGradient>
                <linearGradient id={`cn-${city.id}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={colors.warning} stopOpacity={0.3} />
                  <stop offset="100%" stopColor={colors.warning} stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="day" hide />
              <Tooltip
                contentStyle={{ borderRadius: 8, border: `1px solid ${colors.border}`, fontSize: 12 }}
                labelStyle={{ fontWeight: 600 }}
              />
              <Area type="monotone" dataKey="noShows" stroke={colors.danger} strokeWidth={2} fill={`url(#ns-${city.id})`} />
              <Area type="monotone" dataKey="cancellations" stroke={colors.warning} strokeWidth={2} fill={`url(#cn-${city.id})`} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="flex items-center justify-between mt-3 pt-3 border-t border-line-light text-[12px]">
          <span className="text-ink-secondary">
            <Flag size={12} className="inline -mt-[2px] mr-1 text-danger" />
            <span className="font-bold text-ink-primary">{city.flaggedPlans}</span> flagged
          </span>
          <span className="text-ink-secondary">
            <span className="font-bold text-ink-primary">{city.weakZones.length}</span> weak zone{city.weakZones.length === 1 ? '' : 's'}
          </span>
        </div>
      </div>
    </Card>
  )
}

const Metric = ({
  Icon,
  label,
  value,
}: {
  Icon: typeof CalendarDays
  label: string
  value: string | number
}) => (
  <div className="bg-surface-subtle border border-line-light rounded-[12px] py-2 px-[10px]">
    <div className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-[0.4px] text-ink-secondary">
      <Icon size={11} />
      {label}
    </div>
    <div className="text-[18px] font-bold text-ink-primary mt-[2px]">{value}</div>
  </div>
)

export const healthStyle = (status: CityHealth) => {
  if (status === 'Healthy') return { bg: colors.successLight, text: colors.successText, dot: colors.success }
  if (status === 'Watch') return { bg: colors.warningLight, text: colors.warningText, dot: colors.warning }
  return { bg: colors.dangerLight, text: colors.dangerText, dot: colors.danger }
}

const direction = (xs: number[]): 'up' | 'down' => {
  if (xs.length < 2) return 'up'
  return xs[xs.length - 1] >= xs[0] ? 'up' : 'down'
}

const trendToneClass = (d: 'up' | 'down') =>
  d === 'up' ? 'text-danger' : 'text-success'

export default CityOperationsPage

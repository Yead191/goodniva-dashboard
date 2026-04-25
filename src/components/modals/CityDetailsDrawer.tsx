import {
  AlertTriangle,
  CalendarDays,
  Flag,
  MapPinned,
  Minus,
  StickyNote,
  TrendingDown,
  TrendingUp,
  UserCheck,
  Users,
  X,
  type LucideIcon,
} from 'lucide-react'
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { Badge, PrimaryButton } from '@/components/common'
import { colors } from '@/utils/colors'
import { healthStyle } from '@/pages/cityOps/CityOperationsPage'
import type { CityOps, FlaggedPlanRef, WeakZone } from '@/types'

const CityDetailsDrawer = ({ city, onClose }: { city: CityOps; onClose: () => void }) => {
  const status = healthStyle(city.status)

  return (
    <>
      <div onClick={onClose} className="fixed inset-0 bg-[rgba(15,23,42,0.45)] backdrop-blur-sm z-[100] animate-[fadeIn_0.2s_ease]" />
      <div className="fixed inset-y-0 right-0 z-[101] w-full max-w-[680px] flex flex-col bg-surface shadow-modal animate-[drawerSlide_0.28s_ease]">
        <div className="py-[22px] px-7 flex justify-between items-center shrink-0 border-b border-line-light">
          <div>
            <h2 className="text-xl font-bold text-ink-primary m-0">{city.name}</h2>
            <p className="text-[13px] text-ink-secondary mt-1 mb-0">{city.country} · Population {city.population}</p>
          </div>
          <button onClick={onClose} className="w-9 h-9 rounded-lg border-none bg-transparent cursor-pointer flex items-center justify-center text-ink-secondary hover:bg-surface-input transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-auto px-7 py-5">
          <div
            className="rounded-[14px] p-4 mb-5 flex gap-3 items-start"
            style={{ background: status.bg, color: status.text }}
          >
            <AlertTriangle size={18} className="shrink-0 mt-[2px]" />
            <div className="flex-1">
              <div className="text-[13px] font-bold mb-[2px]">Status: {city.status}</div>
              <div className="text-[13px]" style={{ color: colors.textSecondary }}>
                {city.notes ?? 'No notes for this city.'}
              </div>
            </div>
            <Badge text={`• ${city.status}`} bg={colors.bgCard} color={status.text} />
          </div>

          <div className="grid grid-cols-2 gap-3 mb-5">
            <Stat Icon={CalendarDays} label="Plans today" value={city.plansToday} />
            <Stat Icon={UserCheck} label="Active hosts" value={city.activeHosts} />
            <Stat Icon={Users} label="Joined users (7d)" value={city.joinedUsersWeek.toLocaleString()} />
            <Stat Icon={Flag} label="Flagged plans" value={city.flaggedPlans} tone={city.flaggedPlans > 0 ? colors.danger : undefined} />
          </div>

          <Section title="No-Show & Cancellation Trend (7d)" icon={TrendingUp}>
            <div className="flex items-center gap-4 mb-2 text-[12px]">
              <LegendDot color={colors.danger} label={`${city.noShowRate7d}% no-show`} />
              <LegendDot color={colors.warning} label={`${city.cancellationRate7d}% cancel`} />
            </div>
            <div className="h-[170px] -mx-2">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={city.trend} margin={{ top: 8, right: 16, bottom: 0, left: -10 }}>
                  <defs>
                    <linearGradient id="ns-detail" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={colors.danger} stopOpacity={0.35} />
                      <stop offset="100%" stopColor={colors.danger} stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="cn-detail" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={colors.warning} stopOpacity={0.3} />
                      <stop offset="100%" stopColor={colors.warning} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke={colors.borderLight} />
                  <XAxis dataKey="day" stroke={colors.textMuted} fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis stroke={colors.textMuted} fontSize={11} tickLine={false} axisLine={false} width={28} />
                  <Tooltip
                    contentStyle={{ borderRadius: 8, border: `1px solid ${colors.border}`, fontSize: 12 }}
                    labelStyle={{ fontWeight: 600 }}
                  />
                  <Area type="monotone" dataKey="noShows" name="No-shows" stroke={colors.danger} strokeWidth={2} fill="url(#ns-detail)" />
                  <Area type="monotone" dataKey="cancellations" name="Cancellations" stroke={colors.warning} strokeWidth={2} fill="url(#cn-detail)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Section>

          <Section title={`Weak Activity Zones (${city.weakZones.length})`} icon={MapPinned} tone="warning">
            <ZoneList zones={city.weakZones} />
          </Section>

          <Section title={`Flagged Plans (${city.flaggedList.length})`} icon={Flag} tone="danger">
            <FlaggedList list={city.flaggedList} />
          </Section>

          {city.notes && (
            <Section title="Operations Notes" icon={StickyNote}>
              <div className="text-sm text-ink-primary leading-relaxed">{city.notes}</div>
            </Section>
          )}
        </div>

        <div className="py-[18px] px-7 border-t border-line-light flex justify-end shrink-0">
          <PrimaryButton label="Close" onClick={onClose} />
        </div>
      </div>
    </>
  )
}

const Section = ({
  title,
  icon: Icon,
  tone,
  children,
}: {
  title: string
  icon?: LucideIcon
  tone?: 'warning' | 'danger'
  children: React.ReactNode
}) => {
  const titleColor =
    tone === 'danger' ? 'text-danger' : tone === 'warning' ? 'text-warning' : 'text-ink-secondary'
  return (
    <div className="mb-5">
      <div className={`text-[11px] font-bold tracking-[0.6px] mb-[10px] uppercase flex items-center gap-[6px] ${titleColor}`}>
        {Icon && <Icon size={13} />}
        {title}
      </div>
      <div className="bg-surface-subtle border border-line-light rounded-[14px] py-3 px-[18px]">{children}</div>
    </div>
  )
}

const Stat = ({
  Icon,
  label,
  value,
  tone,
}: {
  Icon: LucideIcon
  label: string
  value: string | number
  tone?: string
}) => (
  <div className="bg-surface border border-line-light rounded-[12px] px-3 py-[10px]">
    <div className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-[0.4px] text-ink-secondary">
      <Icon size={12} />
      {label}
    </div>
    <div className="text-[20px] font-bold mt-[2px]" style={{ color: tone ?? colors.textPrimary }}>
      {value}
    </div>
  </div>
)

const LegendDot = ({ color, label }: { color: string; label: string }) => (
  <span className="inline-flex items-center gap-[6px] text-ink-secondary">
    <span className="w-2 h-2 rounded-full" style={{ background: color }} />
    {label}
  </span>
)

const ZoneList = ({ zones }: { zones: WeakZone[] }) => {
  if (zones.length === 0) return <div className="text-[13px] text-ink-muted py-2">No weak zones detected.</div>
  return (
    <div className="flex flex-col">
      {zones.map((z, i) => (
        <div
          key={z.name}
          className={`flex items-center justify-between gap-3 py-[10px] ${i === zones.length - 1 ? '' : 'border-b border-line-light'}`}
        >
          <div className="min-w-0">
            <div className="text-sm font-semibold text-ink-primary truncate">{z.name}</div>
            <div className="text-[12px] text-ink-secondary mt-[2px]">
              {z.joinedThisWeek} joined · {z.hostsActive} active host{z.hostsActive === 1 ? '' : 's'}
            </div>
          </div>
          <ZoneTrend trend={z.trend} />
        </div>
      ))}
    </div>
  )
}

const ZoneTrend = ({ trend }: { trend: WeakZone['trend'] }) => {
  if (trend === 'down')
    return (
      <span className="inline-flex items-center gap-1 text-[12px] font-bold text-danger">
        <TrendingDown size={13} /> declining
      </span>
    )
  if (trend === 'up')
    return (
      <span className="inline-flex items-center gap-1 text-[12px] font-bold text-success">
        <TrendingUp size={13} /> recovering
      </span>
    )
  return (
    <span className="inline-flex items-center gap-1 text-[12px] font-bold text-ink-secondary">
      <Minus size={13} /> flat
    </span>
  )
}

const FlaggedList = ({ list }: { list: FlaggedPlanRef[] }) => {
  if (list.length === 0) return <div className="text-[13px] text-ink-muted py-2">No flagged plans in this city.</div>
  return (
    <div className="flex flex-col">
      {list.map((p, i) => (
        <div
          key={p.id}
          className={`flex items-start justify-between gap-3 py-[10px] ${i === list.length - 1 ? '' : 'border-b border-line-light'}`}
        >
          <div className="min-w-0">
            <div className="text-sm font-semibold text-ink-primary truncate">{p.name}</div>
            <div className="text-[12px] text-ink-secondary mt-[2px]">
              {p.host} · {p.date}
            </div>
          </div>
          <Badge text={p.reason} bg={colors.dangerLight} color={colors.dangerText} />
        </div>
      ))}
    </div>
  )
}

export default CityDetailsDrawer

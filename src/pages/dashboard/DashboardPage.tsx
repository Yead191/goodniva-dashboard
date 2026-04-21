import { UserCheck, Lock, AlertTriangle, CheckCircle2 } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import PageHeader from '@/components/layout/PageHeader'
import { Card, StatCard, Badge } from '@/components/common'
import { dashboardStats, growthAnalyticsData, planDistributionData } from '@/data/dashboard'
import { triageSeed } from '@/data/safety'
import { colors } from '@/utils/colors'

const DashboardPage = () => {
  return (
    <div className="py-7 px-8">
      <PageHeader title="Dashboard" subtitle="Overview of platform activity and key metrics" />

      <div className="grid grid-cols-4 gap-4 mb-5">
        <StatCard
          Icon={UserCheck}
          iconBg={colors.primaryLight}
          iconColor={colors.primary}
          label="Verified To Meet"
          value={dashboardStats.verifiedToMeet.toLocaleString()}
          badge="+12.5%"
          badgeTone="success"
        />
        <StatCard
          Icon={Lock}
          iconBg={colors.warningLight}
          iconColor={colors.warning}
          label="Active Lock-ins"
          value={dashboardStats.activeLockIns.toLocaleString()}
          badge="+3.2%"
          badgeTone="success"
        />
        <StatCard
          Icon={AlertTriangle}
          iconBg={colors.dangerLight}
          iconColor={colors.danger}
          label="Urgent Triage"
          value={dashboardStats.urgentTriage}
          badge="Action needed"
          badgeTone="danger"
        />
        <StatCard
          Icon={CheckCircle2}
          iconBg={colors.successLight}
          iconColor={colors.success}
          label="Show-up Rate"
          value={`${dashboardStats.showUpRate}%`}
          badge="+1.8%"
          badgeTone="success"
        />
      </div>

      <div className="grid gap-5 mb-5" style={{ gridTemplateColumns: '2fr 1fr' }}>
        <Card>
          <h3 className="text-[18px] font-bold text-ink-primary m-0 mb-1">Growth Analytics</h3>
          <p className="text-[13px] text-ink-secondary m-0 mb-5">Meetups vs Cancellations this week</p>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={growthAnalyticsData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid vertical={false} stroke={colors.borderLight} />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: colors.textMuted, fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: colors.textMuted, fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    background: colors.bgCard,
                    border: `1px solid ${colors.border}`,
                    borderRadius: 10,
                    fontSize: 13,
                  }}
                />
                <Legend wrapperStyle={{ fontSize: 13 }} />
                <Bar dataKey="Meetups" fill={colors.primary} radius={[6, 6, 0, 0]} />
                <Bar dataKey="Cancel" fill={colors.danger} radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <h3 className="text-[18px] font-bold text-ink-primary m-0 mb-1">Plan Distribution</h3>
          <p className="text-[13px] text-ink-secondary m-0 mb-5">Active users by subscription</p>
          <div className="flex flex-col gap-4">
            {planDistributionData.map((plan) => (
              <div key={plan.label}>
                <div className="flex justify-between mb-[6px]">
                  <span className="text-[13px] font-semibold text-ink-primary">{plan.label}</span>
                  <span className="text-[13px] font-bold tabular-nums" style={{ color: plan.color }}>
                    {plan.value.toLocaleString()}
                  </span>
                </div>
                <div className="h-2 bg-line-light rounded-pill overflow-hidden">
                  <div
                    className="h-full rounded-pill transition-[width] duration-300 ease-in-out"
                    style={{ width: `${plan.percent}%`, background: plan.color }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card>
        <h3 className="text-[18px] font-bold text-ink-primary m-0 mb-1">Safety Triage</h3>
        <p className="text-[13px] text-ink-secondary m-0 mb-5">Latest reports requiring attention</p>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-surface-subtle">
                {['REPORTER / TARGET', 'REASON', 'URGENCY', 'DATE & TIME', 'STATUS'].map((h) => (
                  <th key={h} className="text-left py-[14px] px-4 text-[11px] font-bold text-ink-secondary tracking-[0.6px]">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {triageSeed.slice(0, 3).map((row) => (
                <tr key={row.id}>
                  <td className="p-4 border-b border-line-light">
                    <div className="flex items-center gap-3">
                      <img src={row.reportedUser.avatar} alt="" className="w-10 h-10 rounded-full object-cover" />
                      <div>
                        <div className="text-sm font-semibold text-ink-primary">{row.reportedUser.name}</div>
                        <div className="text-xs text-ink-muted">Reported by {row.reporter.name}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 border-b border-line-light">
                    <Badge text={row.reason} bg="#FCE7F3" color="#9D174D" />
                  </td>
                  <td className="p-4 border-b border-line-light">
                    <Badge text={row.urgency} bg={colors.danger} color="#FFFFFF" solid />
                  </td>
                  <td className="p-4 border-b border-line-light text-[13px] text-ink-secondary">{row.date}</td>
                  <td className="p-4 border-b border-line-light">
                    <Badge text="Pending" bg={colors.warningLight} color={colors.warningText} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}

export default DashboardPage

import { useMemo, useState } from 'react'
import { Sparkles, CheckCircle2, Clock } from 'lucide-react'
import { Card, StatCard, Badge, SegmentedTabs } from '@/components/common'
import { colors } from '@/utils/colors'
import { useMonetisation } from '@/context/MonetisationContext'
import { SectionTitle, DataTable, Td, UserCell, StatusPill, EmptyRow } from '../_shared'

type Filter = 'all' | 'Active' | 'Expired' | 'Converted'

const TrialsSection = () => {
  const { trials, pricing } = useMonetisation()
  const [filter, setFilter] = useState<Filter>('all')

  const stats = useMemo(() => {
    const active = trials.filter((t) => t.state === 'Active').length
    const expired = trials.filter((t) => t.state === 'Expired').length
    const converted = trials.filter((t) => t.state === 'Converted').length
    const finished = expired + converted
    const conversionRate = finished ? Math.round((converted / finished) * 100) : 0
    return { active, expired, converted, conversionRate }
  }, [trials])

  const rows = filter === 'all' ? trials : trials.filter((t) => t.state === filter)

  return (
    <div>
      <SectionTitle
        title="Trials"
        subtitle={`${pricing.trialEnabled ? `${pricing.trialLengthDays}-day` : 'Disabled'} free trial · active, expired and converted trials.`}
      />

      <div className="grid grid-cols-4 gap-4 mb-5">
        <StatCard Icon={Clock} iconBg={colors.infoLight} iconColor={colors.info} label="Active Trials" value={stats.active} badge="Running" badgeTone="info" />
        <StatCard Icon={CheckCircle2} iconBg={colors.successLight} iconColor={colors.success} label="Converted" value={stats.converted} badge={`${stats.conversionRate}%`} badgeTone="success" />
        <StatCard Icon={Sparkles} iconBg={colors.bgInput} iconColor={colors.textSecondary} label="Expired" value={stats.expired} />
        <StatCard Icon={CheckCircle2} iconBg={colors.primaryLight} iconColor={colors.primary} label="Conversion Rate" value={`${stats.conversionRate}%`} badge="of finished" badgeTone="info" />
      </div>

      <Card>
        <div className="flex justify-end mb-4">
          <SegmentedTabs<Filter>
            value={filter}
            onChange={setFilter}
            options={[
              { key: 'all', label: 'All' },
              { key: 'Active', label: 'Active' },
              { key: 'Expired', label: 'Expired' },
              { key: 'Converted', label: 'Converted' },
            ]}
          />
        </div>

        <DataTable headers={['USER', 'STARTED', 'ENDS', 'CONVERTED TO', 'STATUS']}>
          {rows.length === 0 ? (
            <EmptyRow colSpan={5} message="No trials match this filter." />
          ) : (
            rows.map((t) => (
              <tr key={t.id} className="hover:bg-surface-subtle transition-colors duration-150">
                <Td><UserCell {...t.user} /></Td>
                <Td className="text-ink-secondary">{t.startDate}</Td>
                <Td className="text-ink-secondary">{t.endDate}</Td>
                <Td>{t.convertedTo ? <Badge text={t.convertedTo} bg={colors.primaryLight} color={colors.primary} /> : <span className="text-ink-muted">—</span>}</Td>
                <Td><StatusPill status={t.state} /></Td>
              </tr>
            ))
          )}
        </DataTable>
      </Card>
    </div>
  )
}

export default TrialsSection

import { useState } from 'react'
import { Download, History, Search } from 'lucide-react'
import { Card, Badge, SecondaryButton, PillInput } from '@/components/common'
import { colors } from '@/utils/colors'
import { useMonetisation } from '@/context/MonetisationContext'
import { useToast } from '@/context/ToastContext'
import { SectionTitle, DataTable, Td, EmptyRow } from '../_shared'

const AuditLogSection = () => {
  const { auditLog, audit } = useMonetisation()
  const { showToast } = useToast()
  const [query, setQuery] = useState('')

  const filtered = auditLog.filter((e) =>
    [e.section, e.action, e.detail, e.admin].join(' ').toLowerCase().includes(query.toLowerCase()),
  )

  const handleExport = () => {
    audit('Audit Log', 'Exported audit log', `${auditLog.length} entries exported (CSV)`)
    showToast('Audit log exported', 'success')
  }

  return (
    <div>
      <SectionTitle
        title="Audit Log"
        subtitle="Every monetisation config change is recorded here for review and compliance."
        action={<SecondaryButton Icon={Download} label="Export Log" onClick={handleExport} />}
      />

      <Card>
        <div className="flex items-center gap-3 mb-4">
          <div className="flex-1 max-w-[360px]">
            <PillInput value={query} onChange={setQuery} placeholder="Search changes, sections or admins…" iconLeft={Search} />
          </div>
          <span className="text-[13px] text-ink-secondary ml-auto inline-flex items-center gap-2"><History size={15} /> {filtered.length} entries</span>
        </div>

        <DataTable headers={['WHEN', 'SECTION', 'ACTION', 'DETAIL', 'ADMIN']}>
          {filtered.length === 0 ? (
            <EmptyRow colSpan={5} message="No matching audit entries." />
          ) : (
            filtered.map((e) => (
              <tr key={e.id} className="hover:bg-surface-subtle transition-colors duration-150">
                <Td className="text-ink-secondary whitespace-nowrap text-[13px]">{e.timestamp}</Td>
                <Td><Badge text={e.section} bg={colors.primaryLight} color={colors.primary} /></Td>
                <Td className="font-semibold">{e.action}</Td>
                <Td className="text-ink-secondary">{e.detail}</Td>
                <Td className="text-ink-secondary">{e.admin}</Td>
              </tr>
            ))
          )}
        </DataTable>
      </Card>
    </div>
  )
}

export default AuditLogSection

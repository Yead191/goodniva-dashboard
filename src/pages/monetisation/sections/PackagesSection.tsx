import { useState } from 'react'
import { X, Edit2, Plus } from 'lucide-react'
import { Card, Badge, IconButton, Toggle, PrimaryButton, DangerButton, FieldWithLabel, PillInput, SelectPill, MoneyInput } from '@/components/common'
import { colors } from '@/utils/colors'
import { useMonetisation } from '@/context/MonetisationContext'
import { useToast } from '@/context/ToastContext'
import { SectionTitle, DataTable, Td, currencySymbol } from '../_shared'
import type { SponsorshipPackage, ReportingLevel, Currency, BillingPeriod } from '@/types/monetisation'

const PLACEMENTS = ['Feed', 'Vibe', 'Partner Venue']
const blank: Omit<SponsorshipPackage, 'id'> = { name: '', price: 0, currency: 'GBP', billingPeriod: 'Monthly', placements: ['Feed'], priority: 1, reportingLevel: 'Basic', active: true }

const PackagesSection = () => {
  const { packages, setPackages, audit, canEdit } = useMonetisation()
  const { showToast } = useToast()
  const [editing, setEditing] = useState<SponsorshipPackage | null>(null)
  const [creating, setCreating] = useState(false)

  const toggleActive = (p: SponsorshipPackage) => {
    if (!canEdit) return
    setPackages((prev) => prev.map((x) => (x.id === p.id ? { ...x, active: !x.active } : x)))
    audit('Sponsorship Packages', `${p.active ? 'Paused' : 'Activated'} package`, p.name)
  }

  const handleSave = (data: Omit<SponsorshipPackage, 'id'>, id?: number) => {
    if (id) {
      setPackages((prev) => prev.map((p) => (p.id === id ? { ...p, ...data } : p)))
      audit('Sponsorship Packages', 'Edited package', `${data.name} — ${currencySymbol(data.currency)}${data.price}`)
      showToast(`"${data.name}" updated`, 'success')
    } else {
      setPackages((prev) => [...prev, { ...data, id: Date.now() }])
      audit('Sponsorship Packages', 'Created package', `${data.name} — ${currencySymbol(data.currency)}${data.price}`)
      showToast(`"${data.name}" created`, 'success')
    }
    setEditing(null)
    setCreating(false)
  }

  return (
    <div>
      <SectionTitle title="Sponsorship Packages" subtitle="Create and edit packages — prices, placements, priority and reporting level." action={<PrimaryButton Icon={Plus} label="New Package" onClick={() => canEdit && setCreating(true)} />} />

      <Card>
        <DataTable headers={['PACKAGE', 'PRICE', 'BILLING', 'PLACEMENTS', 'PRIORITY', 'REPORTING', 'ACTIVE', 'ACTIONS']}>
          {packages.map((p) => (
            <tr key={p.id} className="hover:bg-surface-subtle transition-colors duration-150">
              <Td className="font-semibold">{p.name}</Td>
              <Td className="font-bold tabular-nums">{currencySymbol(p.currency)}{p.price.toLocaleString()}</Td>
              <Td><Badge text={p.billingPeriod} bg={colors.bgInput} color={colors.textSecondary} /></Td>
              <Td>
                <div className="flex flex-wrap gap-1">
                  {p.placements.map((pl) => <Badge key={pl} text={pl} bg={colors.primaryLight} color={colors.primary} />)}
                </div>
              </Td>
              <Td className="tabular-nums">P{p.priority}</Td>
              <Td><Badge text={p.reportingLevel} bg={colors.infoLight} color={colors.infoText} /></Td>
              <Td><Toggle canEdit={canEdit} checked={p.active} onChange={() => toggleActive(p)} /></Td>
              <Td><IconButton Icon={Edit2} tooltip="Edit" onClick={() => canEdit && setEditing(p)} /></Td>
            </tr>
          ))}
        </DataTable>
      </Card>

      {(editing || creating) && (
        <PackageModal initial={editing ?? undefined} onCancel={() => { setEditing(null); setCreating(false) }} onSubmit={(data) => handleSave(data, editing?.id)} />
      )}
    </div>
  )
}

interface ModalProps {
  initial?: SponsorshipPackage
  onCancel: () => void
  onSubmit: (data: Omit<SponsorshipPackage, 'id'>) => void
}

const PackageModal = ({ initial, onCancel, onSubmit }: ModalProps) => {
  const [form, setForm] = useState<Omit<SponsorshipPackage, 'id'>>(initial ?? blank)
  const set = <K extends keyof Omit<SponsorshipPackage, 'id'>>(k: K, v: Omit<SponsorshipPackage, 'id'>[K]) => setForm((f) => ({ ...f, [k]: v }))

  const togglePlacement = (pl: string) =>
    set('placements', form.placements.includes(pl) ? form.placements.filter((x) => x !== pl) : [...form.placements, pl])

  return (
    <>
      <div onClick={onCancel} className="fixed inset-0 bg-[rgba(15,23,42,0.45)] backdrop-blur-sm z-[100]" />
      <div className="fixed inset-0 z-[101] flex items-center justify-center p-5 pointer-events-none">
        <div className="bg-surface rounded-[20px] w-full max-w-[500px] pointer-events-auto shadow-modal animate-[modalSlide_0.25s_ease]">
          <div className="py-[22px] px-7 flex justify-between items-center">
            <h2 className="text-xl font-bold text-ink-primary m-0">{initial ? 'Edit Package' : 'New Package'}</h2>
            <button onClick={onCancel} className="w-9 h-9 rounded-lg border-none bg-transparent cursor-pointer flex items-center justify-center text-ink-secondary hover:bg-surface-input transition-colors"><X size={20} /></button>
          </div>
          <div className="px-7 pb-5">
            <FieldWithLabel label="Package name"><PillInput value={form.name} onChange={(v) => set('name', v)} placeholder="e.g. City Partner" /></FieldWithLabel>
            <div className="grid grid-cols-3 gap-[14px]">
              <FieldWithLabel label="Price"><MoneyInput value={form.price} onChange={(v) => set('price', v)} placeholder="750" /></FieldWithLabel>
              <FieldWithLabel label="Currency"><SelectPill value={form.currency} onChange={(v) => set('currency', v as Currency)} options={['GBP', 'USD', 'EUR']} /></FieldWithLabel>
              <FieldWithLabel label="Billing period"><SelectPill value={form.billingPeriod} onChange={(v) => set('billingPeriod', v as BillingPeriod)} options={['Monthly', 'Quarterly', 'Annual', 'One-off']} /></FieldWithLabel>
            </div>
            <div className="grid grid-cols-2 gap-[14px]">
              <FieldWithLabel label="Priority"><PillInput value={String(form.priority)} onChange={(v) => set('priority', Number(v.replace(/[^0-9]/g, '')) || 1)} placeholder="2" /></FieldWithLabel>
              <FieldWithLabel label="Reporting"><SelectPill value={form.reportingLevel} onChange={(v) => set('reportingLevel', v as ReportingLevel)} options={['Basic', 'Standard', 'Premium']} /></FieldWithLabel>
            </div>
            <FieldWithLabel label="Placements">
              <div className="flex flex-wrap gap-2">
                {PLACEMENTS.map((pl) => {
                  const on = form.placements.includes(pl)
                  return (
                    <button key={pl} onClick={() => togglePlacement(pl)} className={`py-2 px-4 rounded-pill text-[13px] font-semibold border-2 transition-colors ${on ? 'border-primary bg-primary-light text-primary' : 'border-line bg-surface text-ink-secondary'}`}>
                      {pl}
                    </button>
                  )
                })}
              </div>
            </FieldWithLabel>
          </div>
          <div className="py-[18px] px-7 border-t border-line-light flex gap-[10px] justify-end">
            <DangerButton label="Cancel" onClick={onCancel} />
            <PrimaryButton label={initial ? 'Update' : 'Create'} onClick={() => form.name.trim() && onSubmit(form)} />
          </div>
        </div>
      </div>
    </>
  )
}

export default PackagesSection

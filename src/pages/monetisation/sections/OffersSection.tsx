import { useState } from 'react'
import { X, Plus, Power, Tag, Gift } from 'lucide-react'
import { Card, Badge, IconButton, PrimaryButton, DangerButton, FieldWithLabel, PillInput, SelectPill } from '@/components/common'
import { colors } from '@/utils/colors'
import { useMonetisation } from '@/context/MonetisationContext'
import { useToast } from '@/context/ToastContext'
import { SectionTitle, DataTable, Td, StatusPill } from '../_shared'
import type { Offer, OfferKind } from '@/types/monetisation'

const OffersSection = () => {
  const { offers, setOffers, audit, canEdit } = useMonetisation()
  const { showToast } = useToast()
  const [creating, setCreating] = useState(false)

  const toggleStatus = (o: Offer) => {
    if (!canEdit) return
    const next = o.status === 'Disabled' ? 'Active' : 'Disabled'
    setOffers((prev) => prev.map((x) => (x.id === o.id ? { ...x, status: next } : x)))
    audit('Offers', `${next === 'Disabled' ? 'Disabled' : 'Enabled'} offer`, o.code)
    showToast(`${o.code} ${next === 'Disabled' ? 'disabled' : 'enabled'}`, next === 'Disabled' ? 'warning' : 'success')
  }

  const handleCreate = (data: Omit<Offer, 'id' | 'redemptions' | 'status'>) => {
    const offer: Offer = { ...data, id: Date.now(), redemptions: 0, status: 'Active' }
    setOffers((prev) => [...prev, offer])
    audit('Offers', 'Created offer', `${offer.code} — ${offer.value}`)
    showToast(`Offer "${offer.code}" created`, 'success')
    setCreating(false)
  }

  return (
    <div>
      <SectionTitle title="Offers" subtitle="Manage discount codes and perks." action={<PrimaryButton Icon={Plus} label="New Offer" onClick={() => canEdit && setCreating(true)} />} />

      <Card>
        <DataTable headers={['CODE', 'TYPE', 'DESCRIPTION', 'VALUE', 'REDEMPTIONS', 'EXPIRY', 'STATUS', 'ACTIONS']}>
          {offers.map((o) => (
            <tr key={o.id} className="hover:bg-surface-subtle transition-colors duration-150">
              <Td><span className="font-mono font-bold text-ink-primary">{o.code}</span></Td>
              <Td><Badge text={o.kind} bg={o.kind === 'Perk' ? colors.warningLight : colors.primaryLight} color={o.kind === 'Perk' ? colors.warningText : colors.primary} /></Td>
              <Td className="text-ink-secondary">{o.description}</Td>
              <Td className="font-semibold">{o.value}</Td>
              <Td className="tabular-nums">{o.redemptions} / {o.maxRedemptions}</Td>
              <Td className="text-ink-secondary">{o.expiry}</Td>
              <Td><StatusPill status={o.status} /></Td>
              <Td><IconButton Icon={Power} tooltip={o.status === 'Disabled' ? 'Enable' : 'Disable'} onClick={() => toggleStatus(o)} /></Td>
            </tr>
          ))}
        </DataTable>
      </Card>

      {creating && <OfferModal onCancel={() => setCreating(false)} onSubmit={handleCreate} />}
    </div>
  )
}

interface ModalProps {
  onCancel: () => void
  onSubmit: (data: Omit<Offer, 'id' | 'redemptions' | 'status'>) => void
}

const OfferModal = ({ onCancel, onSubmit }: ModalProps) => {
  const [code, setCode] = useState('')
  const [kind, setKind] = useState<OfferKind>('Discount Code')
  const [description, setDescription] = useState('')
  const [value, setValue] = useState('')
  const [maxRedemptions, setMax] = useState('1000')
  const [expiry, setExpiry] = useState('')

  return (
    <>
      <div onClick={onCancel} className="fixed inset-0 bg-[rgba(15,23,42,0.45)] backdrop-blur-sm z-[100]" />
      <div className="fixed inset-0 z-[101] flex items-center justify-center p-5 pointer-events-none">
        <div className="bg-surface rounded-[20px] w-full max-w-[480px] pointer-events-auto shadow-modal animate-[modalSlide_0.25s_ease]">
          <div className="py-[22px] px-7 flex justify-between items-center">
            <h2 className="text-xl font-bold text-ink-primary m-0 flex items-center gap-2">{kind === 'Perk' ? <Gift size={20} /> : <Tag size={20} />} New Offer</h2>
            <button onClick={onCancel} className="w-9 h-9 rounded-lg border-none bg-transparent cursor-pointer flex items-center justify-center text-ink-secondary hover:bg-surface-input transition-colors"><X size={20} /></button>
          </div>
          <div className="px-7 pb-5">
            <div className="grid grid-cols-2 gap-[14px]">
              <FieldWithLabel label="Code"><PillInput value={code} onChange={(v) => setCode(v.toUpperCase())} placeholder="WELCOME20" /></FieldWithLabel>
              <FieldWithLabel label="Type"><SelectPill value={kind} onChange={(v) => setKind(v as OfferKind)} options={['Discount Code', 'Perk']} /></FieldWithLabel>
            </div>
            <FieldWithLabel label="Description"><PillInput value={description} onChange={setDescription} placeholder="20% off first month" /></FieldWithLabel>
            <div className="grid grid-cols-3 gap-[14px]">
              <FieldWithLabel label="Value"><PillInput value={value} onChange={setValue} placeholder="20% off" /></FieldWithLabel>
              <FieldWithLabel label="Max redemptions"><PillInput value={maxRedemptions} onChange={(v) => setMax(v.replace(/[^0-9]/g, ''))} placeholder="1000" /></FieldWithLabel>
              <FieldWithLabel label="Expiry"><PillInput value={expiry} onChange={setExpiry} placeholder="31 Dec 2026" /></FieldWithLabel>
            </div>
          </div>
          <div className="py-[18px] px-7 border-t border-line-light flex gap-[10px] justify-end">
            <DangerButton label="Cancel" onClick={onCancel} />
            <PrimaryButton label="Create Offer" onClick={() => code.trim() && onSubmit({ code, kind, description, value, maxRedemptions: Number(maxRedemptions) || 0, expiry: expiry || 'No expiry' })} />
          </div>
        </div>
      </div>
    </>
  )
}

export default OffersSection

import { useState } from 'react'
import { X, Edit2, Zap, Eye } from 'lucide-react'
import { Card, Badge, IconButton, PrimaryButton, DangerButton, Toggle, FieldWithLabel, PillInput, SelectPill, MoneyInput } from '@/components/common'
import { colors } from '@/utils/colors'
import { useMonetisation } from '@/context/MonetisationContext'
import { useToast } from '@/context/ToastContext'
import { SectionTitle, DataTable, Td } from '../_shared'
import type { BoostProduct, BoostType } from '@/types/monetisation'

const blank: Omit<BoostProduct, 'id'> = { name: '', type: 'Access', price: 0, credits: 1, active: true, description: '' }

const BoostProductsSection = () => {
  const { boostProducts, setBoostProducts, audit, canEdit } = useMonetisation()
  const { showToast } = useToast()
  const [editing, setEditing] = useState<BoostProduct | null>(null)
  const [creating, setCreating] = useState(false)

  const accessOn = boostProducts.some((p) => p.type === 'Access' && p.active)
  const visibilityOn = boostProducts.some((p) => p.type === 'Visibility' && p.active)

  const bulkToggle = (type: BoostType, on: boolean) => {
    if (!canEdit) return
    setBoostProducts((prev) => prev.map((p) => (p.type === type ? { ...p, active: on } : p)))
    audit('Boost Products', `${on ? 'Enabled' : 'Disabled'} ${type} Boosts`, `All ${type} boost products turned ${on ? 'ON' : 'OFF'}`)
    showToast(`${type} Boosts ${on ? 'enabled' : 'disabled'}`, on ? 'success' : 'warning')
  }

  const toggleActive = (p: BoostProduct) => {
    if (!canEdit) return
    setBoostProducts((prev) => prev.map((x) => (x.id === p.id ? { ...x, active: !x.active } : x)))
    audit('Boost Products', `${p.active ? 'Deactivated' : 'Activated'} product`, p.name)
  }

  const handleSave = (data: Omit<BoostProduct, 'id'>, id?: number) => {
    if (id) {
      setBoostProducts((prev) => prev.map((p) => (p.id === id ? { ...p, ...data } : p)))
      audit('Boost Products', 'Edited product', `${data.name} — £${data.price.toFixed(2)} / ${data.credits} credit(s)`)
      showToast(`"${data.name}" updated`, 'success')
    } else {
      setBoostProducts((prev) => [...prev, { ...data, id: Date.now() }])
      audit('Boost Products', 'Created product', `${data.name} — £${data.price.toFixed(2)} / ${data.credits} credit(s)`)
      showToast(`"${data.name}" created`, 'success')
    }
    setEditing(null)
    setCreating(false)
  }

  return (
    <div>
      <SectionTitle
        title="Boost Products"
        subtitle="Create and edit Boost products, prices, credits and active status."
        action={<PrimaryButton label="New Product" onClick={() => canEdit && setCreating(true)} />}
      />

      <div className="grid grid-cols-2 gap-4 mb-5">
        <Card>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: colors.primaryLight, color: colors.primary }}><Zap size={18} /></div>
            <div className="font-bold text-ink-primary">Access Boosts</div>
          </div>
          <Toggle canEdit={canEdit} checked={accessOn} onChange={(v) => bulkToggle('Access', v)} label="Enable Access Boosts" description="Let users buy extra plan joins beyond the free weekly limit." />
        </Card>
        <Card>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: colors.warningLight, color: colors.warning }}><Eye size={18} /></div>
            <div className="font-bold text-ink-primary">Visibility Boosts</div>
          </div>
          <Toggle canEdit={canEdit} checked={visibilityOn} onChange={(v) => bulkToggle('Visibility', v)} label="Enable Visibility Boosts" description="Let hosts push plans to the top of discovery." />
        </Card>
      </div>

      <Card>
        <DataTable headers={['PRODUCT', 'TYPE', 'PRICE', 'CREDITS', 'STATUS', 'ACTIONS']}>
          {boostProducts.map((p) => (
            <tr key={p.id} className="hover:bg-surface-subtle transition-colors duration-150">
              <Td>
                <div className="font-semibold text-ink-primary">{p.name}</div>
                <div className="text-xs text-ink-muted">{p.description}</div>
              </Td>
              <Td><Badge text={p.type} bg={p.type === 'Access' ? colors.primaryLight : colors.warningLight} color={p.type === 'Access' ? colors.primary : colors.warningText} /></Td>
              <Td className="font-bold tabular-nums">£{p.price.toFixed(2)}</Td>
              <Td className="tabular-nums">{p.credits}</Td>
              <Td><Toggle canEdit={canEdit} checked={p.active} onChange={() => toggleActive(p)} /></Td>
              <Td><IconButton Icon={Edit2} tooltip="Edit" onClick={() => canEdit && setEditing(p)} /></Td>
            </tr>
          ))}
        </DataTable>
      </Card>

      {(editing || creating) && (
        <BoostProductModal
          initial={editing ?? undefined}
          onCancel={() => { setEditing(null); setCreating(false) }}
          onSubmit={(data) => handleSave(data, editing?.id)}
        />
      )}
    </div>
  )
}

interface ModalProps {
  initial?: BoostProduct
  onCancel: () => void
  onSubmit: (data: Omit<BoostProduct, 'id'>) => void
}

const BoostProductModal = ({ initial, onCancel, onSubmit }: ModalProps) => {
  const [form, setForm] = useState<Omit<BoostProduct, 'id'>>(initial ?? blank)
  const set = <K extends keyof Omit<BoostProduct, 'id'>>(k: K, v: Omit<BoostProduct, 'id'>[K]) => setForm((f) => ({ ...f, [k]: v }))

  return (
    <>
      <div onClick={onCancel} className="fixed inset-0 bg-[rgba(15,23,42,0.45)] backdrop-blur-sm z-[100]" />
      <div className="fixed inset-0 z-[101] flex items-center justify-center p-5 pointer-events-none">
        <div className="bg-surface rounded-[20px] w-full max-w-[480px] pointer-events-auto shadow-modal animate-[modalSlide_0.25s_ease]">
          <div className="py-[22px] px-7 flex justify-between items-center">
            <h2 className="text-xl font-bold text-ink-primary m-0">{initial ? 'Edit Boost Product' : 'New Boost Product'}</h2>
            <button onClick={onCancel} className="w-9 h-9 rounded-lg border-none bg-transparent cursor-pointer flex items-center justify-center text-ink-secondary hover:bg-surface-input transition-colors"><X size={20} /></button>
          </div>
          <div className="px-7 pb-5">
            <FieldWithLabel label="Name"><PillInput value={form.name} onChange={(v) => set('name', v)} placeholder="e.g. Access Boost — Single" /></FieldWithLabel>
            <FieldWithLabel label="Description"><PillInput value={form.description} onChange={(v) => set('description', v)} placeholder="Short description" /></FieldWithLabel>
            <div className="grid grid-cols-3 gap-[14px]">
              <FieldWithLabel label="Type"><SelectPill value={form.type} onChange={(v) => set('type', v as BoostType)} options={['Access', 'Visibility']} /></FieldWithLabel>
              <FieldWithLabel label="Price (£)"><MoneyInput value={form.price} onChange={(v) => set('price', v)} placeholder="1.99" /></FieldWithLabel>
              <FieldWithLabel label="Credits"><PillInput value={String(form.credits)} onChange={(v) => set('credits', Number(v.replace(/[^0-9]/g, '')) || 0)} placeholder="1" /></FieldWithLabel>
            </div>
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

export default BoostProductsSection

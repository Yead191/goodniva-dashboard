import { useState } from 'react'
import { X, Check, Pause, Play, Plus, Ban } from 'lucide-react'
import { Card, Badge, IconButton, PrimaryButton, DangerButton, FieldWithLabel, PillInput } from '@/components/common'
import { colors } from '@/utils/colors'
import { useMonetisation } from '@/context/MonetisationContext'
import { useToast } from '@/context/ToastContext'
import { SectionTitle, DataTable, Td, StatusPill } from '../_shared'
import type { Sponsor, SponsorStatus } from '@/types/monetisation'

const SponsorsSection = () => {
  const { sponsors, setSponsors, audit, canEdit } = useMonetisation()
  const { showToast } = useToast()
  const [creating, setCreating] = useState(false)

  const update = (id: number, status: SponsorStatus, verb: string) => {
    const s = sponsors.find((x) => x.id === id)
    if (!s || !canEdit) return
    setSponsors((prev) => prev.map((x) => (x.id === id ? { ...x, status } : x)))
    audit('Sponsors', `${verb} sponsor`, s.name)
    showToast(`${s.name} ${verb.toLowerCase()}d`, status === 'Rejected' ? 'danger' : status === 'Paused' ? 'warning' : 'success')
  }

  const handleCreate = (data: Omit<Sponsor, 'id' | 'status' | 'joinedDate'>) => {
    const sponsor: Sponsor = { ...data, id: Date.now(), status: 'Pending', joinedDate: 'Today', logo: data.logo || 'https://i.pravatar.cc/80?img=40' }
    setSponsors((prev) => [...prev, sponsor])
    audit('Sponsors', 'Added sponsor', sponsor.name)
    showToast(`${sponsor.name} added`, 'success')
    setCreating(false)
  }

  return (
    <div>
      <SectionTitle title="Sponsors" subtitle="Add, edit, approve and pause sponsors." action={<PrimaryButton Icon={Plus} label="Add Sponsor" onClick={() => canEdit && setCreating(true)} />} />

      <Card>
        <DataTable headers={['SPONSOR', 'CATEGORY', 'CONTACT', 'JOINED', 'STATUS', 'ACTIONS']}>
          {sponsors.map((s) => (
            <tr key={s.id} className="hover:bg-surface-subtle transition-colors duration-150">
              <Td>
                <div className="flex items-center gap-3">
                  <img src={s.logo} alt="" className="w-9 h-9 rounded-lg object-cover" />
                  <span className="font-semibold text-ink-primary">{s.name}</span>
                </div>
              </Td>
              <Td><Badge text={s.category} bg={colors.bgInput} color={colors.textSecondary} /></Td>
              <Td className="text-ink-secondary">{s.contact}</Td>
              <Td className="text-ink-secondary">{s.joinedDate}</Td>
              <Td><StatusPill status={s.status} /></Td>
              <Td>
                <div className="flex gap-1">
                  {s.status === 'Pending' && <>
                    <IconButton Icon={Check} tooltip="Approve" onClick={() => update(s.id, 'Approved', 'Approve')} />
                    <IconButton Icon={Ban} tooltip="Reject" danger onClick={() => update(s.id, 'Rejected', 'Reject')} />
                  </>}
                  {s.status === 'Approved' && <IconButton Icon={Pause} tooltip="Pause" onClick={() => update(s.id, 'Paused', 'Pause')} />}
                  {s.status === 'Paused' && <IconButton Icon={Play} tooltip="Resume" onClick={() => update(s.id, 'Approved', 'Resume')} />}
                  {s.status === 'Rejected' && <span className="text-ink-muted text-[13px] px-2">—</span>}
                </div>
              </Td>
            </tr>
          ))}
        </DataTable>
      </Card>

      {creating && <SponsorModal onCancel={() => setCreating(false)} onSubmit={handleCreate} />}
    </div>
  )
}

interface ModalProps {
  onCancel: () => void
  onSubmit: (data: Omit<Sponsor, 'id' | 'status' | 'joinedDate'>) => void
}

const SponsorModal = ({ onCancel, onSubmit }: ModalProps) => {
  const [name, setName] = useState('')
  const [category, setCategory] = useState('')
  const [contact, setContact] = useState('')

  return (
    <>
      <div onClick={onCancel} className="fixed inset-0 bg-[rgba(15,23,42,0.45)] backdrop-blur-sm z-[100]" />
      <div className="fixed inset-0 z-[101] flex items-center justify-center p-5 pointer-events-none">
        <div className="bg-surface rounded-[20px] w-full max-w-[460px] pointer-events-auto shadow-modal animate-[modalSlide_0.25s_ease]">
          <div className="py-[22px] px-7 flex justify-between items-center">
            <h2 className="text-xl font-bold text-ink-primary m-0">Add Sponsor</h2>
            <button onClick={onCancel} className="w-9 h-9 rounded-lg border-none bg-transparent cursor-pointer flex items-center justify-center text-ink-secondary hover:bg-surface-input transition-colors"><X size={20} /></button>
          </div>
          <div className="px-7 pb-5">
            <FieldWithLabel label="Sponsor name"><PillInput value={name} onChange={setName} placeholder="e.g. BrewHaus Coffee" /></FieldWithLabel>
            <FieldWithLabel label="Category"><PillInput value={category} onChange={setCategory} placeholder="e.g. Food & Drink" /></FieldWithLabel>
            <FieldWithLabel label="Contact email"><PillInput value={contact} onChange={setContact} placeholder="partners@example.com" /></FieldWithLabel>
          </div>
          <div className="py-[18px] px-7 border-t border-line-light flex gap-[10px] justify-end">
            <DangerButton label="Cancel" onClick={onCancel} />
            <PrimaryButton label="Add Sponsor" onClick={() => name.trim() && onSubmit({ name, category, contact, logo: '' })} />
          </div>
        </div>
      </div>
    </>
  )
}

export default SponsorsSection

import { useState } from 'react'
import { X } from 'lucide-react'
import { PillInput, SelectPill, FieldWithLabel, PrimaryButton, DangerButton } from '@/components/common'
import type { CityHealth, CityOps } from '@/types'

interface CityFormModalProps {
  onCancel: () => void
  onSubmit: (data: Omit<CityOps, 'id'>) => void
  initial?: CityOps
}

const STATUS_OPTIONS: CityHealth[] = ['Healthy', 'Watch', 'At Risk']

const CityFormModal = ({ onCancel, onSubmit, initial }: CityFormModalProps) => {
  const isEdit = !!initial
  const [name, setName] = useState(initial?.name ?? '')
  const [country, setCountry] = useState(initial?.country ?? '')
  const [countryCode, setCountryCode] = useState(initial?.countryCode ?? '')
  const [population, setPopulation] = useState(initial?.population && initial.population !== '—' ? initial.population : '')
  const [status, setStatus] = useState<CityHealth>(initial?.status ?? 'Healthy')
  const [plansToday, setPlansToday] = useState(initial ? String(initial.plansToday) : '')
  const [activeHosts, setActiveHosts] = useState(initial ? String(initial.activeHosts) : '')
  const [joinedUsersWeek, setJoinedUsersWeek] = useState(initial ? String(initial.joinedUsersWeek) : '')
  const [notes, setNotes] = useState(initial?.notes ?? '')

  const valid = name.trim() !== '' && country.trim() !== ''

  const toNum = (v: string) => {
    const n = parseInt(v, 10)
    return Number.isFinite(n) && n > 0 ? n : 0
  }

  const handleSubmit = () => {
    if (!valid) return
    onSubmit({
      name: name.trim(),
      country: country.trim(),
      countryCode: countryCode.trim().toUpperCase(),
      status,
      population: population.trim() || '—',
      plansToday: toNum(plansToday),
      activeHosts: toNum(activeHosts),
      joinedUsersWeek: toNum(joinedUsersWeek),
      flaggedPlans: initial?.flaggedPlans ?? 0,
      competitionsActive: initial?.competitionsActive ?? 0,
      noShowRate7d: initial?.noShowRate7d ?? 0,
      cancellationRate7d: initial?.cancellationRate7d ?? 0,
      trend: initial?.trend ?? [],
      weakZones: initial?.weakZones ?? [],
      flaggedList: initial?.flaggedList ?? [],
      competitionsList: initial?.competitionsList ?? [],
      notes: notes.trim() || undefined,
    })
  }

  return (
    <>
      <div onClick={onCancel} className="fixed inset-0 bg-[rgba(15,23,42,0.45)] backdrop-blur-sm z-[100] animate-[fadeIn_0.2s_ease]" />
      <div className="fixed inset-0 z-[101] flex items-center justify-center p-5 pointer-events-none">
        <div className="bg-surface rounded-[20px] w-full max-w-[560px] max-h-[92vh] flex flex-col pointer-events-auto shadow-modal animate-[modalSlide_0.25s_ease]">
          <div className="py-[22px] px-7 flex justify-between items-center shrink-0">
            <div>
              <h2 className="text-xl font-bold text-ink-primary m-0">{isEdit ? 'Edit City' : 'Add New City'}</h2>
              <p className="text-[13px] text-ink-secondary mt-1 mb-0">{isEdit ? "Update this city's operations details" : "Start tracking a new city's operations"}</p>
            </div>
            <button onClick={onCancel} className="w-9 h-9 rounded-lg border-none bg-transparent cursor-pointer flex items-center justify-center text-ink-secondary hover:bg-surface-input transition-colors">
              <X size={20} />
            </button>
          </div>

          <div className="flex-1 overflow-auto px-7 pb-5">
            <FieldWithLabel label="City Name" uppercaseLabel>
              <PillInput value={name} onChange={setName} placeholder="e.g. Manchester" />
            </FieldWithLabel>

            <div className="grid grid-cols-2 gap-3">
              <FieldWithLabel label="Country" uppercaseLabel>
                <PillInput value={country} onChange={setCountry} placeholder="e.g. United Kingdom" />
              </FieldWithLabel>
              <FieldWithLabel label="Country Code" uppercaseLabel>
                <PillInput value={countryCode} onChange={setCountryCode} placeholder="e.g. GB" />
              </FieldWithLabel>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <FieldWithLabel label="Population" uppercaseLabel>
                <PillInput value={population} onChange={setPopulation} placeholder="e.g. 2.5M" />
              </FieldWithLabel>
              <FieldWithLabel label="Status" uppercaseLabel>
                <SelectPill value={status} onChange={(v) => setStatus(v as CityHealth)} options={STATUS_OPTIONS} />
              </FieldWithLabel>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <FieldWithLabel label="Plans Today" uppercaseLabel>
                <PillInput value={plansToday} onChange={setPlansToday} placeholder="0" type="number" />
              </FieldWithLabel>
              <FieldWithLabel label="Active Hosts" uppercaseLabel>
                <PillInput value={activeHosts} onChange={setActiveHosts} placeholder="0" type="number" />
              </FieldWithLabel>
              <FieldWithLabel label="Joined (7d)" uppercaseLabel>
                <PillInput value={joinedUsersWeek} onChange={setJoinedUsersWeek} placeholder="0" type="number" />
              </FieldWithLabel>
            </div>

            <FieldWithLabel label="Notes (optional)" uppercaseLabel>
              <PillInput value={notes} onChange={setNotes} placeholder="Context for this city…" />
            </FieldWithLabel>
          </div>

          <div className="py-[18px] px-7 border-t border-line-light flex gap-[10px] justify-end shrink-0">
            <DangerButton label="Cancel" onClick={onCancel} />
            <PrimaryButton label={isEdit ? 'Save Changes' : 'Add City'} onClick={handleSubmit} disabled={!valid} />
          </div>
        </div>
      </div>
    </>
  )
}

export default CityFormModal

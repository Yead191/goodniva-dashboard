import { useState } from 'react'
import { X, Check, Pause, Play, Plus, Ban, Edit2, Zap, CheckCircle2, XCircle, Radio } from 'lucide-react'
import { Card, Badge, IconButton, PrimaryButton, DangerButton, Toggle, FieldWithLabel, PillInput, SelectPill } from '@/components/common'
import ImageUpload from '@/components/ImageUpload'
import { colors } from '@/utils/colors'
import { useMonetisation } from '@/context/MonetisationContext'
import { useToast } from '@/context/ToastContext'
import { SectionTitle, DataTable, Td, StatusPill, currencySymbol } from '../_shared'
import { evaluateLiveEligibility } from '@/utils/sponsorEligibility'
import type { Sponsor, SponsorStatus, SponsorshipPackage, PaymentStatus } from '@/types/monetisation'
import { SPONSOR_STATUSES, SAFETY_STATUSES, COVERING_RADII, PAYMENT_STATUSES } from '@/types/monetisation'

type SponsorDraft = Omit<Sponsor, 'id' | 'joinedDate'>

const blankSponsor: SponsorDraft = {
  name: '', category: '', description: '',
  contactPerson: '', contact: '', contactPhone: '', website: '', socialLink: '',
  address: '', city: '', postcode: '', country: '', latitude: '', longitude: '', coveringRadius: '5km',
  logo: '', appDisplayImage: '', appImageApproved: false, profileImage: '',
  status: 'Draft', safetyStatus: 'Pending', adminNotes: '',
  packageId: undefined, packageStartDate: '', packageEndDate: '', packagePaymentStatus: 'Unpaid',
}

/** Green "LIVE" pill shown when a sponsor passes every go-live condition. */
const LivePill = ({ live }: { live: boolean }) => (
  <span
    className="inline-flex items-center gap-[6px] py-1 px-3 rounded-pill text-xs font-bold whitespace-nowrap"
    style={live ? { background: colors.successLight, color: colors.successText } : { background: colors.bgInput, color: colors.textMuted }}
  >
    <Radio size={12} /> {live ? 'Live' : 'Not live'}
  </span>
)

const SponsorsSection = () => {
  const { sponsors, setSponsors, packages, audit, canEdit } = useMonetisation()
  const { showToast } = useToast()
  const [creating, setCreating] = useState(false)
  const [editing, setEditing] = useState<Sponsor | null>(null)

  const packageName = (id?: number) => packages.find((p) => p.id === id)?.name

  const update = (id: number, status: SponsorStatus, verb: string) => {
    const s = sponsors.find((x) => x.id === id)
    if (!s || !canEdit) return
    setSponsors((prev) => prev.map((x) => (x.id === id ? { ...x, status } : x)))
    audit('Sponsors', `${verb} sponsor`, s.name)
    showToast(`${s.name} ${verb.toLowerCase()}d`, status === 'Rejected' ? 'danger' : status === 'Paused' ? 'warning' : 'success')
  }

  const handleSave = (data: SponsorDraft, id?: number) => {
    if (id) {
      setSponsors((prev) => prev.map((s) => (s.id === id ? { ...s, ...data } : s)))
      audit('Sponsors', 'Edited sponsor', data.name)
      showToast(`${data.name} updated`, 'success')
    } else {
      const sponsor: Sponsor = { ...data, id: Date.now(), joinedDate: 'Today', logo: data.logo || 'https://i.pravatar.cc/80?img=40' }
      setSponsors((prev) => [...prev, sponsor])
      audit('Sponsors', 'Added sponsor', sponsor.name)
      showToast(`${sponsor.name} added`, 'success')
    }
    setCreating(false)
    setEditing(null)
  }

  return (
    <div>
      <SectionTitle title="Sponsors" subtitle="Manage full sponsor profiles, safety review, package assignment and status." action={<PrimaryButton Icon={Plus} label="Add Sponsor" onClick={() => canEdit && setCreating(true)} />} />

      <Card>
        <DataTable headers={['SPONSOR', 'CATEGORY', 'PACKAGE', 'STATUS', 'SAFETY', 'LIVE', 'ACTIONS']}>
          {sponsors.map((s) => (
            <tr key={s.id} className="hover:bg-surface-subtle transition-colors duration-150">
              <Td>
                <div className="flex items-center gap-3">
                  <img src={s.appDisplayImage || s.logo} alt="" className="w-9 h-9 rounded-lg object-cover" />
                  <div>
                    <div className="font-semibold text-ink-primary">{s.name}</div>
                    <div className="text-xs text-ink-muted">{s.city || '—'}</div>
                  </div>
                </div>
              </Td>
              <Td><Badge text={s.category || '—'} bg={colors.bgInput} color={colors.textSecondary} /></Td>
              <Td>{packageName(s.packageId) ? <Badge text={packageName(s.packageId)!} bg={colors.primaryLight} color={colors.primary} /> : <span className="text-ink-muted text-[13px]">Unassigned</span>}</Td>
              <Td><StatusPill status={s.status} /></Td>
              <Td><StatusPill status={s.safetyStatus} /></Td>
              <Td><LivePill live={evaluateLiveEligibility(s, packages.find((p) => p.id === s.packageId)).isLive} /></Td>
              <Td>
                <div className="flex gap-1">
                  <IconButton Icon={Edit2} tooltip="Edit" onClick={() => canEdit && setEditing(s)} />
                  {s.status === 'Pending Review' && <>
                    <IconButton Icon={Check} tooltip="Approve" onClick={() => update(s.id, 'Approved', 'Approve')} />
                    <IconButton Icon={Ban} tooltip="Reject" danger onClick={() => update(s.id, 'Rejected', 'Reject')} />
                  </>}
                  {s.status === 'Approved' && <IconButton Icon={Zap} tooltip="Activate" onClick={() => update(s.id, 'Active', 'Activate')} />}
                  {s.status === 'Active' && <IconButton Icon={Pause} tooltip="Pause" onClick={() => update(s.id, 'Paused', 'Pause')} />}
                  {s.status === 'Paused' && <IconButton Icon={Play} tooltip="Resume" onClick={() => update(s.id, 'Active', 'Resume')} />}
                </div>
              </Td>
            </tr>
          ))}
        </DataTable>
      </Card>

      {(creating || editing) && (
        <SponsorModal
          initial={editing ?? undefined}
          packages={packages}
          onCancel={() => { setCreating(false); setEditing(null) }}
          onSubmit={(data) => handleSave(data, editing?.id)}
        />
      )}
    </div>
  )
}

interface ModalProps {
  initial?: Sponsor
  packages: SponsorshipPackage[]
  onCancel: () => void
  onSubmit: (data: SponsorDraft) => void
}

const NONE = 'None'

const textareaClass = 'w-full rounded-2xl border-2 border-transparent bg-surface-input p-4 text-sm text-ink-primary outline-none focus:border-primary focus:bg-surface resize-none'

const SponsorModal = ({ initial, packages, onCancel, onSubmit }: ModalProps) => {
  const [form, setForm] = useState<SponsorDraft>(initial ?? blankSponsor)
  const set = <K extends keyof SponsorDraft>(k: K, v: SponsorDraft[K]) => setForm((f) => ({ ...f, [k]: v }))

  const packageOptions = [NONE, ...packages.map((p) => p.name)]
  const selectedPackage = packages.find((p) => p.id === form.packageId)
  const selectedPackageName = selectedPackage?.name ?? NONE
  // Evaluate go-live against the in-progress form so the checklist updates live.
  const eligibility = evaluateLiveEligibility({ ...form, id: 0, joinedDate: '' }, selectedPackage)

  return (
    <>
      <div onClick={onCancel} className="fixed inset-0 bg-[rgba(15,23,42,0.45)] backdrop-blur-sm z-[100]" />
      <div className="fixed inset-0 z-[101] flex items-center justify-center p-5 pointer-events-none">
        <div className="bg-surface rounded-[20px] w-full max-w-[640px] max-h-[92vh] flex flex-col pointer-events-auto shadow-modal animate-[modalSlide_0.25s_ease]">
          <div className="py-[22px] px-7 flex justify-between items-center shrink-0">
            <h2 className="text-xl font-bold text-ink-primary m-0">{initial ? 'Edit Sponsor' : 'Add Sponsor'}</h2>
            <button onClick={onCancel} className="w-9 h-9 rounded-lg border-none bg-transparent cursor-pointer flex items-center justify-center text-ink-secondary hover:bg-surface-input transition-colors"><X size={20} /></button>
          </div>

          <div className="flex-1 overflow-auto px-7 pb-5">
            <SectionHeading>Business</SectionHeading>
            <FieldWithLabel label="Business name"><PillInput value={form.name} onChange={(v) => set('name', v)} placeholder="e.g. BrewHaus Coffee" /></FieldWithLabel>
            <FieldWithLabel label="Category / business type"><PillInput value={form.category} onChange={(v) => set('category', v)} placeholder="e.g. Food & Drink" /></FieldWithLabel>
            <FieldWithLabel label="Business description">
              <textarea value={form.description} onChange={(e) => set('description', e.target.value)} rows={3} className={textareaClass} placeholder="Short description shown to users…" />
            </FieldWithLabel>

            <SectionHeading>Contact</SectionHeading>
            <div className="grid grid-cols-2 gap-[14px]">
              <FieldWithLabel label="Contact person"><PillInput value={form.contactPerson} onChange={(v) => set('contactPerson', v)} placeholder="Full name" /></FieldWithLabel>
              <FieldWithLabel label="Contact email"><PillInput value={form.contact} onChange={(v) => set('contact', v)} placeholder="partners@example.com" /></FieldWithLabel>
              <FieldWithLabel label="Contact phone"><PillInput value={form.contactPhone} onChange={(v) => set('contactPhone', v)} placeholder="+44 …" /></FieldWithLabel>
              <FieldWithLabel label="Website"><PillInput value={form.website} onChange={(v) => set('website', v)} placeholder="https://…" /></FieldWithLabel>
              <FieldWithLabel label="Instagram / social link"><PillInput value={form.socialLink} onChange={(v) => set('socialLink', v)} placeholder="https://instagram.com/…" /></FieldWithLabel>
            </div>

            <SectionHeading>Location</SectionHeading>
            <FieldWithLabel label="Address"><PillInput value={form.address} onChange={(v) => set('address', v)} placeholder="Street address" /></FieldWithLabel>
            <div className="grid grid-cols-3 gap-[14px]">
              <FieldWithLabel label="City / area"><PillInput value={form.city} onChange={(v) => set('city', v)} placeholder="London" /></FieldWithLabel>
              <FieldWithLabel label="Postcode"><PillInput value={form.postcode} onChange={(v) => set('postcode', v)} placeholder="EC1A 1BB" /></FieldWithLabel>
              <FieldWithLabel label="Country"><PillInput value={form.country} onChange={(v) => set('country', v)} placeholder="United Kingdom" /></FieldWithLabel>
            </div>
            <div className="grid grid-cols-3 gap-[14px]">
              <FieldWithLabel label="Latitude"><PillInput value={form.latitude} onChange={(v) => set('latitude', v)} placeholder="51.5155" /></FieldWithLabel>
              <FieldWithLabel label="Longitude"><PillInput value={form.longitude} onChange={(v) => set('longitude', v)} placeholder="-0.0922" /></FieldWithLabel>
              <FieldWithLabel label="Covering distance / radius"><SelectPill value={form.coveringRadius} onChange={(v) => set('coveringRadius', v as SponsorDraft['coveringRadius'])} options={[...COVERING_RADII]} /></FieldWithLabel>
            </div>

            <SectionHeading>Images</SectionHeading>
            <FieldWithLabel label="Logo"><ImageUpload value={form.logo} onChange={(v) => set('logo', v)} /></FieldWithLabel>
            <FieldWithLabel label="App display image (shown to users in the app)"><ImageUpload value={form.appDisplayImage} onChange={(v) => setForm((f) => ({ ...f, appDisplayImage: v, appImageApproved: false }))} variant="wide" /></FieldWithLabel>
            <div className="rounded-2xl bg-surface-input px-4 mb-[14px]">
              <Toggle
                checked={form.appImageApproved}
                onChange={(v) => set('appImageApproved', v)}
                disabled={!form.appDisplayImage}
                label="App display image approved"
                description="Required for go-live. Re-uploading the image resets this."
              />
            </div>
            <FieldWithLabel label="Main profile image (optional)"><ImageUpload value={form.profileImage} onChange={(v) => set('profileImage', v)} variant="wide" /></FieldWithLabel>

            <SectionHeading>Package assignment</SectionHeading>
            <FieldWithLabel label="Sponsorship package">
              <SelectPill
                value={selectedPackageName}
                onChange={(name) => set('packageId', name === NONE ? undefined : packages.find((p) => p.name === name)?.id)}
                options={packageOptions}
              />
            </FieldWithLabel>

            {selectedPackage && (
              <div className="rounded-2xl bg-surface-input p-4 mb-[14px] grid grid-cols-2 gap-x-6 gap-y-[10px]">
                <DetailRow label="Package name" value={selectedPackage.name} />
                <DetailRow label="Price" value={`${currencySymbol(selectedPackage.currency)}${selectedPackage.price.toLocaleString()}`} />
                <DetailRow label="Billing period" value={selectedPackage.billingPeriod} />
                <DetailRow label="Package status" value={selectedPackage.active ? 'Active' : 'Paused'} />
                <DetailRow label="Priority" value={`P${selectedPackage.priority}`} />
                <DetailRow label="Reporting" value={selectedPackage.reportingLevel} />
                <div className="col-span-2">
                  <span className="text-[11px] font-bold text-ink-secondary tracking-[0.4px] uppercase">Placements</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {selectedPackage.placements.map((pl) => <Badge key={pl} text={pl} bg={colors.primaryLight} color={colors.primary} />)}
                  </div>
                </div>
              </div>
            )}

            <div className="grid grid-cols-3 gap-[14px]">
              <FieldWithLabel label="Start date"><PillInput type="date" value={form.packageStartDate} onChange={(v) => set('packageStartDate', v)} /></FieldWithLabel>
              <FieldWithLabel label="End date"><PillInput type="date" value={form.packageEndDate} onChange={(v) => set('packageEndDate', v)} /></FieldWithLabel>
              <FieldWithLabel label="Payment status"><SelectPill value={form.packagePaymentStatus} onChange={(v) => set('packagePaymentStatus', v as PaymentStatus)} options={[...PAYMENT_STATUSES]} /></FieldWithLabel>
            </div>

            <SectionHeading>Workflow</SectionHeading>
            <div className="grid grid-cols-2 gap-[14px]">
              <FieldWithLabel label="Sponsor status"><SelectPill value={form.status} onChange={(v) => set('status', v as SponsorStatus)} options={[...SPONSOR_STATUSES]} /></FieldWithLabel>
              <FieldWithLabel label="Safety approval"><SelectPill value={form.safetyStatus} onChange={(v) => set('safetyStatus', v as SponsorDraft['safetyStatus'])} options={[...SAFETY_STATUSES]} /></FieldWithLabel>
            </div>
            <FieldWithLabel label="Internal admin notes">
              <textarea value={form.adminNotes} onChange={(e) => set('adminNotes', e.target.value)} rows={3} className={textareaClass} placeholder="Admin-only notes — not shown to users…" />
            </FieldWithLabel>

            <SectionHeading>Go-live eligibility</SectionHeading>
            <div className={`rounded-2xl p-4 border ${eligibility.isLive ? 'border-success bg-success-light/40' : 'border-line-light bg-surface-input'}`}>
              <div className="flex items-center gap-2 mb-3">
                <LivePill live={eligibility.isLive} />
                <span className="text-[13px] text-ink-secondary">
                  {eligibility.isLive ? 'All conditions met — this sponsor is live.' : `${eligibility.blockers.length} condition(s) still blocking go-live.`}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-x-6 gap-y-2">
                {eligibility.checks.map((c) => (
                  <div key={c.label} className="flex items-center gap-2">
                    {c.ok ? <CheckCircle2 size={16} className="text-success-text shrink-0" /> : <XCircle size={16} className="text-danger shrink-0" />}
                    <span className={`text-[13px] ${c.ok ? 'text-ink-primary' : 'text-ink-secondary'}`}>{c.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="py-[18px] px-7 border-t border-line-light flex gap-[10px] justify-end shrink-0">
            <DangerButton label="Cancel" onClick={onCancel} />
            <PrimaryButton label={initial ? 'Update Sponsor' : 'Add Sponsor'} onClick={() => form.name.trim() && onSubmit(form)} />
          </div>
        </div>
      </div>
    </>
  )
}

const SectionHeading = ({ children }: { children: React.ReactNode }) => (
  <h3 className="text-[11px] font-bold text-ink-secondary tracking-[0.6px] uppercase mt-5 mb-3 first:mt-0">{children}</h3>
)

const DetailRow = ({ label, value }: { label: string; value: string }) => (
  <div className="flex items-center justify-between gap-3">
    <span className="text-[13px] text-ink-secondary">{label}</span>
    <span className="text-[13px] font-semibold text-ink-primary text-right">{value}</span>
  </div>
)

export default SponsorsSection

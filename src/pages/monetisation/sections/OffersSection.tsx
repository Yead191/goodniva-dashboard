import { useMemo, useState } from 'react'
import { X, Plus, Power, Tag, Gift, Edit2, Store, Sparkles, MapPin, Ticket, Building2 } from 'lucide-react'
import { Card, Badge, StatCard, IconButton, PrimaryButton, DangerButton, Toggle, SegmentedTabs, FieldWithLabel, PillInput, SelectPill } from '@/components/common'
import { colors } from '@/utils/colors'
import { useMonetisation } from '@/context/MonetisationContext'
import { useToast } from '@/context/ToastContext'
import { surfacesAtPlanCreation, planCreationBlocker, isFullyRedeemed } from '@/utils/offers'
import { SectionTitle, DataTable, Td, StatusPill, EmptyRow } from '../_shared'
import type { Offer, OfferKind, Sponsor } from '@/types/monetisation'
import { OFFER_KINDS } from '@/types/monetisation'

type OfferDraft = Omit<Offer, 'id' | 'redemptions' | 'status'>
type OwnerFilter = 'all' | 'partner' | 'platform'

const PLATFORM = 'GoodNiva (platform-wide)'

const KIND_STYLES: Record<OfferKind, { bg: string; color: string }> = {
  'Discount Code': { bg: colors.primaryLight, color: colors.primary },
  'Special Offer': { bg: colors.infoLight, color: colors.infoText },
  Perk: { bg: colors.warningLight, color: colors.warningText },
}

/** Trading name is what users see, so prefer it over the registered name. */
const partnerLabel = (p: Sponsor) => p.tradingName || p.name

const OffersSection = () => {
  const { offers, setOffers, sponsors, audit, canEdit } = useMonetisation()
  const { showToast } = useToast()
  const [creating, setCreating] = useState(false)
  const [editing, setEditing] = useState<Offer | null>(null)
  const [ownerFilter, setOwnerFilter] = useState<OwnerFilter>('all')

  const partnerName = (id?: number) => {
    const p = sponsors.find((s) => s.id === id)
    return p ? partnerLabel(p) : undefined
  }

  const visible = offers.filter((o) =>
    ownerFilter === 'all' ? true : ownerFilter === 'partner' ? o.partnerId !== undefined : o.partnerId === undefined,
  )

  const stats = useMemo(() => {
    const linked = offers.filter((o) => o.partnerId !== undefined)
    return {
      total: offers.length,
      linked: linked.length,
      unlinked: offers.length - linked.length,
      surfacing: offers.filter(surfacesAtPlanCreation).length,
      redemptions: offers.reduce((sum, o) => sum + o.redemptions, 0),
    }
  }, [offers])

  const toggleStatus = (o: Offer) => {
    if (!canEdit) return
    const next = o.status === 'Disabled' ? 'Active' : 'Disabled'
    setOffers((prev) => prev.map((x) => (x.id === o.id ? { ...x, status: next } : x)))
    audit('Offers', `${next === 'Disabled' ? 'Disabled' : 'Enabled'} offer`, o.code)
    showToast(`${o.code} ${next === 'Disabled' ? 'disabled' : 'enabled'}`, next === 'Disabled' ? 'warning' : 'success')
  }

  const togglePlanCreation = (o: Offer, next: boolean) => {
    if (!canEdit) return
    setOffers((prev) => prev.map((x) => (x.id === o.id ? { ...x, showInPlanCreation: next } : x)))
    audit('Offers', `${next ? 'Enabled' : 'Disabled'} plan creation surfacing`, o.code)
  }

  const handleSave = (data: OfferDraft, id?: number) => {
    if (id) {
      setOffers((prev) => prev.map((o) => (o.id === id ? { ...o, ...data } : o)))
      audit('Offers', 'Edited offer', `${data.code} — ${partnerName(data.partnerId) ?? 'platform-wide'}`)
      showToast(`Offer "${data.code}" updated`, 'success')
    } else {
      setOffers((prev) => [...prev, { ...data, id: Date.now(), redemptions: 0, status: 'Active' }])
      audit('Offers', 'Created offer', `${data.code} — ${partnerName(data.partnerId) ?? 'platform-wide'}`)
      showToast(`Offer "${data.code}" created`, 'success')
    }
    setCreating(false)
    setEditing(null)
  }

  return (
    <div>
      <SectionTitle
        title="Offers"
        subtitle="Discount codes, special offers and venue perks. Every offer is tied to a partner so the business relationship stays reportable."
        action={<PrimaryButton Icon={Plus} label="New Offer" onClick={() => canEdit && setCreating(true)} />}
      />

      <div className="grid grid-cols-4 gap-4 mb-5">
        <StatCard Icon={Ticket} iconBg={colors.primaryLight} iconColor={colors.primary} label="Total Offers" value={stats.total} />
        <StatCard Icon={Store} iconBg={colors.successLight} iconColor={colors.success} label="Linked to a Partner" value={stats.linked} badge={stats.unlinked ? `${stats.unlinked} platform-wide` : 'All linked'} badgeTone={stats.unlinked ? 'info' : 'success'} />
        <StatCard Icon={Sparkles} iconBg={colors.infoLight} iconColor={colors.info} label="Live in Plan Creation" value={stats.surfacing} />
        <StatCard Icon={Gift} iconBg={colors.warningLight} iconColor={colors.warning} label="Total Redemptions" value={stats.redemptions.toLocaleString()} />
      </div>

      <Card>
        <div className="flex items-center justify-between gap-3 mb-4 flex-wrap">
          <h3 className="text-base font-bold text-ink-primary m-0">All offers</h3>
          <SegmentedTabs
            value={ownerFilter}
            onChange={setOwnerFilter}
            options={[
              { key: 'all', label: `All (${offers.length})` },
              { key: 'partner', label: `Partner offers (${stats.linked})` },
              { key: 'platform', label: `Platform-wide (${stats.unlinked})` },
            ]}
          />
        </div>

        <DataTable headers={['OFFER', 'TYPE', 'PARTNER / VENUE', 'VALUE', 'REDEMPTIONS', 'PLAN CREATION', 'STATUS', 'ACTIONS']}>
          {visible.length === 0 && <EmptyRow colSpan={8} message="No offers match this filter." />}
          {visible.map((o) => {
            const blocker = planCreationBlocker(o)
            const owner = partnerName(o.partnerId)
            return (
              <tr key={o.id} className="hover:bg-surface-subtle transition-colors duration-150">
                <Td>
                  <div className="font-mono font-bold text-ink-primary">{o.code}</div>
                  <div className="text-xs text-ink-muted max-w-[220px]">{o.description}</div>
                </Td>
                <Td><Badge text={o.kind} bg={KIND_STYLES[o.kind].bg} color={KIND_STYLES[o.kind].color} /></Td>
                <Td>
                  {owner ? (
                    <>
                      <div className="font-semibold text-ink-primary whitespace-nowrap">{owner}</div>
                      <div className="text-xs text-ink-muted flex items-center gap-1">
                        <MapPin size={11} className="shrink-0" />
                        {o.venue || 'All venues'}
                      </div>
                    </>
                  ) : (
                    <span className="text-[13px] text-ink-muted italic">{PLATFORM}</span>
                  )}
                </Td>
                <Td>
                  <div className="font-semibold whitespace-nowrap">{o.value}</div>
                  <div className="text-xs text-ink-muted whitespace-nowrap">Expires {o.expiry}</div>
                </Td>
                <Td className="tabular-nums whitespace-nowrap">
                  {o.redemptions.toLocaleString()} / {o.maxRedemptions.toLocaleString()}
                  {isFullyRedeemed(o) && <div className="text-xs text-danger">Limit reached</div>}
                </Td>
                <Td>
                  <div className="flex items-center gap-2">
                    <Toggle
                      checked={o.showInPlanCreation}
                      onChange={(v) => togglePlanCreation(o, v)}
                      canEdit={canEdit}
                      disabled={o.partnerId === undefined}
                    />
                    {o.showInPlanCreation && blocker && <span className="text-xs text-warning-text">{blocker}</span>}
                  </div>
                </Td>
                <Td><StatusPill status={o.status} /></Td>
                <Td>
                  <div className="flex gap-1">
                    <IconButton Icon={Edit2} tooltip="Edit" onClick={() => canEdit && setEditing(o)} />
                    <IconButton Icon={Power} tooltip={o.status === 'Disabled' ? 'Enable' : 'Disable'} onClick={() => toggleStatus(o)} />
                  </div>
                </Td>
              </tr>
            )
          })}
        </DataTable>
      </Card>

      <PlanCreationPreview />

      {(creating || editing) && (
        <OfferModal
          initial={editing ?? undefined}
          partners={sponsors}
          onCancel={() => { setCreating(false); setEditing(null) }}
          onSubmit={(data) => handleSave(data, editing?.id)}
        />
      )}
    </div>
  )
}

/**
 * Mirrors what the app shows a user who picks a partner venue while creating a
 * plan, so admins can confirm the offer wiring without leaving the dashboard.
 */
const PlanCreationPreview = () => {
  const { offers, sponsors } = useMonetisation()
  const [partnerName, setPartnerName] = useState(sponsors[0] ? partnerLabel(sponsors[0]) : '')

  const partner = sponsors.find((s) => partnerLabel(s) === partnerName)
  const linked = partner ? offers.filter((o) => o.partnerId === partner.id) : []
  const surfacing = linked.filter(surfacesAtPlanCreation)
  const withheld = linked.filter((o) => !surfacesAtPlanCreation(o))

  return (
    <div className="mt-5">
      <Card>
        <div className="flex items-start justify-between gap-4 mb-4 flex-wrap">
          <div>
            <h3 className="text-base font-bold text-ink-primary m-0">Plan creation preview</h3>
            <p className="text-[13px] text-ink-secondary mt-1 mb-0">What a user sees after choosing this partner's venue for a plan.</p>
          </div>
          <div className="w-[260px] shrink-0">
            <SelectPill value={partnerName} onChange={setPartnerName} options={sponsors.map(partnerLabel)} />
          </div>
        </div>

        {partner && (
          <div className="flex items-center gap-3 rounded-2xl bg-surface-input p-3 mb-4">
            <img src={partner.appDisplayImage || partner.logo} alt="" className="w-10 h-10 rounded-lg object-cover" />
            <div className="min-w-0">
              <div className="text-sm font-semibold text-ink-primary">{partnerLabel(partner)}</div>
              <div className="text-xs text-ink-muted flex items-center gap-1">
                <MapPin size={11} className="shrink-0" />
                {[partner.address, partner.city].filter(Boolean).join(', ') || 'No address on file'}
              </div>
            </div>
          </div>
        )}

        {surfacing.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-line p-6 text-center">
            <div className="text-[13px] font-semibold text-ink-secondary">No offer would be shown here</div>
            <div className="text-xs text-ink-muted mt-1">
              {linked.length === 0
                ? 'This partner has no offers yet.'
                : `${linked.length} offer(s) exist but none are eligible to surface right now.`}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {surfacing.map((o) => (
              <div key={o.id} className="rounded-2xl border border-success/40 bg-success-light/30 p-4">
                <div className="flex items-center justify-between gap-2 mb-2">
                  <Badge text={o.kind} bg={KIND_STYLES[o.kind].bg} color={KIND_STYLES[o.kind].color} />
                  <span className="font-mono text-xs font-bold text-ink-secondary">{o.code}</span>
                </div>
                <div className="text-sm font-bold text-ink-primary">{o.value}</div>
                <div className="text-[13px] text-ink-secondary mt-0.5">{o.description}</div>
                {o.terms && <div className="text-xs text-ink-muted mt-2">{o.terms}</div>}
                <div className="text-xs text-ink-muted mt-2 flex items-center gap-1">
                  <MapPin size={11} className="shrink-0" />
                  {o.venue || 'All venues'} · expires {o.expiry}
                </div>
              </div>
            ))}
          </div>
        )}

        {withheld.length > 0 && (
          <div className="mt-4 pt-4 border-t border-line-light">
            <div className="text-[11px] font-bold text-ink-secondary tracking-[0.6px] uppercase mb-2">Not shown</div>
            <div className="flex flex-col gap-1">
              {withheld.map((o) => (
                <div key={o.id} className="flex items-center gap-2 text-[13px]">
                  <span className="font-mono font-bold text-ink-secondary">{o.code}</span>
                  <span className="text-ink-muted">— {planCreationBlocker(o)}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </Card>
    </div>
  )
}

interface ModalProps {
  initial?: Offer
  partners: Sponsor[]
  onCancel: () => void
  onSubmit: (data: OfferDraft) => void
}

const blankOffer: OfferDraft = {
  code: '', kind: 'Discount Code', description: '', value: '',
  partnerId: undefined, venue: '', showInPlanCreation: false, terms: '',
  maxRedemptions: 1000, expiry: '',
}

const OfferModal = ({ initial, partners, onCancel, onSubmit }: ModalProps) => {
  const [form, setForm] = useState<OfferDraft>(initial ?? blankOffer)
  const set = <K extends keyof OfferDraft>(k: K, v: OfferDraft[K]) => setForm((f) => ({ ...f, [k]: v }))

  const owner = partners.find((p) => p.id === form.partnerId)
  const ownerOptions = [PLATFORM, ...partners.map(partnerLabel)]

  const selectOwner = (label: string) => {
    if (label === PLATFORM) {
      // Platform offers have no venue and never surface during plan creation.
      setForm((f) => ({ ...f, partnerId: undefined, venue: '', showInPlanCreation: false }))
      return
    }
    setForm((f) => ({ ...f, partnerId: partners.find((p) => partnerLabel(p) === label)?.id }))
  }

  const Icon = form.kind === 'Discount Code' ? Tag : form.kind === 'Special Offer' ? Sparkles : Gift

  return (
    <>
      <div onClick={onCancel} className="fixed inset-0 bg-[rgba(15,23,42,0.45)] backdrop-blur-sm z-[100]" />
      <div className="fixed inset-0 z-[101] flex items-center justify-center p-5 pointer-events-none">
        <div className="bg-surface rounded-[20px] w-full max-w-[560px] max-h-[92vh] flex flex-col pointer-events-auto shadow-modal animate-[modalSlide_0.25s_ease]">
          <div className="py-[22px] px-7 flex justify-between items-center shrink-0">
            <h2 className="text-xl font-bold text-ink-primary m-0 flex items-center gap-2">
              <Icon size={20} /> {initial ? 'Edit Offer' : 'New Offer'}
            </h2>
            <button onClick={onCancel} className="w-9 h-9 rounded-lg border-none bg-transparent cursor-pointer flex items-center justify-center text-ink-secondary hover:bg-surface-input transition-colors"><X size={20} /></button>
          </div>

          <div className="flex-1 overflow-auto px-7 pb-5">
            <SectionHeading>Ownership</SectionHeading>
            <FieldWithLabel label="Partner">
              <SelectPill value={owner ? partnerLabel(owner) : PLATFORM} onChange={selectOwner} options={ownerOptions} />
            </FieldWithLabel>
            {owner ? (
              <FieldWithLabel label="Venue (leave blank for all of this partner's venues)">
                <PillInput value={form.venue} onChange={(v) => set('venue', v)} iconLeft={Building2} placeholder={`e.g. ${partnerLabel(owner)} ${owner.city || 'High Street'}`} />
              </FieldWithLabel>
            ) : (
              <div className="rounded-2xl bg-surface-input p-4 mb-[14px] text-[13px] text-ink-secondary">
                Platform-wide offers are funded by GoodNiva, not a partner. They never surface during plan creation.
              </div>
            )}

            <SectionHeading>Offer</SectionHeading>
            <div className="grid grid-cols-2 gap-[14px]">
              <FieldWithLabel label="Code"><PillInput value={form.code} onChange={(v) => set('code', v.toUpperCase())} placeholder="BREWFREE" /></FieldWithLabel>
              <FieldWithLabel label="Type"><SelectPill value={form.kind} onChange={(v) => set('kind', v as OfferKind)} options={[...OFFER_KINDS]} /></FieldWithLabel>
            </div>
            <FieldWithLabel label="Description"><PillInput value={form.description} onChange={(v) => set('description', v)} placeholder="Free filter coffee for everyone on the plan" /></FieldWithLabel>
            <div className="grid grid-cols-3 gap-[14px]">
              <FieldWithLabel label="Value"><PillInput value={form.value} onChange={(v) => set('value', v)} placeholder="Free coffee" /></FieldWithLabel>
              <FieldWithLabel label="Max redemptions"><PillInput value={String(form.maxRedemptions)} onChange={(v) => set('maxRedemptions', Number(v.replace(/[^0-9]/g, '')) || 0)} placeholder="1000" /></FieldWithLabel>
              <FieldWithLabel label="Expiry"><PillInput value={form.expiry} onChange={(v) => set('expiry', v)} placeholder="31 Dec 2026" /></FieldWithLabel>
            </div>
            <FieldWithLabel label="Terms shown to users"><PillInput value={form.terms} onChange={(v) => set('terms', v)} placeholder="Up to 6 people. Show the plan in-store." /></FieldWithLabel>

            <SectionHeading>Plan creation</SectionHeading>
            <div className="rounded-2xl bg-surface-input px-4">
              <Toggle
                checked={form.showInPlanCreation}
                onChange={(v) => set('showInPlanCreation', v)}
                disabled={!owner}
                label="Surface this offer during plan creation"
                description={owner
                  ? 'Users who pick this venue for a plan will see the offer alongside it.'
                  : 'Only available once the offer belongs to a partner.'}
              />
            </div>
          </div>

          <div className="py-[18px] px-7 border-t border-line-light flex gap-[10px] justify-end shrink-0">
            <DangerButton label="Cancel" onClick={onCancel} />
            <PrimaryButton label={initial ? 'Update Offer' : 'Create Offer'} onClick={() => form.code.trim() && onSubmit({ ...form, expiry: form.expiry || 'No expiry' })} />
          </div>
        </div>
      </div>
    </>
  )
}

const SectionHeading = ({ children }: { children: React.ReactNode }) => (
  <h3 className="text-[11px] font-bold text-ink-secondary tracking-[0.6px] uppercase mt-5 mb-3 first:mt-0">{children}</h3>
)

export default OffersSection

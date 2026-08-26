import type { Sponsor, SponsorshipPackage } from '@/types/monetisation'

export interface LiveCheck {
  label: string
  ok: boolean
}

export interface LiveEligibility {
  /** True only when every condition passes. */
  isLive: boolean
  checks: LiveCheck[]
  /** Short list of the failing conditions, for compact display. */
  blockers: string[]
}

const parse = (iso: string): number | null => {
  if (!iso) return null
  const t = Date.parse(iso)
  return Number.isNaN(t) ? null : t
}

/**
 * Evaluates whether a partner may go live. A partner is live ONLY when an
 * approved profile AND an active, paid, in-window assigned package both hold —
 * neither condition alone is sufficient.
 */
export const evaluateLiveEligibility = (
  sponsor: Sponsor,
  pkg: SponsorshipPackage | undefined,
  now: number = Date.now(),
): LiveEligibility => {
  const start = parse(sponsor.packageStartDate)
  const end = parse(sponsor.packageEndDate)

  const checks: LiveCheck[] = [
    { label: 'Profile approved or active', ok: sponsor.status === 'Approved' || sponsor.status === 'Active' },
    { label: 'Safety approval approved', ok: sponsor.safetyStatus === 'Approved' },
    { label: 'Package assigned', ok: !!pkg },
    { label: 'Package status active', ok: !!pkg && pkg.active },
    { label: 'Payment paid or manually approved', ok: sponsor.packagePaymentStatus === 'Paid' || sponsor.packagePaymentStatus === 'Manually Approved' },
    { label: 'Start date has arrived', ok: start !== null && start <= now },
    { label: 'End date has not passed', ok: end !== null && end >= now },
    { label: 'App display image uploaded & approved', ok: !!sponsor.appDisplayImage && sponsor.appImageApproved },
  ]

  return {
    isLive: checks.every((c) => c.ok),
    checks,
    blockers: checks.filter((c) => !c.ok).map((c) => c.label),
  }
}

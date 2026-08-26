import type { Offer } from '@/types/monetisation'

/** True once an offer has burnt through its redemption allowance. */
export const isFullyRedeemed = (o: Offer): boolean => o.maxRedemptions > 0 && o.redemptions >= o.maxRedemptions

/**
 * Whether the app should show this offer to a user who has just picked the
 * owning partner's venue during plan creation. All four conditions must hold:
 * it belongs to a partner, it is switched on for plan creation, it is live,
 * and it still has redemptions left.
 */
export const surfacesAtPlanCreation = (o: Offer): boolean =>
  o.partnerId !== undefined && o.showInPlanCreation && o.status === 'Active' && !isFullyRedeemed(o)

/** Human-readable reason an offer will not surface, or null when it will. */
export const planCreationBlocker = (o: Offer): string | null => {
  if (o.partnerId === undefined) return 'Not linked to a partner'
  if (!o.showInPlanCreation) return 'Plan creation surfacing is off'
  if (o.status !== 'Active') return `Offer is ${o.status.toLowerCase()}`
  if (isFullyRedeemed(o)) return 'Redemption limit reached'
  return null
}

/** Offers scoped to a partner, limited to a named venue when one is given. */
export const offersForVenue = (offers: Offer[], partnerId: number, venue?: string): Offer[] =>
  offers.filter((o) => o.partnerId === partnerId && (!venue || !o.venue || o.venue === venue))

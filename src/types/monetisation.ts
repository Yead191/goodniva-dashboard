// ── Subscriptions (GoodNiva Plus members) ──────────────────────────────
export type PlusStatus = 'Active' | 'Cancelled' | 'Past Due' | 'Expired' | 'Refunded'

export interface PlusMember {
  id: number
  user: { name: string; email: string; avatar: string }
  plan: 'Plus Monthly' | 'Plus Annual'
  amount: number
  status: PlusStatus
  startDate: string
  renewalDate: string
  /** Set when the member has cancelled but retains access until expiry. */
  cancelledAt?: string
  /** Set when a refund has been issued. */
  refundedAmount?: number
}

// ── Subscription pricing config ────────────────────────────────────────
export interface PricingConfig {
  amount: number
  currency: 'GBP' | 'USD' | 'EUR'
  billingPeriod: 'Monthly' | 'Annual'
  annualAmount: number
  trialEnabled: boolean
  trialLengthDays: number
  displayText: string
  /** Threshold (£ saved) above which the "switch to annual" nudge is shown. */
  savingsNudgeThreshold: number
}

// ── Trials ─────────────────────────────────────────────────────────────
export type TrialState = 'Active' | 'Expired' | 'Converted'

export interface Trial {
  id: number
  user: { name: string; email: string; avatar: string }
  startDate: string
  endDate: string
  state: TrialState
  /** Set when the trial converted to a paid plan. */
  convertedTo?: 'Plus Monthly' | 'Plus Annual'
}

// ── Boost products & purchases ─────────────────────────────────────────
export type BoostType = 'Access' | 'Visibility'

export interface BoostProduct {
  id: number
  name: string
  type: BoostType
  price: number
  credits: number
  active: boolean
  description: string
}

export type BoostPurchaseStatus = 'Completed' | 'Refunded' | 'Pending'

export interface BoostPurchase {
  id: string
  user: { name: string; email: string; avatar: string }
  product: string
  type: BoostType
  amount: number
  creditsPurchased: number
  creditsUsed: number
  status: BoostPurchaseStatus
  date: string
}

// ── Native ads / AdMob ─────────────────────────────────────────────────
export type Platform = 'iOS' | 'Android'

export interface AdUnit {
  id: number
  platform: Platform
  placement: string
  adUnitId: string
}

export interface AdsConfig {
  nativeAdsEnabled: boolean
  admobFallbackEnabled: boolean
  mediationEnabled: boolean
  /** Suppress ads during a user's very first session. */
  firstSessionSuppression: boolean
  adUnits: AdUnit[]
}

// ── Rewarded ads (future) ──────────────────────────────────────────────
export interface RewardedAdsConfig {
  enabled: boolean
  provider: 'AdMob' | 'AppLovin' | 'Unity Ads'
  dailyCap: number
  allowedRewards: string[]
}

// ── Sponsors & packages ────────────────────────────────────────────────
export type SponsorStatus = 'Pending' | 'Approved' | 'Paused' | 'Rejected'

export interface Sponsor {
  id: number
  name: string
  logo: string
  contact: string
  category: string
  status: SponsorStatus
  joinedDate: string
}

export type ReportingLevel = 'Basic' | 'Standard' | 'Premium'

export interface SponsorshipPackage {
  id: number
  name: string
  price: number
  placements: string[]
  priority: number
  reportingLevel: ReportingLevel
  active: boolean
}

// ── Campaigns ──────────────────────────────────────────────────────────
export type CampaignStatus = 'Live' | 'Scheduled' | 'Paused' | 'Ended' | 'Pending Approval'
export type CampaignPlacement = 'Vibe' | 'Feed' | 'Partner Venue'

export interface Campaign {
  id: number
  name: string
  sponsor: string
  placement: CampaignPlacement
  targeting: string
  dailyCap: number
  startDate: string
  endDate: string
  status: CampaignStatus
}

export interface CampaignsConfig {
  vibeSponsoredCardsEnabled: boolean
  feedSponsoredCardsEnabled: boolean
  partnerVenueSuggestionsEnabled: boolean
  competitionPartnerVenueEnabled: boolean
  feedFirstAdPosition: number
  feedRepeatFrequency: number
  feedMaxAdsPerSession: number
}

// ── Offers ─────────────────────────────────────────────────────────────
export type OfferStatus = 'Active' | 'Scheduled' | 'Expired' | 'Disabled'
export type OfferKind = 'Discount Code' | 'Perk'

export interface Offer {
  id: number
  code: string
  kind: OfferKind
  description: string
  value: string
  redemptions: number
  maxRedemptions: number
  expiry: string
  status: OfferStatus
}

// ── Audit log ──────────────────────────────────────────────────────────
export interface AuditEntry {
  id: number
  section: string
  action: string
  detail: string
  admin: string
  timestamp: string
}

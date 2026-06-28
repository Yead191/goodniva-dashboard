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
import type { PlanLimits } from './index'

export interface PricingConfig {
  amount: number
  currency: 'GBP' | 'USD' | 'EUR'
  billingPeriod: 'Monthly' | 'Annual'
  annualAmount: number
  trialEnabled: boolean
  trialLengthDays: number
  /**
   * Entitlements the free trial unlocks. Deliberately separate from GoodNiva
   * Plus — trial users get their own (typically reduced) limits, not full Plus.
   */
  trialLimits: PlanLimits
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

/** A surface where native ads can appear, with its own on/off switch. */
export interface AdPlacementToggle {
  key: string
  label: string
  description: string
  enabled: boolean
}

export interface AdsConfig {
  nativeAdsEnabled: boolean
  admobFallbackEnabled: boolean
  mediationEnabled: boolean
  /** Suppress ads during a user's very first session. */
  firstSessionSuppression: boolean
  /** Per-surface placement switches (Feed, Vibe, Plan details, …). */
  placements: AdPlacementToggle[]
  /** Feed ad pacing — position of the first ad and how often ads repeat. */
  feedFirstAdPosition: number
  feedRepeatFrequency: number
  feedMaxAdsPerSession: number
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
export type SponsorStatus = 'Draft' | 'Pending Review' | 'Approved' | 'Active' | 'Paused' | 'Rejected'
export type SafetyStatus = 'Pending' | 'Approved' | 'Rejected'
export type CoveringRadius = '1km' | '5km' | '10km' | '25km' | 'City-wide'

export const SPONSOR_STATUSES: SponsorStatus[] = ['Draft', 'Pending Review', 'Approved', 'Active', 'Paused', 'Rejected']
export const SAFETY_STATUSES: SafetyStatus[] = ['Pending', 'Approved', 'Rejected']
export const COVERING_RADII: CoveringRadius[] = ['1km', '5km', '10km', '25km', 'City-wide']

export interface Sponsor {
  id: number
  /** Business / sponsor name. */
  name: string
  category: string
  description: string
  // Contact
  contactPerson: string
  /** Primary contact email. */
  contact: string
  contactPhone: string
  website: string
  socialLink: string
  // Location
  address: string
  city: string
  postcode: string
  country: string
  latitude: string
  longitude: string
  coveringRadius: CoveringRadius
  // Media
  logo: string
  /** Image shown to users in the app. */
  appDisplayImage: string
  /** Whether the app display image has passed review (required to go live). */
  appImageApproved: boolean
  /** Optional main profile/hero image. */
  profileImage: string
  // Workflow
  status: SponsorStatus
  safetyStatus: SafetyStatus
  /** Internal admin-only notes, not shown to users. */
  adminNotes: string
  // Package assignment (the sponsor's contract for a package)
  /** Sponsorship package this sponsor is assigned to. */
  packageId?: number
  /** Assignment start date (ISO yyyy-mm-dd). */
  packageStartDate: string
  /** Assignment end date (ISO yyyy-mm-dd). */
  packageEndDate: string
  packagePaymentStatus: PaymentStatus
  joinedDate: string
}

export type ReportingLevel = 'Basic' | 'Standard' | 'Premium'
export type BillingPeriod = 'Monthly' | 'Quarterly' | 'Annual' | 'One-off'
export type Currency = 'GBP' | 'USD' | 'EUR'

export interface SponsorshipPackage {
  id: number
  name: string
  price: number
  currency: Currency
  billingPeriod: BillingPeriod
  placements: string[]
  priority: number
  reportingLevel: ReportingLevel
  active: boolean
}

/** Payment state of a sponsor's assigned package. */
export type PaymentStatus = 'Unpaid' | 'Paid' | 'Manually Approved'
export const PAYMENT_STATUSES: PaymentStatus[] = ['Unpaid', 'Paid', 'Manually Approved']

// ── Campaigns ──────────────────────────────────────────────────────────
export type CampaignStatus = 'Live' | 'Scheduled' | 'Paused' | 'Ended' | 'Pending Approval'
export type CampaignPlacement = 'Vibe' | 'Feed' | 'Partner Venue'

/** Sponsor-facing performance metrics for a campaign. */
export interface CampaignMetrics {
  impressions: number
  clicks: number
  /** Times users picked this sponsor's venue when creating a plan. */
  venueSelections: number
  /** Plans created at this venue. */
  plansCreated: number
  /** Users who joined plans at this venue. */
  usersJoined: number
  /** Offer / promo claims attributed to the campaign. */
  offerClaims: number
}

export interface Campaign {
  id: number
  name: string
  sponsor: string
  /** Package this campaign runs under. */
  package?: string
  placement: CampaignPlacement
  targeting: string
  dailyCap: number
  startDate: string
  endDate: string
  status: CampaignStatus
  metrics: CampaignMetrics
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

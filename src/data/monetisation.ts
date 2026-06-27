import type {
  PlusMember,
  PricingConfig,
  Trial,
  BoostProduct,
  BoostPurchase,
  AdsConfig,
  RewardedAdsConfig,
  Sponsor,
  SponsorshipPackage,
  Campaign,
  CampaignsConfig,
  Offer,
  AuditEntry,
} from '@/types/monetisation'

const av = (n: number) => `https://i.pravatar.cc/80?img=${n}`

// ── Plus members ───────────────────────────────────────────────────────
export const plusMembersSeed: PlusMember[] = [
  { id: 1, user: { name: 'Olivia Bennett', email: 'olivia.b@email.com', avatar: av(11) }, plan: 'Plus Annual', amount: 99.99, status: 'Active', startDate: '12 Jan 2026', renewalDate: '12 Jan 2027' },
  { id: 2, user: { name: 'Marcus Reid', email: 'marcus.r@email.com', avatar: av(12) }, plan: 'Plus Monthly', amount: 9.99, status: 'Active', startDate: '03 Jun 2026', renewalDate: '03 Jul 2026' },
  { id: 3, user: { name: 'Priya Sharma', email: 'priya.s@email.com', avatar: av(13) }, plan: 'Plus Monthly', amount: 9.99, status: 'Cancelled', startDate: '20 Apr 2026', renewalDate: '20 Jul 2026', cancelledAt: '18 Jun 2026' },
  { id: 4, user: { name: 'Tom Walker', email: 'tom.w@email.com', avatar: av(14) }, plan: 'Plus Monthly', amount: 9.99, status: 'Past Due', startDate: '15 May 2026', renewalDate: '15 Jun 2026' },
  { id: 5, user: { name: 'Sofia Alvarez', email: 'sofia.a@email.com', avatar: av(15) }, plan: 'Plus Annual', amount: 99.99, status: 'Refunded', startDate: '01 Mar 2026', renewalDate: '01 Mar 2027', refundedAmount: 99.99 },
  { id: 6, user: { name: 'James Carter', email: 'james.c@email.com', avatar: av(16) }, plan: 'Plus Monthly', amount: 9.99, status: 'Expired', startDate: '10 Feb 2026', renewalDate: '10 May 2026' },
  { id: 7, user: { name: 'Hannah Lee', email: 'hannah.l@email.com', avatar: av(17) }, plan: 'Plus Annual', amount: 99.99, status: 'Active', startDate: '22 May 2026', renewalDate: '22 May 2027' },
  { id: 8, user: { name: 'David Kim', email: 'david.k@email.com', avatar: av(18) }, plan: 'Plus Monthly', amount: 9.99, status: 'Active', startDate: '08 Jun 2026', renewalDate: '08 Jul 2026' },
]

// ── Subscription pricing config ────────────────────────────────────────
export const defaultPricingConfig: PricingConfig = {
  amount: 9.99,
  currency: 'GBP',
  billingPeriod: 'Monthly',
  annualAmount: 99.99,
  trialEnabled: true,
  trialLengthDays: 7,
  displayText: 'GoodNiva Plus — unlock unlimited plans, priority placement & an ad-free experience.',
  savingsNudgeThreshold: 20,
}

// ── Trials ─────────────────────────────────────────────────────────────
export const trialsSeed: Trial[] = [
  { id: 1, user: { name: 'Ella Fitzgerald', email: 'ella.f@email.com', avatar: av(21) }, startDate: '22 Jun 2026', endDate: '29 Jun 2026', state: 'Active' },
  { id: 2, user: { name: 'Noah Patel', email: 'noah.p@email.com', avatar: av(22) }, startDate: '24 Jun 2026', endDate: '01 Jul 2026', state: 'Active' },
  { id: 3, user: { name: 'Grace Hopper', email: 'grace.h@email.com', avatar: av(23) }, startDate: '10 Jun 2026', endDate: '17 Jun 2026', state: 'Converted', convertedTo: 'Plus Annual' },
  { id: 4, user: { name: 'Liam Murphy', email: 'liam.m@email.com', avatar: av(24) }, startDate: '05 Jun 2026', endDate: '12 Jun 2026', state: 'Converted', convertedTo: 'Plus Monthly' },
  { id: 5, user: { name: 'Ava Robinson', email: 'ava.r@email.com', avatar: av(25) }, startDate: '01 Jun 2026', endDate: '08 Jun 2026', state: 'Expired' },
  { id: 6, user: { name: 'Ethan Brooks', email: 'ethan.b@email.com', avatar: av(26) }, startDate: '28 May 2026', endDate: '04 Jun 2026', state: 'Expired' },
]

// ── Boost products & purchases ─────────────────────────────────────────
export const boostProductsSeed: BoostProduct[] = [
  { id: 1, name: 'Access Boost — Single', type: 'Access', price: 1.99, credits: 1, active: true, description: 'Join one extra plan beyond the weekly free limit.' },
  { id: 2, name: 'Access Boost — Pack of 5', type: 'Access', price: 7.99, credits: 5, active: true, description: 'Five access credits at a discount.' },
  { id: 3, name: 'Visibility Boost — 24h', type: 'Visibility', price: 2.99, credits: 1, active: true, description: 'Push a hosted plan to the top of discovery for 24 hours.' },
  { id: 4, name: 'Visibility Boost — Week', type: 'Visibility', price: 9.99, credits: 1, active: false, description: 'Featured placement for a full week.' },
]

export const boostPurchasesSeed: BoostPurchase[] = [
  { id: 'BP-1042', user: { name: 'Marcus Reid', email: 'marcus.r@email.com', avatar: av(12) }, product: 'Access Boost — Pack of 5', type: 'Access', amount: 7.99, creditsPurchased: 5, creditsUsed: 3, status: 'Completed', date: '24 Jun 2026' },
  { id: 'BP-1041', user: { name: 'Hannah Lee', email: 'hannah.l@email.com', avatar: av(17) }, product: 'Visibility Boost — 24h', type: 'Visibility', amount: 2.99, creditsPurchased: 1, creditsUsed: 1, status: 'Completed', date: '23 Jun 2026' },
  { id: 'BP-1040', user: { name: 'Tom Walker', email: 'tom.w@email.com', avatar: av(14) }, product: 'Access Boost — Single', type: 'Access', amount: 1.99, creditsPurchased: 1, creditsUsed: 0, status: 'Refunded', date: '21 Jun 2026' },
  { id: 'BP-1039', user: { name: 'David Kim', email: 'david.k@email.com', avatar: av(18) }, product: 'Visibility Boost — 24h', type: 'Visibility', amount: 2.99, creditsPurchased: 1, creditsUsed: 1, status: 'Completed', date: '20 Jun 2026' },
  { id: 'BP-1038', user: { name: 'Priya Sharma', email: 'priya.s@email.com', avatar: av(13) }, product: 'Access Boost — Pack of 5', type: 'Access', amount: 7.99, creditsPurchased: 5, creditsUsed: 5, status: 'Completed', date: '18 Jun 2026' },
  { id: 'BP-1037', user: { name: 'Olivia Bennett', email: 'olivia.b@email.com', avatar: av(11) }, product: 'Visibility Boost — Week', type: 'Visibility', amount: 9.99, creditsPurchased: 1, creditsUsed: 0, status: 'Pending', date: '17 Jun 2026' },
]

// ── Ads config ─────────────────────────────────────────────────────────
export const defaultAdsConfig: AdsConfig = {
  nativeAdsEnabled: true,
  admobFallbackEnabled: true,
  mediationEnabled: false,
  firstSessionSuppression: true,
  adUnits: [
    { id: 1, platform: 'iOS', placement: 'Feed', adUnitId: 'ca-app-pub-3940256099942544/2934735716' },
    { id: 2, platform: 'iOS', placement: 'Plan Details', adUnitId: 'ca-app-pub-3940256099942544/3986624511' },
    { id: 3, platform: 'Android', placement: 'Feed', adUnitId: 'ca-app-pub-3940256099942544/6300978111' },
    { id: 4, platform: 'Android', placement: 'Plan Details', adUnitId: 'ca-app-pub-3940256099942544/1033173712' },
  ],
}

// ── Rewarded ads config (future / disabled) ────────────────────────────
export const defaultRewardedAdsConfig: RewardedAdsConfig = {
  enabled: false,
  provider: 'AdMob',
  dailyCap: 5,
  allowedRewards: ['Access credit', 'Visibility credit'],
}

// ── Sponsors ───────────────────────────────────────────────────────────
export const sponsorsSeed: Sponsor[] = [
  { id: 1, name: 'BrewHaus Coffee', logo: av(31), contact: 'partners@brewhaus.com', category: 'Food & Drink', status: 'Approved', joinedDate: '02 Feb 2026' },
  { id: 2, name: 'PeakFit Gyms', logo: av(32), contact: 'marketing@peakfit.com', category: 'Fitness', status: 'Approved', joinedDate: '14 Mar 2026' },
  { id: 3, name: 'UrbanThreads', logo: av(33), contact: 'hello@urbanthreads.co', category: 'Retail', status: 'Pending', joinedDate: '20 Jun 2026' },
  { id: 4, name: 'NightOwl Lounge', logo: av(34), contact: 'events@nightowl.com', category: 'Nightlife', status: 'Paused', joinedDate: '08 Apr 2026' },
  { id: 5, name: 'GreenLeaf Wellness', logo: av(35), contact: 'team@greenleaf.com', category: 'Wellness', status: 'Pending', joinedDate: '25 Jun 2026' },
]

// ── Sponsorship packages ───────────────────────────────────────────────
export const packagesSeed: SponsorshipPackage[] = [
  { id: 1, name: 'Starter Spotlight', price: 250, placements: ['Feed'], priority: 1, reportingLevel: 'Basic', active: true },
  { id: 2, name: 'City Partner', price: 750, placements: ['Feed', 'Vibe'], priority: 2, reportingLevel: 'Standard', active: true },
  { id: 3, name: 'Premier Partner', price: 2000, placements: ['Feed', 'Vibe', 'Partner Venue'], priority: 3, reportingLevel: 'Premium', active: true },
  { id: 4, name: 'Event Takeover', price: 3500, placements: ['Feed', 'Vibe', 'Partner Venue'], priority: 4, reportingLevel: 'Premium', active: false },
]

// ── Campaigns ──────────────────────────────────────────────────────────
export const campaignsSeed: Campaign[] = [
  { id: 1, name: 'BrewHaus Summer Meetups', sponsor: 'BrewHaus Coffee', placement: 'Feed', targeting: 'London · Coffee Culture', dailyCap: 5000, startDate: '01 Jun 2026', endDate: '31 Aug 2026', status: 'Live' },
  { id: 2, name: 'PeakFit Morning Runs', sponsor: 'PeakFit Gyms', placement: 'Vibe', targeting: 'Manchester · Fitness', dailyCap: 3000, startDate: '15 Jun 2026', endDate: '15 Sep 2026', status: 'Live' },
  { id: 3, name: 'UrbanThreads Pop-up', sponsor: 'UrbanThreads', placement: 'Partner Venue', targeting: 'London · Fashion', dailyCap: 2000, startDate: '01 Jul 2026', endDate: '14 Jul 2026', status: 'Scheduled' },
  { id: 4, name: 'NightOwl Live Sessions', sponsor: 'NightOwl Lounge', placement: 'Feed', targeting: 'Bristol · Nightlife', dailyCap: 1500, startDate: '20 May 2026', endDate: '20 Jun 2026', status: 'Ended' },
  { id: 5, name: 'GreenLeaf Wellness Week', sponsor: 'GreenLeaf Wellness', placement: 'Vibe', targeting: 'Leeds · Wellness', dailyCap: 2500, startDate: '01 Jul 2026', endDate: '07 Jul 2026', status: 'Pending Approval' },
]

export const defaultCampaignsConfig: CampaignsConfig = {
  vibeSponsoredCardsEnabled: true,
  feedSponsoredCardsEnabled: true,
  partnerVenueSuggestionsEnabled: true,
  competitionPartnerVenueEnabled: false,
  feedFirstAdPosition: 4,
  feedRepeatFrequency: 8,
  feedMaxAdsPerSession: 6,
}

// ── Offers ─────────────────────────────────────────────────────────────
export const offersSeed: Offer[] = [
  { id: 1, code: 'WELCOME20', kind: 'Discount Code', description: '20% off first month of Plus', value: '20% off', redemptions: 342, maxRedemptions: 1000, expiry: '31 Dec 2026', status: 'Active' },
  { id: 2, code: 'ANNUAL2MO', kind: 'Discount Code', description: '2 months free on annual plan', value: '2 months free', redemptions: 128, maxRedemptions: 500, expiry: '30 Sep 2026', status: 'Active' },
  { id: 3, code: 'STUDENT50', kind: 'Discount Code', description: '50% off for verified students', value: '50% off', redemptions: 89, maxRedemptions: 2000, expiry: '31 Aug 2026', status: 'Active' },
  { id: 4, code: 'FOUNDERPERK', kind: 'Perk', description: 'Exclusive host badge for early members', value: 'Host badge', redemptions: 56, maxRedemptions: 100, expiry: '01 Jul 2026', status: 'Scheduled' },
  { id: 5, code: 'SUMMER15', kind: 'Discount Code', description: '15% off any Boost pack', value: '15% off', redemptions: 410, maxRedemptions: 410, expiry: '01 Jun 2026', status: 'Expired' },
]

// ── Audit log seed ─────────────────────────────────────────────────────
export const auditLogSeed: AuditEntry[] = [
  { id: 1, section: 'Subscription Pricing', action: 'Updated price', detail: 'Plus Monthly £8.99 → £9.99', admin: 'Super Admin', timestamp: '24 Jun 2026, 14:32' },
  { id: 2, section: 'Trials', action: 'Changed trial length', detail: '14 days → 7 days', admin: 'Super Admin', timestamp: '20 Jun 2026, 09:10' },
  { id: 3, section: 'Native Ads / AdMob', action: 'Enabled AdMob fallback', detail: 'AdMob fallback turned ON', admin: 'Super Admin', timestamp: '18 Jun 2026, 16:45' },
  { id: 4, section: 'Sponsors', action: 'Approved sponsor', detail: 'PeakFit Gyms approved', admin: 'Super Admin', timestamp: '14 Mar 2026, 11:20' },
]

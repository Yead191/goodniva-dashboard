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
  // Free trial gets a taste of Plus, not the full thing — its own limits.
  // Creation extras default to off so they stay paid-only until the admin opts in.
  trialLimits: {
    weeklyPlanJoins: 10,
    monthlyPlansHosted: 2,
    canCreatePlans: true,
    canCreateGroups: true,
    canCreateCompetitions: false,
    canCreateCommunities: false,
    priorityPlacement: false,
    advancedFilters: true,
    seeWhoViewed: false,
    adFree: true,
    prioritySupport: false,
  },
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
  // Native ads only on Feed/Vibe — plan details deliberately OFF by default.
  placements: [
    { key: 'feed', label: 'Feed', description: 'Native ad cards within the main feed.', enabled: true },
    { key: 'vibe', label: 'Vibe', description: 'Native ad cards within the Vibe surface.', enabled: true },
    { key: 'planDetails', label: 'Plan details', description: 'Native ads on individual plan detail pages.', enabled: false },
  ],
  feedFirstAdPosition: 4,
  feedRepeatFrequency: 8,
  feedMaxAdsPerSession: 6,
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

// ── Partners ───────────────────────────────────────────────────────────
export const sponsorsSeed: Sponsor[] = [
  {
    id: 1, name: 'BrewHaus Coffee Ltd', tradingName: 'BrewHaus Coffee', category: 'Food & Drink',
    vatNumber: 'GB 412 8871 03', companyNumber: '09847215',
    description: 'Independent speciality coffee roaster and meetup space.',
    contactPerson: 'Anna Doyle', contact: 'partners@brewhaus.com', contactPhone: '+44 20 7946 0011',
    website: 'https://brewhaus.com', socialLink: 'https://instagram.com/brewhaus',
    address: '12 Bridge Street', city: 'London', postcode: 'EC1A 1BB', country: 'United Kingdom',
    latitude: '51.5155', longitude: '-0.0922', coveringRadius: '5km',
    logo: av(31), appDisplayImage: av(31), appImageApproved: true, profileImage: '',
    status: 'Active', safetyStatus: 'Approved', adminNotes: '', packageId: 2,
    packageStartDate: '2026-06-01', packageEndDate: '2026-08-31', packagePaymentStatus: 'Paid', joinedDate: '02 Feb 2026',
  },
  {
    id: 2, name: 'PeakFit Group Ltd', tradingName: 'PeakFit Gyms', category: 'Fitness',
    vatNumber: 'GB 288 4410 77', companyNumber: '07731902',
    description: 'City-wide gym chain running community fitness events.',
    contactPerson: 'Marcus Reid', contact: 'marketing@peakfit.com', contactPhone: '+44 161 496 0022',
    website: 'https://peakfit.com', socialLink: 'https://instagram.com/peakfit',
    address: '4 Albert Square', city: 'Manchester', postcode: 'M2 5PB', country: 'United Kingdom',
    latitude: '53.4794', longitude: '-2.2453', coveringRadius: 'City-wide',
    logo: av(32), appDisplayImage: '', appImageApproved: false, profileImage: '',
    status: 'Approved', safetyStatus: 'Approved', adminNotes: '', packageId: 3,
    packageStartDate: '2026-07-01', packageEndDate: '2026-09-30', packagePaymentStatus: 'Unpaid', joinedDate: '14 Mar 2026',
  },
  {
    id: 3, name: 'UrbanThreads', tradingName: 'UrbanThreads', category: 'Retail',
    vatNumber: 'GB 550 1937 21',
    description: 'Streetwear brand hosting pop-up shopping experiences.',
    contactPerson: 'Priya Sharma', contact: 'hello@urbanthreads.co', contactPhone: '+44 20 7946 0033',
    website: 'https://urbanthreads.co', socialLink: 'https://instagram.com/urbanthreads',
    address: '88 Brick Lane', city: 'London', postcode: 'E1 6RL', country: 'United Kingdom',
    latitude: '51.5210', longitude: '-0.0719', coveringRadius: '1km',
    logo: av(33), appDisplayImage: '', appImageApproved: false, profileImage: '',
    status: 'Pending Review', safetyStatus: 'Pending', adminNotes: '',
    packageStartDate: '', packageEndDate: '', packagePaymentStatus: 'Unpaid', joinedDate: '20 Jun 2026',
  },
  {
    id: 4, name: 'NightOwl Hospitality Ltd', tradingName: 'NightOwl Lounge', category: 'Nightlife',
    vatNumber: 'GB 733 2065 48', companyNumber: '11204773',
    description: 'Late-night music venue and cocktail lounge.',
    contactPerson: 'Tom Walker', contact: 'events@nightowl.com', contactPhone: '+44 117 496 0044',
    website: 'https://nightowl.com', socialLink: 'https://instagram.com/nightowl',
    address: '21 Harbourside', city: 'Bristol', postcode: 'BS1 5UH', country: 'United Kingdom',
    latitude: '51.4480', longitude: '-2.5973', coveringRadius: '10km',
    logo: av(34), appDisplayImage: av(34), appImageApproved: true, profileImage: '',
    status: 'Paused', safetyStatus: 'Approved', adminNotes: 'Paused pending licence renewal.', packageId: 1,
    packageStartDate: '2026-05-01', packageEndDate: '2026-07-31', packagePaymentStatus: 'Manually Approved', joinedDate: '08 Apr 2026',
  },
  {
    id: 5, name: 'GreenLeaf Wellness', tradingName: 'GreenLeaf Wellness', category: 'Wellness',
    vatNumber: '',
    description: 'Wellness studio offering yoga and mindfulness sessions.',
    contactPerson: 'Sofia Alvarez', contact: 'team@greenleaf.com', contactPhone: '+44 113 496 0055',
    website: 'https://greenleaf.com', socialLink: 'https://instagram.com/greenleaf',
    address: '7 Park Row', city: 'Leeds', postcode: 'LS1 5HD', country: 'United Kingdom',
    latitude: '53.7997', longitude: '-1.5492', coveringRadius: '25km',
    logo: av(35), appDisplayImage: '', appImageApproved: false, profileImage: '',
    status: 'Draft', safetyStatus: 'Pending', adminNotes: '',
    packageStartDate: '', packageEndDate: '', packagePaymentStatus: 'Unpaid', joinedDate: '25 Jun 2026',
  },
]

// ── Partnership packages ───────────────────────────────────────────────
export const packagesSeed: SponsorshipPackage[] = [
  { id: 1, name: 'Starter Spotlight', price: 250, currency: 'GBP', billingPeriod: 'Monthly', placements: ['Feed'], priority: 1, reportingLevel: 'Basic', active: true },
  { id: 2, name: 'City Partner', price: 750, currency: 'GBP', billingPeriod: 'Monthly', placements: ['Feed', 'Vibe'], priority: 2, reportingLevel: 'Standard', active: true },
  { id: 3, name: 'Premier Partner', price: 2000, currency: 'GBP', billingPeriod: 'Quarterly', placements: ['Feed', 'Vibe', 'Partner Venue'], priority: 3, reportingLevel: 'Premium', active: true },
  { id: 4, name: 'Event Takeover', price: 3500, currency: 'GBP', billingPeriod: 'One-off', placements: ['Feed', 'Vibe', 'Partner Venue'], priority: 4, reportingLevel: 'Premium', active: false },
]

// ── Campaigns ──────────────────────────────────────────────────────────
export const campaignsSeed: Campaign[] = [
  { id: 1, name: 'BrewHaus Summer Meetups', sponsor: 'BrewHaus Coffee', package: 'City Partner', placement: 'Feed', targeting: 'London · Coffee Culture', dailyCap: 5000, startDate: '01 Jun 2026', endDate: '31 Aug 2026', status: 'Live', metrics: { impressions: 48200, clicks: 3860, venueSelections: 520, plansCreated: 184, usersJoined: 962, offerClaims: 241 } },
  { id: 2, name: 'PeakFit Morning Runs', sponsor: 'PeakFit Gyms', package: 'Premier Partner', placement: 'Vibe', targeting: 'Manchester · Fitness', dailyCap: 3000, startDate: '15 Jun 2026', endDate: '15 Sep 2026', status: 'Live', metrics: { impressions: 31400, clicks: 2120, venueSelections: 318, plansCreated: 121, usersJoined: 640, offerClaims: 158 } },
  { id: 3, name: 'UrbanThreads Pop-up', sponsor: 'UrbanThreads', package: 'Starter Spotlight', placement: 'Partner Venue', targeting: 'London · Fashion', dailyCap: 2000, startDate: '01 Jul 2026', endDate: '14 Jul 2026', status: 'Scheduled', metrics: { impressions: 0, clicks: 0, venueSelections: 0, plansCreated: 0, usersJoined: 0, offerClaims: 0 } },
  { id: 4, name: 'NightOwl Live Sessions', sponsor: 'NightOwl Lounge', package: 'Starter Spotlight', placement: 'Feed', targeting: 'Bristol · Nightlife', dailyCap: 1500, startDate: '20 May 2026', endDate: '20 Jun 2026', status: 'Ended', metrics: { impressions: 22600, clicks: 1450, venueSelections: 196, plansCreated: 64, usersJoined: 312, offerClaims: 88 } },
  { id: 5, name: 'GreenLeaf Wellness Week', sponsor: 'GreenLeaf Wellness', package: 'City Partner', placement: 'Vibe', targeting: 'Leeds · Wellness', dailyCap: 2500, startDate: '01 Jul 2026', endDate: '07 Jul 2026', status: 'Pending Approval', metrics: { impressions: 0, clicks: 0, venueSelections: 0, plansCreated: 0, usersJoined: 0, offerClaims: 0 } },
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
// partnerId maps to sponsorsSeed above; offers without one are GoodNiva's own.
export const offersSeed: Offer[] = [
  { id: 1, code: 'WELCOME20', kind: 'Discount Code', description: '20% off first month of Plus', value: '20% off', venue: '', showInPlanCreation: false, terms: 'New members only. One use per account.', redemptions: 342, maxRedemptions: 1000, expiry: '31 Dec 2026', status: 'Active' },
  { id: 2, code: 'ANNUAL2MO', kind: 'Discount Code', description: '2 months free on annual plan', value: '2 months free', venue: '', showInPlanCreation: false, terms: 'Applies to the Plus Annual plan only.', redemptions: 128, maxRedemptions: 500, expiry: '30 Sep 2026', status: 'Active' },
  { id: 3, code: 'STUDENT50', kind: 'Discount Code', description: '50% off for verified students', value: '50% off', venue: '', showInPlanCreation: false, terms: 'Requires student verification.', redemptions: 89, maxRedemptions: 2000, expiry: '31 Aug 2026', status: 'Active' },
  { id: 4, code: 'FOUNDERPERK', kind: 'Perk', description: 'Exclusive host badge for early members', value: 'Host badge', venue: '', showInPlanCreation: false, terms: 'Awarded once, non-transferable.', redemptions: 56, maxRedemptions: 100, expiry: '01 Jul 2026', status: 'Scheduled' },
  { id: 5, code: 'SUMMER15', kind: 'Discount Code', description: '15% off any Boost pack', value: '15% off', venue: '', showInPlanCreation: false, terms: 'One Boost pack per order.', redemptions: 410, maxRedemptions: 410, expiry: '01 Jun 2026', status: 'Expired' },
  { id: 6, code: 'BREWFREE', kind: 'Perk', description: 'Free filter coffee for everyone on the plan', value: 'Free coffee', partnerId: 1, venue: 'BrewHaus Bridge Street', showInPlanCreation: true, terms: 'Up to 6 people. Show the plan in-store.', redemptions: 214, maxRedemptions: 600, expiry: '31 Aug 2026', status: 'Active' },
  { id: 7, code: 'BREWCAKE', kind: 'Special Offer', description: 'Coffee & cake for £6 when you book a table', value: '£6 bundle', partnerId: 1, venue: '', showInPlanCreation: true, terms: 'Weekdays before 4pm.', redemptions: 97, maxRedemptions: 400, expiry: '31 Aug 2026', status: 'Active' },
  { id: 8, code: 'PEAKDAY', kind: 'Discount Code', description: 'Free day pass for plan attendees', value: 'Free day pass', partnerId: 2, venue: 'PeakFit Albert Square', showInPlanCreation: true, terms: 'First visit only. 18+.', redemptions: 63, maxRedemptions: 300, expiry: '15 Sep 2026', status: 'Active' },
  { id: 9, code: 'THREADS10', kind: 'Discount Code', description: '10% off at the Brick Lane pop-up', value: '10% off', partnerId: 3, venue: 'UrbanThreads Brick Lane', showInPlanCreation: true, terms: 'Excludes sale items.', redemptions: 0, maxRedemptions: 250, expiry: '14 Jul 2026', status: 'Scheduled' },
  { id: 10, code: 'OWLENTRY', kind: 'Perk', description: 'Skip-the-queue entry before 10pm', value: 'Priority entry', partnerId: 4, venue: 'NightOwl Harbourside', showInPlanCreation: false, terms: 'Subject to capacity. Over-21s only.', redemptions: 142, maxRedemptions: 500, expiry: '31 Jul 2026', status: 'Disabled' },
]

// ── Audit log seed ─────────────────────────────────────────────────────
export const auditLogSeed: AuditEntry[] = [
  { id: 1, section: 'Subscription Pricing', action: 'Updated price', detail: 'Plus Monthly £8.99 → £9.99', admin: 'Super Admin', timestamp: '24 Jun 2026, 14:32' },
  { id: 2, section: 'Trials', action: 'Changed trial length', detail: '14 days → 7 days', admin: 'Super Admin', timestamp: '20 Jun 2026, 09:10' },
  { id: 3, section: 'Native Ads / AdMob', action: 'Enabled AdMob fallback', detail: 'AdMob fallback turned ON', admin: 'Super Admin', timestamp: '18 Jun 2026, 16:45' },
  { id: 4, section: 'Partners', action: 'Approved partner', detail: 'PeakFit Gyms approved', admin: 'Super Admin', timestamp: '14 Mar 2026, 11:20' },
]

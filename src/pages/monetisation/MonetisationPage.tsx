import { useState } from 'react'
import {
  Crown, Tag, Sparkles, Zap, ShoppingBag, Tv, Gift, Megaphone, Package, Rocket, Ticket, BarChart3, History, type LucideIcon,
} from 'lucide-react'
import PageHeader from '@/components/layout/PageHeader'
import { Card } from '@/components/common'
import { MonetisationProvider, useMonetisation } from '@/context/MonetisationContext'
import SubscriptionPlansSection from './sections/SubscriptionPlansSection'
import SubscriptionsSection from './sections/SubscriptionsSection'
import TrialsSection from './sections/TrialsSection'
import BoostProductsSection from './sections/BoostProductsSection'
import BoostPurchasesSection from './sections/BoostPurchasesSection'
import AdsSection from './sections/AdsSection'
import RewardedAdsSection from './sections/RewardedAdsSection'
import SponsorsSection from './sections/SponsorsSection'
import PackagesSection from './sections/PackagesSection'
import CampaignsSection from './sections/CampaignsSection'
import OffersSection from './sections/OffersSection'
import ReportsSection from './sections/ReportsSection'
import AuditLogSection from './sections/AuditLogSection'

type SectionKey =
  | 'subscriptionPlans' | 'subscriptions' | 'trials'
  | 'boostProducts' | 'boostPurchases'
  | 'ads' | 'rewarded'
  | 'sponsors' | 'packages' | 'campaigns'
  | 'offers'
  | 'reports' | 'audit'

interface NavItem { key: SectionKey; label: string; Icon: LucideIcon }
interface NavGroup { title: string; items: NavItem[] }

const NAV_GROUPS: NavGroup[] = [
  {
    title: 'Subscriptions',
    items: [
      { key: 'subscriptionPlans', label: 'Subscription Pricing', Icon: Tag },
      { key: 'subscriptions', label: 'Plus Members', Icon: Crown },
      { key: 'trials', label: 'Trials', Icon: Sparkles },
    ],
  },
  {
    title: 'Boosts',
    items: [
      { key: 'boostProducts', label: 'Boost Products', Icon: Zap },
      { key: 'boostPurchases', label: 'Boost Purchases', Icon: ShoppingBag },
    ],
  },
  {
    title: 'Advertising',
    items: [
      { key: 'ads', label: 'Native Ads / AdMob', Icon: Tv },
      { key: 'rewarded', label: 'Rewarded Ads', Icon: Gift },
    ],
  },
  {
    title: 'Partnerships',
    items: [
      { key: 'sponsors', label: 'Partners', Icon: Megaphone },
      { key: 'packages', label: 'Partnership Packages', Icon: Package },
      { key: 'campaigns', label: 'Campaigns', Icon: Rocket },
    ],
  },
  {
    title: 'Growth',
    items: [{ key: 'offers', label: 'Offers', Icon: Ticket }],
  },
  {
    title: 'Insights',
    items: [
      { key: 'reports', label: 'Reports', Icon: BarChart3 },
      { key: 'audit', label: 'Audit Log', Icon: History },
    ],
  },
]

const SECTION_COMPONENTS: Record<SectionKey, () => JSX.Element> = {
  subscriptionPlans: SubscriptionPlansSection,
  subscriptions: SubscriptionsSection,
  trials: TrialsSection,
  boostProducts: BoostProductsSection,
  boostPurchases: BoostPurchasesSection,
  ads: AdsSection,
  rewarded: RewardedAdsSection,
  sponsors: SponsorsSection,
  packages: PackagesSection,
  campaigns: CampaignsSection,
  offers: OffersSection,
  reports: ReportsSection,
  audit: AuditLogSection,
}

const MonetisationInner = () => {
  const [active, setActive] = useState<SectionKey>('subscriptionPlans')
  const { canEdit } = useMonetisation()
  const ActiveSection = SECTION_COMPONENTS[active]

  return (
    <div className="py-7 px-8">
      <PageHeader
        title="Monetisation"
        subtitle="Edit subscriptions, boosts, ads, partners and offers without an app release. All changes are permission-controlled and audit-logged."
      />

      {!canEdit && (
        <div className="mb-5 p-4 rounded-2xl border border-warning/30 bg-warning-light text-warning-text text-[13px]">
          You have view-only access to monetisation settings. Editing requires the Monetisation permission.
        </div>
      )}

      <div className="grid gap-5 items-start" style={{ gridTemplateColumns: '248px 1fr' }}>
        <Card>
          <div className="flex flex-col gap-1">
            {NAV_GROUPS.map((group) => (
              <div key={group.title} className="mb-2 last:mb-0">
                <div className="text-[10px] font-bold text-ink-muted tracking-[0.8px] uppercase px-[14px] pt-2 pb-1">{group.title}</div>
                {group.items.map(({ key, label, Icon }) => {
                  const isActive = active === key
                  return (
                    <button
                      key={key}
                      onClick={() => setActive(key)}
                      className={`w-full flex items-center gap-3 py-[10px] px-[14px] rounded-[10px] text-[13px] border-none cursor-pointer text-left transition-all duration-150 ${
                        isActive
                          ? 'bg-primary-light text-primary font-semibold'
                          : 'bg-transparent text-ink-secondary font-medium hover:bg-surface-input'
                      }`}
                    >
                      <Icon size={16} className="shrink-0" />
                      {label}
                    </button>
                  )
                })}
              </div>
            ))}
          </div>
        </Card>

        <div className="min-w-0">
          <ActiveSection />
        </div>
      </div>
    </div>
  )
}

const MonetisationPage = () => (
  <MonetisationProvider>
    <MonetisationInner />
  </MonetisationProvider>
)

export default MonetisationPage

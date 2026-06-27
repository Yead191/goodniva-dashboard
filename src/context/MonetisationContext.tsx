import { createContext, useContext, useState, useCallback, ReactNode, Dispatch, SetStateAction } from 'react'
import { useAuth } from './AuthContext'
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
import {
  plusMembersSeed,
  defaultPricingConfig,
  trialsSeed,
  boostProductsSeed,
  boostPurchasesSeed,
  defaultAdsConfig,
  defaultRewardedAdsConfig,
  sponsorsSeed,
  packagesSeed,
  campaignsSeed,
  defaultCampaignsConfig,
  offersSeed,
  auditLogSeed,
} from '@/data/monetisation'

interface MonetisationContextValue {
  // Collections
  plusMembers: PlusMember[]
  setPlusMembers: Dispatch<SetStateAction<PlusMember[]>>
  trials: Trial[]
  boostProducts: BoostProduct[]
  setBoostProducts: Dispatch<SetStateAction<BoostProduct[]>>
  boostPurchases: BoostPurchase[]
  setBoostPurchases: Dispatch<SetStateAction<BoostPurchase[]>>
  sponsors: Sponsor[]
  setSponsors: Dispatch<SetStateAction<Sponsor[]>>
  packages: SponsorshipPackage[]
  setPackages: Dispatch<SetStateAction<SponsorshipPackage[]>>
  campaigns: Campaign[]
  setCampaigns: Dispatch<SetStateAction<Campaign[]>>
  offers: Offer[]
  setOffers: Dispatch<SetStateAction<Offer[]>>

  // Config blocks
  pricing: PricingConfig
  setPricing: Dispatch<SetStateAction<PricingConfig>>
  ads: AdsConfig
  setAds: Dispatch<SetStateAction<AdsConfig>>
  rewarded: RewardedAdsConfig
  setRewarded: Dispatch<SetStateAction<RewardedAdsConfig>>
  campaignsConfig: CampaignsConfig
  setCampaignsConfig: Dispatch<SetStateAction<CampaignsConfig>>

  // Audit
  auditLog: AuditEntry[]
  audit: (section: string, action: string, detail: string) => void

  canEdit: boolean
}

const MonetisationContext = createContext<MonetisationContextValue | undefined>(undefined)

export const MonetisationProvider = ({ children }: { children: ReactNode }) => {
  const { user, hasPermission } = useAuth()

  const [plusMembers, setPlusMembers] = useState<PlusMember[]>(plusMembersSeed)
  const [trials] = useState<Trial[]>(trialsSeed)
  const [boostProducts, setBoostProducts] = useState<BoostProduct[]>(boostProductsSeed)
  const [boostPurchases, setBoostPurchases] = useState<BoostPurchase[]>(boostPurchasesSeed)
  const [sponsors, setSponsors] = useState<Sponsor[]>(sponsorsSeed)
  const [packages, setPackages] = useState<SponsorshipPackage[]>(packagesSeed)
  const [campaigns, setCampaigns] = useState<Campaign[]>(campaignsSeed)
  const [offers, setOffers] = useState<Offer[]>(offersSeed)

  const [pricing, setPricing] = useState<PricingConfig>(defaultPricingConfig)
  const [ads, setAds] = useState<AdsConfig>(defaultAdsConfig)
  const [rewarded, setRewarded] = useState<RewardedAdsConfig>(defaultRewardedAdsConfig)
  const [campaignsConfig, setCampaignsConfig] = useState<CampaignsConfig>(defaultCampaignsConfig)

  const [auditLog, setAuditLog] = useState<AuditEntry[]>(auditLogSeed)
  const [seq, setSeq] = useState(auditLogSeed.length + 1)

  // Edits are permission-controlled — only admins with the module may write.
  const canEdit = hasPermission('monetisation')

  const audit = useCallback(
    (section: string, action: string, detail: string) => {
      const now = new Date()
      const timestamp = now.toLocaleString('en-GB', {
        day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false,
      }).replace(',', '')
      setAuditLog((prev) => [
        { id: seq, section, action, detail, admin: user?.name ?? 'Admin', timestamp },
        ...prev,
      ])
      setSeq((s) => s + 1)
    },
    [seq, user?.name],
  )

  return (
    <MonetisationContext.Provider
      value={{
        plusMembers, setPlusMembers,
        trials,
        boostProducts, setBoostProducts,
        boostPurchases, setBoostPurchases,
        sponsors, setSponsors,
        packages, setPackages,
        campaigns, setCampaigns,
        offers, setOffers,
        pricing, setPricing,
        ads, setAds,
        rewarded, setRewarded,
        campaignsConfig, setCampaignsConfig,
        auditLog, audit,
        canEdit,
      }}
    >
      {children}
    </MonetisationContext.Provider>
  )
}

export const useMonetisation = (): MonetisationContextValue => {
  const ctx = useContext(MonetisationContext)
  if (!ctx) throw new Error('useMonetisation must be used within MonetisationProvider')
  return ctx
}

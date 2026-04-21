import type { RevenueMonth, Subscriber } from '@/types'

export const revenueMonthlySeed: RevenueMonth[] = [
  { month: 'Nov', revenue: 8420 },
  { month: 'Dec', revenue: 11200 },
  { month: 'Jan', revenue: 9850 },
  { month: 'Feb', revenue: 12700 },
  { month: 'Mar', revenue: 14300 },
  { month: 'Apr', revenue: 13850 },
  { month: 'May', revenue: 16200 },
  { month: 'Jun', revenue: 15800 },
  { month: 'Jul', revenue: 18400 },
  { month: 'Aug', revenue: 19700 },
  { month: 'Sep', revenue: 21300 },
  { month: 'Oct', revenue: 23850 },
]

export const subscribersSeed: Subscriber[] = [
  { id: 1, user: { name: 'Elena Rodriguez', email: 'elena.r@example.com', avatar: 'https://i.pravatar.cc/80?img=48' }, plan: 'Premium', amount: 20.0, startDate: 'Oct 12, 2024', nextBilling: 'Nov 12, 2024', status: 'Active', method: 'Visa •• 4242' },
  { id: 2, user: { name: 'Marcus Okonkwo', email: 'marcus.o@example.com', avatar: 'https://i.pravatar.cc/80?img=13' }, plan: 'Professional', amount: 100.08, startDate: 'Oct 08, 2024', nextBilling: 'Oct 08, 2025', status: 'Active', method: 'Mastercard •• 8832' },
  { id: 3, user: { name: 'Priya Sharma', email: 'priya.s@example.com', avatar: 'https://i.pravatar.cc/80?img=47' }, plan: 'Premium', amount: 20.0, startDate: 'Oct 03, 2024', nextBilling: 'Nov 03, 2024', status: 'Active', method: 'Visa •• 1193' },
  { id: 4, user: { name: 'Tomás Silva', email: 'tomas.s@example.com', avatar: 'https://i.pravatar.cc/80?img=33' }, plan: 'Premium', amount: 20.0, startDate: 'Sep 28, 2024', nextBilling: 'Oct 28, 2024', status: 'Cancelled', method: 'Visa •• 7721' },
  { id: 5, user: { name: 'Aiko Tanaka', email: 'aiko.t@example.com', avatar: 'https://i.pravatar.cc/80?img=45' }, plan: 'Professional', amount: 100.08, startDate: 'Sep 20, 2024', nextBilling: 'Sep 20, 2025', status: 'Active', method: 'Amex •• 3301' },
  { id: 6, user: { name: "Liam O'Brien", email: 'liam.o@example.com', avatar: 'https://i.pravatar.cc/80?img=68' }, plan: 'Premium', amount: 20.0, startDate: 'Sep 15, 2024', nextBilling: 'Nov 15, 2024', status: 'Active', method: 'Visa •• 5628' },
  { id: 7, user: { name: 'Zara Hassan', email: 'zara.h@example.com', avatar: 'https://i.pravatar.cc/80?img=44' }, plan: 'Premium', amount: 20.0, startDate: 'Sep 10, 2024', nextBilling: 'Nov 10, 2024', status: 'Active', method: 'Mastercard •• 9034' },
  { id: 8, user: { name: 'Daniel Kim', email: 'daniel.k@example.com', avatar: 'https://i.pravatar.cc/80?img=53' }, plan: 'Professional', amount: 100.08, startDate: 'Sep 05, 2024', nextBilling: 'Sep 05, 2025', status: 'Active', method: 'Visa •• 2856' },
  { id: 9, user: { name: 'Sofia Martinez', email: 'sofia.m@example.com', avatar: 'https://i.pravatar.cc/80?img=32' }, plan: 'Premium', amount: 20.0, startDate: 'Aug 28, 2024', nextBilling: 'Oct 28, 2024', status: 'Active', method: 'Visa •• 4417' },
  { id: 10, user: { name: 'Raj Patel', email: 'raj.p@example.com', avatar: 'https://i.pravatar.cc/80?img=52' }, plan: 'Premium', amount: 20.0, startDate: 'Aug 20, 2024', nextBilling: 'Oct 20, 2024', status: 'Past Due', method: 'Mastercard •• 6120' },
]

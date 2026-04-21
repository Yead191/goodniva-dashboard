import type { Subscription, Interest } from '@/types'

export const subscriptionsSeed: Subscription[] = [
  {
    id: 1,
    planName: 'Starter',
    price: 'Free',
    duration: 'Unlimited',
    features: ['Up to 10 active users', 'Basic analytics', 'Email support', 'Single workspace', 'Community access'],
    status: 'Active',
  },
  {
    id: 2,
    planName: 'Premium',
    price: '$20.00',
    duration: 'Monthly',
    features: ['Up to 25 active users', 'Advanced analytics dashboard', 'Priority email support', '3 workspaces', 'Custom branding'],
    status: 'Active',
  },
  {
    id: 3,
    planName: 'Professional',
    price: '$100.08',
    duration: 'Yearly',
    features: ['Unlimited users', 'Advanced analytics dashboard', '24/7 priority support', 'Unlimited workspaces', 'SSO integration'],
    status: 'Active',
  },
  {
    id: 4,
    planName: 'Enterprise',
    price: '$500.00',
    duration: 'Yearly',
    features: ['Everything in Professional', 'Dedicated account manager', 'Custom SLA', 'On-premise deployment', 'Training sessions'],
    status: 'Active',
  },
]

export const interestsSeed: Interest[] = [
  { id: 1, name: 'Football', emoji: '⚽' },
  { id: 2, name: 'Coffee Culture', emoji: '☕' },
  { id: 3, name: 'Gaming', emoji: '🎮' },
  { id: 4, name: 'Hiking', emoji: '⛰️' },
  { id: 5, name: 'Painting', emoji: '🎨' },
  { id: 6, name: 'Pizza Making', emoji: '🍕' },
  { id: 7, name: 'Yoga', emoji: '🧘' },
  { id: 8, name: 'Photography', emoji: '📷' },
  { id: 9, name: 'Reading', emoji: '📚' },
  { id: 10, name: 'Cycling', emoji: '🚴' },
]

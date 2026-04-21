// User types
export interface User {
  id: number
  name: string
  email: string
  location: string
  avatar: string
  subscription: 'Premium' | 'Professional' | 'Starter' | 'Free'
  verified: boolean
  identityInfo?: IdentityInfo
  interestInfo?: InterestInfo
}

export interface IdentityInfo {
  fullName: string
  dateOfBirth: string
  idType: string
  idNumber: string
}

export interface InterestInfo {
  interests: string[]
  hobbies: string[]
  joinedDate: string
}

// Plan types
export interface PlanHost {
  name: string
  avatar: string
  verified?: boolean
}

export interface Plan {
  id: number
  name: string
  avatar: string
  host: PlanHost
  category: string
  participants: {
    joined: number
    total: number
    avatars: string[]
  }
  date: string
  status: 'Active' | 'Cancelled' | 'Completed'
  location?: string
  description?: string
}

// Community types
export interface Community {
  id: number
  name: string
  avatar: string
  owner: { name: string; avatar: string }
  memberCount: number
  members: number
  groups: number
  competitions: number
  wins: number
  status: 'Active' | 'Inactive'
  description: string
  createdDate: string
  type: string
  memberList: CommunityMember[]
  groupList: CommunityGroup[]
  competitionList: Competition[]
  scoreboard: ScoreboardEntry[]
}

export interface CommunityMember {
  id: number
  name: string
  avatar: string
  role: string
  joined: string
}

export interface CommunityGroup {
  id: number
  name: string
  members: number
  city: string
  avatar: string
}

export interface Competition {
  id: number
  title: string
  date: string
  status: string
  teamA: { name: string; avatar: string }
  teamB: { name: string; avatar: string }
}

export interface ScoreboardEntry {
  pos: number
  name: string
  city: string
  avatar: string
  m: number
  w: number
  d: number
  l: number
}

// Subscription types
export interface Subscription {
  id: number
  planName: string
  price: string
  duration: string
  features: string[]
  status: 'Active' | 'Cancelled' | 'Expired' | 'Hidden'
}

// Interest types
export interface Interest {
  id: number
  name: string
  emoji: string
}

// Safety Triage types
export interface TriageUser {
  name: string
  handle: string
  avatar: string
}

export interface TriageHistoryEvent {
  date: string
  action: string
  note: string
  by: string
}

export interface TriageReport {
  id: number
  reportedUser: TriageUser
  reporter: TriageUser
  reason: string
  urgency: 'HIGH' | 'MEDIUM' | 'LOW'
  date: string
  status: 'PENDING' | 'REVIEWED' | 'RESOLVED'
  contentPreview: string
  history: TriageHistoryEvent[]
}

// Revenue types
export interface RevenueMonth {
  month: string
  revenue: number
}

export interface Subscriber {
  id: number
  user: { name: string; email: string; avatar: string }
  plan: 'Premium' | 'Professional' | 'Starter'
  amount: number
  startDate: string
  nextBilling: string
  status: 'Active' | 'Cancelled' | 'Past Due'
  method: string
}

// Support types
export interface SupportMessage {
  from: 'user' | 'admin'
  name: string
  avatar: string
  text: string
  time: string
}

export interface SupportTicket {
  id: string
  user: { name: string; email: string; avatar: string }
  subject: string
  category: 'Account' | 'Billing' | 'Bug' | 'Feature Request' | 'Safety'
  priority: 'Low' | 'Medium' | 'High'
  status: 'Open' | 'In Progress' | 'Resolved'
  createdAt: string
  lastUpdated: string
  description: string
  messages: SupportMessage[]
}

// Broadcast types
export type BroadcastType = 'announcement' | 'warning' | 'promo' | 'info'
export type BroadcastChannel = 'In-App' | 'Email' | 'Push'
export type BroadcastStatus = 'Sent' | 'Scheduled' | 'Failed'

export interface Broadcast {
  id: string
  title: string
  message: string
  audience: string
  channels: BroadcastChannel[]
  sentAt: string
  recipients: number
  delivered: number
  read: number
  status: BroadcastStatus
  type: BroadcastType
}

// Notification types
export type NotificationType =
  | 'safety'
  | 'support'
  | 'revenue'
  | 'user'
  | 'broadcast'
  | 'community'
  | 'billing'
  | 'system'

export interface AdminNotification {
  id: number
  type: NotificationType
  title: string
  message: string
  time: string
  rawTime: string
  read: boolean
  actor: { name: string; avatar: string }
  actionLabel: string
  actionKey: string
}

// FAQ types
export interface FaqItem {
  id: number
  question: string
  answer: string
}

// Toast types
export type ToastTone = 'success' | 'warning' | 'danger' | 'info'

export interface Toast {
  text: string
  tone: ToastTone
}

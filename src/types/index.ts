// User types
export type UserAccountStatus = 'active' | 'warned' | 'suspended' | 'banned'

export interface UserRestrictions {
  joining: boolean
  hosting: boolean
}

export interface UserPlanRef {
  id: number
  title: string
  date: string
  category: string
  status: 'Upcoming' | 'Completed' | 'Cancelled'
}

export interface AttendanceRecord {
  planId: number
  planTitle: string
  date: string
  outcome: 'Attended' | 'No-Show' | 'Cancelled'
}

export interface UserReport {
  id: number
  date: string
  reason: string
  reporter: string
  status: 'Pending' | 'Reviewed' | 'Dismissed'
}

export interface ModeratorNote {
  id: number
  date: string
  author: string
  text: string
}

export interface UserActivity {
  city: string
  joinedPlans: UserPlanRef[]
  hostedPlans: UserPlanRef[]
  attendance: AttendanceRecord[]
  reports: UserReport[]
  moderatorNotes: ModeratorNote[]
}

export interface User {
  id: number
  name: string
  email: string
  location: string
  avatar: string
  subscription: 'Premium' | 'Professional' | 'Starter' | 'Free'
  verified: boolean
  accountStatus: UserAccountStatus
  restrictions: UserRestrictions
  identityInfo?: IdentityInfo
  interestInfo?: InterestInfo
  activity?: UserActivity
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

export interface PlanParticipant {
  id: number
  name: string
  avatar: string
  joinedAt: string
  outcome: 'Attended' | 'No-Show' | 'Cancelled' | 'Pending'
}

export interface PlanReportRef {
  id: number
  date: string
  reason: string
  reporter: string
  status: 'Pending' | 'Reviewed' | 'Dismissed'
}

export interface HostReliability {
  totalHosted: number
  completed: number
  cancelled: number
  noShowRate: number
  rating: number
  cancellationsLast30d: number
}

export interface PlanCancellationEvent {
  date: string
  by: 'Host' | 'Admin' | 'System'
  reason: string
}

export interface PlanComplaint {
  id: number
  date: string
  from: string
  text: string
  status: 'Open' | 'Resolved'
}

export interface PlanModerationNote {
  id: number
  date: string
  author: string
  text: string
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
  flagged?: boolean
  flagReason?: string
  participantList?: PlanParticipant[]
  reports?: PlanReportRef[]
  hostReliability?: HostReliability
  cancellations?: PlanCancellationEvent[]
  complaints?: PlanComplaint[]
  moderationNotes?: PlanModerationNote[]
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

export interface TriageLinkedPlan {
  id: number
  name: string
  avatar: string
  date: string
  category?: string
}

export type TriageEvidenceKind = 'screenshot' | 'chat' | 'link' | 'note'

export interface TriageEvidence {
  id: number
  kind: TriageEvidenceKind
  caption: string
  url?: string
  addedAt: string
}

export interface TriageChatMessage {
  id: number
  from: 'admin' | 'reporter'
  authorName: string
  avatar: string
  text: string
  time: string
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
  linkedPlan?: TriageLinkedPlan
  evidence?: TriageEvidence[]
  reporterChat?: TriageChatMessage[]
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

// Action Centre types
export type ActionCentreType =
  | 'warn'
  | 'restrictJoin'
  | 'restrictHost'
  | 'suspend'
  | 'ban'
  | 'reversal'

export type ActionCentreStatus = 'Active' | 'Reversed' | 'Expired'

export type ActionCentreCategory =
  | 'Warnings'
  | 'Restrictions'
  | 'Suspensions'
  | 'Bans'
  | 'Reversals'

export interface ActionCentreEntry {
  id: number
  type: ActionCentreType
  target: { id: number; name: string; avatar: string; handle: string }
  reason: string
  source?: string
  appliedBy: string
  appliedAt: string
  expiresAt?: string
  status: ActionCentreStatus
  reversedBy?: string
  reversedAt?: string
  reversalReason?: string
  reversalOf?: number
}

// City Operations types
export type CityHealth = 'Healthy' | 'Watch' | 'At Risk'

export interface CityTrendPoint {
  day: string
  noShows: number
  cancellations: number
}

export interface WeakZone {
  name: string
  joinedThisWeek: number
  hostsActive: number
  trend: 'down' | 'flat' | 'up'
}

export interface FlaggedPlanRef {
  id: number
  name: string
  host: string
  reason: string
  date: string
}

export interface CityOps {
  id: number
  name: string
  country: string
  countryCode: string
  status: CityHealth
  population: string
  plansToday: number
  activeHosts: number
  joinedUsersWeek: number
  flaggedPlans: number
  noShowRate7d: number
  cancellationRate7d: number
  trend: CityTrendPoint[]
  weakZones: WeakZone[]
  flaggedList: FlaggedPlanRef[]
  notes?: string
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

export type AdminRole = 'super_admin' | 'admin'

export type ModuleKey =
  | 'dashboard'
  | 'users'
  | 'plans'
  | 'community'
  | 'interest'
  | 'subscriptions'
  | 'revenue'
  | 'safety'
  | 'actionCentre'
  | 'cityOps'
  | 'broadcast'
  | 'support'
  | 'settings'
  | 'manageAdmin'

export interface ModuleDef {
  key: ModuleKey
  label: string
  description: string
  path: string
}

export const MODULES: ModuleDef[] = [
  { key: 'dashboard', label: 'Dashboard', description: 'Overview metrics and KPIs', path: '/dashboard' },
  { key: 'users', label: 'User Management', description: 'View and moderate users', path: '/users' },
  { key: 'plans', label: 'Plans', description: 'Plan listings and moderation', path: '/plans' },
  { key: 'community', label: 'Community', description: 'Communities and groups', path: '/community' },
  { key: 'interest', label: 'Interest', description: 'Interest categories', path: '/interest' },
  { key: 'subscriptions', label: 'Subscriptions', description: 'Subscription plans', path: '/subscriptions' },
  { key: 'revenue', label: 'Revenue', description: 'Revenue and subscribers', path: '/revenue' },
  { key: 'safety', label: 'Safety Triage', description: 'Reports and triage queue', path: '/safety' },
  { key: 'actionCentre', label: 'Action Centre', description: 'Moderation actions log', path: '/action-centre' },
  { key: 'cityOps', label: 'City Operations', description: 'City-level analytics', path: '/city-operations' },
  { key: 'broadcast', label: 'Broadcast', description: 'Send announcements', path: '/broadcast' },
  { key: 'support', label: 'Support', description: 'Support tickets', path: '/support' },
  { key: 'settings', label: 'Settings', description: 'Profile and platform settings', path: '/settings' },
  { key: 'manageAdmin', label: 'Manage Admin', description: 'Create and manage admin accounts', path: '/manage-admin' },
]

export const ALL_MODULE_KEYS: ModuleKey[] = MODULES.map((m) => m.key)

export type AdminAccountStatus = 'Active' | 'Suspended'

export interface Admin {
  id: number
  name: string
  email: string
  avatar: string
  role: AdminRole
  permissions: ModuleKey[]
  status: AdminAccountStatus
  createdAt: string
}

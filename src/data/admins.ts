import type { Admin } from '@/types/permissions'
import { ALL_MODULE_KEYS } from '@/types/permissions'

export const adminsSeed: Admin[] = [
  {
    id: 1,
    name: 'Super Admin',
    email: 'admin@goodniva.com',
    avatar: 'https://i.pravatar.cc/80?img=60',
    role: 'super_admin',
    permissions: ALL_MODULE_KEYS,
    status: 'Active',
    createdAt: '2024-01-12',
  },
  {
    id: 2,
    name: 'Sara Khan',
    email: 'sara.khan@goodniva.com',
    avatar: 'https://i.pravatar.cc/80?img=47',
    role: 'admin',
    permissions: ['dashboard', 'users', 'safety', 'actionCentre', 'support'],
    status: 'Active',
    createdAt: '2024-08-03',
  },
  {
    id: 3,
    name: 'Marco Rossi',
    email: 'marco.rossi@goodniva.com',
    avatar: 'https://i.pravatar.cc/80?img=12',
    role: 'admin',
    permissions: ['dashboard', 'plans', 'community', 'cityOps'],
    status: 'Active',
    createdAt: '2024-10-19',
  },
  {
    id: 4,
    name: 'Aisha Patel',
    email: 'aisha.patel@goodniva.com',
    avatar: 'https://i.pravatar.cc/80?img=32',
    role: 'admin',
    permissions: ['dashboard', 'revenue', 'subscriptions'],
    status: 'Suspended',
    createdAt: '2025-02-14',
  },
]

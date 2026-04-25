import { ReactNode } from 'react'
import { AlertTriangle, Ban, CircleSlash, Lock, RotateCcw, ShieldOff, Trash2, UserX, UsersRound, X, LucideIcon } from 'lucide-react'
import { colors } from '@/utils/colors'
import { SecondaryButton } from '@/components/common'

export type ConfirmAction =
  | 'delete'
  | 'lock'
  | 'block'
  | 'hide'
  | 'deleteInterest'
  | 'blockUser'
  | 'warn'
  | 'restrictJoin'
  | 'restrictHost'
  | 'suspend'
  | 'ban'
  | 'removeRestriction'
  | 'suspendCommunity'
  | 'reactivateCommunity'
  | 'deleteCommunity'
  | 'reverseAction'

interface ConfirmDialogProps {
  action: ConfirmAction
  userName: string
  onCancel: () => void
  onConfirm: () => void
}

interface ActionConfig {
  Icon: LucideIcon
  iconBg: string
  iconColor: string
  title: string
  message: ReactNode
  confirmLabel: string
  confirmColor: string
  confirmHover: string
}

const ConfirmDialog = ({ action, userName, onCancel, onConfirm }: ConfirmDialogProps) => {
  const configs: Record<ConfirmAction, ActionConfig> = {
    delete: {
      Icon: Trash2, iconBg: colors.dangerLight, iconColor: colors.danger,
      title: 'Delete User?',
      message: <>Are you sure you want to delete <strong>{userName}</strong>? This action cannot be undone and all associated data will be permanently removed.</>,
      confirmLabel: 'Yes, Delete', confirmColor: colors.danger, confirmHover: '#DC2626',
    },
    lock: {
      Icon: Lock, iconBg: colors.warningLight, iconColor: colors.warning,
      title: 'Lock Account?',
      message: <>Are you sure you want to lock <strong>{userName}</strong>'s account? They will be signed out and unable to access the platform.</>,
      confirmLabel: 'Yes, Lock', confirmColor: colors.warning, confirmHover: '#D97706',
    },
    block: {
      Icon: Ban, iconBg: colors.dangerLight, iconColor: colors.danger,
      title: 'Block Plan?',
      message: <>Are you sure you want to block <strong>"{userName}"</strong>? This plan will be removed from public view.</>,
      confirmLabel: 'Yes, Block Plan', confirmColor: colors.danger, confirmHover: '#DC2626',
    },
    hide: {
      Icon: Lock, iconBg: colors.warningLight, iconColor: colors.warning,
      title: 'Hide Subscription?',
      message: <>Are you sure you want to hide <strong>"{userName}"</strong>? This subscription will no longer be visible to the public. You can unhide it later.</>,
      confirmLabel: 'Yes, Hide Subscription', confirmColor: colors.warning, confirmHover: '#D97706',
    },
    deleteInterest: {
      Icon: Trash2, iconBg: colors.dangerLight, iconColor: colors.danger,
      title: 'Delete Interest?',
      message: <>Are you sure you want to delete <strong>"{userName}"</strong>? This interest category will be permanently removed.</>,
      confirmLabel: 'Yes, Delete', confirmColor: colors.danger, confirmHover: '#DC2626',
    },
    blockUser: {
      Icon: Ban, iconBg: colors.dangerLight, iconColor: colors.danger,
      title: 'Block User?',
      message: <>Are you sure you want to block <strong>{userName}</strong>? They will be removed from the platform and unable to create new accounts from the same device.</>,
      confirmLabel: 'Yes, Block User', confirmColor: colors.danger, confirmHover: '#DC2626',
    },
    warn: {
      Icon: AlertTriangle, iconBg: colors.warningLight, iconColor: colors.warning,
      title: 'Warn User?',
      message: <>Send a formal warning to <strong>{userName}</strong>? They'll receive a notification explaining the policy concern.</>,
      confirmLabel: 'Yes, Send Warning', confirmColor: colors.warning, confirmHover: '#D97706',
    },
    restrictJoin: {
      Icon: CircleSlash, iconBg: colors.warningLight, iconColor: colors.warning,
      title: 'Restrict Joining?',
      message: <>Prevent <strong>{userName}</strong> from joining new plans? They can still host their own and use the rest of the platform.</>,
      confirmLabel: 'Yes, Restrict Joining', confirmColor: colors.warning, confirmHover: '#D97706',
    },
    restrictHost: {
      Icon: ShieldOff, iconBg: colors.warningLight, iconColor: colors.warning,
      title: 'Restrict Hosting?',
      message: <>Prevent <strong>{userName}</strong> from hosting new plans? They can still join others' plans.</>,
      confirmLabel: 'Yes, Restrict Hosting', confirmColor: colors.warning, confirmHover: '#D97706',
    },
    suspend: {
      Icon: Lock, iconBg: colors.warningLight, iconColor: colors.warning,
      title: 'Suspend Account?',
      message: <>Suspend <strong>{userName}</strong>'s account? They'll be signed out and unable to access the platform until reinstated.</>,
      confirmLabel: 'Yes, Suspend', confirmColor: colors.warning, confirmHover: '#D97706',
    },
    ban: {
      Icon: UserX, iconBg: colors.dangerLight, iconColor: colors.danger,
      title: 'Ban User?',
      message: <>Ban <strong>{userName}</strong> from the platform? This is a permanent action and they will lose access to all data and features.</>,
      confirmLabel: 'Yes, Ban User', confirmColor: colors.danger, confirmHover: '#DC2626',
    },
    removeRestriction: {
      Icon: ShieldOff, iconBg: colors.successLight, iconColor: colors.success,
      title: 'Remove Restrictions?',
      message: <>Lift all active restrictions and reinstate <strong>{userName}</strong> to good standing?</>,
      confirmLabel: 'Yes, Remove Restrictions', confirmColor: colors.success, confirmHover: '#059669',
    },
    suspendCommunity: {
      Icon: Lock, iconBg: colors.warningLight, iconColor: colors.warning,
      title: 'Suspend Community?',
      message: <>Suspend <strong>{userName}</strong>? Members won't be able to post, host plans, or run competitions until reactivated.</>,
      confirmLabel: 'Yes, Suspend', confirmColor: colors.warning, confirmHover: '#D97706',
    },
    reactivateCommunity: {
      Icon: UsersRound, iconBg: colors.successLight, iconColor: colors.success,
      title: 'Reactivate Community?',
      message: <>Reactivate <strong>{userName}</strong>? All members will regain access to posting, hosting, and competitions.</>,
      confirmLabel: 'Yes, Reactivate', confirmColor: colors.success, confirmHover: '#059669',
    },
    deleteCommunity: {
      Icon: Trash2, iconBg: colors.dangerLight, iconColor: colors.danger,
      title: 'Delete Community?',
      message: <>Permanently delete <strong>{userName}</strong>? All groups, scoreboards, and competition history will be removed. This cannot be undone.</>,
      confirmLabel: 'Yes, Delete', confirmColor: colors.danger, confirmHover: '#DC2626',
    },
    reverseAction: {
      Icon: RotateCcw, iconBg: colors.successLight, iconColor: colors.success,
      title: 'Reverse Action?',
      message: <>Reverse this moderation action against <strong>{userName}</strong>? It will be logged as a reversal in the action history.</>,
      confirmLabel: 'Yes, Reverse', confirmColor: colors.success, confirmHover: '#059669',
    },
  }

  const cfg = configs[action]

  return (
    <>
      <div onClick={onCancel} className="fixed inset-0 bg-[rgba(15,23,42,0.45)] backdrop-blur-sm z-[100] animate-[fadeIn_0.2s_ease]" />
      <div className="fixed inset-0 z-[101] flex items-center justify-center p-5 pointer-events-none">
        <div className="bg-surface rounded-[20px] w-full max-w-[440px] pointer-events-auto shadow-modal animate-[modalSlide_0.25s_ease]">
          <div className="p-7 text-center relative">
            <button onClick={onCancel} className="absolute top-4 right-4 w-9 h-9 rounded-lg border-none bg-transparent cursor-pointer text-ink-secondary flex items-center justify-center hover:bg-surface-input transition-colors">
              <X size={20} />
            </button>
            <div className="w-16 h-16 rounded-full inline-flex items-center justify-center mb-4" style={{ background: cfg.iconBg, color: cfg.iconColor }}>
              <cfg.Icon size={28} />
            </div>
            <h2 className="text-xl font-bold text-ink-primary m-0 mb-[10px]">{cfg.title}</h2>
            <p className="text-sm text-ink-secondary m-0 mb-6 leading-relaxed">{cfg.message}</p>
            <div className="flex gap-[10px] justify-center">
              <SecondaryButton label="Cancel" onClick={onCancel} />
              <button
                onClick={onConfirm}
                onMouseEnter={(e) => (e.currentTarget.style.background = cfg.confirmHover)}
                onMouseLeave={(e) => (e.currentTarget.style.background = cfg.confirmColor)}
                className="h-11 px-[22px] rounded-pill border-none text-white text-sm font-semibold cursor-pointer transition-colors duration-150"
                style={{ background: cfg.confirmColor }}
              >
                {cfg.confirmLabel}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default ConfirmDialog

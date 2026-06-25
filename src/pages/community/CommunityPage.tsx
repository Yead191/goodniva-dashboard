import { useState } from 'react'
import { createPortal } from 'react-dom'
import {
  Eye,
  Lock,
  MoreVertical,
  Trash2,
  UsersRound,
  type LucideIcon,
} from 'lucide-react'
import PageHeader from '@/components/layout/PageHeader'
import { Card, Badge, IconButton } from '@/components/common'
import CommunityDetailsModal, { type GroupAction } from '@/components/modals/CommunityDetailsModal'
import ConfirmDialog, { ConfirmAction } from '@/components/modals/ConfirmDialog'
import { communitiesSeed } from '@/data/communities'
import { useToast } from '@/context/ToastContext'
import { useAnchoredMenu } from '@/hooks/useAnchoredMenu'
import { getStatusStyle } from '@/utils/statusStyles'
import type { Community, CommunityGroup, GroupStatus, ToastTone } from '@/types'

type CommunityAction = Extract<
  ConfirmAction,
  'suspendCommunity' | 'reactivateCommunity' | 'deleteCommunity'
>

type ConfirmState =
  | { kind: 'community'; action: CommunityAction; community: Community }
  | { kind: 'group'; action: GroupAction; community: Community; group: CommunityGroup }

const CommunityPage = () => {
  const [communities, setCommunities] = useState<Community[]>(communitiesSeed)
  const [selected, setSelected] = useState<Community | null>(null)
  const [confirm, setConfirm] = useState<ConfirmState | null>(null)
  const { showToast } = useToast()

  const handleConfirm = () => {
    if (!confirm) return
    if (confirm.kind === 'group') {
      applyGroupAction(confirm.community, confirm.group, confirm.action)
      setConfirm(null)
      return
    }
    const { community, action } = confirm
    if (action === 'deleteCommunity') {
      setCommunities((prev) => prev.filter((c) => c.id !== community.id))
      showToast(`"${community.name}" has been deleted`, 'danger')
    } else if (action === 'suspendCommunity') {
      setCommunities((prev) =>
        prev.map((c) => (c.id === community.id ? { ...c, status: 'Inactive' } : c)),
      )
      showToast(`"${community.name}" has been suspended`, 'warning')
    } else {
      setCommunities((prev) =>
        prev.map((c) => (c.id === community.id ? { ...c, status: 'Active' } : c)),
      )
      showToast(`"${community.name}" has been reactivated`, 'success')
    }
    setConfirm(null)
  }

  const applyGroupAction = (community: Community, group: CommunityGroup, action: GroupAction) => {
    const status = groupStatusForAction(action)
    const updateGroups = (c: Community): Community =>
      c.id === community.id
        ? { ...c, groupList: c.groupList.map((g) => (g.id === group.id ? { ...g, status } : g)) }
        : c
    setCommunities((prev) => prev.map(updateGroups))
    setSelected((prev) => (prev ? updateGroups(prev) : prev))
    const { text, tone } = groupActionToast(group.name, action)
    showToast(text, tone)
  }

  return (
    <div className="py-7 px-8">
      <PageHeader title="Community" subtitle="View and manage all communities on the platform" />

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-surface-subtle">
                {['COMMUNITY', 'OWNER', 'MEMBERS', 'GROUPS', 'COMPETITIONS', 'STATUS', 'ACTIONS'].map((h) => (
                  <th key={h} className="text-left py-[14px] px-4 text-[11px] font-bold text-ink-secondary tracking-[0.6px]">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {communities.map((c) => (
                <CommunityRow
                  key={c.id}
                  community={c}
                  onView={() => setSelected(c)}
                  onAction={(action) => setConfirm({ kind: 'community', community: c, action })}
                />
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {selected && (
        <CommunityDetailsModal
          community={selected}
          onClose={() => setSelected(null)}
          onGroupAction={(group, action) =>
            setConfirm({ kind: 'group', community: selected, group, action })
          }
        />
      )}
      {confirm && (
        <ConfirmDialog
          action={confirm.action}
          userName={confirm.kind === 'group' ? confirm.group.name : confirm.community.name}
          onCancel={() => setConfirm(null)}
          onConfirm={handleConfirm}
        />
      )}
    </div>
  )
}

interface CommunityRowProps {
  community: Community
  onView: () => void
  onAction: (action: CommunityAction) => void
}

const CommunityRow = ({ community, onView, onAction }: CommunityRowProps) => {
  const status = getStatusStyle(community.status)
  return (
    <tr className="hover:bg-surface-subtle transition-colors duration-150">
      <td className="py-[14px] px-4 border-b border-line-light">
        <div className="flex items-center gap-3">
          <img src={community.avatar} alt="" className="w-10 h-10 rounded-[10px] object-cover" />
          <div className="text-sm font-semibold text-ink-primary">{community.name}</div>
        </div>
      </td>
      <td className="py-[14px] px-4 border-b border-line-light">
        <div className="flex items-center gap-2">
          <img src={community.owner.avatar} alt="" className="w-7 h-7 rounded-full" />
          <span className="text-[13px]">{community.owner.name}</span>
        </div>
      </td>
      <td className="py-[14px] px-4 border-b border-line-light text-sm font-semibold">{community.memberCount.toLocaleString()}</td>
      <td className="py-[14px] px-4 border-b border-line-light text-sm">{community.groups}</td>
      <td className="py-[14px] px-4 border-b border-line-light text-sm">{community.competitions}</td>
      <td className="py-[14px] px-4 border-b border-line-light">
        <Badge text={community.status} bg={status.bg} color={status.text} />
      </td>
      <td className="py-[14px] px-4 border-b border-line-light">
        <div className="flex gap-1 items-center">
          <IconButton Icon={Eye} tooltip="View" onClick={onView} />
          <CommunityActionsMenu community={community} onAction={onAction} />
          <IconButton
            Icon={Trash2}
            tooltip="Delete"
            danger
            onClick={() => onAction('deleteCommunity')}
          />
        </div>
      </td>
    </tr>
  )
}

interface MenuItem {
  key: CommunityAction
  label: string
  Icon: LucideIcon
  tone: 'warning' | 'success'
  hidden?: boolean
}

const CommunityActionsMenu = ({
  community,
  onAction,
}: {
  community: Community
  onAction: (action: CommunityAction) => void
}) => {
  const { open, setOpen, triggerRef, menuRef, coords, toggle } = useAnchoredMenu(180)

  const items: MenuItem[] = [
    {
      key: 'suspendCommunity',
      label: 'Suspend',
      Icon: Lock,
      tone: 'warning',
      hidden: community.status !== 'Active',
    },
    {
      key: 'reactivateCommunity',
      label: 'Reactivate',
      Icon: UsersRound,
      tone: 'success',
      hidden: community.status === 'Active',
    },
  ].filter((m) => !m.hidden) as MenuItem[]

  const toneClass = (tone: MenuItem['tone']) => {
    if (tone === 'success') return 'text-success hover:bg-surface-subtle'
    return 'text-ink-primary hover:bg-surface-subtle'
  }

  return (
    <div className="inline-flex" ref={triggerRef}>
      <IconButton Icon={MoreVertical} tooltip="More actions" onClick={toggle} />
      {open &&
        createPortal(
          <div
            ref={menuRef}
            style={{ position: 'fixed', top: coords.top, left: coords.left, width: 180 }}
            className="bg-surface rounded-[12px] border border-line-light shadow-modal z-[110] py-1 animate-[fadeIn_0.15s_ease]"
          >
            {items.map((item) => (
              <button
                key={item.key}
                onClick={() => {
                  setOpen(false)
                  onAction(item.key)
                }}
                className={`w-full flex items-center gap-2 px-3 py-2 text-[13px] font-medium text-left bg-transparent border-none cursor-pointer transition-colors ${toneClass(item.tone)}`}
              >
                <item.Icon size={15} />
                {item.label}
              </button>
            ))}
          </div>,
          document.body,
        )}
    </div>
  )
}

const groupStatusForAction = (action: GroupAction): GroupStatus => {
  switch (action) {
    case 'warnGroup':
      return 'Warned'
    case 'restrictGroupJoin':
      return 'Join Restricted'
    case 'restrictGroupHost':
      return 'Host Restricted'
    case 'suspendGroup':
      return 'Suspended'
    case 'banGroup':
      return 'Banned'
    case 'removeGroupRestriction':
      return 'Active'
  }
}

const groupActionToast = (
  name: string,
  action: GroupAction,
): { text: string; tone: ToastTone } => {
  switch (action) {
    case 'warnGroup':
      return { text: `Warning sent to "${name}"`, tone: 'warning' }
    case 'restrictGroupJoin':
      return { text: `Joining restricted for "${name}"`, tone: 'warning' }
    case 'restrictGroupHost':
      return { text: `Hosting restricted for "${name}"`, tone: 'warning' }
    case 'suspendGroup':
      return { text: `"${name}" has been suspended`, tone: 'warning' }
    case 'banGroup':
      return { text: `"${name}" has been banned`, tone: 'danger' }
    case 'removeGroupRestriction':
      return { text: `"${name}" has been reactivated`, tone: 'success' }
  }
}

export default CommunityPage

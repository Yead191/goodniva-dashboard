import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import {
  X,
  Users,
  UsersRound,
  Trophy,
  Target,
  AlertTriangle,
  Ban,
  CircleSlash,
  Lock,
  MoreVertical,
  ShieldCheck,
  ShieldOff,
  type LucideIcon,
} from 'lucide-react'
import { colors } from '@/utils/colors'
import { Badge, IconButton, PrimaryButton } from '@/components/common'
import { getStatusStyle } from '@/utils/statusStyles'
import type { Community, CommunityGroup } from '@/types'
import type { ConfirmAction } from '@/components/modals/ConfirmDialog'

export type GroupAction = Extract<
  ConfirmAction,
  | 'warnGroup'
  | 'restrictGroupJoin'
  | 'restrictGroupHost'
  | 'suspendGroup'
  | 'banGroup'
  | 'removeGroupRestriction'
>

type Tab = 'overview' | 'members' | 'group' | 'competitions' | 'scoreboard'

interface CommunityDetailsModalProps {
  community: Community
  onClose: () => void
  onGroupAction?: (group: CommunityGroup, action: GroupAction) => void
}

const CommunityDetailsModal = ({ community, onClose, onGroupAction }: CommunityDetailsModalProps) => {
  const [tab, setTab] = useState<Tab>('overview')

  const tabs: { key: Tab; label: string }[] = [
    { key: 'overview', label: 'Overview' },
    { key: 'members', label: 'Members' },
    { key: 'group', label: 'Group' },
    { key: 'competitions', label: 'Competitions' },
    { key: 'scoreboard', label: 'Scoreboard' },
  ]

  return (
    <>
      <div onClick={onClose} className="fixed inset-0 bg-[rgba(15,23,42,0.45)] backdrop-blur-sm z-[100] animate-[fadeIn_0.2s_ease]" />
      <div className="fixed inset-0 z-[101] flex items-center justify-center p-5 pointer-events-none">
        <div className="bg-surface rounded-[20px] w-full max-w-[760px] max-h-[92vh] flex flex-col pointer-events-auto shadow-modal animate-[modalSlide_0.25s_ease]">
          <div className="py-[22px] px-7 border-b border-line-light shrink-0">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-[14px]">
                <img src={community.avatar} alt="" className="w-14 h-14 rounded-[14px] object-cover" />
                <div>
                  <h2 className="text-xl font-bold text-ink-primary m-0">{community.name}</h2>
                  <p className="text-[13px] text-ink-secondary mt-0.5 mb-0">{community.type}</p>
                </div>
              </div>
              <button onClick={onClose} className="w-9 h-9 rounded-lg border-none bg-transparent cursor-pointer flex items-center justify-center text-ink-secondary hover:bg-surface-input transition-colors">
                <X size={20} />
              </button>
            </div>

            <div className="flex gap-2 -mx-7 px-7 border-b border-line-light">
              {tabs.map((t) => (
                <button key={t.key} onClick={() => setTab(t.key)}
                  className={`py-[10px] px-4 border-none bg-transparent text-sm font-semibold cursor-pointer transition-colors -mb-px ${
                    tab === t.key ? 'text-primary border-b-2 border-primary' : 'text-ink-secondary border-b-2 border-transparent'
                  }`}>
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1 overflow-auto py-5 px-7">
            {tab === 'overview' && <OverviewTab community={community} />}
            {tab === 'members' && <MembersTab community={community} />}
            {tab === 'group' && <GroupTab community={community} onGroupAction={onGroupAction} />}
            {tab === 'competitions' && <CompetitionsTab community={community} />}
            {tab === 'scoreboard' && <ScoreboardTab community={community} />}
          </div>

          <div className="py-[18px] px-7 border-t border-line-light flex justify-end shrink-0">
            <PrimaryButton label="Close" onClick={onClose} />
          </div>
        </div>
      </div>
    </>
  )
}

const OverviewTab = ({ community }: { community: Community }) => (
  <div>
    <div className="grid grid-cols-4 gap-3 mb-5">
      <MiniStat Icon={Users} label="Members" value={community.memberCount.toLocaleString()} />
      <MiniStat Icon={UsersRound} label="Groups" value={community.groups} />
      <MiniStat Icon={Target} label="Competitions" value={community.competitions} />
      <MiniStat Icon={Trophy} label="Wins" value={community.wins} />
    </div>
    <div className="bg-surface-subtle border border-line-light rounded-[14px] p-4">
      <div className="text-[11px] font-bold text-ink-secondary tracking-[0.6px] mb-[10px]">OWNER</div>
      <div className="flex items-center gap-3 mb-4">
        <img src={community.owner.avatar} alt="" className="w-11 h-11 rounded-full" />
        <div>
          <div className="text-[15px] font-bold text-ink-primary">{community.owner.name}</div>
          <div className="text-xs text-ink-secondary">Created {community.createdDate}</div>
        </div>
      </div>
      <p className="text-sm text-ink-secondary m-0 leading-relaxed">{community.description}</p>
    </div>
  </div>
)

const MembersTab = ({ community }: { community: Community }) => (
  <div className="flex flex-col gap-[10px]">
    {community.memberList.length === 0 ? (
      <EmptyState message="No member details available" />
    ) : community.memberList.map((m) => (
      <div key={m.id} className="flex items-center gap-3 p-3 bg-surface-subtle rounded-xl">
        <img src={m.avatar} alt="" className="w-10 h-10 rounded-full" />
        <div className="flex-1">
          <div className="text-sm font-semibold text-ink-primary">{m.name}</div>
          <div className="text-xs text-ink-muted">Joined {m.joined}</div>
        </div>
        <Badge text={m.role} bg={colors.primaryLight} color={colors.primary} />
      </div>
    ))}
  </div>
)

const GroupTab = ({
  community,
  onGroupAction,
}: {
  community: Community
  onGroupAction?: (group: CommunityGroup, action: GroupAction) => void
}) => (
  <div className="grid grid-cols-2 gap-3">
    {community.groupList.length === 0 ? (
      <div className="col-span-2"><EmptyState message="No groups created yet" /></div>
    ) : community.groupList.map((g) => {
      const status = g.status ?? 'Active'
      const style = getStatusStyle(status)
      return (
        <div key={g.id} className="bg-surface-subtle border border-line-light rounded-xl p-[14px]">
          <div className="flex items-start gap-[10px] mb-2">
            <img src={g.avatar} alt="" className="w-9 h-9 rounded-[10px]" />
            <div className="min-w-0 flex-1">
              <div className="text-sm font-bold text-ink-primary truncate">{g.name}</div>
              <div className="text-xs text-ink-muted">{g.city}</div>
            </div>
            {onGroupAction && <GroupActionsMenu group={g} onAction={(a) => onGroupAction(g, a)} />}
          </div>
          <div className="flex items-center justify-between">
            <div className="text-[13px] text-ink-secondary">{g.members} members</div>
            {status !== 'Active' && <Badge text={status} bg={style.bg} color={style.text} />}
          </div>
        </div>
      )
    })}
  </div>
)

interface GroupMenuItem {
  key: GroupAction
  label: string
  Icon: LucideIcon
  tone: 'warning' | 'danger' | 'success'
}

const GROUP_MODERATION_ITEMS: GroupMenuItem[] = [
  { key: 'warnGroup', label: 'Warn Group', Icon: AlertTriangle, tone: 'warning' },
  { key: 'restrictGroupJoin', label: 'Restrict Joining', Icon: CircleSlash, tone: 'warning' },
  { key: 'restrictGroupHost', label: 'Restrict Hosting', Icon: ShieldOff, tone: 'warning' },
  { key: 'suspendGroup', label: 'Suspend Group', Icon: Lock, tone: 'warning' },
  { key: 'banGroup', label: 'Ban Group', Icon: Ban, tone: 'danger' },
]

const MENU_WIDTH = 190

const GroupActionsMenu = ({
  group,
  onAction,
}: {
  group: CommunityGroup
  onAction: (action: GroupAction) => void
}) => {
  const [open, setOpen] = useState(false)
  const [coords, setCoords] = useState({ top: 0, left: 0 })
  const triggerRef = useRef<HTMLDivElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)

  const status = group.status ?? 'Active'
  const items: GroupMenuItem[] = [
    ...GROUP_MODERATION_ITEMS,
    ...(status !== 'Active'
      ? [{ key: 'removeGroupRestriction' as const, label: 'Reactivate', Icon: ShieldCheck, tone: 'success' as const }]
      : []),
  ]

  useEffect(() => {
    if (!open) return
    const onDocClick = (e: MouseEvent) => {
      const node = e.target as Node
      if (triggerRef.current?.contains(node) || menuRef.current?.contains(node)) return
      setOpen(false)
    }
    // The menu is portaled, so any scroll/resize would detach it — close instead.
    const onScrollOrResize = () => setOpen(false)
    document.addEventListener('mousedown', onDocClick)
    window.addEventListener('scroll', onScrollOrResize, true)
    window.addEventListener('resize', onScrollOrResize)
    return () => {
      document.removeEventListener('mousedown', onDocClick)
      window.removeEventListener('scroll', onScrollOrResize, true)
      window.removeEventListener('resize', onScrollOrResize)
    }
  }, [open])

  const toggle = () => {
    if (!open && triggerRef.current) {
      const r = triggerRef.current.getBoundingClientRect()
      const estHeight = items.length * 38 + 8
      const top =
        r.bottom + estHeight + 8 > window.innerHeight ? r.top - estHeight - 4 : r.bottom + 4
      setCoords({ top, left: Math.max(8, r.right - MENU_WIDTH) })
    }
    setOpen((o) => !o)
  }

  const toneClass = (tone: GroupMenuItem['tone']) => {
    if (tone === 'danger') return 'text-danger hover:bg-danger-light'
    if (tone === 'success') return 'text-success hover:bg-surface-subtle'
    return 'text-ink-primary hover:bg-surface-subtle'
  }

  return (
    <div className="shrink-0" ref={triggerRef}>
      <IconButton Icon={MoreVertical} tooltip="Group actions" onClick={toggle} />
      {open &&
        createPortal(
          <div
            ref={menuRef}
            style={{ position: 'fixed', top: coords.top, left: coords.left, width: MENU_WIDTH }}
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

const CompetitionsTab = ({ community }: { community: Community }) => (
  <div className="flex flex-col gap-3">
    {community.competitionList.length === 0 ? (
      <EmptyState message="No competitions scheduled" />
    ) : community.competitionList.map((c) => (
      <div key={c.id} className="bg-surface-subtle border border-line-light rounded-xl p-4">
        <div className="flex justify-between mb-3">
          <div className="text-[15px] font-bold text-ink-primary">{c.title}</div>
          <Badge text={c.status} bg={colors.infoLight} color={colors.infoText} />
        </div>
        <div className="flex items-center gap-4 justify-center">
          <TeamInfo team={c.teamA} />
          <div className="text-sm font-bold text-ink-muted">VS</div>
          <TeamInfo team={c.teamB} />
        </div>
        <div className="text-center text-xs text-ink-muted mt-[10px]">{c.date}</div>
      </div>
    ))}
  </div>
)

const TeamInfo = ({ team }: { team: { name: string; avatar: string } }) => (
  <div className="flex flex-col items-center gap-[6px]">
    <img src={team.avatar} alt="" className="w-10 h-10 rounded-full" />
    <span className="text-xs font-semibold text-ink-primary">{team.name}</span>
  </div>
)

const ScoreboardTab = ({ community }: { community: Community }) => (
  <div>
    {community.scoreboard.length === 0 ? (
      <EmptyState message="No scores yet" />
    ) : (
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-surface-subtle">
            {['POS', 'GROUP', 'M', 'W', 'D', 'L'].map((h) => (
              <th key={h} className="text-left py-[10px] px-3 text-[11px] font-bold text-ink-secondary tracking-[0.6px]">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {community.scoreboard.map((row) => (
            <tr key={row.pos}>
              <td className="p-3 border-b border-line-light text-sm font-bold">#{row.pos}</td>
              <td className="p-3 border-b border-line-light">
                <div className="flex items-center gap-2">
                  <img src={row.avatar} alt="" className="w-7 h-7 rounded-full" />
                  <div>
                    <div className="text-[13px] font-semibold">{row.name}</div>
                    <div className="text-[10px] text-ink-muted tracking-[0.5px]">{row.city}</div>
                  </div>
                </div>
              </td>
              <td className="p-3 border-b border-line-light text-[13px]">{row.m}</td>
              <td className="p-3 border-b border-line-light text-[13px] text-success font-bold">{row.w}</td>
              <td className="p-3 border-b border-line-light text-[13px]">{row.d}</td>
              <td className="p-3 border-b border-line-light text-[13px] text-danger font-bold">{row.l}</td>
            </tr>
          ))}
        </tbody>
      </table>
    )}
  </div>
)

const MiniStat = ({ Icon, label, value }: { Icon: LucideIcon; label: string; value: string | number }) => (
  <div className="p-[14px] bg-surface-subtle border border-line-light rounded-xl">
    <Icon size={16} color={colors.primary} />
    <div className="text-xl font-bold text-ink-primary mt-2">{value}</div>
    <div className="text-[11px] text-ink-secondary mt-0.5">{label}</div>
  </div>
)

const EmptyState = ({ message }: { message: string }) => (
  <div className="py-10 px-5 text-center text-ink-muted text-sm">{message}</div>
)

export default CommunityDetailsModal

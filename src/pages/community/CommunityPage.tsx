import { useState } from 'react'
import { Eye } from 'lucide-react'
import PageHeader from '@/components/layout/PageHeader'
import { Card, Badge, IconButton } from '@/components/common'
import CommunityDetailsModal from '@/components/modals/CommunityDetailsModal'
import { communitiesSeed } from '@/data/communities'
import { getStatusStyle } from '@/utils/statusStyles'
import type { Community } from '@/types'

const CommunityPage = () => {
  const [communities] = useState<Community[]>(communitiesSeed)
  const [selected, setSelected] = useState<Community | null>(null)

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
                <CommunityRow key={c.id} community={c} onView={() => setSelected(c)} />
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {selected && <CommunityDetailsModal community={selected} onClose={() => setSelected(null)} />}
    </div>
  )
}

const CommunityRow = ({ community, onView }: { community: Community; onView: () => void }) => {
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
        <IconButton Icon={Eye} tooltip="View" onClick={onView} />
      </td>
    </tr>
  )
}

export default CommunityPage

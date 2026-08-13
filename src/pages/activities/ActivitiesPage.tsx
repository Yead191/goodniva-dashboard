import { useState } from 'react'
import { Plus, Edit2, Trash2, ImageIcon } from 'lucide-react'
import PageHeader from '@/components/layout/PageHeader'
import { Card, IconButton, PrimaryButton, Toggle, Badge } from '@/components/common'
import ActivityFormModal from '@/components/modals/ActivityFormModal'
import ConfirmDialog from '@/components/modals/ConfirmDialog'
import { activitiesSeed } from '@/data/activities'
import { useToast } from '@/context/ToastContext'
import { colors } from '@/utils/colors'
import type { Activity } from '@/types'

const ActivitiesPage = () => {
  const [activities, setActivities] = useState<Activity[]>(activitiesSeed)
  const [mode, setMode] = useState<'create' | 'edit' | null>(null)
  const [editing, setEditing] = useState<Activity | null>(null)
  const [confirming, setConfirming] = useState<Activity | null>(null)
  const { showToast } = useToast()

  const handleCreate = (data: Omit<Activity, 'id'>) => {
    setActivities((prev) => [...prev, { ...data, id: Date.now() }])
    setMode(null)
    showToast(`Activity "${data.name}" added`, 'success')
  }

  const handleUpdate = (data: Omit<Activity, 'id'>) => {
    if (!editing) return
    setActivities((prev) => prev.map((a) => (a.id === editing.id ? { ...a, ...data } : a)))
    setMode(null)
    setEditing(null)
    showToast(`Activity "${data.name}" updated`, 'success')
  }

  const handleDelete = () => {
    if (!confirming) return
    setActivities((prev) => prev.filter((a) => a.id !== confirming.id))
    showToast(`"${confirming.name}" has been deleted`, 'danger')
    setConfirming(null)
  }

  const handleToggle = (activity: Activity) => {
    const next = !activity.enabled
    setActivities((prev) =>
      prev.map((a) => (a.id === activity.id ? { ...a, enabled: next } : a)),
    )
    showToast(
      `"${activity.name}" ${next ? 'enabled' : 'disabled'} for competitions`,
      next ? 'success' : 'warning',
    )
  }

  return (
    <div className="py-7 px-8">
      <PageHeader
        title="Activities"
        subtitle="Manage activities available for competitions"
        action={
          <PrimaryButton
            Icon={Plus}
            label="Add Activity"
            onClick={() => { setEditing(null); setMode('create') }}
          />
        }
      />

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-surface-subtle">
                {['IMAGE', 'ACTIVITY NAME', 'STATUS', 'ENABLED', 'ACTIONS'].map((h) => (
                  <th key={h} className="text-left py-[14px] px-4 text-[11px] font-bold text-ink-secondary tracking-[0.6px]">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {activities.map((activity) => (
                <ActivityRow
                  key={activity.id}
                  activity={activity}
                  onEdit={() => { setEditing(activity); setMode('edit') }}
                  onDelete={() => setConfirming(activity)}
                  onToggle={() => handleToggle(activity)}
                />
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {mode && (
        <ActivityFormModal
          mode={mode}
          initialData={editing ?? undefined}
          onCancel={() => { setMode(null); setEditing(null) }}
          onSubmit={mode === 'edit' ? handleUpdate : handleCreate}
        />
      )}
      {confirming && (
        <ConfirmDialog
          action="deleteActivity"
          userName={confirming.name}
          onCancel={() => setConfirming(null)}
          onConfirm={handleDelete}
        />
      )}
    </div>
  )
}

interface ActivityRowProps {
  activity: Activity
  onEdit: () => void
  onDelete: () => void
  onToggle: () => void
}

const ActivityRow = ({ activity, onEdit, onDelete, onToggle }: ActivityRowProps) => (
  <tr className="hover:bg-surface-subtle transition-colors duration-150">
    <td className="py-[14px] px-4 border-b border-line-light">
      <div className="w-14 h-14 rounded-[14px] bg-surface-input flex items-center justify-center overflow-hidden">
        {activity.image ? (
          <img src={activity.image} alt={activity.name} className="w-full h-full object-cover" />
        ) : (
          <ImageIcon size={22} className="text-ink-muted" />
        )}
      </div>
    </td>
    <td className="py-[14px] px-4 border-b border-line-light text-[15px] font-semibold text-ink-primary">
      {activity.name}
    </td>
    <td className="py-[14px] px-4 border-b border-line-light">
      <Badge
        text={activity.enabled ? 'Active' : 'Disabled'}
        bg={activity.enabled ? colors.successLight : colors.bgInput}
        color={activity.enabled ? colors.successText : colors.textSecondary}
      />
    </td>
    <td className="py-[14px] px-4 border-b border-line-light">
      <Toggle checked={activity.enabled} onChange={() => onToggle()} />
    </td>
    <td className="py-[14px] px-4 border-b border-line-light">
      <div className="flex gap-1">
        <IconButton Icon={Edit2} tooltip="Edit" onClick={onEdit} />
        <IconButton Icon={Trash2} tooltip="Delete" danger onClick={onDelete} />
      </div>
    </td>
  </tr>
)

export default ActivitiesPage

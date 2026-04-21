import { useState } from 'react'
import { Plus, Edit2, Trash2 } from 'lucide-react'
import PageHeader from '@/components/layout/PageHeader'
import { Card, IconButton, PrimaryButton } from '@/components/common'
import InterestFormModal from '@/components/modals/InterestFormModal'
import ConfirmDialog from '@/components/modals/ConfirmDialog'
import { interestsSeed } from '@/data/subscriptions'
import { useToast } from '@/context/ToastContext'
import type { Interest } from '@/types'

const InterestPage = () => {
  const [interests, setInterests] = useState<Interest[]>(interestsSeed)
  const [mode, setMode] = useState<'create' | 'edit' | null>(null)
  const [editing, setEditing] = useState<Interest | null>(null)
  const [confirming, setConfirming] = useState<Interest | null>(null)
  const { showToast } = useToast()

  const handleCreate = (data: Omit<Interest, 'id'>) => {
    setInterests((prev) => [...prev, { ...data, id: Date.now() }])
    setMode(null)
    showToast(`Interest "${data.name}" added`, 'success')
  }

  const handleUpdate = (data: Omit<Interest, 'id'>) => {
    if (!editing) return
    setInterests((prev) => prev.map((i) => (i.id === editing.id ? { ...i, ...data } : i)))
    setMode(null)
    setEditing(null)
    showToast(`Interest "${data.name}" updated`, 'success')
  }

  const handleDelete = () => {
    if (!confirming) return
    setInterests((prev) => prev.filter((i) => i.id !== confirming.id))
    showToast(`"${confirming.name}" has been deleted`, 'danger')
    setConfirming(null)
  }

  return (
    <div className="py-7 px-8">
      <PageHeader
        title="Interests"
        subtitle="Manage user interests and categories"
        action={
          <PrimaryButton
            Icon={Plus}
            label="Add Interest"
            onClick={() => { setEditing(null); setMode('create') }}
          />
        }
      />

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-surface-subtle">
                {['ICON', 'INTEREST NAME', 'ACTIONS'].map((h) => (
                  <th key={h} className="text-left py-[14px] px-4 text-[11px] font-bold text-ink-secondary tracking-[0.6px]">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {interests.map((interest) => (
                <InterestRow
                  key={interest.id}
                  interest={interest}
                  onEdit={() => { setEditing(interest); setMode('edit') }}
                  onDelete={() => setConfirming(interest)}
                />
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {mode && (
        <InterestFormModal
          mode={mode}
          initialData={editing ?? undefined}
          onCancel={() => { setMode(null); setEditing(null) }}
          onSubmit={mode === 'edit' ? handleUpdate : handleCreate}
        />
      )}
      {confirming && (
        <ConfirmDialog
          action="deleteInterest"
          userName={confirming.name}
          onCancel={() => setConfirming(null)}
          onConfirm={handleDelete}
        />
      )}
    </div>
  )
}

interface InterestRowProps {
  interest: Interest
  onEdit: () => void
  onDelete: () => void
}

const InterestRow = ({ interest, onEdit, onDelete }: InterestRowProps) => (
  <tr className="hover:bg-surface-subtle transition-colors duration-150">
    <td className="py-[14px] px-4 border-b border-line-light">
      <div className="w-14 h-14 rounded-[14px] bg-surface-input flex items-center justify-center text-[30px]">
        {interest.emoji}
      </div>
    </td>
    <td className="py-[14px] px-4 border-b border-line-light text-[15px] font-semibold text-ink-primary">
      {interest.name}
    </td>
    <td className="py-[14px] px-4 border-b border-line-light">
      <div className="flex gap-1">
        <IconButton Icon={Edit2} tooltip="Edit" onClick={onEdit} />
        <IconButton Icon={Trash2} tooltip="Delete" danger onClick={onDelete} />
      </div>
    </td>
  </tr>
)

export default InterestPage

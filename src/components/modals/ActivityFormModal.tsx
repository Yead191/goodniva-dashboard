import { useState } from 'react'
import { X } from 'lucide-react'
import { PillInput, PrimaryButton, DangerButton, FieldWithLabel } from '@/components/common'
import ImageUpload from '@/components/ImageUpload'
import type { Activity } from '@/types'

interface ActivityFormModalProps {
  mode: 'create' | 'edit'
  initialData?: Activity
  onCancel: () => void
  onSubmit: (data: Omit<Activity, 'id'>) => void
}

const ActivityFormModal = ({ mode, initialData, onCancel, onSubmit }: ActivityFormModalProps) => {
  const [name, setName] = useState(initialData?.name ?? '')
  const [image, setImage] = useState(initialData?.image ?? '')
  const [enabled, setEnabled] = useState(initialData?.enabled ?? true)

  const isEdit = mode === 'edit'

  const handleSubmit = () => {
    if (!name.trim()) return
    onSubmit({ name: name.trim(), image, enabled })
  }

  return (
    <>
      <div onClick={onCancel} className="fixed inset-0 bg-[rgba(15,23,42,0.45)] backdrop-blur-sm z-[100] animate-[fadeIn_0.2s_ease]" />
      <div className="fixed inset-0 z-[101] flex items-center justify-center p-5 pointer-events-none">
        <div className="bg-surface rounded-[20px] w-full max-w-[520px] max-h-[92vh] flex flex-col pointer-events-auto shadow-modal animate-[modalSlide_0.25s_ease]">
          <div className="py-[22px] px-7 flex justify-between items-center shrink-0">
            <h2 className="text-xl font-bold text-ink-primary m-0">
              {isEdit ? 'Edit Activity' : 'Add New Activity'}
            </h2>
            <button onClick={onCancel} className="w-9 h-9 rounded-lg border-none bg-transparent cursor-pointer flex items-center justify-center text-ink-secondary hover:bg-surface-input transition-colors">
              <X size={20} />
            </button>
          </div>

          <div className="flex-1 overflow-auto px-7 pb-5">
            <FieldWithLabel label="Activity Name">
              <PillInput value={name} onChange={setName} placeholder="e.g. Running" />
            </FieldWithLabel>

            <FieldWithLabel label="Image">
              <ImageUpload value={image} onChange={setImage} />
            </FieldWithLabel>

            <label className="flex items-center gap-3 mt-1 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={enabled}
                onChange={(e) => setEnabled(e.target.checked)}
                className="w-4 h-4 accent-primary cursor-pointer"
              />
              <span className="text-sm font-semibold text-ink-primary">Enabled for competitions</span>
            </label>
          </div>

          <div className="py-[18px] px-7 border-t border-line-light flex gap-[10px] justify-end shrink-0">
            <DangerButton label="Cancel" onClick={onCancel} />
            <PrimaryButton label={isEdit ? 'Update' : 'Save'} onClick={handleSubmit} />
          </div>
        </div>
      </div>
    </>
  )
}

export default ActivityFormModal

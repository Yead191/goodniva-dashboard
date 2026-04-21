import { useState, useRef } from 'react'
import { X, UploadCloud } from 'lucide-react'
import { colors } from '@/utils/colors'
import { PillInput, PrimaryButton, DangerButton } from '@/components/common'
import type { Interest } from '@/types'

interface InterestFormModalProps {
  mode: 'create' | 'edit'
  initialData?: Interest
  onCancel: () => void
  onSubmit: (data: Omit<Interest, 'id'>) => void
}

const EMOJI_PRESETS = ['⚽', '☕', '🎮', '⛰️', '🎨', '🍕', '🧘', '📷', '📚', '🚴', '🎵', '🎬']

const InterestFormModal = ({ mode, initialData, onCancel, onSubmit }: InterestFormModalProps) => {
  const [name, setName] = useState(initialData?.name ?? '')
  const [emoji, setEmoji] = useState(initialData?.emoji ?? '')
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const isEdit = mode === 'edit'

  const handleFile = (file: File | null | undefined) => {
    if (!file) return
    if (!/^image\/(svg\+xml|png|jpeg|jpg)/.test(file.type)) return
    const reader = new FileReader()
    reader.onload = (e) => setImagePreview(e.target?.result as string)
    reader.readAsDataURL(file)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    handleFile(e.dataTransfer.files[0])
  }

  const handleSubmit = () => {
    if (!name.trim()) return
    onSubmit({ name, emoji: emoji || initialData?.emoji || '✨' })
  }

  return (
    <>
      <div onClick={onCancel} className="fixed inset-0 bg-[rgba(15,23,42,0.45)] backdrop-blur-sm z-[100] animate-[fadeIn_0.2s_ease]" />
      <div className="fixed inset-0 z-[101] flex items-center justify-center p-5 pointer-events-none">
        <div className="bg-surface rounded-[20px] w-full max-w-[520px] max-h-[92vh] flex flex-col pointer-events-auto shadow-modal animate-[modalSlide_0.25s_ease]">
          <div className="py-[22px] px-7 flex justify-between items-center shrink-0">
            <h2 className="text-xl font-bold text-ink-primary m-0">
              {isEdit ? 'Edit Interest' : 'Add New Interest'}
            </h2>
            <button onClick={onCancel} className="w-9 h-9 rounded-lg border-none bg-transparent cursor-pointer flex items-center justify-center text-ink-secondary hover:bg-surface-input transition-colors">
              <X size={20} />
            </button>
          </div>

          <div className="flex-1 overflow-auto px-7 pb-5">
            <div className="mb-5">
              <label className="block text-[11px] font-bold text-ink-secondary tracking-[0.6px] mb-2 uppercase">
                Interest Name
              </label>
              <PillInput value={name} onChange={setName} placeholder="e.g. Football" />
            </div>

            <div>
              <label className="block text-[13px] font-semibold text-ink-primary mb-2">
                Image Preview
              </label>
              <div
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                className={`rounded-[14px] p-8 text-center cursor-pointer transition-all duration-150 min-h-[170px] flex items-center justify-center flex-col gap-[10px] border-2 border-dashed ${
                  isDragging ? 'bg-primary-light border-primary' : 'bg-surface-input border-line'
                }`}
              >
                {imagePreview ? (
                  <img src={imagePreview} alt="" className="max-h-[120px] max-w-full rounded-lg object-contain" />
                ) : initialData?.emoji && isEdit ? (
                  <div className="text-5xl">{initialData.emoji}</div>
                ) : (
                  <div className="w-14 h-14 rounded-full bg-surface flex items-center justify-center text-primary">
                    <UploadCloud size={24} />
                  </div>
                )}
                <div>
                  <div className="text-sm font-semibold text-ink-primary">
                    {isDragging ? 'Drop to upload' : 'Click to change or drag & drop'}
                  </div>
                  <div className="text-xs text-ink-muted mt-1">SVG, PNG, JPG (max. 800×400px)</div>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".svg,.png,.jpg,.jpeg"
                  onChange={(e) => handleFile(e.target.files?.[0])}
                  className="hidden"
                />
              </div>
            </div>

            <div className="mt-[14px]">
              <label className="block text-xs font-medium text-ink-secondary mb-2">
                Or pick a quick icon
              </label>
              <div className="flex gap-[6px] flex-wrap">
                {EMOJI_PRESETS.map((e) => (
                  <button
                    key={e}
                    onClick={() => { setEmoji(e); setImagePreview(null) }}
                    style={{
                      border: emoji === e ? `2px solid ${colors.primary}` : `1px solid ${colors.border}`,
                      background: emoji === e ? colors.primaryLight : colors.bgCard,
                    }}
                    className="w-10 h-10 rounded-[10px] cursor-pointer text-xl flex items-center justify-center transition-all duration-150"
                  >
                    {e}
                  </button>
                ))}
              </div>
            </div>
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

export default InterestFormModal

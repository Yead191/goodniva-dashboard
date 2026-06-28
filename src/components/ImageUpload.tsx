import { useRef } from 'react'
import { Upload, X, ImageIcon } from 'lucide-react'

interface ImageUploadProps {
  value: string
  onChange: (dataUrl: string) => void
  /** Aspect hint for the preview box. */
  variant?: 'square' | 'wide'
  disabled?: boolean
}

/**
 * Lightweight image picker. Reads the chosen file as a data URL and hands it to
 * the parent (frontend-only — real uploads would POST to storage on the backend).
 */
const ImageUpload = ({ value, onChange, variant = 'square', disabled }: ImageUploadProps) => {
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFile = (file?: File) => {
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => onChange(typeof reader.result === 'string' ? reader.result : '')
    reader.readAsDataURL(file)
  }

  const box = variant === 'wide' ? 'h-[96px] w-full' : 'h-[88px] w-[88px]'

  return (
    <div className="flex items-center gap-3">
      <div className={`${box} rounded-2xl bg-surface-input border border-line-light overflow-hidden flex items-center justify-center shrink-0`}>
        {value ? (
          <img src={value} alt="" className="w-full h-full object-cover" />
        ) : (
          <ImageIcon size={22} className="text-ink-muted" />
        )}
      </div>
      <div className="flex flex-col gap-2">
        <button
          type="button"
          disabled={disabled}
          onClick={() => inputRef.current?.click()}
          className="inline-flex items-center gap-2 h-9 px-4 rounded-pill border-2 border-line bg-surface text-[13px] font-semibold text-ink-secondary cursor-pointer hover:border-primary hover:text-primary transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
        >
          <Upload size={15} /> {value ? 'Replace' : 'Upload'}
        </button>
        {value && !disabled && (
          <button
            type="button"
            onClick={() => onChange('')}
            className="inline-flex items-center gap-1 text-[12px] font-semibold text-danger bg-transparent border-none cursor-pointer p-0"
          >
            <X size={13} /> Remove
          </button>
        )}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0])}
      />
    </div>
  )
}

export default ImageUpload

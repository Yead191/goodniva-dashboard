interface ToggleProps {
  checked: boolean
  onChange: (next: boolean) => void
  disabled?: boolean
  label?: string
  description?: string
  /** When false, hides the interactive switch and shows a read-only state. */
  canEdit?: boolean
}

/**
 * Pill switch used across monetisation config panels.
 * When `label`/`description` are provided it renders as a full settings row.
 */
const Toggle = ({ checked, onChange, disabled, label, description, canEdit = true }: ToggleProps) => {
  const isDisabled = disabled || !canEdit

  const Switch = (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={isDisabled}
      onClick={() => !isDisabled && onChange(!checked)}
      className={`relative w-[44px] h-[24px] rounded-pill shrink-0 transition-colors duration-150 border-none ${
        isDisabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'
      } ${checked ? 'bg-primary' : 'bg-line'}`}
    >
      <span
        className={`absolute top-[3px] w-[18px] h-[18px] rounded-full bg-white shadow-sm transition-all duration-150 ${
          checked ? 'left-[23px]' : 'left-[3px]'
        }`}
      />
    </button>
  )

  if (!label) return Switch

  return (
    <div className="flex items-center justify-between gap-4 py-[14px] border-b border-line-light last:border-b-0">
      <div className="min-w-0">
        <div className="text-sm font-semibold text-ink-primary">{label}</div>
        {description && <div className="text-[13px] text-ink-secondary mt-0.5">{description}</div>}
      </div>
      <div className="flex items-center gap-3 shrink-0">
        <span className={`text-[11px] font-bold tracking-[0.4px] ${checked ? 'text-success-text' : 'text-ink-muted'}`}>
          {checked ? 'ON' : 'OFF'}
        </span>
        {Switch}
      </div>
    </div>
  )
}

export default Toggle

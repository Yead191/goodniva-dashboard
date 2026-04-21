import { LucideIcon } from 'lucide-react'

interface BaseButtonProps {
  label: string
  Icon?: LucideIcon
  onClick?: () => void
  disabled?: boolean
  type?: 'button' | 'submit'
  fullWidth?: boolean
}

export const PrimaryButton = ({ Icon, label, onClick, disabled, type = 'button', fullWidth }: BaseButtonProps) => (
  <button
    type={type}
    onClick={onClick}
    disabled={disabled}
    className={`inline-flex items-center justify-center gap-2 h-11 px-[22px] rounded-pill border-none text-sm font-semibold text-white cursor-pointer transition-colors duration-150 bg-primary hover:bg-primary-dark disabled:bg-line disabled:opacity-70 disabled:cursor-not-allowed ${fullWidth ? 'w-full' : ''}`}
  >
    {Icon && <Icon size={16} />}
    {label}
  </button>
)

export const SecondaryButton = ({ Icon, label, onClick, disabled, fullWidth }: BaseButtonProps) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`inline-flex items-center justify-center gap-2 h-11 px-[22px] rounded-pill border border-line text-sm font-semibold text-ink-primary cursor-pointer transition-colors duration-150 bg-surface hover:bg-surface-subtle ${fullWidth ? 'w-full' : ''}`}
  >
    {Icon && <Icon size={16} />}
    {label}
  </button>
)

export const DangerButton = ({ Icon, label, onClick, disabled, fullWidth }: BaseButtonProps) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`inline-flex items-center justify-center gap-2 h-11 px-[22px] rounded-pill border-none text-sm font-semibold text-white cursor-pointer transition-colors duration-150 bg-danger hover:bg-[#DC2626] ${fullWidth ? 'w-full' : ''}`}
  >
    {Icon && <Icon size={16} />}
    {label}
  </button>
)

export const SuccessButton = ({ Icon, label, onClick, disabled, fullWidth }: BaseButtonProps) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`inline-flex items-center justify-center gap-2 h-11 px-[22px] rounded-pill border-none text-sm font-semibold text-white cursor-pointer transition-colors duration-150 bg-success hover:bg-[#059669] ${fullWidth ? 'w-full' : ''}`}
  >
    {Icon && <Icon size={16} />}
    {label}
  </button>
)

interface IconButtonProps {
  Icon: LucideIcon
  tooltip?: string
  onClick?: () => void
  danger?: boolean
}

export const IconButton = ({ Icon, tooltip, onClick, danger }: IconButtonProps) => (
  <button
    onClick={onClick}
    title={tooltip}
    className={`w-[34px] h-[34px] rounded-lg border-none cursor-pointer flex items-center justify-center transition-all duration-150 bg-transparent hover:bg-surface-input ${danger ? 'text-danger hover:bg-danger-light' : 'text-ink-secondary'}`}
  >
    <Icon size={16} />
  </button>
)

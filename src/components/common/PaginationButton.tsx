import { LucideIcon } from 'lucide-react'

interface PaginationButtonProps {
  Icon: LucideIcon
  onClick?: () => void
  disabled?: boolean
}

const PaginationButton = ({ Icon, onClick, disabled }: PaginationButtonProps) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className="w-[34px] h-[34px] rounded-lg border border-line bg-surface flex items-center justify-center transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer text-ink-primary disabled:text-ink-muted"
  >
    <Icon size={16} />
  </button>
)

export default PaginationButton

import { colors } from '@/utils/colors'

interface BadgeProps {
  text: string
  bg?: string
  color?: string
  solid?: boolean
}

const Badge = ({ text, bg = colors.bgInput, color = colors.textSecondary, solid }: BadgeProps) => (
  <span
    style={{ background: bg, color }}
    className={
      solid
        ? 'inline-block py-[5px] px-[14px] rounded-pill text-[11px] font-bold tracking-[0.4px]'
        : 'inline-block py-[3px] px-[10px] rounded-pill text-[12px] font-semibold'
    }
  >
    {text}
  </span>
)

export default Badge

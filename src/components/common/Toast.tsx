import { CheckCircle2, AlertTriangle, AlertCircle, Info } from 'lucide-react'
import { colors } from '@/utils/colors'
import type { ToastTone } from '@/types'

interface ToastProps {
  text: string
  tone?: ToastTone
}

const toneMap = {
  success: { bg: colors.success, Icon: CheckCircle2 },
  warning: { bg: colors.warning, Icon: AlertTriangle },
  danger: { bg: colors.danger, Icon: AlertCircle },
  info: { bg: colors.info, Icon: Info },
} as const

const Toast = ({ text, tone = 'success' }: ToastProps) => {
  const { bg, Icon } = toneMap[tone]
  return (
    <div
      className="fixed top-6 left-1/2 -translate-x-1/2 text-white py-3 px-5 rounded-pill text-sm font-semibold flex items-center gap-[10px] shadow-toast z-[9999] animate-[toastSlide_0.2s_ease]"
      style={{ background: bg }}
    >
      <Icon size={18} />
      {text}
    </div>
  )
}

export default Toast

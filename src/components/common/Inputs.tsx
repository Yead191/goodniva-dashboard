import { useState, ChangeEvent, KeyboardEvent } from 'react'
import { Eye, EyeOff, ChevronDown, LucideIcon } from 'lucide-react'

interface PillInputProps {
  value: string
  onChange: (val: string) => void
  placeholder?: string
  iconRight?: LucideIcon
  iconLeft?: LucideIcon
  type?: string
  onKeyDown?: (e: KeyboardEvent<HTMLInputElement>) => void
}

export const PillInput = ({
  value,
  onChange,
  placeholder,
  iconRight: IconRight,
  iconLeft: IconLeft,
  type = 'text',
  onKeyDown,
}: PillInputProps) => {
  const [focused, setFocused] = useState(false)
  return (
    <div
      className={`relative h-[46px] rounded-pill flex items-center transition-all duration-150 border-2 ${
        focused ? 'bg-surface border-primary' : 'bg-surface-input border-transparent'
      }`}
    >
      {IconLeft && (
        <div className="absolute left-[18px] text-ink-muted pointer-events-none flex">
          <IconLeft size={16} />
        </div>
      )}
      <input
        type={type}
        value={value}
        onChange={(e: ChangeEvent<HTMLInputElement>) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder={placeholder}
        onKeyDown={onKeyDown}
        className="w-full h-full border-none outline-none bg-transparent text-sm text-ink-primary font-medium rounded-pill"
        style={{
          paddingLeft: IconLeft ? 44 : 20,
          paddingRight: IconRight ? 44 : 20,
        }}
      />
      {IconRight && (
        <div className="absolute right-[18px] text-ink-muted pointer-events-none flex">
          <IconRight size={16} />
        </div>
      )}
    </div>
  )
}

interface PasswordInputProps {
  value: string
  onChange: (val: string) => void
  placeholder?: string
}

export const PasswordInput = ({ value, onChange, placeholder }: PasswordInputProps) => {
  const [focused, setFocused] = useState(false)
  const [visible, setVisible] = useState(false)
  return (
    <div
      className={`relative h-[46px] rounded-pill flex items-center transition-all duration-150 border-2 ${
        focused ? 'bg-surface border-primary' : 'bg-surface-input border-transparent'
      }`}
    >
      <input
        type={visible ? 'text' : 'password'}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder={placeholder}
        className="w-full h-full border-none outline-none bg-transparent pl-5 pr-11 text-sm text-ink-primary rounded-pill"
      />
      <button
        type="button"
        onClick={() => setVisible(!visible)}
        className="absolute right-4 bg-transparent border-none text-ink-muted cursor-pointer flex items-center p-1"
      >
        {visible ? <EyeOff size={16} /> : <Eye size={16} />}
      </button>
    </div>
  )
}

interface SelectPillProps {
  value: string
  onChange: (val: string) => void
  options: string[]
}

export const SelectPill = ({ value, onChange, options }: SelectPillProps) => (
  <div className="relative h-[46px]">
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full h-full rounded-pill border-2 border-transparent bg-surface-input pl-5 pr-10 text-sm text-ink-primary font-medium cursor-pointer appearance-none outline-none"
    >
      {options.map((opt) => (
        <option key={opt} value={opt}>
          {opt}
        </option>
      ))}
    </select>
    <ChevronDown
      size={16}
      className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-ink-muted"
    />
  </div>
)

interface FieldProps {
  label: string
  children: React.ReactNode
  uppercaseLabel?: boolean
}

export const FieldWithLabel = ({ label, children, uppercaseLabel }: FieldProps) => (
  <div className="mb-[14px]">
    <label
      className={`block mb-[6px] ${
        uppercaseLabel
          ? 'text-[11px] font-bold text-ink-secondary tracking-[0.6px] uppercase'
          : 'text-[13px] font-semibold text-ink-primary'
      }`}
    >
      {label}
    </label>
    {children}
  </div>
)

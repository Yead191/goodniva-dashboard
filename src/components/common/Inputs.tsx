import { useState, ChangeEvent, KeyboardEvent } from 'react'
import { Eye, EyeOff, ChevronDown, LucideIcon } from 'lucide-react'

interface MoneyInputProps {
  value: number
  onChange: (val: number) => void
  placeholder?: string
  /** Maximum number of decimal places allowed. Defaults to 2. */
  decimals?: number
}

/**
 * Currency/decimal input that keeps its own raw text buffer while editing so
 * intermediate states like "1." are preserved (fixes "1.99" collapsing to "199").
 * Emits a parsed number to the parent on every change.
 */
export const MoneyInput = ({ value, onChange, placeholder, decimals = 2 }: MoneyInputProps) => {
  const [focused, setFocused] = useState(false)
  const [text, setText] = useState<string>(value ? String(value) : '')

  const handleChange = (raw: string) => {
    // Allow only digits and a single decimal point, capped to `decimals` places.
    let cleaned = raw.replace(/[^0-9.]/g, '')
    const firstDot = cleaned.indexOf('.')
    if (firstDot !== -1) {
      cleaned =
        cleaned.slice(0, firstDot + 1) +
        cleaned.slice(firstDot + 1).replace(/\./g, '').slice(0, decimals)
    }
    setText(cleaned)
    onChange(cleaned === '' || cleaned === '.' ? 0 : Number(cleaned))
  }

  return (
    <div
      className={`relative h-[46px] rounded-pill flex items-center transition-all duration-150 border-2 ${
        focused ? 'bg-surface border-primary' : 'bg-surface-input border-transparent'
      }`}
    >
      <input
        type="text"
        inputMode="decimal"
        value={text}
        onChange={(e: ChangeEvent<HTMLInputElement>) => handleChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder={placeholder}
        className="w-full h-full border-none outline-none bg-transparent px-5 text-sm text-ink-primary font-medium rounded-pill"
      />
    </div>
  )
}

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

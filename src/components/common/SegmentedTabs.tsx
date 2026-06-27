interface SegmentedTabsProps<T extends string> {
  value: T
  onChange: (val: T) => void
  options: { key: T; label: string }[]
}

/**
 * Pill-style segmented control. Shared variant of the inline filter pills
 * used on the Revenue page.
 */
function SegmentedTabs<T extends string>({ value, onChange, options }: SegmentedTabsProps<T>) {
  return (
    <div className="inline-flex gap-1 p-1 bg-surface-input rounded-pill">
      {options.map((opt) => (
        <button
          key={opt.key}
          onClick={() => onChange(opt.key)}
          className={`py-[6px] px-[14px] rounded-pill border-none text-[13px] font-semibold cursor-pointer transition-all duration-150 ${
            value === opt.key
              ? 'bg-surface text-ink-primary shadow-[0_1px_2px_rgba(15,23,42,0.08)]'
              : 'bg-transparent text-ink-secondary'
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  )
}

export default SegmentedTabs

import { colors } from '@/utils/colors'

interface LogoProps {
  variant?: 'light' | 'dark'
}

const Logo = ({ variant = 'dark' }: LogoProps) => (
  <div className="flex items-center gap-[10px]">
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="logo-grad" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
          <stop stopColor={colors.primary} />
          <stop offset="1" stopColor="#8B5CF6" />
        </linearGradient>
      </defs>
      <path
        d="M16 3C10.48 3 6 7.48 6 13c0 7.5 10 17 10 17s10-9.5 10-17c0-5.52-4.48-10-10-10z"
        fill="url(#logo-grad)"
      />
      <circle cx="16" cy="13" r="4" fill="#FFFFFF" />
    </svg>
    <span
      className={`text-[18px] font-extrabold tracking-[-0.3px] ${variant === 'light' ? 'text-white' : 'text-ink-primary'}`}
    >
      GoodNiva
    </span>
  </div>
)

export default Logo

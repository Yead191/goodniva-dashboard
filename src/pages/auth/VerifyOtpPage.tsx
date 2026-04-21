import { useState } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { ArrowLeft, AlertCircle } from 'lucide-react'
import AuthLayout from '@/components/auth/AuthLayout'
import OtpInput from '@/components/auth/OtpInput'
import { PrimaryButton } from '@/components/common'
import { useCountdown } from '@/hooks/useCountdown'

const VerifyOtpPage = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const email = (location.state as { email?: string })?.email || 'your email'

  const [otp, setOtp] = useState<string[]>(['', '', '', ''])
  const [error, setError] = useState('')
  const { seconds, isActive, reset } = useCountdown(42)

  const handleVerify = () => {
    setError('')
    const code = otp.join('')
    if (code.length !== 4) {
      setError('Please enter the 4-digit code')
      return
    }
    navigate('/reset-password', { state: { email } })
  }

  const handleResend = () => {
    if (isActive) return
    reset()
    setOtp(['', '', '', ''])
  }

  return (
    <AuthLayout>
      <Link
        to="/forgot-password"
        className="inline-flex items-center gap-[6px] text-[13px] text-ink-secondary no-underline mb-4"
      >
        <ArrowLeft size={14} /> Back
      </Link>

      <h1 className="text-[28px] font-bold text-ink-primary m-0 mb-2">Check your email</h1>
      <p className="text-sm text-ink-secondary mt-0 mb-7 leading-relaxed">
        We sent a 4-digit code to <strong>{email}</strong>. Enter it below.
      </p>

      <div className="mb-5">
        <OtpInput value={otp} onChange={setOtp} onComplete={handleVerify} />
      </div>

      <div className="text-center mb-5 text-[13px] text-ink-secondary">
        Didn't receive the code?{' '}
        {isActive ? (
          <span className="text-ink-muted">Resend in {seconds}s</span>
        ) : (
          <button
            onClick={handleResend}
            className="bg-transparent border-none text-primary font-semibold cursor-pointer text-[13px]"
          >
            Resend code
          </button>
        )}
      </div>

      {error && (
        <div className="py-[10px] px-[14px] rounded-[10px] bg-danger-light text-danger-text text-[13px] font-medium flex items-center gap-2 mb-4">
          <AlertCircle size={16} />
          {error}
        </div>
      )}

      <PrimaryButton label="Verify" onClick={handleVerify} fullWidth />
    </AuthLayout>
  )
}

export default VerifyOtpPage

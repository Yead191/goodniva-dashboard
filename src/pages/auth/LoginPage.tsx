import { useState, FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Mail, AlertCircle } from 'lucide-react'
import AuthLayout from '@/components/auth/AuthLayout'
import { PillInput, PasswordInput, FieldWithLabel, PrimaryButton } from '@/components/common'
import { useAuth } from '@/context/AuthContext'

const LoginPage = () => {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('admin@goodniva.com')
  const [password, setPassword] = useState('admin1234')
  const [remember, setRemember] = useState(true)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    if (!email.trim() || !password.trim()) {
      setError('Please fill in all fields')
      return
    }
    setLoading(true)
    try {
      await login(email, password)
      navigate('/dashboard')
    } catch {
      setError('Invalid email or password')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout>
      <h1 className="text-[28px] text-center font-bold text-[#0F172A] mb-2">
        Login in to your account
      </h1>
      <p className="text-sm text-[#475569] mb-7 text-center">
        Please enter your email and password to continue
      </p>

      <form onSubmit={handleSubmit}>
        <FieldWithLabel label="Email Address">
          <PillInput
            value={email}
            onChange={setEmail}
            placeholder="you@example.com"
            iconLeft={Mail}
          />
        </FieldWithLabel>
        <FieldWithLabel label="Password">
          <PasswordInput value={password} onChange={setPassword} placeholder="Enter password" />
        </FieldWithLabel>

        <div className="flex justify-between items-center mb-5">
          <label className="flex items-center gap-2 text-[13px] text-[#475569] cursor-pointer">
            <input
              type="checkbox"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
              className="w-4 h-4 accent-[#6B4EE6]"
            />
            Remember me
          </label>
          <Link
            to="/forgot-password"
            className="text-[13px] font-semibold text-[#6B4EE6] no-underline"
          >
            Forgot password?
          </Link>
        </div>

        {error && (
          <div className="py-[10px] px-[14px] rounded-[10px] bg-[#FEE2E2] text-[#991B1B] text-[13px] font-medium flex items-center gap-2 mb-4">
            <AlertCircle size={16} />
            {error}
          </div>
        )}

        <PrimaryButton
          type="submit"
          label={loading ? 'Signing in...' : 'Sign In'}
          disabled={loading}
          fullWidth
        />
      </form>

      <p className="mt-6 text-[13px] text-[#94A3B8] text-center">
        Demo: any email / password works
      </p>
    </AuthLayout>
  )
}

export default LoginPage

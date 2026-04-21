import { useState } from 'react'
import { AlertCircle, CheckCircle2 } from 'lucide-react'
import { PasswordInput, FieldWithLabel, PrimaryButton } from '@/components/common'
import { useToast } from '@/context/ToastContext'

const ChangePasswordSection = () => {
  const { showToast } = useToast()
  const [current, setCurrent] = useState('')
  const [newPw, setNewPw] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')

  const checks = {
    length: newPw.length >= 8,
    uppercase: /[A-Z]/.test(newPw),
    number: /\d/.test(newPw),
    special: /[!@#$%^&*(),.?":{}|<>]/.test(newPw),
  }

  const handleSubmit = () => {
    setError('')
    if (!current || !newPw || !confirm) { setError('Please fill in all fields'); return }
    if (!checks.length || !checks.uppercase || !checks.number) {
      setError('Password does not meet all requirements')
      return
    }
    if (newPw !== confirm) { setError('New passwords do not match'); return }

    setCurrent(''); setNewPw(''); setConfirm('')
    showToast('Password changed successfully', 'success')
  }

  return (
    <div>
      <div className="mb-6 pb-4 border-b border-line-light">
        <h3 className="text-[18px] font-bold text-ink-primary m-0">Change Password</h3>
        <p className="text-[13px] text-ink-secondary mt-1 mb-0">Keep your account secure with a strong password</p>
      </div>

      <FieldWithLabel label="Current Password">
        <PasswordInput value={current} onChange={setCurrent} placeholder="Enter current password" />
      </FieldWithLabel>
      <FieldWithLabel label="New Password">
        <PasswordInput value={newPw} onChange={setNewPw} placeholder="Enter new password" />
      </FieldWithLabel>
      <FieldWithLabel label="Confirm New Password">
        <PasswordInput value={confirm} onChange={setConfirm} placeholder="Re-enter new password" />
      </FieldWithLabel>

      {newPw && (
        <div className="bg-surface-subtle border border-line-light rounded-[14px] py-3 px-4 my-2 mb-4">
          <div className="text-xs font-bold text-ink-secondary mb-2 tracking-[0.3px]">PASSWORD REQUIREMENTS</div>
          <Requirement met={checks.length} label="At least 8 characters" />
          <Requirement met={checks.uppercase} label="One uppercase letter" />
          <Requirement met={checks.number} label="One number" />
          <Requirement met={checks.special} label="One special character" />
        </div>
      )}

      {error && (
        <div className="py-[10px] px-[14px] rounded-[10px] bg-danger-light text-danger-text text-[13px] font-medium flex items-center gap-2 mb-[14px]">
          <AlertCircle size={16} />
          {error}
        </div>
      )}

      <div className="flex justify-end mt-5 pt-4 border-t border-line-light">
        <PrimaryButton label="Update Password" onClick={handleSubmit} />
      </div>
    </div>
  )
}

const Requirement = ({ met, label }: { met: boolean; label: string }) => (
  <div className={`flex items-center gap-2 py-[3px] text-xs ${met ? 'text-success' : 'text-ink-muted'}`}>
    <CheckCircle2 size={13} />
    <span className={met ? 'font-semibold' : 'font-medium'}>{label}</span>
  </div>
)

export default ChangePasswordSection

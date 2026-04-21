import { useState, useRef } from 'react'
import { Camera } from 'lucide-react'
import { PillInput, FieldWithLabel, PrimaryButton } from '@/components/common'
import { useAuth } from '@/context/AuthContext'
import { useToast } from '@/context/ToastContext'
import { colors } from '@/utils/colors'

const ProfileSection = () => {
  const { user } = useAuth()
  const { showToast } = useToast()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [firstName, setFirstName] = useState(user?.name?.split(' ')[0] || 'Sarah')
  const [lastName, setLastName] = useState(user?.name?.split(' ').slice(1).join(' ') || 'Chen')
  const [email, setEmail] = useState(user?.email || 'admin@goodniva.com')
  const [phone, setPhone] = useState('+1 (555) 123-4567')
  const [role] = useState(user?.role || 'Admin')
  const [avatar, setAvatar] = useState(user?.avatar || '')

  const handleFile = (file: File | null | undefined) => {
    if (!file) return
    const reader = new FileReader()
    reader.onload = (e) => setAvatar(e.target?.result as string)
    reader.readAsDataURL(file)
  }

  const handleSave = () => {
    showToast('Profile updated successfully', 'success')
  }

  return (
    <div>
      <div className="mb-6 pb-4 border-b border-line-light">
        <h3 className="text-[18px] font-bold text-ink-primary m-0">Profile Information</h3>
        <p className="text-[13px] text-ink-secondary mt-1 mb-0">Update your personal details and profile picture</p>
      </div>

      <div className="flex items-center gap-5 mb-6">
        <div className="relative">
          <img src={avatar} alt="" className="w-24 h-24 rounded-full object-cover border-[3px] border-line-light" />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-primary text-white border-[3px] border-surface cursor-pointer flex items-center justify-center"
          >
            <Camera size={14} />
          </button>
          <input ref={fileInputRef} type="file" accept="image/*" onChange={(e) => handleFile(e.target.files?.[0])} className="hidden" />
        </div>
        <div>
          <div className="text-[18px] font-bold text-ink-primary">{firstName} {lastName}</div>
          <div className="text-[13px] text-ink-secondary mt-0.5">{role}</div>
          <div className="text-xs text-ink-muted mt-1">Click the camera icon to upload a new photo</div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-[14px] mb-2">
        <FieldWithLabel label="First Name">
          <PillInput value={firstName} onChange={setFirstName} placeholder="First name" />
        </FieldWithLabel>
        <FieldWithLabel label="Last Name">
          <PillInput value={lastName} onChange={setLastName} placeholder="Last name" />
        </FieldWithLabel>
      </div>

      <FieldWithLabel label="Email Address">
        <PillInput value={email} onChange={setEmail} placeholder="you@example.com" />
      </FieldWithLabel>
      <FieldWithLabel label="Phone Number">
        <PillInput value={phone} onChange={setPhone} placeholder="+1 (555) 000-0000" />
      </FieldWithLabel>
      <FieldWithLabel label="Role">
        <div className="h-[46px] rounded-pill bg-surface-input px-5 flex items-center text-sm text-ink-secondary font-medium">
          {role} <span className="ml-2 text-[11px] text-ink-muted">(Read-only)</span>
        </div>
      </FieldWithLabel>

      <div className="flex justify-end mt-5 pt-4 border-t border-line-light">
        <PrimaryButton label="Save Changes" onClick={handleSave} />
      </div>
    </div>
  )
}

export default ProfileSection

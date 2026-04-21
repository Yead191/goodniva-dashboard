import { X, CheckCircle2, Crown } from 'lucide-react'
import { colors } from '@/utils/colors'
import { PrimaryButton } from '@/components/common'
import type { User } from '@/types'

interface UserDetailsModalProps {
  user: User
  onClose: () => void
}

const UserDetailsModal = ({ user, onClose }: UserDetailsModalProps) => {
  return (
    <>
      <div onClick={onClose} className="fixed inset-0 bg-[rgba(15,23,42,0.45)] backdrop-blur-sm z-[100] animate-[fadeIn_0.2s_ease]" />
      <div className="fixed inset-0 z-[101] flex items-center justify-center p-5 pointer-events-none">
        <div className="bg-surface rounded-[20px] w-full max-w-[540px] max-h-[92vh] flex flex-col pointer-events-auto shadow-modal animate-[modalSlide_0.25s_ease]">
          <div className="py-[22px] px-7 flex justify-between items-center shrink-0">
            <h2 className="text-xl font-bold text-ink-primary m-0">User Details</h2>
            <button onClick={onClose} className="w-9 h-9 rounded-lg border-none bg-transparent cursor-pointer flex items-center justify-center text-ink-secondary hover:bg-surface-input transition-colors">
              <X size={20} />
            </button>
          </div>

          <div className="flex-1 overflow-auto px-7 pb-5">
            <div className="text-center mb-6">
              <div className="relative inline-block mb-3">
                <img src={user.avatar} alt={user.name} className="w-24 h-24 rounded-full object-cover" />
                {user.verified && (
                  <div className="absolute bottom-1 right-1 w-7 h-7 rounded-full bg-success text-white border-[3px] border-surface flex items-center justify-center">
                    <CheckCircle2 size={14} />
                  </div>
                )}
              </div>
              <h3 className="text-xl font-bold text-ink-primary m-0">{user.name}</h3>
              <div className="inline-flex items-center gap-1 py-1 px-3 rounded-pill bg-primary-light text-primary text-xs font-bold mt-2">
                <Crown size={12} />
                {user.subscription}
              </div>
              <div className="text-[13px] text-ink-secondary mt-[6px]">{user.email}</div>
            </div>

            {user.identityInfo && (
              <div className="mb-4">
                <div className="text-[11px] font-bold text-ink-secondary tracking-[0.6px] mb-[10px] uppercase">Identity Info</div>
                <div className="bg-surface-subtle border border-line-light rounded-[14px] py-3 px-[18px]">
                  <InfoRow label="Full Name" value={user.identityInfo.fullName} />
                  <InfoRow label="Date of Birth" value={user.identityInfo.dateOfBirth} />
                  <InfoRow label="ID Type" value={user.identityInfo.idType} />
                  <InfoRow label="ID Number" value={user.identityInfo.idNumber} last />
                </div>
              </div>
            )}

            {user.interestInfo && (
              <div>
                <div className="text-[11px] font-bold text-ink-secondary tracking-[0.6px] mb-[10px] uppercase">Interests & Activity</div>
                <div className="bg-surface-subtle border border-line-light rounded-[14px] py-3 px-[18px]">
                  <InfoRow label="Interests" value={user.interestInfo.interests.join(', ')} />
                  <InfoRow label="Hobbies" value={user.interestInfo.hobbies.join(', ')} />
                  <InfoRow label="Joined" value={user.interestInfo.joinedDate} last />
                </div>
              </div>
            )}
          </div>

          <div className="py-[18px] px-7 border-t border-line-light flex justify-end shrink-0">
            <PrimaryButton label="Close" onClick={onClose} />
          </div>
        </div>
      </div>
    </>
  )
}

const InfoRow = ({ label, value, last }: { label: string; value: string; last?: boolean }) => (
  <div className={`flex justify-between py-[10px] ${last ? '' : 'border-b border-line-light'}`}>
    <span className="text-[13px] text-ink-secondary">{label}</span>
    <span className="text-sm font-semibold text-ink-primary">{value}</span>
  </div>
)

export default UserDetailsModal

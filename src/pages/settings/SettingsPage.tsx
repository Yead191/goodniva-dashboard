import { useState } from 'react'
import { User as UserIcon, Lock, HelpCircle, Info, Shield, FileText } from 'lucide-react'
import PageHeader from '@/components/layout/PageHeader'
import { Card } from '@/components/common'
import ProfileSection from './sections/ProfileSection'
import ChangePasswordSection from './sections/ChangePasswordSection'
import FaqSection from './sections/FaqSection'
import RichContentSection from './sections/RichContentSection'
import { defaultRichContent } from '@/data/faq'

type Section = 'profile' | 'password' | 'faq' | 'about' | 'privacy' | 'terms'

const sections: { key: Section; label: string; Icon: React.ComponentType<{ size?: number }> }[] = [
  { key: 'profile', label: 'Profile', Icon: UserIcon },
  { key: 'password', label: 'Change Password', Icon: Lock },
  { key: 'faq', label: 'FAQ', Icon: HelpCircle },
  { key: 'about', label: 'About Us', Icon: Info },
  { key: 'privacy', label: 'Privacy Policy', Icon: Shield },
  { key: 'terms', label: 'Terms of Service', Icon: FileText },
]

const SettingsPage = () => {
  const [active, setActive] = useState<Section>('profile')

  return (
    <div className="py-7 px-8">
      <PageHeader title="Settings" subtitle="Manage your profile and platform configuration" />

      <div className="grid gap-5 items-start" style={{ gridTemplateColumns: '240px 1fr' }}>
        <Card>
          <div className="flex flex-col gap-0.5">
            {sections.map(({ key, label, Icon }) => {
              const isActive = active === key
              return (
                <button key={key} onClick={() => setActive(key)}
                  className={`flex items-center gap-3 py-[11px] px-[14px] rounded-[10px] text-sm border-none cursor-pointer text-left transition-all duration-150 ${
                    isActive
                      ? 'bg-primary-light text-primary font-semibold'
                      : 'bg-transparent text-ink-secondary font-medium hover:bg-surface-input'
                  }`}>
                  <Icon size={16} />
                  {label}
                </button>
              )
            })}
          </div>
        </Card>

        <Card>
          {active === 'profile' && <ProfileSection />}
          {active === 'password' && <ChangePasswordSection />}
          {active === 'faq' && <FaqSection />}
          {active === 'about' && <RichContentSection title="About Us" description="Share your company story and mission" initialContent={defaultRichContent.about} />}
          {active === 'privacy' && <RichContentSection title="Privacy Policy" description="How you collect, use, and protect user data" initialContent={defaultRichContent.privacy} />}
          {active === 'terms' && <RichContentSection title="Terms of Service" description="The rules for using your platform" initialContent={defaultRichContent.terms} />}
        </Card>
      </div>
    </div>
  )
}

export default SettingsPage

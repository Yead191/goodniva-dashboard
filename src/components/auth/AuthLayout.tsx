import { ReactNode } from 'react'
import Logo from '@/components/common/Logo'

interface AuthLayoutProps {
  children: ReactNode
}

const AuthLayout = ({ children }: AuthLayoutProps) => {
  return (
    <div className="min-h-screen flex font-sans">
      {/* Left: hero image */}
      <div
        className="hidden lg:block flex-1 relative bg-cover bg-center py-10 px-[60px] text-white"
        style={{
          backgroundImage:
            'linear-gradient(135deg, rgba(107,78,230,0.85) 0%, rgba(139,92,246,0.75) 100%), url(https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1200&q=80)',
        }}
      >
        <div className="">
          <img src="/logoDark.svg" alt="" className='h-24' />
        </div>
        <div className="absolute bottom-[60px] left-[60px] right-[60px]">
          <h2 className="text-[36px] font-extrabold leading-[1.2] mb-4">
            Build safer communities, one meetup at a time.
          </h2>
          <p className="text-base leading-[1.6] opacity-90 m-0">
            Manage users, monitor safety, and grow your platform with tools built for moderation teams.
          </p>
        </div>
      </div>

      {/* Right: form */}
      <div className="flex-1 bg-white flex items-center justify-center py-10 px-6">
        <div className="border p-10 rounded-lg w-full max-w-[420px]">
          <div className="mb-8 flex justify-center items-center">
            <img src="/logo.svg" alt="" className='h-24' />
          </div>
          {children}
        </div>
      </div>
    </div>
  )
}

export default AuthLayout

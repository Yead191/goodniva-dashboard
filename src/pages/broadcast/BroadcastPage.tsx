import { useState } from 'react'
import { Send, Clock, Megaphone, Zap, Gift, Info, Bell, Mail, Smartphone, CheckCircle2, AlertCircle } from 'lucide-react'
import PageHeader from '@/components/layout/PageHeader'
import { Card, Badge, PrimaryButton, PillInput, SelectPill, FieldWithLabel } from '@/components/common'
import { broadcastsSeed } from '@/data/broadcasts'
import { useToast } from '@/context/ToastContext'
import { colors } from '@/utils/colors'
import { getStatusStyle } from '@/utils/statusStyles'
import type { Broadcast, BroadcastType, BroadcastChannel } from '@/types'

const AUDIENCE_SIZES: Record<string, number> = {
  'All Users': 12842,
  'Premium Users': 4219,
  'Free Users': 8420,
  'Professional Users': 342,
  'Inactive Users (30d+)': 1840,
}

const BroadcastPage = () => {
  const [broadcasts, setBroadcasts] = useState<Broadcast[]>(broadcastsSeed)
  const [title, setTitle] = useState('')
  const [message, setMessage] = useState('')
  const [audience, setAudience] = useState('All Users')
  const [channels, setChannels] = useState<BroadcastChannel[]>(['In-App'])
  const [type, setType] = useState<BroadcastType>('announcement')
  const [sendLater, setSendLater] = useState(false)
  const [scheduleDate, setScheduleDate] = useState('')
  const [error, setError] = useState('')
  const { showToast } = useToast()

  const toggleChannel = (ch: BroadcastChannel) => {
    setChannels((prev) => (prev.includes(ch) ? prev.filter((c) => c !== ch) : [...prev, ch]))
  }

  const handleReset = () => {
    setTitle(''); setMessage(''); setAudience('All Users'); setChannels(['In-App'])
    setType('announcement'); setSendLater(false); setScheduleDate(''); setError('')
  }

  const handleSubmit = () => {
    setError('')
    if (!title.trim()) { setError('Please add a title'); return }
    if (!message.trim() || message.length < 10) { setError('Message is too short'); return }
    if (channels.length === 0) { setError('Select at least one channel'); return }
    if (sendLater && !scheduleDate) { setError('Pick a schedule date'); return }

    const id = `BRC-${String(broadcasts.length + 9).padStart(3, '0')}`
    const recipients = AUDIENCE_SIZES[audience] || 0
    const newBroadcast: Broadcast = {
      id, title, message, audience, channels, type,
      sentAt: sendLater ? `Scheduled for ${scheduleDate}` : 'Just now',
      recipients,
      delivered: sendLater ? 0 : Math.floor(recipients * 0.97),
      read: sendLater ? 0 : Math.floor(recipients * 0.62),
      status: sendLater ? 'Scheduled' : 'Sent',
    }
    setBroadcasts([newBroadcast, ...broadcasts])
    showToast(sendLater ? 'Broadcast scheduled' : `Sent to ${recipients.toLocaleString()} users`, 'success')
    handleReset()
  }

  const types: { key: BroadcastType; label: string; Icon: React.ComponentType<{ size?: number }> }[] = [
    { key: 'announcement', label: 'Announcement', Icon: Megaphone },
    { key: 'warning', label: 'Warning', Icon: Zap },
    { key: 'promo', label: 'Promo', Icon: Gift },
    { key: 'info', label: 'Info', Icon: Info },
  ]

  return (
    <div className="py-7 px-8">
      <PageHeader title="Broadcast" subtitle="Send notifications and announcements to your users" />

      <div className="grid gap-5 mb-5 items-start" style={{ gridTemplateColumns: '1fr 380px' }}>
        <Card>
          <div className="mb-5 pb-4 border-b border-line-light">
            <h3 className="text-[18px] font-bold text-ink-primary m-0">Compose Broadcast</h3>
            <p className="text-[13px] text-ink-secondary mt-1 mb-0">Craft your message and pick your audience</p>
          </div>

          <div className="mb-[18px]">
            <label className="block text-[13px] font-semibold text-ink-primary mb-2">Notification Type</label>
            <div className="grid grid-cols-4 gap-2">
              {types.map(({ key, label, Icon }) => {
                const active = type === key
                return (
                  <button key={key} onClick={() => setType(key)}
                    className={`flex flex-col items-center gap-[6px] py-[14px] px-2 rounded-xl cursor-pointer transition-all duration-150 border-2 ${
                      active
                        ? 'border-primary bg-primary-light text-primary'
                        : 'border-transparent bg-surface-input text-ink-secondary'
                    }`}
                  >
                    <Icon size={18} />
                    <span className="text-xs font-semibold">{label}</span>
                  </button>
                )
              })}
            </div>
          </div>

          <FieldWithLabel label="Title">
            <PillInput value={title} onChange={setTitle} placeholder="e.g. New Safety Features Rolled Out" />
          </FieldWithLabel>

          <div className="mb-[14px]">
            <div className="flex justify-between items-center mb-[6px]">
              <label className="text-[13px] font-semibold text-ink-primary">Message</label>
              <span className="text-[11px] text-ink-muted">{message.length} / 280</span>
            </div>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value.slice(0, 280))}
              placeholder="Write a clear, concise message..."
              rows={4}
              className="w-full rounded-[14px] border-2 border-transparent bg-surface-input py-[14px] px-[18px] text-sm text-ink-primary outline-none resize-y leading-relaxed"
            />
          </div>

          <FieldWithLabel label={`Audience — ${(AUDIENCE_SIZES[audience] || 0).toLocaleString()} recipients`}>
            <SelectPill value={audience} onChange={setAudience} options={Object.keys(AUDIENCE_SIZES)} />
          </FieldWithLabel>

          <div className="mb-[18px]">
            <label className="block text-[13px] font-semibold text-ink-primary mb-2">Delivery Channels</label>
            <div className="flex gap-2 flex-wrap">
              <ChannelToggle Icon={Bell} label="In-App" active={channels.includes('In-App')} onClick={() => toggleChannel('In-App')} />
              <ChannelToggle Icon={Mail} label="Email" active={channels.includes('Email')} onClick={() => toggleChannel('Email')} />
              <ChannelToggle Icon={Smartphone} label="Push" active={channels.includes('Push')} onClick={() => toggleChannel('Push')} />
            </div>
          </div>

          <div className="mb-[18px] py-[14px] px-4 bg-surface-subtle border border-line-light rounded-xl">
            <label className="flex items-center gap-[10px] cursor-pointer">
              <div
                onClick={(e) => { e.preventDefault(); setSendLater(!sendLater) }}
                className="w-9 h-5 rounded-pill relative transition-colors duration-150 shrink-0 cursor-pointer"
                style={{ background: sendLater ? colors.primary : colors.border }}
              >
                <div
                  className="absolute top-0.5 w-4 h-4 rounded-full bg-white transition-[left] duration-150 shadow-sm"
                  style={{ left: sendLater ? 18 : 2 }}
                />
              </div>
              <div className="flex-1">
                <div className="text-sm font-semibold text-ink-primary">Schedule for later</div>
                <div className="text-xs text-ink-secondary">Pick when this broadcast should go out</div>
              </div>
            </label>
            {sendLater && (
              <input type="datetime-local" value={scheduleDate} onChange={(e) => setScheduleDate(e.target.value)}
                className="w-full mt-3 h-[42px] rounded-pill border-2 border-transparent bg-surface py-0 px-[18px] text-[13px] text-ink-primary outline-none" />
            )}
          </div>

          {error && (
            <div className="py-[10px] px-[14px] rounded-[10px] bg-danger-light text-danger-text text-[13px] font-medium mb-[14px] flex items-center gap-2">
              <AlertCircle size={16} /> {error}
            </div>
          )}

          <div className="flex justify-end gap-[10px] pt-4 border-t border-line-light">
            <button onClick={handleReset} className="h-11 px-5 rounded-pill border border-line bg-surface text-ink-secondary text-sm font-semibold cursor-pointer">Reset</button>
            <PrimaryButton Icon={sendLater ? Clock : Send} label={sendLater ? 'Schedule Broadcast' : 'Send Now'} onClick={handleSubmit} />
          </div>
        </Card>

        <div className="sticky top-5">
          <Card>
            <div className="mb-4 pb-3 border-b border-line-light">
              <h3 className="text-[15px] font-bold text-ink-primary m-0">Live Preview</h3>
              <p className="text-xs text-ink-secondary mt-[3px] mb-0">How users will see this</p>
            </div>
            <div className="bg-gradient-to-br from-[#E5E7EB] to-[#D1D5DB] rounded-[18px] p-4">
              <NotificationPreview title={title} message={message} type={type} />
            </div>
          </Card>
        </div>
      </div>

      <Card>
        <div className="mb-5">
          <h3 className="text-[18px] font-bold text-ink-primary m-0">Broadcast History</h3>
          <p className="text-[13px] text-ink-secondary mt-1 mb-0">Previously sent and scheduled broadcasts</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-surface-subtle">
                {['BROADCAST', 'AUDIENCE', 'CHANNELS', 'SENT', 'READ RATE', 'STATUS'].map((h) => (
                  <th key={h} className="text-left py-[14px] px-4 text-[11px] font-bold text-ink-secondary tracking-[0.6px]">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {broadcasts.map((b) => <BroadcastRow key={b.id} broadcast={b} />)}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}

const ChannelToggle = ({ Icon, label, active, onClick }: { Icon: React.ComponentType<{ size?: number }>; label: string; active: boolean; onClick: () => void }) => (
  <button onClick={onClick}
    className={`inline-flex items-center gap-2 py-[10px] px-[18px] rounded-pill text-[13px] font-semibold cursor-pointer transition-all duration-150 ${
      active
        ? 'border-2 border-primary bg-primary-light text-primary'
        : 'border border-line bg-surface text-ink-secondary'
    }`}>
    <Icon size={15} />
    {label}
    {active && <CheckCircle2 size={14} />}
  </button>
)

const NotificationPreview = ({ title, message, type }: { title: string; message: string; type: BroadcastType }) => {
  const typeConfig: Record<BroadcastType, { Icon: React.ComponentType<{ size?: number }>; color: string; bg: string }> = {
    announcement: { Icon: Megaphone, color: colors.primary, bg: colors.primaryLight },
    warning: { Icon: Zap, color: colors.warning, bg: colors.warningLight },
    promo: { Icon: Gift, color: '#EC4899', bg: '#FCE7F3' },
    info: { Icon: Info, color: colors.info, bg: colors.infoLight },
  }
  const cfg = typeConfig[type]

  return (
    <div className="bg-surface rounded-[14px] p-[14px] flex gap-3 items-start shadow-[0_4px_12px_rgba(15,23,42,0.08)]">
      <div className="w-9 h-9 rounded-[10px] flex items-center justify-center shrink-0" style={{ background: cfg.bg, color: cfg.color }}>
        <cfg.Icon size={18} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-[13px] font-bold text-ink-primary leading-snug mb-1">
          {title || 'Your notification title'}
        </div>
        <div className="text-xs text-ink-secondary leading-relaxed">
          {message || 'Your message will appear here as users see it.'}
        </div>
        <div className="text-[10px] text-ink-muted mt-[6px] font-semibold tracking-[0.3px]">GoodNiva</div>
      </div>
    </div>
  )
}

const BroadcastRow = ({ broadcast }: { broadcast: Broadcast }) => {
  const status = getStatusStyle(broadcast.status)
  const readRate = broadcast.recipients > 0 ? Math.round((broadcast.read / broadcast.recipients) * 100) : 0

  return (
    <tr className="hover:bg-surface-subtle transition-colors duration-150">
      <td className="py-[14px] px-4 border-b border-line-light">
        <div className="text-[11px] font-bold text-primary font-mono mb-[3px]">{broadcast.id}</div>
        <div className="text-sm font-semibold text-ink-primary">{broadcast.title}</div>
      </td>
      <td className="py-[14px] px-4 border-b border-line-light text-[13px] text-ink-secondary">{broadcast.audience}</td>
      <td className="py-[14px] px-4 border-b border-line-light">
        <div className="flex gap-1 flex-wrap">
          {broadcast.channels.map((c) => <Badge key={c} text={c} />)}
        </div>
      </td>
      <td className="py-[14px] px-4 border-b border-line-light text-[13px] text-ink-secondary tabular-nums">{broadcast.recipients.toLocaleString()}</td>
      <td className="py-[14px] px-4 border-b border-line-light">
        {broadcast.status === 'Scheduled' ? <span className="text-[13px] text-ink-muted">—</span> : (
          <div className="flex items-center gap-[10px]">
            <div className="w-[60px] h-[6px] bg-line-light rounded-pill overflow-hidden">
              <div className="h-full bg-primary rounded-pill" style={{ width: `${readRate}%` }} />
            </div>
            <span className="text-xs font-bold text-ink-primary tabular-nums">{readRate}%</span>
          </div>
        )}
      </td>
      <td className="py-[14px] px-4 border-b border-line-light">
        <span className="inline-flex items-center gap-[6px] py-1 px-3 rounded-pill text-xs font-bold" style={{ background: status.bg, color: status.text }}>
          <span className="w-[6px] h-[6px] rounded-full" style={{ background: status.dot }} />
          {broadcast.status}
        </span>
      </td>
    </tr>
  )
}

export default BroadcastPage

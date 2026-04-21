import { useState } from 'react'
import { Plus, Search, Inbox, Clock, CheckCircle2, MessageSquare, ArrowUpRight } from 'lucide-react'
import PageHeader from '@/components/layout/PageHeader'
import { Card, Badge, StatCard, PrimaryButton } from '@/components/common'
import TicketDetailsModal from '@/components/modals/TicketDetailsModal'
import CreateTicketModal from '@/components/modals/CreateTicketModal'
import { ticketsSeed } from '@/data/support'
import { useToast } from '@/context/ToastContext'
import { colors } from '@/utils/colors'
import { getStatusStyle, getPriorityStyle } from '@/utils/statusStyles'
import type { SupportTicket } from '@/types'

const SupportPage = () => {
  const [tickets, setTickets] = useState<SupportTicket[]>(ticketsSeed)
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null)
  const [showCreate, setShowCreate] = useState(false)
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [search, setSearch] = useState('')
  const { showToast } = useToast()

  const filtered = tickets.filter((t) => {
    const matchesStatus = statusFilter === 'all' || t.status === statusFilter
    const q = search.trim().toLowerCase()
    const matchesSearch = !q || t.subject.toLowerCase().includes(q) || t.user.name.toLowerCase().includes(q) || t.id.toLowerCase().includes(q)
    return matchesStatus && matchesSearch
  })

  const counts = {
    open: tickets.filter((t) => t.status === 'Open').length,
    inProgress: tickets.filter((t) => t.status === 'In Progress').length,
    resolved: tickets.filter((t) => t.status === 'Resolved').length,
    total: tickets.length,
  }

  const handleCreate = (newTicket: Omit<SupportTicket, 'id' | 'status' | 'createdAt' | 'lastUpdated' | 'messages'>) => {
    const id = `TKT-${1024 + tickets.length + 1}`
    const ticket: SupportTicket = {
      ...newTicket, id, status: 'Open', createdAt: 'Just now', lastUpdated: 'Just now',
      messages: [{ from: 'user', name: newTicket.user.name, avatar: newTicket.user.avatar, text: newTicket.description, time: 'Just now' }],
    }
    setTickets((prev) => [ticket, ...prev])
    setShowCreate(false)
    showToast(`Ticket ${id} submitted`, 'success')
  }

  const handleReply = (ticketId: string, text: string) => {
    const newMessage = { from: 'admin' as const, name: 'Support Team', avatar: 'https://i.pravatar.cc/80?img=60', text, time: 'Just now' }
    setTickets((prev) => prev.map((t) =>
      t.id === ticketId ? { ...t, messages: [...t.messages, newMessage], lastUpdated: 'Just now', status: t.status === 'Open' ? 'In Progress' : t.status } : t,
    ))
    setSelectedTicket((prev) =>
      prev && prev.id === ticketId ? { ...prev, messages: [...prev.messages, newMessage], status: prev.status === 'Open' ? 'In Progress' : prev.status } : prev,
    )
    showToast('Reply sent', 'success')
  }

  const handleStatusChange = (ticketId: string, newStatus: SupportTicket['status']) => {
    setTickets((prev) => prev.map((t) => (t.id === ticketId ? { ...t, status: newStatus, lastUpdated: 'Just now' } : t)))
    setSelectedTicket((prev) => (prev && prev.id === ticketId ? { ...prev, status: newStatus } : prev))
    showToast(`Ticket marked as ${newStatus}`, newStatus === 'Resolved' ? 'success' : 'warning')
  }

  return (
    <div className="py-7 px-8">
      <PageHeader
        title="Support"
        subtitle="Manage help requests and assist users with issues"
        action={<PrimaryButton Icon={Plus} label="New Ticket" onClick={() => setShowCreate(true)} />}
      />

      <div className="grid grid-cols-4 gap-4 mb-5">
        <StatCard Icon={Inbox} iconBg={colors.warningLight} iconColor={colors.warning} label="Open Tickets" value={counts.open} badge="Awaiting" badgeTone="warning" />
        <StatCard Icon={Clock} iconBg={colors.infoLight} iconColor={colors.info} label="In Progress" value={counts.inProgress} badge="Active" badgeTone="info" />
        <StatCard Icon={CheckCircle2} iconBg={colors.successLight} iconColor={colors.success} label="Resolved" value={counts.resolved} badge="Closed" badgeTone="success" />
        <StatCard Icon={MessageSquare} iconBg={colors.primaryLight} iconColor={colors.primary} label="Total Tickets" value={counts.total} badge="All Time" badgeTone="info" />
      </div>

      <Card>
        <div className="flex justify-between items-center mb-4 gap-3 flex-wrap">
          <div className="flex gap-1 p-1 bg-surface-input rounded-pill">
            {['all', 'Open', 'In Progress', 'Resolved'].map((key) => (
              <button key={key} onClick={() => setStatusFilter(key)}
                className={`py-[6px] px-[14px] rounded-pill border-none text-[13px] font-semibold cursor-pointer transition-all duration-150 ${
                  statusFilter === key
                    ? 'bg-surface text-ink-primary shadow-[0_1px_2px_rgba(15,23,42,0.08)]'
                    : 'bg-transparent text-ink-secondary'
                }`}
              >
                {key === 'all' ? 'All' : key}
              </button>
            ))}
          </div>
          <div className="relative w-[280px]">
            <Search size={16} className="absolute left-[14px] top-1/2 -translate-y-1/2 pointer-events-none text-ink-muted" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by ID, subject, user..."
              className="w-full h-10 rounded-pill border-none bg-surface-input pl-10 pr-4 text-[13px] text-ink-primary outline-none" />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-surface-subtle">
                {['TICKET', 'SUBJECT', 'CATEGORY', 'PRIORITY', 'STATUS', 'UPDATED', ''].map((h) => (
                  <th key={h} className="text-left py-[14px] px-4 text-[11px] font-bold text-ink-secondary tracking-[0.6px]">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={7} className="py-10 px-5 text-center text-ink-muted text-sm">No tickets match your filters</td></tr>
              ) : (
                filtered.map((t) => <TicketRow key={t.id} ticket={t} onOpen={() => setSelectedTicket(t)} />)
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {showCreate && <CreateTicketModal onCancel={() => setShowCreate(false)} onSubmit={handleCreate} />}
      {selectedTicket && (
        <TicketDetailsModal ticket={selectedTicket} onClose={() => setSelectedTicket(null)}
          onReply={(text) => handleReply(selectedTicket.id, text)}
          onStatusChange={(newStatus) => handleStatusChange(selectedTicket.id, newStatus)} />
      )}
    </div>
  )
}

const TicketRow = ({ ticket, onOpen }: { ticket: SupportTicket; onOpen: () => void }) => {
  const status = getStatusStyle(ticket.status)
  const priority = getPriorityStyle(ticket.priority)
  const catMap: Record<string, { bg: string; text: string }> = {
    Account: { bg: colors.primaryLight, text: colors.primary },
    Billing: { bg: '#FEF3C7', text: '#92400E' },
    Bug: { bg: colors.dangerLight, text: colors.dangerText },
    Safety: { bg: '#FCE7F3', text: '#9D174D' },
    'Feature Request': { bg: colors.infoLight, text: colors.infoText },
  }
  const cat = catMap[ticket.category] || { bg: colors.bgInput, text: colors.textSecondary }

  return (
    <tr onClick={onOpen} className="hover:bg-surface-subtle transition-colors duration-150 cursor-pointer">
      <td className="py-[14px] px-4 border-b border-line-light text-[13px] font-bold text-primary font-mono">{ticket.id}</td>
      <td className="py-[14px] px-4 border-b border-line-light">
        <div className="flex items-center gap-[10px]">
          <img src={ticket.user.avatar} alt="" className="w-8 h-8 rounded-full" />
          <div>
            <div className="text-sm font-semibold text-ink-primary">{ticket.subject}</div>
            <div className="text-xs text-ink-muted">{ticket.user.name}</div>
          </div>
        </div>
      </td>
      <td className="py-[14px] px-4 border-b border-line-light"><Badge text={ticket.category} bg={cat.bg} color={cat.text} /></td>
      <td className="py-[14px] px-4 border-b border-line-light"><Badge text={ticket.priority} bg={priority.bg} color={priority.text} /></td>
      <td className="py-[14px] px-4 border-b border-line-light">
        <span className="inline-flex items-center gap-[6px] py-1 px-3 rounded-pill text-xs font-bold" style={{ background: status.bg, color: status.text }}>
          <span className="w-[6px] h-[6px] rounded-full" style={{ background: status.dot }} />
          {ticket.status}
        </span>
      </td>
      <td className="py-[14px] px-4 border-b border-line-light text-[13px] text-ink-secondary">{ticket.lastUpdated}</td>
      <td className="py-[14px] px-4 border-b border-line-light text-right">
        <ArrowUpRight size={16} className="text-ink-muted" />
      </td>
    </tr>
  )
}

export default SupportPage

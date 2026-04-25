import type { Plan } from '@/types'

export const plansSeed: Plan[] = [
  {
    id: 1,
    name: 'Sunset Yoga at Hyde Park',
    avatar: 'https://images.unsplash.com/photo-1545389336-cf090694435e?w=200&q=80',
    host: { name: 'Elena Rodriguez', avatar: 'https://i.pravatar.cc/80?img=48', verified: true },
    category: 'Fitness',
    participants: {
      joined: 12,
      total: 20,
      avatars: ['https://i.pravatar.cc/80?img=1', 'https://i.pravatar.cc/80?img=2', 'https://i.pravatar.cc/80?img=3'],
    },
    date: 'Oct 28, 2024 · 6:00 PM',
    status: 'Active',
    location: 'Hyde Park, London',
    description: 'A relaxing sunset yoga session open to all levels. Mats provided.',
    flagged: false,
    participantList: [
      { id: 1, name: 'Sophie Martin', avatar: 'https://i.pravatar.cc/80?img=1', joinedAt: 'Oct 22, 2024', outcome: 'Pending' },
      { id: 2, name: 'James Wright', avatar: 'https://i.pravatar.cc/80?img=2', joinedAt: 'Oct 23, 2024', outcome: 'Pending' },
      { id: 3, name: 'Anika Patel', avatar: 'https://i.pravatar.cc/80?img=3', joinedAt: 'Oct 24, 2024', outcome: 'Pending' },
    ],
    reports: [],
    hostReliability: {
      totalHosted: 14, completed: 13, cancelled: 1, noShowRate: 4, rating: 4.8, cancellationsLast30d: 0,
    },
    cancellations: [],
    complaints: [],
    moderationNotes: [
      { id: 1, date: 'Oct 22, 2024', author: 'Admin Sara', text: 'Trusted host, no concerns.' },
    ],
  },
  {
    id: 2,
    name: 'Coffee Brewing Workshop',
    avatar: 'https://images.unsplash.com/photo-1511920170033-f8396924c348?w=200&q=80',
    host: { name: 'Marcus Okonkwo', avatar: 'https://i.pravatar.cc/80?img=13', verified: false },
    category: 'Workshop',
    participants: {
      joined: 8,
      total: 12,
      avatars: ['https://i.pravatar.cc/80?img=4', 'https://i.pravatar.cc/80?img=5'],
    },
    date: 'Oct 29, 2024 · 10:00 AM',
    status: 'Active',
    location: 'Shoreditch, London',
    description: 'Learn pour-over, french press, and espresso techniques.',
    flagged: true,
    flagReason: 'Host has 2 recent no-shows',
    participantList: [
      { id: 11, name: 'Olivia Chen', avatar: 'https://i.pravatar.cc/80?img=4', joinedAt: 'Oct 24, 2024', outcome: 'Pending' },
      { id: 12, name: 'Rohan Mehta', avatar: 'https://i.pravatar.cc/80?img=5', joinedAt: 'Oct 25, 2024', outcome: 'Pending' },
    ],
    reports: [
      { id: 21, date: 'Oct 23, 2024', reason: 'Host did not show up to last session', reporter: 'Olivia Chen', status: 'Reviewed' },
    ],
    hostReliability: {
      totalHosted: 6, completed: 3, cancelled: 1, noShowRate: 33, rating: 3.2, cancellationsLast30d: 1,
    },
    cancellations: [],
    complaints: [
      { id: 31, date: 'Oct 23, 2024', from: 'Olivia Chen', text: 'Host arrived 40 minutes late and rushed the session.', status: 'Open' },
    ],
    moderationNotes: [
      { id: 2, date: 'Oct 24, 2024', author: 'Admin Tariq', text: 'Flagged due to host reliability concerns. Monitor this session.' },
    ],
  },
  {
    id: 3,
    name: 'Weekend Hiking Trail',
    avatar: 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=200&q=80',
    host: { name: "Liam O'Brien", avatar: 'https://i.pravatar.cc/80?img=68', verified: true },
    category: 'Outdoor',
    participants: {
      joined: 18,
      total: 25,
      avatars: ['https://i.pravatar.cc/80?img=6', 'https://i.pravatar.cc/80?img=7', 'https://i.pravatar.cc/80?img=8'],
    },
    date: 'Oct 26, 2024 · 7:00 AM',
    status: 'Active',
    location: 'Wicklow Mountains, IE',
    description: 'Moderate-level hike with scenic viewpoints.',
    flagged: false,
    participantList: [
      { id: 21, name: 'Niamh Murphy', avatar: 'https://i.pravatar.cc/80?img=6', joinedAt: 'Oct 18, 2024', outcome: 'Pending' },
      { id: 22, name: 'Sean Walsh', avatar: 'https://i.pravatar.cc/80?img=7', joinedAt: 'Oct 19, 2024', outcome: 'Pending' },
      { id: 23, name: 'Aoife Byrne', avatar: 'https://i.pravatar.cc/80?img=8', joinedAt: 'Oct 20, 2024', outcome: 'Pending' },
    ],
    reports: [],
    hostReliability: {
      totalHosted: 22, completed: 20, cancelled: 1, noShowRate: 5, rating: 4.6, cancellationsLast30d: 0,
    },
    cancellations: [
      { date: 'Aug 12, 2024', by: 'Host', reason: 'Severe weather warning' },
    ],
    complaints: [],
    moderationNotes: [],
  },
  {
    id: 4,
    name: 'Tech Founders Meetup',
    avatar: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=200&q=80',
    host: { name: 'Daniel Kim', avatar: 'https://i.pravatar.cc/80?img=53', verified: true },
    category: 'Networking',
    participants: {
      joined: 34,
      total: 50,
      avatars: ['https://i.pravatar.cc/80?img=9', 'https://i.pravatar.cc/80?img=10'],
    },
    date: 'Oct 30, 2024 · 7:00 PM',
    status: 'Active',
    location: 'Seoul, KR',
    description: 'Monthly meetup for startup founders and operators.',
    flagged: true,
    flagReason: 'Host account under Trust & Safety review',
    participantList: [
      { id: 31, name: 'Ji-woo Park', avatar: 'https://i.pravatar.cc/80?img=9', joinedAt: 'Oct 15, 2024', outcome: 'Pending' },
      { id: 32, name: 'Min-jun Lee', avatar: 'https://i.pravatar.cc/80?img=10', joinedAt: 'Oct 16, 2024', outcome: 'Pending' },
    ],
    reports: [
      { id: 41, date: 'Oct 09, 2024', reason: 'Harassment from host at last meetup', reporter: 'Ji-woo Park', status: 'Reviewed' },
      { id: 42, date: 'Oct 11, 2024', reason: 'Inappropriate behavior', reporter: 'Anonymous', status: 'Pending' },
    ],
    hostReliability: {
      totalHosted: 18, completed: 14, cancelled: 2, noShowRate: 11, rating: 2.8, cancellationsLast30d: 1,
    },
    cancellations: [
      { date: 'Oct 02, 2024', by: 'Host', reason: 'Personal emergency' },
    ],
    complaints: [
      { id: 51, date: 'Oct 09, 2024', from: 'Ji-woo Park', text: 'Made several attendees uncomfortable with personal remarks.', status: 'Open' },
      { id: 52, date: 'Oct 12, 2024', from: 'Anonymous', text: 'Pushy networking — felt coerced into pitching.', status: 'Open' },
    ],
    moderationNotes: [
      { id: 4, date: 'Oct 12, 2024', author: 'Admin Sara', text: 'Plan flagged. Host placed under T&S review pending complaint resolution.' },
    ],
  },
  {
    id: 5,
    name: 'Photography Walk',
    avatar: 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=200&q=80',
    host: { name: 'Aiko Tanaka', avatar: 'https://i.pravatar.cc/80?img=45', verified: true },
    category: 'Creative',
    participants: {
      joined: 15,
      total: 15,
      avatars: ['https://i.pravatar.cc/80?img=11', 'https://i.pravatar.cc/80?img=12'],
    },
    date: 'Oct 25, 2024 · 3:00 PM',
    status: 'Completed',
    location: 'Shibuya, Tokyo',
    description: 'Urban photography walk with critique session after.',
    flagged: false,
    participantList: [
      { id: 41, name: 'Haruto Sato', avatar: 'https://i.pravatar.cc/80?img=11', joinedAt: 'Oct 18, 2024', outcome: 'Attended' },
      { id: 42, name: 'Yui Nakamura', avatar: 'https://i.pravatar.cc/80?img=12', joinedAt: 'Oct 19, 2024', outcome: 'Attended' },
      { id: 43, name: 'Kenji Mori', avatar: 'https://i.pravatar.cc/80?img=15', joinedAt: 'Oct 20, 2024', outcome: 'No-Show' },
    ],
    reports: [],
    hostReliability: {
      totalHosted: 9, completed: 9, cancelled: 0, noShowRate: 6, rating: 4.9, cancellationsLast30d: 0,
    },
    cancellations: [],
    complaints: [],
    moderationNotes: [
      { id: 5, date: 'Oct 25, 2024', author: 'System', text: 'Plan completed successfully. 14/15 attended.' },
    ],
  },
  {
    id: 6,
    name: 'Board Games Night',
    avatar: 'https://images.unsplash.com/photo-1606167668584-78701c57f13d?w=200&q=80',
    host: { name: 'Zara Hassan', avatar: 'https://i.pravatar.cc/80?img=44', verified: true },
    category: 'Social',
    participants: {
      joined: 6,
      total: 10,
      avatars: ['https://i.pravatar.cc/80?img=14'],
    },
    date: 'Oct 27, 2024 · 8:00 PM',
    status: 'Cancelled',
    location: 'Istanbul, TR',
    description: 'Casual board games night - all games provided.',
    flagged: false,
    participantList: [
      { id: 51, name: 'Emre Yilmaz', avatar: 'https://i.pravatar.cc/80?img=14', joinedAt: 'Oct 21, 2024', outcome: 'Cancelled' },
      { id: 52, name: 'Selin Demir', avatar: 'https://i.pravatar.cc/80?img=16', joinedAt: 'Oct 22, 2024', outcome: 'Cancelled' },
    ],
    reports: [],
    hostReliability: {
      totalHosted: 5, completed: 4, cancelled: 1, noShowRate: 8, rating: 4.4, cancellationsLast30d: 1,
    },
    cancellations: [
      { date: 'Oct 26, 2024', by: 'Host', reason: 'Venue closed unexpectedly' },
    ],
    complaints: [],
    moderationNotes: [
      { id: 6, date: 'Oct 26, 2024', author: 'Admin Tariq', text: 'Host cancelled with valid reason. Refunds processed automatically.' },
    ],
  },
]

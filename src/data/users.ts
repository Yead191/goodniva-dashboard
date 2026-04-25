import type { User } from '@/types'

export const usersSeed: User[] = [
  {
    id: 1,
    name: 'Elena Rodriguez',
    email: 'elena.r@example.com',
    location: 'Hyde Park, London',
    avatar: 'https://i.pravatar.cc/80?img=48',
    subscription: 'Premium',
    verified: true,
    accountStatus: 'active',
    restrictions: { joining: false, hosting: false },
    identityInfo: { fullName: 'Elena Rodriguez', dateOfBirth: 'Mar 14, 1992', idType: 'Passport', idNumber: 'P••••4821' },
    interestInfo: { interests: ['Running', 'Yoga', 'Photography'], hobbies: ['Travel', 'Reading'], joinedDate: 'Mar 2024' },
    activity: {
      city: 'London, UK',
      joinedPlans: [
        { id: 101, title: 'Sunrise Yoga at Hyde Park', date: 'Apr 12, 2026', category: 'Yoga', status: 'Completed' },
        { id: 102, title: 'Photo Walk: Camden Market', date: 'Apr 18, 2026', category: 'Photography', status: 'Completed' },
        { id: 103, title: 'Thames 10K Charity Run', date: 'May 02, 2026', category: 'Running', status: 'Upcoming' },
      ],
      hostedPlans: [
        { id: 201, title: 'Morning Stretch Club', date: 'Mar 22, 2026', category: 'Yoga', status: 'Completed' },
      ],
      attendance: [
        { planId: 101, planTitle: 'Sunrise Yoga at Hyde Park', date: 'Apr 12, 2026', outcome: 'Attended' },
        { planId: 102, planTitle: 'Photo Walk: Camden Market', date: 'Apr 18, 2026', outcome: 'Attended' },
        { planId: 201, planTitle: 'Morning Stretch Club', date: 'Mar 22, 2026', outcome: 'Attended' },
      ],
      reports: [],
      moderatorNotes: [
        { id: 1, date: 'Mar 28, 2026', author: 'Admin Sara', text: 'Great host, consistently positive feedback from attendees.' },
      ],
    },
  },
  {
    id: 2,
    name: 'Marcus Okonkwo',
    email: 'marcus.o@example.com',
    location: 'Shoreditch, London',
    avatar: 'https://i.pravatar.cc/80?img=13',
    subscription: 'Professional',
    verified: false,
    accountStatus: 'warned',
    restrictions: { joining: false, hosting: false },
    identityInfo: { fullName: 'Marcus Okonkwo', dateOfBirth: 'Aug 02, 1988', idType: 'Driving License', idNumber: 'DL••••9087' },
    interestInfo: { interests: ['Basketball', 'Music'], hobbies: ['Cooking'], joinedDate: 'Feb 2024' },
    activity: {
      city: 'London, UK',
      joinedPlans: [
        { id: 110, title: 'Pickup Basketball — Shoreditch Park', date: 'Apr 05, 2026', category: 'Sports', status: 'Completed' },
        { id: 111, title: 'Open Mic Night', date: 'Apr 14, 2026', category: 'Music', status: 'Completed' },
        { id: 112, title: 'Sunday Cookout', date: 'Apr 21, 2026', category: 'Food', status: 'Cancelled' },
      ],
      hostedPlans: [],
      attendance: [
        { planId: 110, planTitle: 'Pickup Basketball — Shoreditch Park', date: 'Apr 05, 2026', outcome: 'Attended' },
        { planId: 111, planTitle: 'Open Mic Night', date: 'Apr 14, 2026', outcome: 'No-Show' },
        { planId: 109, planTitle: 'Jazz Club Meetup', date: 'Mar 30, 2026', outcome: 'No-Show' },
      ],
      reports: [
        { id: 11, date: 'Apr 15, 2026', reason: 'Repeated no-shows', reporter: 'Open Mic host', status: 'Reviewed' },
      ],
      moderatorNotes: [
        { id: 2, date: 'Apr 16, 2026', author: 'Admin Sara', text: 'Issued formal warning after 2nd no-show in 30 days.' },
      ],
    },
  },
  {
    id: 3,
    name: 'Priya Sharma',
    email: 'priya.s@example.com',
    location: 'Bangalore, IN',
    avatar: 'https://i.pravatar.cc/80?img=47',
    subscription: 'Premium',
    verified: true,
    accountStatus: 'active',
    restrictions: { joining: false, hosting: true },
    identityInfo: { fullName: 'Priya Sharma', dateOfBirth: 'Jun 21, 1995', idType: 'National ID', idNumber: 'ID••••3421' },
    interestInfo: { interests: ['Dance', 'Art'], hobbies: ['Gardening'], joinedDate: 'Jan 2024' },
    activity: {
      city: 'Bangalore, IN',
      joinedPlans: [
        { id: 120, title: 'Bharatanatyam Workshop', date: 'Apr 08, 2026', category: 'Dance', status: 'Completed' },
        { id: 121, title: 'Watercolor Sunday', date: 'Apr 19, 2026', category: 'Art', status: 'Upcoming' },
      ],
      hostedPlans: [
        { id: 220, title: 'Saturday Salsa Social', date: 'Mar 15, 2026', category: 'Dance', status: 'Cancelled' },
        { id: 221, title: 'Garden Sketching', date: 'Apr 04, 2026', category: 'Art', status: 'Cancelled' },
      ],
      attendance: [
        { planId: 120, planTitle: 'Bharatanatyam Workshop', date: 'Apr 08, 2026', outcome: 'Attended' },
        { planId: 220, planTitle: 'Saturday Salsa Social', date: 'Mar 15, 2026', outcome: 'Cancelled' },
      ],
      reports: [
        { id: 21, date: 'Apr 02, 2026', reason: 'Cancelled hosted plan within 1 hour of start', reporter: '3 attendees', status: 'Reviewed' },
      ],
      moderatorNotes: [
        { id: 3, date: 'Apr 03, 2026', author: 'Admin Tariq', text: 'Hosting restricted after pattern of last-minute cancellations.' },
      ],
    },
  },
  {
    id: 4,
    name: 'Tomás Silva',
    email: 'tomas.s@example.com',
    location: 'Porto, PT',
    avatar: 'https://i.pravatar.cc/80?img=33',
    subscription: 'Premium',
    verified: false,
    accountStatus: 'suspended',
    restrictions: { joining: false, hosting: false },
    identityInfo: { fullName: 'Tomás Silva', dateOfBirth: 'Oct 30, 1990', idType: 'Passport', idNumber: 'P••••5612' },
    interestInfo: { interests: ['Surfing', 'Hiking'], hobbies: ['Photography'], joinedDate: 'Dec 2023' },
    activity: {
      city: 'Porto, PT',
      joinedPlans: [
        { id: 130, title: 'Matosinhos Surf Sunrise', date: 'Mar 26, 2026', category: 'Surfing', status: 'Completed' },
      ],
      hostedPlans: [
        { id: 230, title: 'Douro Valley Hike', date: 'Mar 20, 2026', category: 'Hiking', status: 'Completed' },
      ],
      attendance: [
        { planId: 130, planTitle: 'Matosinhos Surf Sunrise', date: 'Mar 26, 2026', outcome: 'Attended' },
        { planId: 230, planTitle: 'Douro Valley Hike', date: 'Mar 20, 2026', outcome: 'Attended' },
      ],
      reports: [
        { id: 41, date: 'Apr 10, 2026', reason: 'Inappropriate behavior toward attendees', reporter: '2 attendees', status: 'Reviewed' },
      ],
      moderatorNotes: [
        { id: 4, date: 'Apr 11, 2026', author: 'Admin Sara', text: 'Account suspended pending Trust & Safety review.' },
      ],
    },
  },
  {
    id: 5,
    name: 'Aiko Tanaka',
    email: 'aiko.t@example.com',
    location: 'Tokyo, JP',
    avatar: 'https://i.pravatar.cc/80?img=45',
    subscription: 'Professional',
    verified: true,
    accountStatus: 'active',
    restrictions: { joining: false, hosting: false },
    identityInfo: { fullName: 'Aiko Tanaka', dateOfBirth: 'Feb 11, 1993', idType: 'National ID', idNumber: 'ID••••7788' },
    interestInfo: { interests: ['Photography', 'Design'], hobbies: ['Cycling'], joinedDate: 'Nov 2023' },
    activity: {
      city: 'Tokyo, JP',
      joinedPlans: [
        { id: 140, title: 'Shibuya Street Photography', date: 'Apr 06, 2026', category: 'Photography', status: 'Completed' },
        { id: 141, title: 'Design Critique Café', date: 'Apr 20, 2026', category: 'Design', status: 'Upcoming' },
      ],
      hostedPlans: [
        { id: 240, title: 'Cherry Blossom Bike Tour', date: 'Apr 02, 2026', category: 'Cycling', status: 'Completed' },
      ],
      attendance: [
        { planId: 140, planTitle: 'Shibuya Street Photography', date: 'Apr 06, 2026', outcome: 'Attended' },
        { planId: 240, planTitle: 'Cherry Blossom Bike Tour', date: 'Apr 02, 2026', outcome: 'Attended' },
      ],
      reports: [],
      moderatorNotes: [],
    },
  },
  {
    id: 6,
    name: "Liam O'Brien",
    email: 'liam.o@example.com',
    location: 'Dublin, IE',
    avatar: 'https://i.pravatar.cc/80?img=68',
    subscription: 'Premium',
    verified: true,
    accountStatus: 'active',
    restrictions: { joining: true, hosting: false },
    identityInfo: { fullName: "Liam O'Brien", dateOfBirth: 'May 07, 1991', idType: 'Passport', idNumber: 'P••••3344' },
    interestInfo: { interests: ['Football', 'Music'], hobbies: ['Gaming'], joinedDate: 'Oct 2023' },
    activity: {
      city: 'Dublin, IE',
      joinedPlans: [
        { id: 150, title: '5-a-side Phoenix Park', date: 'Mar 28, 2026', category: 'Sports', status: 'Completed' },
        { id: 151, title: 'Trad Music Night', date: 'Apr 09, 2026', category: 'Music', status: 'Completed' },
        { id: 152, title: 'Saturday League Match', date: 'Apr 17, 2026', category: 'Sports', status: 'Cancelled' },
      ],
      hostedPlans: [
        { id: 250, title: 'Retro Game Café Meet', date: 'Apr 01, 2026', category: 'Gaming', status: 'Completed' },
      ],
      attendance: [
        { planId: 150, planTitle: '5-a-side Phoenix Park', date: 'Mar 28, 2026', outcome: 'Attended' },
        { planId: 151, planTitle: 'Trad Music Night', date: 'Apr 09, 2026', outcome: 'No-Show' },
        { planId: 152, planTitle: 'Saturday League Match', date: 'Apr 17, 2026', outcome: 'No-Show' },
        { planId: 149, planTitle: 'Pub Quiz Tuesday', date: 'Mar 25, 2026', outcome: 'No-Show' },
      ],
      reports: [
        { id: 61, date: 'Apr 18, 2026', reason: '3 no-shows in 30 days', reporter: 'System', status: 'Reviewed' },
      ],
      moderatorNotes: [
        { id: 6, date: 'Apr 18, 2026', author: 'Admin Tariq', text: 'Joining restricted for 14 days due to repeated no-shows.' },
      ],
    },
  },
  {
    id: 7,
    name: 'Zara Hassan',
    email: 'zara.h@example.com',
    location: 'Istanbul, TR',
    avatar: 'https://i.pravatar.cc/80?img=44',
    subscription: 'Starter',
    verified: true,
    accountStatus: 'active',
    restrictions: { joining: false, hosting: false },
    identityInfo: { fullName: 'Zara Hassan', dateOfBirth: 'Sep 16, 1996', idType: 'National ID', idNumber: 'ID••••9012' },
    interestInfo: { interests: ['Yoga', 'Writing'], hobbies: ['Reading'], joinedDate: 'Sep 2023' },
    activity: {
      city: 'Istanbul, TR',
      joinedPlans: [
        { id: 160, title: 'Bosphorus Sunrise Yoga', date: 'Apr 11, 2026', category: 'Yoga', status: 'Completed' },
        { id: 161, title: 'Writers Circle', date: 'Apr 22, 2026', category: 'Writing', status: 'Upcoming' },
      ],
      hostedPlans: [],
      attendance: [
        { planId: 160, planTitle: 'Bosphorus Sunrise Yoga', date: 'Apr 11, 2026', outcome: 'Attended' },
      ],
      reports: [],
      moderatorNotes: [],
    },
  },
  {
    id: 8,
    name: 'Daniel Kim',
    email: 'daniel.k@example.com',
    location: 'Seoul, KR',
    avatar: 'https://i.pravatar.cc/80?img=53',
    subscription: 'Professional',
    verified: true,
    accountStatus: 'banned',
    restrictions: { joining: false, hosting: false },
    identityInfo: { fullName: 'Daniel Kim', dateOfBirth: 'Dec 03, 1989', idType: 'Passport', idNumber: 'P••••4455' },
    interestInfo: { interests: ['Hiking', 'Tech'], hobbies: ['Coffee'], joinedDate: 'Aug 2023' },
    activity: {
      city: 'Seoul, KR',
      joinedPlans: [
        { id: 170, title: 'Bukhansan Trail Hike', date: 'Mar 18, 2026', category: 'Hiking', status: 'Completed' },
      ],
      hostedPlans: [
        { id: 270, title: 'Dev Coffee Chat — Gangnam', date: 'Mar 24, 2026', category: 'Tech', status: 'Completed' },
      ],
      attendance: [
        { planId: 170, planTitle: 'Bukhansan Trail Hike', date: 'Mar 18, 2026', outcome: 'Attended' },
        { planId: 270, planTitle: 'Dev Coffee Chat — Gangnam', date: 'Mar 24, 2026', outcome: 'Attended' },
      ],
      reports: [
        { id: 81, date: 'Apr 05, 2026', reason: 'Harassment reported by 4 users', reporter: '4 attendees', status: 'Reviewed' },
        { id: 82, date: 'Apr 09, 2026', reason: 'Created secondary account after warning', reporter: 'System', status: 'Reviewed' },
      ],
      moderatorNotes: [
        { id: 8, date: 'Apr 06, 2026', author: 'Admin Sara', text: 'First warning issued for harassment complaints.' },
        { id: 9, date: 'Apr 10, 2026', author: 'Admin Tariq', text: 'Permanent ban after evasion attempt. Device fingerprint recorded.' },
      ],
    },
  },
]

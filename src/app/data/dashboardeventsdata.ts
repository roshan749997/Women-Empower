// constants/event.constants.ts
export const EVENT_CATEGORIES = [
  'Rangoli',
  'Spiritual',
  'Resin',
  'Shubh Labh',
  'Lapdesk',
  'Diya & Thali',
  'Decor',
  'Gift'
] as const;

export const EVENT_STATUSES = {
  UPCOMING: 'upcoming',
  COMPLETED: 'completed',
  ONGOING: 'ongoing'
} as const;

export const STATUS_COLORS = {
  upcoming: 'bg-blue-500',
  completed: 'bg-gray-500',
  ongoing: 'bg-green-500'
} as const;

export const INITIAL_EVENTS = [
  {
    id: '1',
    thumbnail: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=300&fit=crop',
    category: 'Rangoli',
    title: 'Tech Innovation Summit 2025',
    description: 'Join industry leaders for groundbreaking discussions on AI, blockchain, and future technologies.',
    dateTime: '2025-10-15T10:00',
    status: 'upcoming' as const,
    keywords: ['AI', 'Tech', 'Innovation'],
    banner: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&h=400&fit=crop'
  },
  {
    id: '2',
    thumbnail: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=400&h=300&fit=crop',
    category: 'Spiritual',
    title: 'Summer Music Festival',
    description: 'Experience live performances from top artists in an outdoor setting.',
    dateTime: '2025-09-20T18:00',
    status: 'completed' as const,
    keywords: ['Music', 'Festival', 'Live'],
  },
  {
    id: '3',
    thumbnail: 'https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=400&h=300&fit=crop',
    category: 'Decor',
    title: 'Startup Networking Meetup',
    description: 'Connect with entrepreneurs and investors in your area.',
    dateTime: '2025-10-03T14:00',
    status: 'ongoing' as const,
    keywords: ['Startup', 'Networking', 'Business'],
  }
];
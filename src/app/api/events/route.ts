// app/api/events/route.ts
import { NextResponse } from 'next/server';

export interface Event {
  id: string;
  e_image: string;
  category_id: string;
  title: string;
  description: string;
  date_time: string;
  status: 'upcoming' | 'ongoing' | 'completed';
  keywords: string;
  banner: string;
}

// Mock database - Replace with actual database calls
const events: Event[] = [
  {
    id: '1',
    e_image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400',
    category_id: '1',
    title: 'Global Tech Summit 2025',
    description: 'A global gathering of tech leaders, startups, and innovators.',
    date_time: '2025-12-01 09:00:00',
    status: 'upcoming',
    keywords: 'technology,global summit,startups',
    banner: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200',
  },
  {
    id: '2',
    e_image: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=400',
    category_id: '2',
    title: 'Diwali Rangoli Workshop',
    description: 'Learn traditional rangoli patterns and modern designs for Diwali celebrations',
    date_time: '2025-10-25 10:00:00',
    status: 'upcoming',
    keywords: 'diwali,rangoli,traditional',
    banner: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=1200',
  },
  {
    id: '3',
    e_image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=400',
    category_id: '3',
    title: 'Music Festival 2025',
    description: 'Experience the best live music performances from around the world',
    date_time: '2025-11-15 18:00:00',
    status: 'ongoing',
    keywords: 'music,festival,live performance',
    banner: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1200',
  },
  {
    id: '4',
    e_image: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=400',
    category_id: '4',
    title: 'Art Exhibition',
    description: 'Contemporary art showcase featuring emerging artists',
    date_time: '2025-09-20 11:00:00',
    status: 'completed',
    keywords: 'art,exhibition,contemporary',
    banner: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=1200',
  },
  {
    id: '5',
    e_image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=400',
    category_id: '5',
    title: 'Food & Culture Fest',
    description: 'Taste authentic cuisines from different cultures and traditions',
    date_time: '2025-10-30 12:00:00',
    status: 'upcoming',
    keywords: 'food,culture,festival',
    banner: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=1200',
  },
  {
    id: '6',
    e_image: 'https://images.unsplash.com/photo-1496024840928-4c417adf211d?w=400',
    category_id: '6',
    title: 'Business Leadership Summit',
    description: 'Learn from industry leaders and network with professionals',
    date_time: '2025-11-05 09:00:00',
    status: 'upcoming',
    keywords: 'business,leadership,networking',
    banner: 'https://images.unsplash.com/photo-1496024840928-4c417adf211d?w=1200',
  },
  {
    id: '7',
    e_image: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=400',
    category_id: '7',
    title: 'Yoga & Wellness Retreat',
    description: 'Rejuvenate your mind and body with yoga and meditation sessions',
    date_time: '2025-12-10 07:00:00',
    status: 'upcoming',
    keywords: 'yoga,wellness,meditation',
    banner: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=1200',
  },
  {
    id: '8',
    e_image: 'https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?w=400',
    category_id: '8',
    title: 'Photography Workshop',
    description: 'Master the art of photography with professional photographers',
    date_time: '2025-10-28 14:00:00',
    status: 'ongoing',
    keywords: 'photography,workshop,art',
    banner: 'https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?w=1200',
  },
  {
    id: '9',
    e_image: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=400',
    category_id: '9',
    title: 'Coding Bootcamp',
    description: 'Intensive coding bootcamp for aspiring software developers',
    date_time: '2025-11-20 09:00:00',
    status: 'upcoming',
    keywords: 'coding,programming,bootcamp',
    banner: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1200',
  },
  {
    id: '10',
    e_image: 'https://images.unsplash.com/photo-1528605248644-14dd04022da1?w=400',
    category_id: '10',
    title: 'Marketing Conference',
    description: 'Learn the latest digital marketing strategies and trends',
    date_time: '2025-12-05 10:00:00',
    status: 'upcoming',
    keywords: 'marketing,digital,conference',
    banner: 'https://images.unsplash.com/photo-1528605248644-14dd04022da1?w=1200',
  },
];

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    
    const search = searchParams.get('search')?.toLowerCase() || '';
    const status = searchParams.get('status') || 'All';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');

    // Filter events
    let filtered = events.filter((event) => {
      const matchesSearch =
        event.title.toLowerCase().includes(search) ||
        event.description.toLowerCase().includes(search) ||
        event.keywords.toLowerCase().includes(search);

      const matchesStatus = status === 'All' || event.status === status;

      return matchesSearch && matchesStatus;
    });

    // Sort by date (upcoming first)
    filtered.sort((a, b) => {
      const dateA = new Date(a.date_time).getTime();
      const dateB = new Date(b.date_time).getTime();
      return dateB - dateA;
    });

    // Pagination
    const total = filtered.length;
    const totalPages = Math.ceil(total / limit);
    const start = (page - 1) * limit;
    const paginatedEvents = filtered.slice(start, start + limit);

    // Get featured events (non-completed with banners)
    const featuredEvents = events
      .filter((e) => e.status !== 'completed' && e.banner && e.banner.trim() !== '')
      .slice(0, 5);

    return NextResponse.json({
      success: true,
      data: paginatedEvents,
      featured: featuredEvents,
      pagination: {
        page,
        limit,
        total,
        totalPages
      },
      filters: {
        statuses: ['All', 'upcoming', 'ongoing', 'completed']
      }
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch events' },
      { status: 500 }
    );
  }
}
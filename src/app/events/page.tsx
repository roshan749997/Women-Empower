// app/events/page.tsx (Server Component)
import EventsSectionClient from "../component/events/EventsSectionClient";

interface Event {
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

interface EventApiResponse {
  success: boolean;
  message: string;
  data: Event[];
}

async function getEvents(): Promise<{
  events: Event[];
  featuredEvents: Event[];
  statuses: string[];
}> {
  try {
    // Fetch events from API
    const res = await fetch('http://localhost:5000/v1/event/', {
      cache: 'no-store'
    });
    
    if (!res.ok) {
      throw new Error('Failed to fetch events');
    }
    
    const response: EventApiResponse = await res.json();
    const events = response.data || [];
    
    // Extract unique statuses for filtering
    const statuses = ['All', ...new Set(events.map(event => event.status))];
    
    // Get featured events (first 3 events as featured)
    const featuredEvents = events.slice(0, 3);
    
    return {
      events,
      featuredEvents,
      statuses
    };
  } catch (error) {
    console.error('Error fetching events:', error);
    return {
      events: [],
      featuredEvents: [],
      statuses: ['All', 'upcoming', 'ongoing', 'completed']
    };
  }
}

export default async function EventsPage() {
  const eventsData = await getEvents();

  return (
    <EventsSectionClient 
      initialEvents={eventsData.events}
      featuredEvents={eventsData.featuredEvents}
      statuses={eventsData.statuses}
    />
  );
}

// Optional: Generate metadata
export const metadata = {
  title: 'Events & Workshops | Learning Platform',
  description: 'Discover upcoming events, workshops, and conferences',
};
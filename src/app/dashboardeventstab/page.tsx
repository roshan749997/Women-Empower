// app/events/page.tsx (Server Component)
import { EventDashboardClient } from '../component/dashboard/dashboardeventstab/EventDashboardClient';
import { getEventsV1, getCategoriesApi } from '@/app/lib/api';

// This is a Server Component by default in Next.js App Router
export default async function EventsPage() {
  const [eventsRaw, categories] = await Promise.all([
    getEventsV1(),
    getCategoriesApi()
  ]);
  const categoryIdToName: Record<string, string> = {};
  (categories || []).forEach((c: { id: string; name: string }) => {
    categoryIdToName[c.id] = c.name;
  });
  const events = (eventsRaw || []).map((e: any) => ({
    ...e,
    category: categoryIdToName[e.category] || e.category
  }));

  return <EventDashboardClient initialEvents={events} />;
}

// Optional: Add metadata
export const metadata = {
  title: 'Event Dashboard',
  description: 'Manage your events efficiently',
};
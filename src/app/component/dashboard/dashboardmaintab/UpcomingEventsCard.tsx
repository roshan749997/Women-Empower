'use client';

import { UpcomingEvent } from '@/app/data/dashboardmaintabdata';

interface UpcomingEventsCardProps {
  events: UpcomingEvent[];
}

export function UpcomingEventsCard({ events }: UpcomingEventsCardProps) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900">Events</h2>
        <button className="px-4 py-2 text-sm font-semibold text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all duration-150">
          View All
        </button>
      </div>
      <div className="space-y-4">
        {events.map((event, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-150"
          >
            <div>
              <p className="font-semibold text-gray-900">{event.name}</p>
              <p className="text-sm text-gray-500 mt-1">{event.date}</p>
            </div>
            <div className="text-right">
              <p className="text-lg font-bold text-gray-900">{event.time}</p>
              <p className="text-xs text-gray-500 uppercase tracking-wide">
                Time
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
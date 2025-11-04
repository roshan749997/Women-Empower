'use client';
import React from 'react';
import { getStatusColor, formatEventDateTimeFull } from '@/app/lib/utils/dashboardevent-utils';
import R2Image from "../dashboardallproductstab/R2Image";
import { DEFAULT_THUMBNAIL } from "@/app/data/dashboardproductdata";
import type { Event } from '@/app/types/dashboardeventtab';

interface EventModalViewProps {
  event: Event;
}

export const EventModalView: React.FC<EventModalViewProps> = ({ event }) => {
  return (
    <div className="space-y-4">
      {event.banner && (
        <R2Image src={event.banner} fallbackSrc={DEFAULT_THUMBNAIL} alt="Banner" className="w-full h-48 object-cover rounded-lg" />
      )}
      <R2Image src={event.thumbnail} fallbackSrc={DEFAULT_THUMBNAIL} alt={event.title} className="w-full h-64 object-cover rounded-lg" />
      <div>
        <span className={`${getStatusColor(event.status)} text-white text-sm px-3 py-1 rounded-full capitalize inline-block`}>
          {event.status}
        </span>
      </div>
      <div>
        <p className="text-sm text-gray-500">Category</p>
        <p className="text-lg font-semibold">{event.category}</p>
      </div>
      <div>
        <p className="text-sm text-gray-500">Title</p>
        <p className="text-xl font-bold">{event.title}</p>
      </div>
      <div>
        <p className="text-sm text-gray-500">Description</p>
        <p className="text-gray-700">{event.description}</p>
      </div>
      <div>
        <p className="text-sm text-gray-500">Date & Time</p>
        <p className="text-gray-700">{formatEventDateTimeFull(event.dateTime)}</p>
      </div>
      <div>
        <p className="text-sm text-gray-500 mb-2">Keywords</p>
        <div className="flex flex-wrap gap-2">
          {event.keywords.map((keyword, idx) => (
            <span key={idx} className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
              {keyword}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

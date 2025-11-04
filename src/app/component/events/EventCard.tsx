// app/events/EventCard.tsx
"use client";
import React from "react";
import { Calendar, Clock } from "lucide-react";
import R2Image from "../dashboard/dashboardallproductstab/R2Image";
import { DEFAULT_THUMBNAIL } from "@/app/data/dashboardproductdata";

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

interface EventCardProps {
  event: Event;
  formatDate: (date: string) => string;
  formatTime: (date: string) => string;
  getStatusColor: (status: string) => string;
}

const EventCard: React.FC<EventCardProps> = ({ 
  event, 
  formatDate, 
  formatTime, 
  getStatusColor 
}) => {
  const tags = event.keywords ? event.keywords.split(',').slice(0, 2) : [];
  // Use banner if exists and not empty, otherwise use e_image
  const cardImage = event.banner && event.banner.trim() !== "" ? event.banner : event.e_image;
  
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-all duration-300 border border-gray-100 group flex flex-col">
      <div className="relative">
        <R2Image 
          src={cardImage} 
          fallbackSrc={DEFAULT_THUMBNAIL}
          alt={event.title}
          className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <span className={`absolute bottom-3 left-3 px-2 py-1 rounded text-xs font-medium border ${getStatusColor(event.status)}`}>
          {event.status.toUpperCase()}
        </span>
      </div>

      <div className="p-4 flex flex-col flex-grow">
        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 text-sm leading-5">{event.title}</h3>
        <p className="text-gray-600 mb-3 text-xs line-clamp-2 leading-4">{event.description}</p>

        <div className="space-y-1 text-xs text-gray-500 mb-3">
          <div className="flex items-center">
            <Calendar className="w-3 h-3 mr-1.5" /> {formatDate(event.date_time)}
          </div>
          <div className="flex items-center">
            <Clock className="w-3 h-3 mr-1.5" /> {formatTime(event.date_time)}
          </div>
        </div>

        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {tags.map((tag, i) => (
              <span key={i} className="inline-flex items-center px-2 py-0.5 bg-gray-50 text-gray-600 text-xs rounded">
                {tag.trim()}
              </span>
            ))}
          </div>
        )}

        <button
          className={`mt-auto w-full py-2 px-4 rounded-lg text-sm font-semibold transition-colors
            ${
              event.status === 'completed'
                ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                : event.status === 'upcoming'
                ? 'bg-blue-50 text-blue-600 hover:bg-blue-100'
                : event.status === 'ongoing'
                ? 'bg-green-50 text-green-600 hover:bg-green-100'
                : 'bg-[#695946] text-white hover:bg-[#61503c]'
            }
          `}
          disabled={event.status === 'completed'}
        >
          {event.status === 'completed'
            ? 'Event Completed'
            : event.status === 'upcoming'
            ? 'Join Upcoming'
            : event.status === 'ongoing'
            ? 'Join Now'
            : 'Join Event'}
        </button>
      </div>
    </div>
  );
};

export default EventCard;

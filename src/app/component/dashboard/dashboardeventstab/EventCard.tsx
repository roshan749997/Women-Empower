"use client";
import React from "react";
import { Calendar, Tag, Eye, Edit2, Trash2, MoreVertical } from "lucide-react";
import {
  getStatusColor,
  formatEventDateTime,
} from "@/app/lib/utils/dashboardevent-utils";
import type { Event, ModalMode } from "@/app/types/dashboardeventtab";
import R2Image from "../dashboardallproductstab/R2Image";
import { DEFAULT_THUMBNAIL } from "@/app/data/dashboardproductdata";

interface EventCardProps {
  event: Event;
  activeDropdown: string | null;
  onToggleDropdown: (id: string) => void;
  onOpenModal: (mode: ModalMode, event: Event) => void;
  onDelete: (id: string) => void;
}

export const EventCard: React.FC<EventCardProps> = ({
  event,
  activeDropdown,
  onToggleDropdown,
  onOpenModal,
  onDelete,
}) => {
  return (
    <div
      className="bg-white rounded-lg shadow-sm hover:shadow-xl transition-all duration-300 group overflow-hidden border border-gray-100"
      data-event-id={event.id}
    >
      {/* Image Section */}
      <div className="relative overflow-hidden">
        <R2Image
          src={event.thumbnail}
          fallbackSrc={DEFAULT_THUMBNAIL}
          alt={event.title}
          className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
        />

        {/* Status Badge */}
        <div
          className={`absolute top-3 left-3 ${getStatusColor(
            event.status
          )} text-white px-2.5 py-1 rounded-md text-xs font-bold shadow-lg capitalize`}
        >
          {event.status}
        </div>

        {/* Category Badge */}
        {event.category && (
          <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm text-gray-700 px-2.5 py-1 rounded-md flex items-center gap-1.5 text-xs font-medium shadow-md">
            <Tag className="w-3 h-3 text-blue-600" />
            <span>{event.category}</span>
          </div>
        )}

        {/* Three Dots Menu */}
        <div className="absolute top-3 left-1/2 -translate-x-1/2 z-30 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleDropdown(event.id);
            }}
            className="bg-white/95 backdrop-blur-sm hover:bg-white text-gray-700 p-2 rounded-full shadow-lg transition-all duration-150 hover:shadow-xl hover:scale-110"
          >
            <MoreVertical className="w-4 h-4" />
          </button>
        </div>

        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* Content Section */}
      <div className="p-4">
        {/* Event Title */}
        <h3 className="font-semibold text-gray-900 text-base mb-2 line-clamp-2 min-h-[3rem] group-hover:text-blue-600 transition-colors">
          {event.title}
        </h3>

        {/* Date & Time */}
        <div className="flex items-center gap-2 text-gray-600 text-sm mb-3">
          <Calendar className="w-4 h-4" />
          <span>{formatEventDateTime(event.dateTime)}</span>
        </div>

        {/* Keywords */}
        <div className="flex flex-wrap gap-2 mb-2">
          {event.keywords.slice(0, 3).map((keyword, idx) => (
            <span
              key={idx}
              className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full flex items-center gap-1"
            >
              <Tag className="w-3 h-3" />
              {keyword}
            </span>
          ))}
        </div>
      </div>

      {/* Dropdown Menu */}
      {activeDropdown === event.id && (
        <div
          className="fixed z-50 w-56 bg-white rounded-xl shadow-2xl border border-gray-200 py-2 animate-in fade-in slide-in-from-top-2 duration-200"
          style={{
            top: `${
              (
                document.querySelector(
                  `[data-event-id="${event.id}"]`
                ) as HTMLElement
              )?.getBoundingClientRect().top || 0
            }px`,
            left: `${
              ((
                document.querySelector(
                  `[data-event-id="${event.id}"]`
                ) as HTMLElement
              )?.getBoundingClientRect().right || 0) - 224
            }px`,
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={() => onOpenModal("view", event)}
            className="w-full text-left px-4 py-2.5 hover:bg-blue-50 flex items-center gap-3 text-sm text-gray-700 transition-colors rounded-lg mx-1"
          >
            <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
              <Eye className="w-4 h-4 text-blue-600" />
            </div>
            <span className="font-medium">View Details</span>
          </button>

          <button
            onClick={() => onOpenModal("edit", event)}
            className="w-full text-left px-4 py-2.5 hover:bg-green-50 flex items-center gap-3 text-sm text-gray-700 transition-colors rounded-lg mx-1"
          >
            <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center">
              <Edit2 className="w-4 h-4 text-green-600" />
            </div>
            <span className="font-medium">Edit Event</span>
          </button>

          <div className="border-t border-gray-200 my-2 mx-2"></div>

          <button
            onClick={() => onDelete(event.id)}
            className="w-full text-left px-4 py-2.5 hover:bg-red-50 flex items-center gap-3 text-sm text-red-600 transition-colors rounded-lg mx-1"
          >
            <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center">
              <Trash2 className="w-4 h-4 text-red-600" />
            </div>
            <span className="font-medium">Delete Event</span>
          </button>
        </div>
      )}
    </div>
  );
};

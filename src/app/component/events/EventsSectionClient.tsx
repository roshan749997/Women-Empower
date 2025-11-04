"use client";
import React, { useState, useMemo, useCallback, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import EventCard from "./EventCard";
import FeaturedEventsSlider from "./FeaturedEventsSlider";
import EventFilters from "./EventFilters";
import { getEventsApi, searchEventsApi } from "../../lib/api";

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

interface Props {
  initialEvents: Event[];
  featuredEvents: Event[];
  statuses: string[];
}

const EventsSectionClient = ({ initialEvents, featuredEvents, statuses }: Props) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [events, setEvents] = useState<Event[]>(initialEvents);
  const [allEvents, setAllEvents] = useState<Event[]>(initialEvents);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const eventsPerPage = 12;

  // Fetch all events once on component mount
  const fetchAllEvents = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const eventsData = await getEventsApi();
      setAllEvents(eventsData);
      setEvents(eventsData);
    } catch (err) {
      console.error('Error fetching events:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch events');
    } finally {
      setLoading(false);
    }
  }, []);

  // Apply client-side filtering
  const applyFilters = useCallback(() => {
    let filteredEvents = [...allEvents];
    
    // If there's a search term, filter by search
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase();
      filteredEvents = filteredEvents.filter((event: Event) => 
        event.title.toLowerCase().includes(searchLower) ||
        event.description.toLowerCase().includes(searchLower) ||
        event.keywords.toLowerCase().includes(searchLower)
      );
    }
    
    // Filter by status
    if (selectedStatus !== "All") {
      filteredEvents = filteredEvents.filter((event: Event) => 
        event.status === selectedStatus
      );
    }
    
    setEvents(filteredEvents);
  }, [allEvents, searchTerm, selectedStatus]);

  useEffect(() => {
    fetchAllEvents();
  }, [fetchAllEvents]);

  useEffect(() => {
    applyFilters();
    setCurrentPage(1);
  }, [applyFilters]);

  // Use the filtered events directly
  const filteredEvents = events;

  const totalPages = Math.ceil(filteredEvents.length / eventsPerPage);

  const paginatedEvents = useMemo(() => {
    const startIndex = (currentPage - 1) * eventsPerPage;
    return filteredEvents.slice(startIndex, startIndex + eventsPerPage);
  }, [filteredEvents, currentPage]);

  const goToPage = useCallback(
    (page: number) => {
      if (page === currentPage || isTransitioning || page < 1 || page > totalPages) return;
      setIsTransitioning(true);
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: "smooth" });
      setTimeout(() => setIsTransitioning(false), 400);
    },
    [currentPage, isTransitioning, totalPages]
  );

  const goToPrevPage = useCallback(() => {
    if (currentPage > 1) goToPage(currentPage - 1);
  }, [currentPage, goToPage]);

  const goToNextPage = useCallback(() => {
    if (currentPage < totalPages) goToPage(currentPage + 1);
  }, [currentPage, totalPages, goToPage]);

  const getPageNumbers = useCallback(() => {
    const maxVisible = 5;
    let pages: (number | string)[] = [];

    if (totalPages <= maxVisible) {
      pages = Array.from({ length: totalPages }, (_, i) => i + 1);
    } else {
      if (currentPage <= 3) {
        pages = [1, 2, 3, 4, "...", totalPages];
      } else if (currentPage >= totalPages - 2) {
        pages = [1, "...", totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
      } else {
        pages = [1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages];
      }
    }
    return pages;
  }, [currentPage, totalPages]);

  const formatDate = (dateTime: string) => {
    const d = new Date(dateTime);
    return d.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const formatTime = (dateTime: string) => {
    const d = new Date(dateTime);
    return d.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "upcoming":
        return "bg-blue-50 text-blue-600 border-blue-200";
      case "ongoing":
        return "bg-green-50 text-green-600 border-green-200";
      case "completed":
        return "bg-gray-50 text-gray-500 border-gray-200";
      default:
        return "bg-gray-50 text-gray-500 border-gray-200";
    }
  };

  return (
    <div className="bg-[#f1f2f4] py-2 sm:py-2 px-2 sm:px-4">
      <section className="min-h-screen bg-white rounded-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <FeaturedEventsSlider
            featuredEvents={featuredEvents}
            formatDate={formatDate}
          />

          <EventFilters
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            selectedStatus={selectedStatus}
            setSelectedStatus={setSelectedStatus}
            statuses={statuses}
          />

          <h2 className="text-2xl font-bold mb-6">
            All Events & Workshops ({filteredEvents.length})
          </h2>

          {loading ? (
            <div className="flex items-center justify-center py-16">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#61503c]"></div>
            </div>
          ) : error ? (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">⚠️</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Error loading events
              </h3>
              <p className="text-gray-600 mb-4">
                {error}
              </p>
              <button
                onClick={fetchAllEvents}
                className="bg-[#61503c] text-white px-6 py-2 rounded-md hover:bg-[#7a5b3e] transition-all duration-200 transform hover:scale-105"
              >
                Try Again
              </button>
            </div>
          ) : filteredEvents.length > 0 ? (
            <div
              className={`transition-opacity duration-200 ${
                isTransitioning ? "opacity-50" : "opacity-100"
              }`}
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {paginatedEvents.map((event) => (
                  <div key={event.id} className="animate-fadeIn">
                    <EventCard
                      event={event}
                      formatDate={formatDate}
                      formatTime={formatTime}
                      getStatusColor={getStatusColor}
                    />
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">📅</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No events found
              </h3>
              <p className="text-gray-600 mb-4">
                Try adjusting your search terms or filters
              </p>
              <button
                onClick={() => {
                  setSearchTerm("");
                  setSelectedStatus("All");
                }}
                className="bg-[#61503c] text-white px-6 py-2 rounded-md hover:bg-[#7a5b3e] transition-all duration-200 transform hover:scale-105"
              >
                Clear Filters
              </button>
            </div>
          )}

          {!loading && !error && totalPages > 1 && (
            <div className="flex flex-col sm:flex-row justify-between items-center mt-8 gap-4">
              <div className="text-sm text-gray-600">
                Showing {(currentPage - 1) * eventsPerPage + 1}-
                {Math.min(currentPage * eventsPerPage, filteredEvents.length)} of{" "}
                {filteredEvents.length} events
              </div>

              <div className="flex justify-center items-center gap-2">
                <button
                  onClick={goToPrevPage}
                  disabled={currentPage === 1 || isTransitioning}
                  className={`flex items-center gap-1 px-3 py-2 rounded-md text-sm font-medium ${
                    currentPage === 1 || isTransitioning
                      ? "text-gray-400 cursor-not-allowed opacity-50"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span className="hidden sm:inline">Previous</span>
                </button>

                <div className="flex gap-1">
                  {getPageNumbers().map((page, i) =>
                    typeof page === "number" ? (
                      <button
                        key={i}
                        onClick={() => goToPage(page)}
                        disabled={isTransitioning}
                        className={`px-3 py-2 rounded-md text-sm font-medium ${
                          currentPage === page
                            ? "bg-[#61503c] text-white shadow-md"
                            : "text-gray-700 hover:bg-gray-100"
                        } ${
                          isTransitioning ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                      >
                        {page}
                      </button>
                    ) : (
                      <span key={i} className="px-2 text-gray-400">
                        …
                      </span>
                    )
                  )}
                </div>

                <button
                  onClick={goToNextPage}
                  disabled={currentPage === totalPages || isTransitioning}
                  className={`flex items-center gap-1 px-3 py-2 rounded-md text-sm font-medium ${
                    currentPage === totalPages || isTransitioning
                      ? "text-gray-400 cursor-not-allowed opacity-50"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <span className="hidden sm:inline">Next</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default EventsSectionClient;
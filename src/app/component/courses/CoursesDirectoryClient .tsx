"use client";
import React, { useState, useMemo, useEffect, useCallback } from "react";
import { Search, Filter, ChevronLeft, ChevronRight } from "lucide-react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import CourseCard from "./CourseCard";
import FiltersSidebar from "./FiltersSidebar";
import { getCoursesApi, searchCoursesApi } from "../../lib/api";
import { Course } from "../../types/course";

interface Props {
  initialCourses: Course[];
  categories: string[];
  categoryMap: { [key: string]: string };
  levels: string[];
}

const CoursesDirectoryClient = ({ initialCourses, categories, categoryMap, levels }: Props) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedLevels, setSelectedLevels] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<string>("");
  const [sortBy, setSortBy] = useState("Latest");
  const [showFilters, setShowFilters] = useState(false);
  const [duration, setDuration] = useState<string>("");
  const [instructor, setInstructor] = useState<string>("");
  const [isMobile, setIsMobile] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [courses, setCourses] = useState<Course[]>(initialCourses);
  const [allCourses, setAllCourses] = useState<Course[]>(initialCourses);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const itemsPerPage = 9;

  const sortOptions = ["Latest", "Price: Low to High", "Price: High to Low"];

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Fetch all courses once on component mount
  const fetchAllCourses = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const coursesData = await getCoursesApi();
      setAllCourses(coursesData);
      setCourses(coursesData);
    } catch (err) {
      console.error('Error fetching courses:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch courses');
    } finally {
      setLoading(false);
    }
  }, []);

  // Apply client-side filtering
  const applyFilters = useCallback(() => {
    let filteredCourses = [...allCourses];
    
    // If there's a search term, filter by search
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase();
      filteredCourses = filteredCourses.filter((course: any) => 
        course.title.toLowerCase().includes(searchLower) ||
        course.description.toLowerCase().includes(searchLower) ||
        course.course_coordinator.toLowerCase().includes(searchLower)
      );
    }
    
    // Filter by categories
    if (selectedCategories.length > 0) {
      filteredCourses = filteredCourses.filter((course: any) => {
        // Convert selected category names to IDs and check if course.category_id matches any
        const selectedCategoryIds = selectedCategories.map(catName => categoryMap[catName]);
        return selectedCategoryIds.includes(course.category_id);
      });
    }
    
    // Filter by levels
    if (selectedLevels.length > 0) {
      filteredCourses = filteredCourses.filter((course: any) => 
        selectedLevels.includes(course.level)
      );
    }
    
    // Filter by price range
    if (priceRange) {
      filteredCourses = filteredCourses.filter((course: any) => {
        const price = parseFloat(course.price);
        switch (priceRange) {
          case "Under ₹100":
            return price >= 0 && price <= 100;
          case "₹100 - ₹250":
            return price > 100 && price <= 250;
          case "₹250 - ₹500":
            return price > 250 && price <= 500;
          case "Above ₹500":
            return price > 500;
          default:
            return true;
        }
      });
    }
    
    // Filter by duration (using lessons as duration indicator)
    if (duration) {
      filteredCourses = filteredCourses.filter((course: any) => {
        const courseDuration = course.lessons || 0;
        switch (duration) {
          case "0-1":
            return courseDuration <= 1;
          case "1-3":
            return courseDuration > 1 && courseDuration <= 3;
          case "3-6":
            return courseDuration > 3 && courseDuration <= 6;
          case "6+":
            return courseDuration > 6;
          default:
            return true;
        }
      });
    }
    
    // Filter by instructor
    if (instructor) {
      filteredCourses = filteredCourses.filter((course: any) => 
        course.course_coordinator === instructor
      );
    }
    
    setCourses(filteredCourses);
  }, [allCourses, searchTerm, selectedCategories, selectedLevels, priceRange, duration, instructor]);

  useEffect(() => {
    fetchAllCourses();
  }, [fetchAllCourses]);

  useEffect(() => {
    applyFilters();
    setCurrentPage(1);
  }, [applyFilters]);

  const toggleCategory = useCallback((c: string) => {
    setSelectedCategories((prev) => (prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]));
  }, []);

  const toggleLevel = useCallback((l: string) => {
    setSelectedLevels((prev) => (prev.includes(l) ? prev.filter((x) => x !== l) : [...prev, l]));
  }, []);

  const clearFilters = useCallback(() => {
    setSelectedCategories([]);
    setSelectedLevels([]);
    setPriceRange("");
    setSearchTerm("");
    setDuration("");
    setInstructor("");
    setCurrentPage(1);
  }, []);

  // Apply client-side sorting to the courses from API
  const sortedCourses = useMemo(() => {
    const sorted = [...courses];
    
    switch (sortBy) {
      case "Price: Low to High":
        return sorted.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
      case "Price: High to Low":
        return sorted.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
      case "Latest":
      default:
        return sorted;
    }
  }, [courses, sortBy]);

  const totalPages = Math.ceil(sortedCourses.length / itemsPerPage);

  const paginatedCourses = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return sortedCourses.slice(start, start + itemsPerPage);
  }, [sortedCourses, currentPage]);

  const goToPage = useCallback((page: number) => {
    if (page === currentPage || isTransitioning || page < 1 || page > totalPages) return;
    setIsTransitioning(true);
    setCurrentPage(page);
    setTimeout(() => setIsTransitioning(false), 300);
  }, [currentPage, isTransitioning, totalPages]);

  const getPageNumbers = useCallback(() => {
    const pages = [];
    const maxVisiblePages = isMobile ? 3 : 5;
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      const sidePages = Math.floor(maxVisiblePages / 2);
      let startPage = Math.max(1, currentPage - sidePages);
      let endPage = Math.min(totalPages, currentPage + sidePages);
      if (endPage - startPage + 1 < maxVisiblePages) {
        if (startPage === 1) endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
        else startPage = Math.max(1, endPage - maxVisiblePages + 1);
      }
      for (let i = startPage; i <= endPage; i++) pages.push(i);
    }
    return pages;
  }, [totalPages, currentPage, isMobile]);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, sortedCourses.length);

  return (
    <div className="bg-[#f1f2f4] py-2 px-2 sm:py-2 sm:px-4 min-h-screen">
      <div className="bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white border-b border-gray-200 px-4 sm:px-6 py-4 sm:py-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Online Courses</h1>
                <p className="text-gray-600 mt-1 text-sm sm:text-base">
                  {sortedCourses.length} courses available
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-3 sm:gap-4">
                <button
                  onClick={() => setShowFilters(true)}
                  className="lg:hidden flex items-center gap-2 bg-gray-100 px-3 sm:px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-200 transition-all"
                >
                  <Filter className="w-4 h-4" />
                  Filters
                </button>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 sm:px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  {sortOptions.map((option) => (
                    <option key={option} value={option}>
                      Sort by {option}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="relative">
              <Search className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 sm:w-5 h-4 sm:h-5" />
              <input
                type="text"
                placeholder="Search courses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-white border border-gray-300 rounded-xl pl-10 sm:pl-12 pr-4 py-3 sm:py-4 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
              />
            </div>
          </div>

          <div className="flex">
            <div className="hidden lg:block">
              <FiltersSidebar
                categories={categories}
                categoryMap={categoryMap}
                levels={levels}
                selectedCategories={selectedCategories}
                selectedLevels={selectedLevels}
                priceRange={priceRange}
                duration={duration}
                instructor={instructor}
                toggleCategory={toggleCategory}
                toggleLevel={toggleLevel}
                setPriceRange={setPriceRange}
                setDuration={setDuration}
                setInstructor={setInstructor}
                clearFilters={clearFilters}
                allCourses={allCourses}
                showFilters={true}
              />
            </div>

            <Dialog open={showFilters} onClose={() => setShowFilters(false)} fullWidth maxWidth="sm">
              <DialogTitle className="flex justify-between items-center border-b">
                <span className="text-lg font-semibold">Filters</span>
                <IconButton onClick={() => setShowFilters(false)} size="small">
                  <CloseIcon />
                </IconButton>
              </DialogTitle>
              <DialogContent dividers sx={{ padding: 2, maxHeight: "70vh" }}>
                <FiltersSidebar
                  categories={categories}
                  categoryMap={categoryMap}
                  levels={levels}
                  selectedCategories={selectedCategories}
                  selectedLevels={selectedLevels}
                  priceRange={priceRange}
                  duration={duration}
                  instructor={instructor}
                  toggleCategory={toggleCategory}
                  toggleLevel={toggleLevel}
                  setPriceRange={setPriceRange}
                  setDuration={setDuration}
                  setInstructor={setInstructor}
                  clearFilters={clearFilters}
                  allCourses={allCourses}
                  showFilters={true}
                />
              </DialogContent>
            </Dialog>

            <div className="flex-1 p-6">
              {loading ? (
                <div className="flex items-center justify-center py-16">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#61503c]"></div>
                </div>
              ) : error ? (
                <div className="text-center py-16">
                  <div className="text-6xl mb-4">⚠️</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Error loading courses
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {error}
                  </p>
                  <button
                    onClick={fetchAllCourses}
                    className="bg-[#61503c] text-white px-6 py-2 rounded-md hover:bg-[#7a5b3e] transition-all duration-200 transform hover:scale-105"
                  >
                    Try Again
                  </button>
                </div>
              ) : paginatedCourses.length > 0 ? (
                <>
                  <div className={`transition-opacity duration-300 ${isTransitioning ? "opacity-50" : "opacity-100"}`}>
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 auto-rows-max">
                      {paginatedCourses.map((course) => (
                        <div key={course.id} className="h-full">
                          <CourseCard course={course} />
                        </div>
                      ))}
                    </div>
                  </div>

                  {totalPages > 1 && (
                    <div className="flex flex-col sm:flex-row justify-between items-center mt-8 gap-4">
                      <div className="text-sm text-gray-600 order-2 sm:order-1">
                        Showing {startIndex + 1}-{endIndex} of {sortedCourses.length} courses
                      </div>
                      <div className="flex justify-center items-center gap-2 order-1 sm:order-2">
                        <button
                          onClick={() => goToPage(currentPage - 1)}
                          disabled={currentPage === 1 || isTransitioning}
                          className={`flex items-center gap-1 px-3 py-2 rounded-md text-sm font-medium ${
                            currentPage === 1 || isTransitioning ? "text-gray-400 cursor-not-allowed opacity-50" : "text-gray-700 hover:bg-gray-100"
                          }`}
                        >
                          <ChevronLeft className="w-4 h-4" />
                          <span className="hidden sm:inline">Previous</span>
                        </button>
                        <div className="flex gap-1">
                          {getPageNumbers().map((pageNum) => (
                            <button
                              key={pageNum}
                              onClick={() => goToPage(pageNum)}
                              disabled={isTransitioning}
                              className={`px-3 py-2 rounded-md text-sm font-medium ${
                                currentPage === pageNum ? "bg-[#61503c] text-white shadow-md" : "text-gray-700 hover:bg-gray-100"
                              } ${isTransitioning ? "opacity-50 cursor-not-allowed" : ""}`}
                            >
                              {pageNum}
                            </button>
                          ))}
                        </div>
                        <button
                          onClick={() => goToPage(currentPage + 1)}
                          disabled={currentPage === totalPages || isTransitioning}
                          className={`flex items-center gap-1 px-3 py-2 rounded-md text-sm font-medium ${
                            currentPage === totalPages || isTransitioning ? "text-gray-400 cursor-not-allowed opacity-50" : "text-gray-700 hover:bg-gray-100"
                          }`}
                        >
                          <span className="hidden sm:inline">Next</span>
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-20">
                  <div className="text-8xl mb-6">📚</div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">No courses found</h3>
                  <p className="text-gray-600 mb-6 max-w-md mx-auto">Try adjusting your filters or search terms.</p>
                  <button
                    onClick={clearFilters}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-lg"
                  >
                    Clear all filters
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoursesDirectoryClient;
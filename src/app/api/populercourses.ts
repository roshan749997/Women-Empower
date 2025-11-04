import { Course } from "../types/course";
import { getCoursesApi } from "../lib/api";

// Fetch popular courses from API
export const getPopularCourses = async (): Promise<Course[]> => {
  try {
    const courses = await getCoursesApi();
    // Since the API returns all courses, we'll consider all of them as popular for now
    // In a real scenario, you might want to filter based on some criteria
    return courses || [];
  } catch (error) {
    console.error('Error fetching popular courses:', error);
    // Return empty array as fallback
    return [];
  }
};
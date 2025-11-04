import { getPopularCourses } from "@/app/api/populercourses";
import { PopularCoursesClient } from '../popularcourses/PopularCoursesClient';
import { Course } from '@/app/types/course';

export const PopularCourses = async () => {
  // Fetch data on the server
  let popularCourses: Course[] = [];
  let error: string | null = null;

  try {
    popularCourses = await getPopularCourses();
  } catch (err) {
    console.error('Error fetching popular courses:', err);
    error = err instanceof Error ? err.message : 'Failed to fetch popular courses';
  }

  return (
    <div className="bg-[#f1f2f4] py-2 px-4">
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 sm:py-4 bg-[#f6f0e3] rounded-lg">
        {/* Title */}
        <div className="mb-6 text-left">
          <h2 className="text-black text-3xl font-bold">Popular Courses</h2>
        </div>

        {error ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">⚠️</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Error loading popular courses
            </h3>
            <p className="text-gray-600 mb-4">
              {error}
            </p>
            <a
              href="/"
              className="inline-block bg-[#61503c] text-white px-6 py-2 rounded-md hover:bg-[#7a5b3e] transition-all duration-200 transform hover:scale-105"
            >
              Try Again
            </a>
          </div>
        ) : popularCourses.length > 0 ? (
          <PopularCoursesClient courses={popularCourses} />
        ) : (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📚</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No popular courses found
            </h3>
            <p className="text-gray-600">
              Check back later for popular courses!
            </p>
          </div>
        )}
      </section>
    </div>
  );
};
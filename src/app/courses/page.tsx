// app/courses/page.tsx (Server Component)
import CoursesDirectoryClient from "../component/courses/CoursesDirectoryClient ";
import { getCoursesApi, getCategoriesApi } from "../lib/api";
import { Course } from "../types/course";

async function getCourses(): Promise<{
  courses: Course[];
  categories: string[];
  categoryMap: { [key: string]: string };
  levels: string[];
}> {
  try {
    // Fetch courses from API get all cource data
    const courses = await getCoursesApi();
    
    // Fetch categories for filtering
    const categoriesData = await getCategoriesApi();
    const categories: string[] = (categoriesData?.map((cat: any) => cat.name).filter(Boolean) || []) as string[];
    
    // Create a mapping from category name to category ID
    const categoryMap: { [key: string]: string } = {};
    categoriesData?.forEach((cat: any) => {
      if (cat.name && cat.id) {
        categoryMap[cat.name] = cat.id;
      }
    });
    
    // Extract unique levels from courses
    const levels: string[] = [...new Set(courses.map((course: any) => course.level).filter(Boolean))] as string[];
    
    return {
      courses: courses || [],
      categories,
      categoryMap,
      levels
    };
  } catch (error) {
    console.error('Error fetching courses:', error);
    return {
      courses: [],
      categories: [],
      categoryMap: {},
      levels: []
    };
  }
}

export default async function CoursesPage() {
  const coursesData = await getCourses();

  return (
    <CoursesDirectoryClient 
      initialCourses={coursesData.courses}
      categories={coursesData.categories}
      categoryMap={coursesData.categoryMap}
      levels={coursesData.levels}
    />
  );
}

// Optional: Generate metadata
export const metadata = {
  title: 'Online Courses | Learning Platform',
  description: 'Browse our collection of online courses and start learning today',
};
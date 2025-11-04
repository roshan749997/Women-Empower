// app/api/courses/route.ts
import { NextResponse } from 'next/server';

export interface Course {
  id: string;
  thumbnail: string;
  course_coordinator: string;
  category_id: string;
  title: string;
  description: string;
  lessons: number;
  level: string;
  price: string;
  discount: number;
}

// Mock database - Replace with actual database calls
const courses: Course[] = [
  {
    id: "1",
    thumbnail: "/images/treditional.png",
    course_coordinator: "Sarah Johnson",
    category_id: "web-design",
    title: "Web Design Fundamentals",
    description: "Learn modern web design principles and create beautiful responsive websites.",
    lessons: 18,
    level: "beginner",
    price: "99.99",
    discount: 10
  },
  {
    id: "2",
    thumbnail: "/images/treditional.png",
    course_coordinator: "John Smith",
    category_id: "programming",
    title: "JavaScript Masterclass",
    description: "Master JavaScript from basics to advanced concepts including ES6+, async programming, and more.",
    lessons: 25,
    level: "intermediate",
    price: "149.99",
    discount: 20
  },
  {
    id: "3",
    thumbnail: "/images/treditional.png",
    course_coordinator: "Emily Chen",
    category_id: "design",
    title: "UI/UX Design Principles",
    description: "Learn user interface and user experience design principles to create amazing digital products.",
    lessons: 15,
    level: "beginner",
    price: "129.99",
    discount: 15
  },
  {
    id: "4",
    thumbnail: "/images/treditional.png",
    course_coordinator: "Prof. Alan Turing",
    category_id: "programming",
    title: "Advanced Python Programming",
    description: "Dive deep into advanced Python topics like generators, decorators, multithreading, and performance optimization.",
    lessons: 20,
    level: "advance",
    price: "249.50",
    discount: 15
  },
  {
    id: "5",
    thumbnail: "/images/treditional.png",
    course_coordinator: "Maria Garcia",
    category_id: "rangoli",
    title: "Traditional Rangoli Art",
    description: "Discover the beautiful art of Rangoli and learn traditional patterns and modern techniques.",
    lessons: 12,
    level: "beginner",
    price: "79.99",
    discount: 5
  },
  {
    id: "6",
    thumbnail: "/images/treditional.png",
    course_coordinator: "David Lee",
    category_id: "web-design",
    title: "Responsive Web Design",
    description: "Create websites that work perfectly on all devices using modern CSS techniques and frameworks.",
    lessons: 22,
    level: "intermediate",
    price: "189.99",
    discount: 25
  }
];

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    
    const search = searchParams.get('search')?.toLowerCase() || '';
    const categories = searchParams.get('categories')?.split(',').filter(Boolean) || [];
    const levels = searchParams.get('levels')?.split(',').filter(Boolean) || [];
    const priceRange = searchParams.get('priceRange') || '';
    const sortBy = searchParams.get('sortBy') || 'Latest';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '9');

    // Filter courses
    let filtered = courses.filter((course) => {
      const matchesSearch =
        course.title.toLowerCase().includes(search) ||
        course.course_coordinator.toLowerCase().includes(search) ||
        course.description.toLowerCase().includes(search);

      const matchesCategory = categories.length === 0 || categories.includes(course.category_id);
      const matchesLevel = levels.length === 0 || levels.includes(course.level);

      let matchesPrice = true;
      if (priceRange) {
        const price = parseFloat(course.price);
        if (priceRange === "Under ₹100") matchesPrice = price < 100;
        else if (priceRange === "₹100 - ₹250") matchesPrice = price >= 100 && price <= 250;
        else if (priceRange === "₹250 - ₹500") matchesPrice = price >= 250 && price <= 500;
        else if (priceRange === "Above ₹500") matchesPrice = price > 500;
      }

      return matchesSearch && matchesCategory && matchesLevel && matchesPrice;
    });

    // Sort courses
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "Price: Low to High":
          return parseFloat(a.price) - parseFloat(b.price);
        case "Price: High to Low":
          return parseFloat(b.price) - parseFloat(a.price);
        case "Latest":
        default:
          return 0;
      }
    });

    // Pagination
    const total = filtered.length;
    const totalPages = Math.ceil(total / limit);
    const start = (page - 1) * limit;
    const paginatedCourses = filtered.slice(start, start + limit);

    return NextResponse.json({
      success: true,
      data: paginatedCourses,
      pagination: {
        page,
        limit,
        total,
        totalPages
      },
      filters: {
        categories: [...new Set(courses.map(c => c.category_id))],
        levels: [...new Set(courses.map(c => c.level))]
      }
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch courses' },
      { status: 500 }
    );
  }
}
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
  isPopular?: boolean;
}

export interface CourseApiResponse {
  success: boolean;
  message: string;
  data: Course[];
}

export interface CourseFilterRequest {
  categories?: string[];
  levels?: string[];
  priceRange?: {
    min: number;
    max: number;
  };
}
// types/course.ts
export interface Course {
  id: string;
  thumbnail: string;
  courseName: string;
  coordinator: string;
  category: string;
  title: string;
  description: string;
  lessons: number;
  level: 'Beginner' | 'Intermediate' | 'Expert';
  price: number;
  discount: number;
}

export type ModalMode = 'add' | 'edit' | 'view';

export const CATEGORIES = [
  'Rangoli',
  'Spiritual',
  'Resin',
  'Shubh Labh',
  'Lapdesk',
  'Diya & Thali Decor',
  'Gift'
] as const;

export const LEVELS = ['Beginner', 'Intermediate', 'Expert'] as const;
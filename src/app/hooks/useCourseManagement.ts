// hooks/useCourseManagement.ts
'use client';
import { useState } from 'react';
import { Course,ModalMode } from '../types/dashboardcoursetab'; 
import { generateCourseId,readFileAsDataURL } from '../lib/utils/dashboardcourse-utils';
import { deleteCourse } from '../lib/api';
import { createCourse, getCategoriesApi } from '../lib/api';
import { updateCourse } from '../lib/api';

const STATIC_COURSE_THUMBNAIL = 'https://example.com/thumbnails/course-image.jpg';

export const useCourseManagement = (initialCourses: Course[]) => {
  const [courses, setCourses] = useState<Course[]>(initialCourses);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<ModalMode>('add');
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string>('');

  const [formData, setFormData] = useState<Course>({
    id: '',
    thumbnail: '',
    courseName: '',
    coordinator: '',
    category: '',
    title: '',
    description: '',
    lessons: 0,
    level: 'Beginner',
    price: 0,
    discount: 0
  });

  const openModal = (mode: ModalMode, course?: Course) => {
    setModalMode(mode);
    if (course) {
      setFormData(course);
      setThumbnailPreview(course.thumbnail);
    } else {
      setFormData({
        id: generateCourseId(),
        thumbnail: '',
        courseName: '',
        coordinator: '',
        category: '',
        title: '',
        description: '',
        lessons: 0,
        level: 'Beginner',
        price: 0,
        discount: 0
      });
      setThumbnailPreview('');
    }
    setThumbnailFile(null);
    setIsModalOpen(true);
    setOpenMenuId(null);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setThumbnailFile(null);
    setThumbnailPreview('');
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setThumbnailFile(file);
      const dataURL = await readFileAsDataURL(file);
      setThumbnailPreview(dataURL);
      setFormData({ ...formData, thumbnail: dataURL });
    }
  };

  const handleImageRemove = () => {
    setThumbnailFile(null);
    setThumbnailPreview('');
    setFormData({ ...formData, thumbnail: '' });
  };

  const handleSave = async () => {
    if (!formData.courseName || !formData.coordinator || !formData.category) {
      alert('Please fill all required fields');
      return;
    }

    if (modalMode === 'add') {
      try {
        const categories = await getCategoriesApi();
        const found = (categories || []).find((c: { id: string; name: string }) => c.name === formData.category);
        const categoryId = found?.id || '';
        if (!categoryId) {
          alert('Please select a valid category');
          return;
        }
        const payload = {
          // Send the selected preview (data URL) so API helper uploads to R2 and sends only the key
          thumbnail: thumbnailPreview || formData.thumbnail || '',
          course_coordinator: formData.coordinator,
          category_id: categoryId,
          title: formData.title || formData.courseName,
          description: formData.description,
          lessons: Number(formData.lessons) || 0,
          level: formData.level === 'Expert' ? 'advance' : String(formData.level || '').toLowerCase(),
          price: String(formData.price),
          discount: Number(formData.discount) || 0,
        };
        const created = await createCourse(payload);
        const mapped: Course = {
          id: created.id,
          thumbnail: created.thumbnail,
          courseName: created.title,
          coordinator: created.course_coordinator,
          category: found?.name || formData.category,
          title: created.title,
          description: created.description,
          lessons: Number(created.lessons) || 0,
          level: (created.level || '').toLowerCase() === 'advance' ? 'Expert' : (created.level || 'Beginner'),
          price: Number(created.price) || 0,
          discount: Number(created.discount) || 0,
        };
        setCourses([...courses, mapped]);
        closeModal();
      } catch (e) {
        console.error('Failed to create course', e);
        alert('Failed to create course. Please try again.');
      }
    } else if (modalMode === 'edit') {
      try {
        const categories = await getCategoriesApi();
        const found = (categories || []).find((c: { id: string; name: string }) => c.name === formData.category);
        const categoryId = found?.id || '';
        if (!categoryId) {
          alert('Please select a valid category');
          return;
        }
        const payload = {
          thumbnail: thumbnailPreview || formData.thumbnail || '',
          course_coordinator: formData.coordinator,
          category_id: categoryId,
          title: formData.title || formData.courseName,
          description: formData.description,
          lessons: Number(formData.lessons) || 0,
          level: formData.level === 'Expert' ? 'advance' : String(formData.level || '').toLowerCase(),
          price: String(formData.price),
          discount: Number(formData.discount) || 0,
        };
        const updated = await updateCourse(formData.id, payload);
        const mapped: Course = {
          id: updated.id,
          thumbnail: updated.thumbnail,
          courseName: updated.title,
          coordinator: updated.course_coordinator,
          category: found?.name || formData.category,
          title: updated.title,
          description: updated.description,
          lessons: Number(updated.lessons) || 0,
          level: (updated.level || '').toLowerCase() === 'advance' ? 'Expert' : (updated.level || 'Beginner'),
          price: Number(updated.price) || 0,
          discount: Number(updated.discount) || 0,
        };
        setCourses(courses.map(c => c.id === formData.id ? mapped : c));
        closeModal();
      } catch (e) {
        console.error('Failed to update course', e);
        const msg = (e as any)?.message || 'Failed to update course. Please try again.';
        alert(msg);
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      try {
        await deleteCourse(id);
        setCourses(courses.filter(c => c.id !== id));
      } catch (e) {
        console.error('Failed to delete course', e);
        alert('Failed to delete course. Please try again.');
      }
      setOpenMenuId(null);
    }
  };

  const toggleMenu = (id: string) => {
    setOpenMenuId(openMenuId === id ? null : id);
  };

  return {
    courses,
    setCourses,
    isModalOpen,
    modalMode,
    openMenuId,
    formData,
    thumbnailPreview,
    openModal,
    closeModal,
    handleImageChange,
    handleImageRemove,
    handleSave,
    handleDelete,
    toggleMenu,
    setFormData
  };
};

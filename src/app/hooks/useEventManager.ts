'use client';
import { useState } from 'react';
import { generateEventId, readImageAsDataURL } from '../lib/utils/dashboardevent-utils';
import type { Event, EventFormData } from '../types/dashboardeventtab'; 
import { updateEventV1, createEventV1, getCategoriesApi, deleteEventV1 } from '../lib/api';
import { useEffect } from 'react';

type ModalMode = 'add' | 'edit';

export const useEventManager = (initialEvents: Event[]) => {
  const [events, setEvents] = useState<Event[]>(initialEvents);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<ModalMode>('add');
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string>('');
  const [bannerPreview, setBannerPreview] = useState<string>('');
  const [formData, setFormData] = useState<EventFormData>({
    thumbnail: '',
    category: '',
    title: '',
    description: '',
    dateTime: '',
    status: 'upcoming',
    keywords: [],
    banner: ''
  });
  const [categoryOptions, setCategoryOptions] = useState<Array<{ id: string; name: string }>>([]);

  useEffect(() => {
    (async () => {
      try {
        const cats = await getCategoriesApi();
        setCategoryOptions(Array.isArray(cats) ? cats : []);
      } catch (e) {
        console.error('Failed to load categories', e);
      }
    })();
  }, []);

  const resetForm = () => {
    setFormData({
      thumbnail: '',
      category: '',
      title: '',
      description: '',
      dateTime: '',
      status: 'upcoming',
      keywords: [],
      banner: ''
    });
    setThumbnailPreview('');
    setBannerPreview('');
  };

  const openModal = (mode: ModalMode, event?: Event) => {
    setModalMode(mode);
    if (event) {
      setSelectedEvent(event);
      setFormData(event);
      setThumbnailPreview(event.thumbnail);
      setBannerPreview(event.banner || '');
    } else {
      setSelectedEvent(null);
      resetForm();
    }
    setIsModalOpen(true);
    setActiveDropdown(null);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedEvent(null);
    resetForm();
  };

  const handleImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    type: 'thumbnail' | 'banner'
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const result = await readImageAsDataURL(file);
        if (type === 'thumbnail') {
          setThumbnailPreview(result);
          setFormData({ ...formData, thumbnail: result });
        } else {
          setBannerPreview(result);
          setFormData({ ...formData, banner: result });
        }
      } catch (error) {
        console.error('Error uploading image:', error);
      }
    }
  };

  const handleAdd = async () => {
    try {
      // Resolve category_id from selected category (accepts id or name)
      const resolvedCategoryId = (() => {
        const raw = String(formData.category || '');
        const found = categoryOptions.find(c => c.id === raw || c.name === raw);
        return found?.id || raw;
      })();

      const payload = {
        e_image: String(formData.thumbnail || ''),
        category_id: resolvedCategoryId,
        title: String(formData.title || ''),
        description: String(formData.description || ''),
        date_time: String(formData.dateTime || ''),
        status: String(formData.status || 'upcoming'),
        keywords: Array.isArray(formData.keywords) ? formData.keywords.join(',') : String((formData as any).keywords || ''),
        banner: String(formData.banner || ''),
      };
      const created = await createEventV1(payload);
      const categoryName = categoryOptions.find(c => c.id === (created.category_id || payload.category_id))?.name || (created.category_id || payload.category_id);
      const newEvent: Event = {
        id: created.id || generateEventId(),
        thumbnail: created.e_image || payload.e_image,
        category: categoryName,
        title: created.title || payload.title,
        description: created.description || payload.description,
        dateTime: created.date_time || payload.date_time,
        status: created.status || payload.status,
        keywords: typeof created.keywords === 'string' ? created.keywords.split(',').map((k: string) => k.trim()).filter(Boolean) : Array.isArray(created.keywords) ? created.keywords : (Array.isArray(formData.keywords) ? formData.keywords : []),
        banner: created.banner || payload.banner,
      };
      setEvents([...events, newEvent]);
      closeModal();
    } catch (err) {
      console.error('Failed to create event', err);
      alert((err as any)?.message || 'Failed to create event');
    }
  };

  const handleEdit = async () => {
    if (selectedEvent) {
      try {
        // Map dashboard form to API payload
        const categoryId = categoryOptions.find(c => c.name === formData.category)?.id || formData.category || '';
        const payload = {
          e_image: formData.thumbnail || '',
          category_id: categoryId,
          title: formData.title || '',
          description: formData.description || '',
          date_time: formData.dateTime || '',
          status: formData.status || 'upcoming',
          keywords: Array.isArray(formData.keywords) ? formData.keywords.join(',') : (formData.keywords as any) || '',
          banner: formData.banner || '',
        };
        const updated = await updateEventV1(selectedEvent.id, payload);
        const categoryName = categoryOptions.find(c => c.id === (updated.category_id || payload.category_id))?.name || (updated.category_id || payload.category_id);
        const normalized: Event = {
          id: updated.id || selectedEvent.id,
          thumbnail: updated.e_image || payload.e_image,
          category: categoryName,
          title: updated.title || payload.title,
          description: updated.description || payload.description,
          dateTime: updated.date_time || payload.date_time,
          status: updated.status || payload.status,
          keywords: typeof updated.keywords === 'string' ? updated.keywords.split(',').map((k: string) => k.trim()).filter(Boolean) : Array.isArray(updated.keywords) ? updated.keywords : (Array.isArray(formData.keywords) ? formData.keywords : []),
          banner: updated.banner || payload.banner,
        };
        setEvents(
          events.map((e) => (e.id === selectedEvent.id ? normalized : e))
        );
        closeModal();
      } catch (err) {
        console.error('Failed to update event', err);
        alert((err as any)?.message || 'Failed to update event');
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this event?')) {
      try {
        await deleteEventV1(id);
        setEvents(events.filter((e) => e.id !== id));
        setActiveDropdown(null);
      } catch (err) {
        console.error('Failed to delete event', err);
        alert((err as any)?.message || 'Failed to delete event');
      }
    }
  };

  const handleSubmit = () => {
    if (modalMode === 'add') {
      handleAdd();
    } else {
      handleEdit();
    }
  };

  return {
    events,
    isModalOpen,
    modalMode,
    selectedEvent,
    activeDropdown,
    thumbnailPreview,
    bannerPreview,
    formData,
    setFormData,
    setThumbnailPreview,
    setBannerPreview,
    setActiveDropdown,
    openModal,
    closeModal,
    handleImageUpload,
    handleSubmit,
    handleDelete,
    categoryOptions
  };
};
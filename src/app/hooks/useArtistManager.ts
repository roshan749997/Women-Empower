// hooks/useArtistManager.ts
'use client';
import { useEffect, useState } from 'react';
import { Artist,ModalType, ArtistFormData  } from '../types/dashboard-artist-tab';
import { validateFormData, readFileAsDataURL, buildR2PublicUrl  } from '../lib/utils/dashboardartist-utils';
import { createArtist, updateArtist, deleteArtist, getCategoriesApi } from '../lib/api';

const initialFormData: ArtistFormData = {
  artist_name: '',
  category: '',
  intro: '',
  joining_date: '',
  experience: '',
  image: ''
};

export function useArtistManager(initialArtists: Artist[]) {
  const [artists, setArtists] = useState<Artist[]>(initialArtists);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<ModalType>('create');
  const [selectedArtist, setSelectedArtist] = useState<Artist | null>(null);
  const [formData, setFormData] = useState<ArtistFormData>(initialFormData);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [openDropdownId, setOpenDropdownId] = useState<number | null>(null);
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

  const openModal = (type: ModalType, artist?: Artist) => {
    setModalType(type);
    if (artist) {
      setSelectedArtist(artist);
      const normalizedDate = (() => {
        const raw = artist.joining_date || '';
        // Expect input type=date as YYYY-MM-DD
        if (!raw) return '';
        if (raw.includes('T')) return raw.split('T')[0];
        if (raw.includes(' ')) return raw.split(' ')[0];
        return raw.length >= 10 ? raw.slice(0, 10) : raw;
      })();
      setFormData({
        artist_name: artist.artist_name,
        category: artist.category,
        category_id: artist.category_id,
        intro: artist.intro,
        joining_date: normalizedDate,
        experience: artist.experience,
        image: artist.image || ''
      });
      setImagePreview(artist.image || '');
    } else {
      setSelectedArtist(null);
      setFormData(initialFormData);
      setImagePreview('');
    }
    setIsModalOpen(true);
    setOpenDropdownId(null);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedArtist(null);
    setFormData(initialFormData);
    setImagePreview('');
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const dataUrl = await readFileAsDataURL(file);
        setImagePreview(dataUrl);
        setFormData({ ...formData, image: dataUrl });
      } catch (error) {
        console.error('Error reading file:', error);
      }
    }
  };

  const handleFormChange = (data: Partial<ArtistFormData>) => {
    setFormData({ ...formData, ...data });
  };

  const handleSubmit = async () => {
    if (modalType === 'create') {
      try {
        const found = categoryOptions.find((c) => (formData.category_id ? c.id === formData.category_id : c.name === formData.category));
        const categoryId = found?.id || '';
        if (!categoryId) {
          alert('Please select a valid category.');
          return;
        }
        const created = await createArtist({
          artist_Name: formData.artist_name,
          category_id: categoryId,
          introduction: formData.intro,
          experience: Number(formData.experience),
          imageData: formData.image, // base64 string -> uploaded to R2, DB stores key
        });
        const newArtist: Artist = {
          id: created.id,
          artist_name: created.artist_Name,
          category: found?.name || '',
          category_id: created.category_id,
          intro: created.introduction,
          joining_date: created.joining_date || formData.joining_date || '',
          experience: Number(created.experience),
          image: buildR2PublicUrl(created.artist_profile_pic) || imagePreview
        };
        setArtists([...artists, newArtist]);
      } catch (e) {
        console.error('Failed to create artist', e);
        alert('Failed to create artist. Please try again.');
      }
    } else if (modalType === 'edit' && selectedArtist) {
      try {
        const found = categoryOptions.find((c) => (formData.category_id ? c.id === formData.category_id : c.name === formData.category));
        const categoryId = found?.id || selectedArtist.category_id || '';
        if (!categoryId) {
          alert('Please select a valid category.');
          return;
        }
        const updatedServer = await updateArtist(String(selectedArtist.id), {
          artist_Name: formData.artist_name,
          category_id: categoryId,
          introduction: formData.intro,
          experience: Number(formData.experience),
          imageData: formData.image, // if user picked new image (data URL) it will upload
        });
        const updatedLocal: Artist = {
          id: updatedServer.id,
          artist_name: updatedServer.artist_Name,
          category: found?.name || selectedArtist.category,
          category_id: updatedServer.category_id,
          intro: updatedServer.introduction,
          joining_date: updatedServer.joining_date || selectedArtist.joining_date,
          experience: Number(updatedServer.experience),
          image: buildR2PublicUrl(updatedServer.artist_profile_pic) || selectedArtist.image
        };
        setArtists(artists.map(artist => 
          artist.id === selectedArtist.id 
            ? updatedLocal
            : artist
        ));
      } catch (e) {
        console.error('Failed to update artist', e);
        alert('Failed to update artist. Please try again.');
        setArtists(artists.map(artist => 
          artist.id === selectedArtist.id 
            ? { ...artist, ...formData, experience: Number(formData.experience) }
            : artist
        ));
      }
    }
    closeModal();
  };

  const handleDelete = async (id: string | number) => {
    const idStr = String(id);
    if (confirm('Are you sure you want to delete this artist?')) {
      try {
        await deleteArtist(idStr);
        setArtists(artists.filter(artist => String(artist.id) !== idStr));
      } catch (e) {
        console.error('Failed to delete artist', e);
      }
    }
    setOpenDropdownId(null as unknown as number | null);
  };

  const toggleDropdown = (id: string | number) => {
    const next = String(openDropdownId) === String(id) ? null : (id as unknown as number);
    setOpenDropdownId(next);
  };

  const isFormValid = validateFormData(formData);

  return {
    artists,
    isModalOpen,
    modalType,
    selectedArtist,
    formData,
    imagePreview,
    openDropdownId,
    isFormValid,
    categoryOptions,
    openModal,
    closeModal,
    handleImageUpload,
    handleFormChange,
    handleSubmit,
    handleDelete,
    toggleDropdown
  };
}

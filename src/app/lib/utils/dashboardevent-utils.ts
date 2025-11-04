// utils/event.utils.ts
import { STATUS_COLORS } from "@/app/data/dashboardeventsdata";
import type { Event } from '@/app/types/dashboardeventtab';

export const getStatusColor = (status: Event['status']): string => {
  return STATUS_COLORS[status] || 'bg-gray-500';
};

export const formatEventDateTime = (dateTime: string): string => {
  return new Date(dateTime).toLocaleString('en-IN', {
    dateStyle: 'medium',
    timeStyle: 'short'
  });
};

export const formatEventDateTimeFull = (dateTime: string): string => {
  return new Date(dateTime).toLocaleString('en-IN');
};

export const readImageAsDataURL = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

export const generateEventId = (): string => {
  return Date.now().toString();
};
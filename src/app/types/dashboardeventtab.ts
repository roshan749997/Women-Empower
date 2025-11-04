// types/event.types.ts
export interface Event {
  id: string;
  thumbnail: string;
  category: string;
  title: string;
  description: string;
  dateTime: string;
  status: 'upcoming' | 'completed' | 'ongoing';
  keywords: string[];
  banner?: string;
}

export type ModalMode = 'add' | 'edit' | 'view';

export interface EventFormData extends Partial<Event> {}
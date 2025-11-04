// lib/utils/artist-utils.ts
import { ArtistFormData } from "@/app/types/dashboard-artist-tab";

export function formatDate(dateString: string, locale: string = 'en-IN'): string {
  return new Date(dateString).toLocaleDateString(locale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

export function formatDateLong(dateString: string, locale: string = 'en-IN'): string {
  return new Date(dateString).toLocaleDateString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

export function validateFormData(formData: ArtistFormData): boolean {
  return !!(
    formData.artist_name &&
    formData.category &&
    formData.intro &&
    formData.joining_date &&
    formData.experience
  );
}

export function getInitials(name: string): string {
  return name.charAt(0).toUpperCase();
}

export function readFileAsDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// If backend stores only R2 object keys, build a usable public URL for rendering
export function buildR2PublicUrl(possibleKeyOrUrl?: string | null): string {
  if (!possibleKeyOrUrl) return '';
  const val = String(possibleKeyOrUrl);
  if (/^https?:\/\//i.test(val)) return val; // already a URL
  const base = process.env.NEXT_PUBLIC_R2_PUBLIC_BASE;
  if (base) return `${base.replace(/\/$/, '')}/${val.replace(/^\//, '')}`;
  // Fallback: return the key (caller can decide to handle via signed URL if needed)
  return val;
}

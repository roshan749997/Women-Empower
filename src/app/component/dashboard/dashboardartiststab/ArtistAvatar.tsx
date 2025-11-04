"use client";
// components/artist/ArtistAvatar.tsx
import { useEffect, useMemo, useState } from 'react';
import { User } from 'lucide-react';
import { buildR2PublicUrl } from '@/app/lib/utils/dashboardartist-utils';
import { getFromR2 } from '@/app/lib/utils/r2Client';

interface ArtistAvatarProps {
  image?: string;
  name: string;
  size?: 'sm' | 'md' | 'lg';
}

export default function ArtistAvatar({ image, name, size = 'md' }: ArtistAvatarProps) {
  const sizeClasses = {
    sm: 'h-10 w-10',
    md: 'h-32 w-32',
    lg: 'h-40 w-40'
  };

  const iconSizes = {
    sm: 16,
    md: 48,
    lg: 64
  };

  const [resolvedSrc, setResolvedSrc] = useState<string | null>(null);
  const [finalSrc, setFinalSrc] = useState<string | null>(null);
  const isHttpUrl = (val?: string) => !!val && /^https?:\/\//i.test(val);

  const candidate = useMemo(() => {
    if (!image) return '';
    if (isHttpUrl(image)) return image;
    // try to build from env public base
    return buildR2PublicUrl(image);
  }, [image]);

  useEffect(() => {
    let cancelled = false;
    async function run() {
      if (!candidate) {
        setResolvedSrc(null);
        setFinalSrc(null);
        return;
      }
      if (isHttpUrl(candidate)) {
        setResolvedSrc(candidate);
        setFinalSrc(candidate);
        return;
      }
      // candidate is still a key (no public base), fetch a signed access URL
      try {
        const url = await getFromR2(candidate);
        if (!cancelled) {
          setResolvedSrc(url);
          setFinalSrc(url);
        }
      } catch {
        if (!cancelled) {
          setResolvedSrc(null);
          setFinalSrc(null);
        }
      }
    }
    run();
    return () => { cancelled = true; };
  }, [candidate]);

  // On error, try falling back to a signed URL even if we initially used a public base
  const handleError = async () => {
    try {
      const base = (typeof process !== 'undefined' && process.env && (process.env.NEXT_PUBLIC_R2_PUBLIC_BASE as string)) || '';
      const looksLikeKey = !!image && !isHttpUrl(image);
      const isFromBase = !!base && typeof finalSrc === 'string' && finalSrc.startsWith(base);
      let key: string | null = null;
      if (looksLikeKey) key = String(image);
      else if (isFromBase && finalSrc) {
        const escaped = base.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
        key = finalSrc.replace(new RegExp('^' + escaped + '/?'), '');
      }
      if (key) {
        const url = await getFromR2(key);
        if (url && url !== finalSrc) {
          setFinalSrc(url);
          return;
        }
      }
    } catch {}
    // If still failing, component will render icon
  };

  return (
    <div className={`${sizeClasses[size]} rounded-full overflow-hidden bg-blue-100 flex items-center justify-center`}>
      {finalSrc ? (
        <img
          src={finalSrc}
          alt={name}
          onError={handleError}
          className="h-full w-full object-cover"
        />
      ) : (
        <User size={iconSizes[size]} className="text-blue-600" />
      )}
    </div>
  );
}

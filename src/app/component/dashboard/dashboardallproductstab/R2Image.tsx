"use client";
import { useEffect, useMemo, useState } from "react";
import { buildR2PublicUrl } from "@/app/lib/utils/dashboardartist-utils";
import { getFromR2 } from "@/app/lib/utils/r2Client";

interface R2ImageProps {
  src?: string;
  alt?: string;
  className?: string;
  fallbackSrc?: string;
}

// Treat http(s), data URLs and blob URLs as directly renderable
const isDirectUrl = (val?: string) => !!val && /^(https?:|data:|blob:)/i.test(val);

export default function R2Image({ src, alt = "", className = "", fallbackSrc = "" }: R2ImageProps) {
  const [resolved, setResolved] = useState<string | null>(null);
  const [finalSrc, setFinalSrc] = useState<string>(fallbackSrc || "");

  const candidate = useMemo(() => {
    if (!src) return "";
    if (isDirectUrl(src)) return src;
    return buildR2PublicUrl(src);
  }, [src]);

  useEffect(() => {
    let cancelled = false;
    async function resolve() {
      if (!candidate) {
        setResolved(null);
        setFinalSrc(fallbackSrc || "");
        return;
      }
      if (isDirectUrl(candidate)) {
        setResolved(candidate);
        setFinalSrc(candidate);
        return;
      }
      try {
        const url = await getFromR2(candidate);
        if (!cancelled) {
          setResolved(url);
          setFinalSrc(url);
        }
      } catch {
        if (!cancelled) {
          setResolved(null);
          setFinalSrc(fallbackSrc || "");
        }
      }
    }
    resolve();
    return () => { cancelled = true; };
  }, [candidate, fallbackSrc]);
  const handleError = async () => {
    try {
      const base = (typeof process !== 'undefined' && process.env && (process.env.NEXT_PUBLIC_R2_PUBLIC_BASE as string)) || '';
      const looksLikeKey = !!src && !isDirectUrl(src);
      const isFromBase = !!base && typeof finalSrc === 'string' && finalSrc.startsWith(base);
      let key: string | null = null;
      if (looksLikeKey) key = String(src);
      else if (isFromBase) {
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
    if (fallbackSrc && finalSrc !== fallbackSrc) {
      setFinalSrc(fallbackSrc);
    }
  };

  if (!finalSrc) return <div className={className} />;
  return (
    <img
      src={finalSrc}
      alt={alt}
      className={className}
      loading="lazy"
      referrerPolicy="no-referrer"
      onError={handleError}
    />
  );
}

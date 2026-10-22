import React, { useState, useEffect, useRef } from 'react';

interface FoodImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src?: string;
  alt: string;
  className?: string;
  fallbackSrc?: string;
  /** Set true for above-the-fold images to load eagerly with high priority */
  priority?: boolean;
}

const DEFAULT_FALLBACK =
  'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=75';

/**
 * Optimise an Unsplash URL for the given target width & quality.
 * Non-Unsplash URLs are returned unchanged.
 */
function optimiseUrl(url: string, width = 600, quality = 78): string {
  if (!url) return url;
  try {
    const u = new URL(url);
    if (
      u.hostname === 'images.unsplash.com' ||
      u.hostname.endsWith('.unsplash.com')
    ) {
      u.searchParams.set('w', String(width));
      u.searchParams.set('q', String(quality));
      u.searchParams.set('auto', 'format');
      u.searchParams.set('fit', 'crop');
      return u.toString();
    }
  } catch {
    // not a valid URL — return as-is
  }
  return url;
}

export const FoodImage: React.FC<FoodImageProps> = ({
  src,
  alt,
  className = '',
  fallbackSrc = DEFAULT_FALLBACK,
  priority = false,
  ...rest
}) => {
  const optimisedSrc = optimiseUrl(src || fallbackSrc);
  const optimisedFallback = optimiseUrl(fallbackSrc);

  const [imgSrc, setImgSrc] = useState<string>(optimisedSrc);
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  // Sync when the src prop changes externally
  useEffect(() => {
    const next = optimiseUrl(src || fallbackSrc);
    setImgSrc(next);
    setHasError(false);
    // If browser already cached it, onLoad won't fire — detect via .complete
    setIsLoaded(false);
  }, [src]);

  // Detect already-cached images so shimmer disappears immediately
  useEffect(() => {
    if (imgRef.current?.complete && imgRef.current.naturalWidth > 0) {
      setIsLoaded(true);
    }
  });

  const handleError = () => {
    if (!hasError) {
      setHasError(true);
      setImgSrc(optimisedFallback);
    }
  };

  return (
    <div className={`relative overflow-hidden bg-stone-800/60 ${className}`}>
      {/* Dark shimmer — matches the app's dark theme */}
      {!isLoaded && (
        <div
          className="absolute inset-0 animate-pulse"
          style={{
            background:
              'linear-gradient(90deg, #1c1917 25%, #292524 50%, #1c1917 75%)',
            backgroundSize: '200% 100%',
            animation: 'shimmer 1.4s ease-in-out infinite',
          }}
        />
      )}

      <img
        ref={imgRef}
        src={imgSrc}
        alt={alt}
        referrerPolicy="no-referrer"
        /* Only lazy-load off-screen images; priority images load immediately */
        loading={priority ? 'eager' : 'lazy'}
        /* Hint to browser for critical images */
        {...(priority ? { fetchPriority: 'high' } : {})}
        decoding="async"
        onLoad={() => setIsLoaded(true)}
        onError={handleError}
        className={`w-full h-full object-cover transition-opacity duration-300 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
        {...rest}
      />

      {/* Inline keyframe for shimmer (avoids touching global CSS) */}
      <style>{`
        @keyframes shimmer {
          0%   { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </div>
  );
};

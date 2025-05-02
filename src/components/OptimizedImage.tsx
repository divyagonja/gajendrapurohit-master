import { useState, useEffect } from 'react';
import { getImageUrl, getThumbnailUrl } from '../utils/googleDriveApi';

interface OptimizedImageProps {
  fileId: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  priority?: boolean;
  onLoad?: () => void;
  onError?: () => void;
}

/**
 * OptimizedImage component for efficiently loading Google Drive images
 * Provides better performance than direct image tags with fallbacks and error handling
 */
const OptimizedImage = ({
  fileId,
  alt,
  className = '',
  width,
  height,
  priority = false,
  onLoad,
  onError
}: OptimizedImageProps) => {
  const [src, setSrc] = useState<string>(getImageUrl(fileId));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const placeholderUrl = '/placeholder-image.svg';
  
  // Handle image load error with retry logic
  const handleError = () => {
    // Try a couple of alternate formats before giving up
    if (retryCount === 0) {
      // First try the thumbnail URL at a larger size
      setRetryCount(1);
      setSrc(`https://lh3.googleusercontent.com/d/${fileId}=s0`);
    } else if (retryCount === 1) {
      // Try the download format
      setRetryCount(2);
      setSrc(`https://drive.google.com/uc?export=view&id=${fileId}`);
    } else if (retryCount === 2) {
      // Last try with the thumbnail API
      setRetryCount(3);
      setSrc(`https://drive.google.com/thumbnail?id=${fileId}&sz=w1000`);
    } else {
      // All attempts failed, show placeholder
      setError(true);
      setSrc(placeholderUrl);
      if (onError) onError();
    }
  };

  // Handle successful load
  const handleLoad = () => {
    setLoading(false);
    if (onLoad) onLoad();
  };

  // Preload image if priority is true
  useEffect(() => {
    if (priority && src !== placeholderUrl) {
      const img = new Image();
      img.src = src;
      img.onload = handleLoad;
      img.onerror = handleError;
    }
  }, [priority, src]);

  return (
    <div className={`relative overflow-hidden ${className}`} style={{ width, height }}>
      {/* Fade-in effect when image loads */}
      {loading && !error && (
        <div className="absolute inset-0 animate-pulse bg-gray-200" />
      )}
      
      {/* The actual image */}
      <img
        src={src}
        alt={alt}
        className={`w-full h-full object-cover transition-opacity duration-500 ${loading ? 'opacity-0' : 'opacity-100'}`}
        width={width}
        height={height}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        fetchPriority={priority ? 'high' : 'auto'}
        onLoad={handleLoad}
        onError={handleError}
      />
      
      {/* Error state */}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <span className="text-sm text-gray-500">Image unavailable</span>
        </div>
      )}
    </div>
  );
};

export default OptimizedImage; 
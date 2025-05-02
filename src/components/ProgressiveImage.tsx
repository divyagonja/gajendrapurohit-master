import { useState, useEffect } from 'react';

interface ProgressiveImageProps {
  src: string;
  placeholderSrc?: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  style?: React.CSSProperties;
  priority?: boolean;
  onLoad?: () => void;
  onError?: () => void;
}

/**
 * ProgressiveImage component for lazy loading images with a low-resolution placeholder
 * Provides better user experience by showing a blurry placeholder while the main image loads
 */
const ProgressiveImage = ({
  src,
  placeholderSrc,
  alt,
  className = '',
  width,
  height,
  style = {},
  priority = false,
  onLoad,
  onError
}: ProgressiveImageProps) => {
  const [imgSrc, setImgSrc] = useState(placeholderSrc || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iI2VlZWVlZSIvPjwvc3ZnPg==');
  const [isLoading, setIsLoading] = useState(true);

  // Handle image load
  const handleLoad = () => {
    setIsLoading(false);
    if (onLoad) onLoad();
  };

  // Handle image error
  const handleError = () => {
    // Keep showing placeholder if main image fails
    if (imgSrc !== placeholderSrc && placeholderSrc) {
      setImgSrc(placeholderSrc);
    }
    if (onError) onError();
  };

  // Start loading the main image after component mounts
  useEffect(() => {
    // Create a new image to load the actual source
    const img = new Image();
    img.src = src;
    
    // When image loads, update the displayed image
    img.onload = () => {
      setImgSrc(src);
    };
    
    img.onerror = handleError;
    
    // For priority images, preload immediately
    // For non-priority, use IntersectionObserver for lazy loading
    if (!priority) {
      // Use Intersection Observer for lazy loading
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            // Start loading the image when it enters viewport
            img.src = src;
            // Disconnect observer after triggering load
            observer.disconnect();
          }
        });
      }, { rootMargin: '100px' }); // Start loading when within 100px of viewport
      
      // Create a reference element to observe
      const element = document.createElement('div');
      document.body.appendChild(element);
      observer.observe(element);
      
      return () => {
        observer.disconnect();
        document.body.removeChild(element);
      };
    }
  }, [src, priority, placeholderSrc]);

  return (
    <div className={`overflow-hidden ${className}`} style={{ position: 'relative', ...style }}>
      {/* Blurry placeholder */}
      {isLoading && (
        <div className="absolute inset-0 bg-gray-100 animate-pulse" />
      )}
      
      {/* Main image */}
      <img
        src={imgSrc}
        alt={alt}
        width={width}
        height={height}
        loading={priority ? 'eager' : 'lazy'}
        onLoad={handleLoad}
        onError={handleError}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          transition: 'filter 0.3s ease-out',
          filter: isLoading ? 'blur(10px)' : 'none',
        }}
      />
    </div>
  );
};

export default ProgressiveImage; 
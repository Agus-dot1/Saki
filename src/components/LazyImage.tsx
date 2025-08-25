import React from 'react';
import { useLazyImage } from '../hooks/useLazyImage';

interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
  placeholder?: string;
  threshold?: number;
  rootMargin?: string;
  onLoad?: () => void;
  onError?: () => void;
}

const LazyImage: React.FC<LazyImageProps> = ({
  src,
  alt,
  className = '',
  placeholder = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2Y3ZjdmNyIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiNjY2MiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5DYXJnYW5kby4uLjwvdGV4dD48L3N2Zz4=',
  threshold,
  rootMargin,
  onLoad,
  onError,
}) => {
  const { imageRef, isLoaded, isInView } = useLazyImage({ threshold, rootMargin });

  const handleLoad = () => {
    onLoad?.();
  };

  const handleError = () => {
    onError?.();
  };

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Placeholder */}
      {!isLoaded && (
        <img
          src={placeholder}
          alt="Cargando..."
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${
            isInView ? 'opacity-50' : 'opacity-100'
          }`}
        />
      )}
      
      {/* Actual image */}
      <img
        ref={imageRef}
        src={isInView ? src : placeholder}
        alt={alt}
        className={`w-full h-full object-cover transition-opacity duration-300 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
        onLoad={handleLoad}
        onError={handleError}
        loading="lazy"
      />
      
      {/* Loading indicator */}
      {isInView && !isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <div className="w-8 h-8 border-2 border-gray-300 border-t-accent rounded-full animate-spin"></div>
        </div>
      )}
    </div>
  );
};

export default React.memo(LazyImage);
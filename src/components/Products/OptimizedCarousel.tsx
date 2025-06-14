import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';

interface OptimizedCarouselProps {
  images: string[];
  alt: string;
  className?: string;
}

interface TouchState {
  startX: number;
  startY: number;
  isDragging: boolean;
}

const OptimizedCarousel: React.FC<OptimizedCarouselProps> = ({ 
  images, 
  alt, 
  className = 'object-contain' 
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set([0]));
  const [imageErrors, setImageErrors] = useState<Set<number>>(new Set());
  const [touchState, setTouchState] = useState<TouchState>({
    startX: 0,
    startY: 0,
    isDragging: false
  });
  
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRefs = useRef<(HTMLImageElement | null)[]>([]);
  const preloadTimeoutRef = useRef<NodeJS.Timeout>();

  // Memoized animation variants for better performance
  const slideVariants = useMemo(() => ({
    enter: (direction: number) => ({
      x: direction > 0 ? '100%' : '-100%',
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? '100%' : '-100%',
      opacity: 0,
    }),
  }), []);

  const transition = useMemo(() => ({
    type: 'tween',
    ease: [0.25, 0.46, 0.45, 0.94], // Custom easing for smooth animation
    duration: 0.25, // Optimal 250ms duration
  }), []);

  // Preload adjacent images for smooth navigation
  const preloadAdjacentImages = useCallback((index: number) => {
    const indicesToLoad = [
      Math.max(0, index - 1),
      index,
      Math.min(images.length - 1, index + 1)
    ];

    indicesToLoad.forEach(i => {
      if (!loadedImages.has(i) && !imageErrors.has(i)) {
        setLoadedImages(prev => new Set([...prev, i]));
      }
    });
  }, [images.length, loadedImages, imageErrors]);

  // Lazy load images with intersection observer
  useEffect(() => {
    if (!window.IntersectionObserver) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const index = parseInt(entry.target.getAttribute('data-index') || '0');
            preloadAdjacentImages(index);
          }
        });
      },
      { threshold: 0.1, rootMargin: '50px' }
    );

    imageRefs.current.forEach((img, index) => {
      if (img) {
        img.setAttribute('data-index', index.toString());
        observer.observe(img);
      }
    });

    return () => observer.disconnect();
  }, [preloadAdjacentImages]);

  // Preload next images with debouncing
  useEffect(() => {
    if (preloadTimeoutRef.current) {
      clearTimeout(preloadTimeoutRef.current);
    }

    preloadTimeoutRef.current = setTimeout(() => {
      preloadAdjacentImages(currentIndex);
    }, 100);

    return () => {
      if (preloadTimeoutRef.current) {
        clearTimeout(preloadTimeoutRef.current);
      }
    };
  }, [currentIndex, preloadAdjacentImages]);

  // Navigation functions with bounds checking
  const goToNext = useCallback(() => {
    setCurrentIndex(prev => (prev + 1) % images.length);
  }, [images.length]);

  const goToPrevious = useCallback(() => {
    setCurrentIndex(prev => (prev - 1 + images.length) % images.length);
  }, [images.length]);

  const goToSlide = useCallback((index: number) => {
    if (index >= 0 && index < images.length) {
      setCurrentIndex(index);
    }
  }, [images.length]);

  // Touch/swipe handlers
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    const touch = e.touches[0];
    setTouchState({
      startX: touch.clientX,
      startY: touch.clientY,
      isDragging: true
    });
  }, []);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    if (!touchState.isDragging) return;

    const touch = e.changedTouches[0];
    const deltaX = touch.clientX - touchState.startX;
    const deltaY = touch.clientY - touchState.startY;
    
    // Only trigger swipe if horizontal movement is greater than vertical
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
      if (deltaX > 0) {
        goToPrevious();
      } else {
        goToNext();
      }
    }

    setTouchState(prev => ({ ...prev, isDragging: false }));
  }, [touchState, goToNext, goToPrevious]);

  // Framer Motion drag handlers
  const handleDragEnd = useCallback((event: MouseEvent | TouchEvent, info: PanInfo) => {
    const threshold = 50;
    const velocity = info.velocity.x;
    const offset = info.offset.x;

    if (Math.abs(offset) > threshold || Math.abs(velocity) > 500) {
      if (offset > 0 || velocity > 0) {
        goToPrevious();
      } else {
        goToNext();
      }
    }
  }, [goToNext, goToPrevious]);

  // Image error handling
  const handleImageError = useCallback((index: number) => {
    setImageErrors(prev => new Set([...prev, index]));
  }, []);

  // Image load success handling
  const handleImageLoad = useCallback((index: number) => {
    setLoadedImages(prev => new Set([...prev, index]));
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        goToPrevious();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        goToNext();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [goToNext, goToPrevious]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (preloadTimeoutRef.current) {
        clearTimeout(preloadTimeoutRef.current);
      }
    };
  }, []);

  if (images.length === 0) {
    return (
      <div className={`flex justify-center items-center aspect-square bg-secondary ${className}`}>
        <span className="text-content">No hay imágenes disponibles</span>
      </div>
    );
  }

  return (
    <div 
      ref={containerRef}
      className={`overflow-hidden relative bg-secondary ${className}`}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      role="region"
      aria-label="Carrusel de imágenes del producto"
    >
      {/* Main image container */}
      <div className="relative aspect-square">
        <AnimatePresence mode="wait" custom={currentIndex}>
          <motion.div
            key={currentIndex}
            custom={currentIndex}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={transition}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.1}
            onDragEnd={handleDragEnd}
            className="absolute inset-0 cursor-grab active:cursor-grabbing"
          >
            {loadedImages.has(currentIndex) && !imageErrors.has(currentIndex) ? (
              <img
                ref={el => imageRefs.current[currentIndex] = el}
                src={images[currentIndex]}
                alt={`${alt} - Imagen ${currentIndex + 1}`}
                className="object-contain w-full h-full scale-150 select-none"
                onLoad={() => handleImageLoad(currentIndex)}
                onError={() => handleImageError(currentIndex)}
                loading="eager"
                decoding="async"
                draggable="false"
              />
            ) : (
              <div className="flex justify-center items-center w-full h-full bg-secondary/50">
                <div className="w-8 h-8 rounded-full border-b-2 animate-spin border-accent"></div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation arrows - only show if more than one image */}
      {images.length > 1 && (
        <>
          <button
            onClick={goToPrevious}
            className="absolute left-4 top-1/2 z-10 p-3 rounded-full shadow-lg transition-all duration-200 transform -translate-y-1/2 bg-white/90 hover:bg-white hover:scale-110 focus:outline-none focus:ring-2 focus:ring-accent"
            aria-label="Imagen anterior"
            type="button"
          >
            <ChevronLeft size={20} className="text-primary" />
          </button>
          
          <button
            onClick={goToNext}
            className="absolute right-4 top-1/2 z-10 p-3 rounded-full shadow-lg transition-all duration-200 transform -translate-y-1/2 bg-white/90 hover:bg-white hover:scale-110 focus:outline-none focus:ring-2 focus:ring-accent"
            aria-label="Siguiente imagen"
            type="button"
          >
            <ChevronRight size={20} className="text-primary" />
          </button>
        </>
      )}

      {/* Indicators - only show if more than one image */}
      {images.length > 1 && (
        <div className="flex absolute right-0 left-0 bottom-4 z-10 justify-center space-x-2">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-2 h-2 rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 ${
                index === currentIndex 
                  ? 'bg-accent scale-125' 
                  : 'bg-white/60 hover:bg-white/80'
              }`}
              aria-label={`Ir a imagen ${index + 1}`}
              type="button"
            />
          ))}
        </div>
      )}

      {/* Progress indicator for screen readers */}
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        Imagen {currentIndex + 1} de {images.length}
      </div>
    </div>
  );
};

export default OptimizedCarousel;
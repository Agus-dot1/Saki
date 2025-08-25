import { useState, useEffect, useRef } from 'react';

interface UseLazyImageOptions {
  threshold?: number;
  rootMargin?: string;
}

interface UseLazyImageReturn {
  imageRef: React.RefObject<HTMLImageElement>;
  isLoaded: boolean;
  isInView: boolean;
}

export const useLazyImage = (options: UseLazyImageOptions = {}): UseLazyImageReturn => {
  const { threshold = 0.1, rootMargin = '50px' } = options;
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const imageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const imageElement = imageRef.current;
    if (!imageElement) return;

    // Check if IntersectionObserver is supported
    if (!('IntersectionObserver' in window)) {
      setIsInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.unobserve(imageElement);
        }
      },
      {
        threshold,
        rootMargin,
      }
    );

    observer.observe(imageElement);

    return () => {
      observer.unobserve(imageElement);
    };
  }, [threshold, rootMargin]);

  useEffect(() => {
    const imageElement = imageRef.current;
    if (!imageElement || !isInView) return;

    const handleLoad = () => setIsLoaded(true);
    const handleError = () => setIsLoaded(false);

    imageElement.addEventListener('load', handleLoad);
    imageElement.addEventListener('error', handleError);

    // If image is already loaded (cached)
    if (imageElement.complete) {
      setIsLoaded(true);
    }

    return () => {
      imageElement.removeEventListener('load', handleLoad);
      imageElement.removeEventListener('error', handleError);
    };
  }, [isInView]);

  return {
    imageRef,
    isLoaded,
    isInView,
  };
};
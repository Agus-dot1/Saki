import React, { createContext, useState, useCallback, useEffect } from 'react';
import { Toast } from '../types';

interface ToastContextType {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
  clearAllToasts: () => void;
  // Convenience methods for common toast types
  showSuccess: (title: string, message: string, options?: Partial<Toast>) => void;
  showError: (title: string, message: string, options?: Partial<Toast>) => void;
  showInfo: (title: string, message: string, options?: Partial<Toast>) => void;
  showWarning: (title: string, message: string, options?: Partial<Toast>) => void;
}

export const ToastContext = createContext<ToastContextType>({
  toasts: [],
  addToast: () => {},
  removeToast: () => {},
  clearAllToasts: () => {},
  showSuccess: () => {},
  showError: () => {},
  showInfo: () => {},
  showWarning: () => {},
});

const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const generateId = useCallback(() => {
    return `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }, []);

  const addToast = useCallback((toast: Omit<Toast, 'id'>) => {
    const id = generateId();
    const newToast: Toast = {
      id,
      duration: 3000, // Default 3 seconds for better readability
      dismissible: true,
      ...toast,
    };

    setToasts(prev => {
      // Limit to 3 toasts maximum to avoid clutter
      const updatedToasts = [...prev, newToast];
      return updatedToasts.slice(-3);
    });

    // Auto-dismiss if duration is set
    if (newToast.duration && newToast.duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, newToast.duration);
    }
  }, [generateId]);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  const clearAllToasts = useCallback(() => {
    setToasts([]);
  }, []);

  // Convenience methods with optimized defaults
  const showSuccess = useCallback((title: string, message: string, options?: Partial<Toast>) => {
    addToast({
      type: 'success',
      title,
      message,
      duration: 2500, // Shorter for success messages
      ...options,
    });
  }, [addToast]);

  const showError = useCallback((title: string, message: string, options?: Partial<Toast>) => {
    addToast({
      type: 'error',
      title,
      message,
      duration: 5000, // Longer for errors
      ...options,
    });
  }, [addToast]);

  const showInfo = useCallback((title: string, message: string, options?: Partial<Toast>) => {
    addToast({
      type: 'info',
      title,
      message,
      duration: 3000, // Standard duration for info
      ...options,
    });
  }, [addToast]);

  const showWarning = useCallback((title: string, message: string, options?: Partial<Toast>) => {
    addToast({
      type: 'warning',
      title,
      message,
      duration: 4000, // Slightly longer for warnings
      ...options,
    });
  }, [addToast]);

  // Keyboard navigation support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && toasts.length > 0) {
        // Remove the most recent toast
        const latestToast = toasts[toasts.length - 1];
        if (latestToast.dismissible) {
          removeToast(latestToast.id);
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [toasts, removeToast]);

  const contextValue: ToastContextType = {
    toasts,
    addToast,
    removeToast,
    clearAllToasts,
    showSuccess,
    showError,
    showInfo,
    showWarning,
  };

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
    </ToastContext.Provider>
  );
};

export default ToastProvider;
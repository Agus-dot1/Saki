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
      duration: 5000,
      dismissible: true,
      ...toast,
    };

    setToasts(prev => [...prev, newToast]);

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

  // Convenience methods
  const showSuccess = useCallback((title: string, message: string, options?: Partial<Toast>) => {
    addToast({
      type: 'success',
      title,
      message,
      ...options,
    });
  }, [addToast]);

  const showError = useCallback((title: string, message: string, options?: Partial<Toast>) => {
    addToast({
      type: 'error',
      title,
      message,
      duration: 7000, // Longer duration for errors
      ...options,
    });
  }, [addToast]);

  const showInfo = useCallback((title: string, message: string, options?: Partial<Toast>) => {
    addToast({
      type: 'info',
      title,
      message,
      ...options,
    });
  }, [addToast]);

  const showWarning = useCallback((title: string, message: string, options?: Partial<Toast>) => {
    addToast({
      type: 'warning',
      title,
      message,
      duration: 6000,
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
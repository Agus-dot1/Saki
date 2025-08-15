import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';
import { Toast } from '../../types';
import { useToast } from '../../hooks/useToast';

interface ToastItemProps {
  toast: Toast;
}

const ToastItem: React.FC<ToastItemProps> = ({ toast }) => {
  const { removeToast } = useToast();
  const [progress, setProgress] = useState(100);

  // Progress bar animation
  useEffect(() => {
    if (!toast.duration || toast.duration <= 0) return;

    const interval = setInterval(() => {
      setProgress(prev => {
        const duration = toast.duration ?? 2000;
        const decrement = (100 / (duration / 100));
        return Math.max(0, prev - decrement);
      });
    }, 100);

    return () => clearInterval(interval);
  }, [toast.duration]);

  const getToastStyles = () => {
    const baseStyles = "pointer-events-auto relative overflow-hidden rounded-xl shadow-lg border backdrop-blur-md";
    
    switch (toast.type) {
      case 'success':
        return `${baseStyles} bg-white/95 border-green-200/50 text-green-800`;
      case 'error':
        return `${baseStyles} bg-white/95 border-red-200/50 text-red-800`;
      case 'warning':
        return `${baseStyles} bg-white/95 border-yellow-200/50 text-yellow-800`;
      case 'info':
        return `${baseStyles} bg-white/95 border-blue-200/50 text-blue-800`;
      default:
        return `${baseStyles} bg-white/95 border-gray-200/50 text-gray-800`;
    }
  };

  const getIcon = () => {
    const iconProps = { size: 18, className: "flex-shrink-0" };
    
    switch (toast.type) {
      case 'success':
        return <CheckCircle {...iconProps} className="text-green-600" />;
      case 'error':
        return <AlertCircle {...iconProps} className="text-red-600" />;
      case 'warning':
        return <AlertTriangle {...iconProps} className="text-yellow-600" />;
      case 'info':
        return <Info {...iconProps} className="text-blue-600" />;
      default:
        return <Info {...iconProps} className="text-gray-600" />;
    }
  };

  const getProgressBarColor = () => {
    switch (toast.type) {
      case 'success':
        return 'bg-green-500';
      case 'error':
        return 'bg-red-500';
      case 'warning':
        return 'bg-yellow-500';
      case 'info':
        return 'bg-blue-500';
      default:
        return 'bg-gray-500';
    }
  };

  const handleDismiss = () => {
    removeToast(toast.id);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleDismiss();
    }
  };

  return (
    <div 
      className={getToastStyles()}
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
    >
      {/* Progress bar */}
      {toast.duration && toast.duration > 0 && (
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-black/5">
          <motion.div
            className={`h-full ${getProgressBarColor()}`}
            initial={{ width: '100%' }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.1, ease: 'linear' }}
          />
        </div>
      )}

      <div className="p-3 sm:p-4">
        <div className="flex items-start space-x-3">
          {/* Icon */}
          <div className="mt-0.5">
            {getIcon()}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-semibold leading-tight text-primary">
                  {toast.title}
                </h4>
                <p className="mt-1 text-sm leading-relaxed text-content">
                  {toast.message}
                </p>

                {/* Action button */}
                {toast.action && (
                  <button
                    onClick={toast.action.onClick}
                    className="mt-2 text-sm font-medium underline text-accent hover:text-supporting focus:outline-none focus:ring-2 focus:ring-accent/20 rounded"
                  >
                    {toast.action.label}
                  </button>
                )}
              </div>

              {/* Dismiss button */}
              {toast.dismissible && (
                <button
                  onClick={handleDismiss}
                  onKeyDown={handleKeyDown}
                  className="flex-shrink-0 p-1 ml-2 transition-colors rounded-full text-content hover:text-primary hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-accent/20"
                  aria-label="Cerrar notificación"
                  type="button"
                >
                  <X size={14} />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ToastItem;
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '../../hooks/useToast';
import ToastItem from './ToastItem';

const ToastContainer: React.FC = () => {
  const { toasts } = useToast();

  return (
    <div 
      className="fixed bottom-4 left-1/2 transform -translate-x-1/2  z-[9999] max-w-sm w-full pointer-events-none"
      role="region"
      aria-label="Notificaciones"
      aria-live="polite"
    >
      <AnimatePresence mode="popLayout">
        {toasts.map((toast, index) => (
          <motion.div
            key={toast.id}
            layout
            initial={{ 
              opacity: 0, 
              y: -100, 
              scale: 0.95 
            }}
            animate={{ 
              opacity: 1, 
              y: 0, 
              scale: 1 
            }}
            exit={{ 
              opacity: 0, 
              y: -100, 
              scale: 0.95,
              transition: { duration: 0.2 }
            }}
            transition={{
              type: 'spring',
              stiffness: 500,
              damping: 30,
              mass: 1,
            }}
            style={{
              zIndex: 9999 - index, // Stack toasts properly
            }}
            className="mb-3 last:mb-0"
          >
            <ToastItem toast={{ ...toast, duration: 2000 }} /> {/* Set duration to 2000ms */}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default ToastContainer;
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '../../hooks/useToast';
import ToastItem from './ToastItem';

const ToastContainer: React.FC = () => {
  const { toasts } = useToast();

  return (
    <>
      {/* Mobile Toast Container - Top positioned */}
      <div 
        className="fixed top-4 left-4 right-4 z-[9999] max-w-sm mx-auto pointer-events-none sm:hidden"
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
                y: -50, 
                scale: 0.95 
              }}
              animate={{ 
                opacity: 1, 
                y: 0, 
                scale: 1 
              }}
              exit={{ 
                opacity: 0, 
                y: -50, 
                scale: 0.95,
                transition: { duration: 0.2 }
              }}
              transition={{
                type: 'spring',
                stiffness: 400,
                damping: 25,
                mass: 0.8,
              }}
              style={{
                zIndex: 9999 - index,
              }}
              className="mb-2 last:mb-0"
            >
              <ToastItem toast={toast} />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Desktop Toast Container - Bottom positioned */}
      <div 
        className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-[9999] max-w-sm w-full pointer-events-none hidden sm:block"
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
                y: 50, 
                scale: 0.95 
              }}
              animate={{ 
                opacity: 1, 
                y: 0, 
                scale: 1 
              }}
              exit={{ 
                opacity: 0, 
                y: 50, 
                scale: 0.95,
                transition: { duration: 0.2 }
              }}
              transition={{
                type: 'spring',
                stiffness: 400,
                damping: 25,
                mass: 0.8,
              }}
              style={{
                zIndex: 9999 - index,
              }}
              className="mb-3 last:mb-0"
            >
              <ToastItem toast={toast} />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </>
  );
};

export default ToastContainer;
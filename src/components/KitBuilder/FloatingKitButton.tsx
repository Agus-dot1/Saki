import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles } from 'lucide-react';

interface FloatingKitButtonProps {
  onOpenKitBuilder: () => void;
}

const FloatingKitButton: React.FC<FloatingKitButtonProps> = ({ onOpenKitBuilder }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const shouldShow = scrollY > 300; // Show after scrolling 300px
      setIsVisible(shouldShow);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleClick = () => {
    onOpenKitBuilder();
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed z-40 bottom-24 right-4 sm:bottom-6 sm:right-6"
          initial={{ opacity: 0, scale: 0, y: 100 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0, y: 100 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
        >
          <motion.button
            onClick={handleClick}
            className="relative overflow-hidden text-white transition-all duration-300 rounded-full shadow-2xl bg-gradient-to-r from-accent to-supporting w-14 h-14 sm:w-16 sm:h-16"
            whileHover={{ scale: 1.1, boxShadow: "0 20px 40px rgba(42, 90, 46, 0.3)" }}
            whileTap={{ scale: 0.9 }}
            layout
          >
            {/* Animated background */}
            <div className="absolute inset-0 transition-opacity duration-300 opacity-0 bg-gradient-to-r from-supporting to-accent hover:opacity-100" />

            {/* Content */}
            <div className="relative flex items-center justify-center">
              <Sparkles size={24} className="animate-pulse" />
            </div>

            {/* Sparkle particles */}
            <div className="absolute inset-0 pointer-events-none">
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 bg-white rounded-full"
                  style={{
                    top: `${20 + i * 20}%`,
                    left: `${20 + i * 20}%`,
                  }}
                  animate={{
                    scale: [0, 1, 0],
                    opacity: [0, 1, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: i * 0.5,
                  }}
                />
              ))}
            </div>
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default FloatingKitButton;
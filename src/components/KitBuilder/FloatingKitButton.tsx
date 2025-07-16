import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles } from 'lucide-react';

interface FloatingKitButtonProps {
  onOpenKitBuilder: () => void;
}

const FloatingKitButton: React.FC<FloatingKitButtonProps> = ({ onOpenKitBuilder }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

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
      setIsExpanded(false);
  };

  const handleHover = () => {
    if (isExpanded) {
      setIsExpanded(true);
    } else {
      setIsExpanded(true);
      setTimeout(() => setIsExpanded(false), 5000); // Auto-collapse after 3s
    }
  };


  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed z-40 bottom-24 right-4 sm:bottom-6 sm:right-6"
          onHoverStart={handleHover}
          initial={{ opacity: 0, scale: 0, y: 100 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0, y: 100 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
        >
          <motion.button
            onClick={handleClick}
            className={`relative overflow-hidden bg-gradient-to-r from-accent to-supporting text-white shadow-2xl transition-all duration-300 ${
              isExpanded ? 'rounded-2xl px-6 py-4' : 'rounded-full w-14 h-14 sm:w-16 sm:h-16'
            }`}
            whileHover={{ scale: 1.1, boxShadow: "0 20px 40px rgba(42, 90, 46, 0.3)" }}
            whileTap={{ scale: 0.9 }}
            layout
          >
            {/* Animated background */}
            <div className="absolute inset-0 transition-opacity duration-300 opacity-0 bg-gradient-to-r from-supporting to-accent hover:opacity-100" />

            
            {/* Content */}
            <div className="relative flex items-center justify-center">
              <AnimatePresence mode="wait">
                {isExpanded ? (
                  <motion.div
                    key="expanded"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="flex items-center space-x-2"
                  >
                    <Sparkles size={20} className="animate-pulse" />
                    <span className="font-semibold whitespace-nowrap">Arma tu Kit</span>
                  </motion.div>
                ) : (
                  <motion.div
                    key="collapsed"
                    initial={{ opacity: 0, rotate: -180 }}
                    animate={{ opacity: 1, rotate: 0 }}
                    exit={{ opacity: 0, rotate: 180 }}
                  >
                    <Sparkles size={24} className="animate-pulse" />
                  </motion.div>
                )}
              </AnimatePresence>
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

          {/* Tooltip */}
          <AnimatePresence>
            {!isExpanded && (
              <motion.div
                className="absolute right-0 px-3 py-2 mb-2 text-sm text-white transition-opacity duration-200 bg-gray-900 rounded-lg opacity-0 pointer-events-none bottom-full whitespace-nowrap hover:opacity-100"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 0, y: 0 }}
                whileHover={{ opacity: 1 }}
              >
                Crea tu kit personalizado
                <div className="absolute w-0 h-0 border-t-4 border-l-4 border-r-4 border-transparent top-full right-4 border-t-gray-900" />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default FloatingKitButton;
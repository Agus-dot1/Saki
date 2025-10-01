import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

interface KitBuilderButtonProps {
  onClick: () => void;
  className?: string;
}

const KitBuilderButton: React.FC<KitBuilderButtonProps> = ({ onClick }) => {
  return (
    <motion.button
      onClick={onClick}
      className={`relative overflow-hidden bg-gradient-to-r from-accent to-supporting text-white px-6 py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-300 group`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {/* Animated background */}
      <div className="absolute inset-0 transition-opacity duration-300 opacity-0 bg-gradient-to-r from-supporting to-accent group-hover:opacity-100" />
      
      {/* Content */}
      <div className="relative flex items-center justify-center space-x-2 lg:justify-normal">
        <span>Arma tu Kit</span>
        <Sparkles size={16} className="animate-pulse" />
      </div>
      
      {/* Shine effect */}
      <div className="absolute inset-0 -skew-x-12 opacity-0 bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:opacity-100 group-hover:animate-pulse" />
    </motion.button>
  );
};

export default KitBuilderButton;
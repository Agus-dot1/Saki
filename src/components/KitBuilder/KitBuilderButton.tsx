import React from 'react';
import { motion } from 'framer-motion';
import { Package, Sparkles } from 'lucide-react';

interface KitBuilderButtonProps {
  onClick: () => void;
  className?: string;
}

const KitBuilderButton: React.FC<KitBuilderButtonProps> = ({ onClick, className = '' }) => {
  return (
    <motion.button
      onClick={onClick}
      className={`relative overflow-hidden bg-gradient-to-r from-accent to-supporting text-white px-6 py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-300 group ${className}`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-r from-supporting to-accent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      {/* Content */}
      <div className="relative flex items-center space-x-2">
        <Package size={20} />
        <span>Arma tu Kit</span>
        <Sparkles size={16} className="animate-pulse" />
      </div>
      
      {/* Shine effect */}
      <div className="absolute inset-0 -skew-x-12 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 group-hover:animate-pulse" />
    </motion.button>
  );
};

export default KitBuilderButton;
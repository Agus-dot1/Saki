import React from 'react';
import { motion } from 'framer-motion';
import { Package, ShoppingCart } from 'lucide-react';
import { MAX_ITEMS, DISCOUNT_PERCENTAGE } from './constants';

interface KitSummaryBarProps {
  totalItems: number;
  finalPrice: number;
  hasDiscount: boolean;
}

export const KitSummaryBar: React.FC<KitSummaryBarProps> = ({
  totalItems,
  finalPrice,
  hasDiscount,
}) => {
  return (
    <motion.div
      className="sticky z-20 flex justify-end pr-5 items-enter bottom-3"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
    >
      <div className="flex items-center px-4 py-2 space-x-2 text-xs rounded-full shadow-lg md:px-6 md:py-3 md:space-x-4 bg-white/90 backdrop-blur-md md:text-base">
        <div className="flex items-center space-x-1 text-gray-600">
          <Package size={14} />
          <span>{totalItems}/{MAX_ITEMS}</span>
        </div>
        <div className="flex items-center space-x-1">
          <ShoppingCart size={14} className="text-gray-600" />
          <span className="font-semibold text-accent">${finalPrice.toFixed(2)}</span>
        </div>

        {hasDiscount && (
          <div className="px-2 py-1 text-xs font-medium text-green-800 bg-green-100 rounded-full">
            {DISCOUNT_PERCENTAGE}% OFF
          </div>
        )}
      </div>
    </motion.div>
  );
};
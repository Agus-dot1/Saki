import React from 'react';
import { motion } from 'framer-motion';
import { Check, Package, Sparkles } from 'lucide-react';
import { PreMadeKit } from '../../types/builder';
import { cardVariants } from './constants';

interface PreMadeKitCardProps {
  kit: PreMadeKit;
  onSelect: (kit: PreMadeKit) => void;
  index: number;
}

export const PreMadeKitCard: React.FC<PreMadeKitCardProps> = ({ kit, onSelect, index }) => {
  const hasDiscount = kit.originalPrice && kit.originalPrice > kit.price;
  const discountPercentage = hasDiscount
    ? Math.round(((kit.originalPrice! - kit.price) / kit.originalPrice!) * 100)
    : 0;

  return (
    <motion.div
      variants={cardVariants}
      initial="initial"
      animate="animate"
      whileHover="hover"
      whileTap="tap"
      custom={index}
      className="relative overflow-hidden transition-shadow duration-300 bg-white shadow-lg rounded-3xl group hover:shadow-2xl"
    >
      {hasDiscount && (
        <motion.div
          className="absolute z-10 px-4 py-2 font-bold text-white rounded-full shadow-lg top-4 right-4 bg-gradient-to-r from-red-500 to-pink-500"
          initial={{ scale: 0, rotate: -12 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.3 + index * 0.1, type: "spring", stiffness: 200 }}
        >
          {discountPercentage}% OFF
        </motion.div>
      )}

      <div className="relative overflow-hidden aspect-[4/3]">
        <motion.img
          src={kit.image}
          alt={kit.name}
          className="object-cover w-full h-full"
          whileHover={{ scale: 1.08 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        />
        <motion.div
          className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        />

        <motion.div
          className="absolute flex items-center space-x-2 px-4 py-2.5 text-sm font-semibold text-white bg-black/50 backdrop-blur-md rounded-full bottom-4 left-4 shadow-lg"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 + index * 0.08, duration: 0.3 }}
        >
          <Package size={16} className="text-white" />
          <span>{kit.items.length || 4} Productos Incluidos</span>
        </motion.div>
      </div>

      <div className="p-7 space-y-5">
        <div className="space-y-3">
          <motion.h3
            className="text-2xl font-bold tracking-tight text-gray-900"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 + index * 0.08, duration: 0.3 }}
          >
            {kit.name}
          </motion.h3>
          <motion.p
            className="text-base text-gray-600 leading-relaxed"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + index * 0.08, duration: 0.3 }}
          >
            {kit.description}
          </motion.p>
        </div>

        <motion.div
          className="p-4 space-y-2.5 bg-gradient-to-br from-gray-50 to-white rounded-2xl border border-gray-100"
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.25 + index * 0.08, duration: 0.3 }}
        >
          <div className="text-xs font-semibold tracking-wider text-gray-500 uppercase">Beneficios Incluidos</div>
          {kit.benefits.map((benefit, idx) => (
            <motion.div
              key={idx}
              className="flex items-start space-x-2.5 text-sm text-gray-700"
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + index * 0.08 + idx * 0.04, duration: 0.25 }}
            >
              <div className="flex items-center justify-center w-5 h-5 mt-0.5 rounded-full bg-green-100 flex-shrink-0">
                <Check size={12} className="text-green-600 stroke-[3]" />
              </div>
              <span className="leading-relaxed">{benefit}</span>
            </motion.div>
          ))}
        </motion.div>

        <div className="pt-5 border-t border-gray-100">
          <div className="flex items-end justify-between mb-5">
            <div className="space-y-1">
              {hasDiscount && (
                <motion.div
                  className="flex items-center space-x-2"
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.35 + index * 0.08, duration: 0.25 }}
                >
                  <span className="text-base text-gray-400 line-through">${kit.originalPrice?.toLocaleString()}</span>
                  <span className="px-2 py-0.5 text-xs font-bold text-red-600 bg-red-50 rounded-full">Ahorrás ${(kit.originalPrice! - kit.price).toLocaleString()}</span>
                </motion.div>
              )}
              <motion.div
                className="flex items-baseline space-x-1.5"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 + index * 0.08, duration: 0.3, type: "spring", stiffness: 200 }}
              >
                <span className="text-4xl font-bold text-transparent bg-gradient-to-br from-accent to-supporting bg-clip-text">${kit.price.toLocaleString()}</span>
                <span className="text-sm font-medium text-gray-500">ARS</span>
              </motion.div>
            </div>
          </div>

          <motion.button
            onClick={() => onSelect(kit)}
            className="relative w-full py-4 text-base font-bold text-white overflow-hidden rounded-xl bg-gradient-to-r from-accent to-supporting shadow-lg"
            whileHover={{ scale: 1.02, boxShadow: "0 12px 35px rgba(42, 90, 46, 0.35)" }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.2 }}
          >
            <span className="relative z-10 flex items-center justify-center space-x-2">
              <span>Agregar al Carrito</span>
              <Sparkles size={18} />
            </span>
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-supporting to-accent"
              initial={{ x: "-100%" }}
              whileHover={{ x: 0 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

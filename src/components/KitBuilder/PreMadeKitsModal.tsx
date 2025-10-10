import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { PreMadeKit } from '../../types/builder';
import { PREMADE_KITS, wizardVariants } from './constants';
import { PreMadeKitCard } from './PreMadeKitCard';
import { useCart } from '../../hooks/useCart';

interface PreMadeKitsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PreMadeKitsModal: React.FC<PreMadeKitsModalProps> = ({ isOpen, onClose }) => {
  const { addToCart } = useCart();

  const handleSelectKit = (kit: PreMadeKit) => {
    const kitProduct = {
      id: Date.now(),
      name: kit.name,
      description: kit.description,
      shortDescription: kit.description,
      price: kit.price,
      oldPrice: kit.originalPrice,
      discountPercentage: kit.originalPrice
        ? Math.round(((kit.originalPrice - kit.price) / kit.originalPrice) * 100)
        : 0,
      contents: kit.benefits,
      images: [kit.image],
      detailedDescription: `${kit.description}. Incluye: ${kit.benefits.join(', ')}`,
      stock: 10,
      keyBenefits: kit.benefits,
      featuredIngredients: ['Ingredientes naturales', 'Fórmulas premium'],
      items: kit.items.map(item => ({
        name: item.name,
        quantity: 1
      }))
    };

    addToCart(kitProduct);
    onClose();
  };

  const womenKits = PREMADE_KITS.filter(kit => kit.gender === 'women');
  const menKits = PREMADE_KITS.filter(kit => kit.gender === 'men');

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-gradient-to-br from-white via-gray-50 to-white pt-8 pb-20"
        variants={wizardVariants}
        initial="initial"
        animate="animate"
        exit="exit"
      >
        <div className="relative w-full max-w-7xl px-4">
          <motion.button
            onClick={onClose}
            className="fixed z-20 flex items-center justify-center p-3 bg-white rounded-full shadow-xl top-6 right-6 hover:bg-gray-50"
            whileHover={{ scale: 1.12, rotate: 90 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, scale: 0.8, rotate: -90 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            <X size={24} className="text-gray-700" />
          </motion.button>

          <motion.div
            className="mb-14 text-center"
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            <motion.h1
              className="mb-4 text-5xl font-bold text-transparent md:text-6xl lg:text-7xl bg-gradient-to-r from-accent via-supporting to-accent bg-clip-text"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.08, duration: 0.4 }}
            >
              Kits Personalizados
            </motion.h1>
            <motion.p
              className="max-w-2xl mx-auto text-lg text-gray-600 md:text-xl"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.12, duration: 0.3 }}
            >
              Elegí el kit perfecto para tu rutina de cuidado personal
            </motion.p>
          </motion.div>

          {womenKits.length > 0 && (
            <motion.section
              className="mb-20"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            >
              <motion.div
                className="flex items-center justify-center mb-10 space-x-4"
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              >
                <motion.div
                  className="h-px bg-gradient-to-r from-transparent via-pink-400 to-transparent w-32"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 0.25, duration: 0.5 }}
                />
                <h2 className="text-4xl font-bold text-transparent md:text-5xl bg-gradient-to-r from-pink-500 via-rose-500 to-pink-500 bg-clip-text">
                  Para Ellas
                </h2>
                <motion.div
                  className="h-px bg-gradient-to-r from-transparent via-pink-400 to-transparent w-32"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 0.25, duration: 0.5 }}
                />
              </motion.div>

              <div className="grid gap-8 md:grid-cols-2 lg:gap-10">
                {womenKits.map((kit, index) => (
                  <PreMadeKitCard
                    key={kit.id}
                    kit={kit}
                    onSelect={handleSelectKit}
                    index={index}
                  />
                ))}
              </div>
            </motion.section>
          )}

          {menKits.length > 0 && (
            <motion.section
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            >
              <motion.div
                className="flex items-center justify-center mb-10 space-x-4"
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3, duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              >
                <motion.div
                  className="h-px bg-gradient-to-r from-transparent via-blue-400 to-transparent w-32"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 0.35, duration: 0.5 }}
                />
                <h2 className="text-4xl font-bold text-transparent md:text-5xl bg-gradient-to-r from-blue-600 via-cyan-600 to-blue-600 bg-clip-text">
                  Para Ellos
                </h2>
                <motion.div
                  className="h-px bg-gradient-to-r from-transparent via-blue-400 to-transparent w-32"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 0.35, duration: 0.5 }}
                />
              </motion.div>

              <div className="grid gap-8 md:grid-cols-2 lg:gap-10">
                {menKits.map((kit, index) => (
                  <PreMadeKitCard
                    key={kit.id}
                    kit={kit}
                    onSelect={handleSelectKit}
                    index={index}
                  />
                ))}
              </div>
            </motion.section>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

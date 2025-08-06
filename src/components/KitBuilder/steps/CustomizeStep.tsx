import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Plus, Minus } from 'lucide-react';
import { itemVariants, stepVariants } from '../constants';
import { SelectedKitItem } from '../../../types/builder';

interface CustomizeStepProps {
  kitName: string;
  setKitName: (name: string) => void;
  selectedItems: SelectedKitItem[];
  updateItemQuantity: (itemId: number, quantity: number) => void;
  totalItems: number;
  MAX_ITEMS: number;
  prevStep: () => void;
  nextStep: () => void;
}

export const CustomizeStep: React.FC<CustomizeStepProps> = ({
  kitName,
  setKitName,
  selectedItems,
  updateItemQuantity,
  totalItems,
  MAX_ITEMS,
  prevStep,
  nextStep,
}) => {
  return (
    <motion.div
      key="step-customize"
      variants={stepVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      onAnimationStart={() => document.body.offsetHeight}
    >
      <div className="mb-4 text-center md:mb-8">
        <motion.div variants={itemVariants}>
          <h2 className="mb-2 text-2xl font-bold md:mb-4 md:text-3xl lg:text-5xl text-primary">
            Personalizá tu Kit
          </h2>
          <p className="text-base md:text-lg text-content">
            Ajustá los detalles finales de <span className="font-medium text-accent">"{kitName}"</span>
          </p>
        </motion.div>
      </div>

      <motion.div variants={itemVariants} className="p-4 mb-4 shadow-lg md:p-8 md:mb-8 bg-white/80 backdrop-blur-sm rounded-xl md:rounded-2xl">
        <div className="mb-4 md:mb-8">
          <label className="block mb-2 text-base font-medium text-gray-700 md:mb-3 md:text-lg">
            Nombre del Kit
          </label>
          <input
            type="text"
            value={kitName}
            onChange={(e) => setKitName(e.target.value)}
            className="w-full px-3 py-2 transition-all duration-200 border-2 rounded-lg md:px-4 md:py-3 border-accent/20 md:rounded-xl focus:border-accent focus:ring-4 focus:ring-accent/20"
            maxLength={50}
          />
        </div>

        <div className="space-y-2 md:space-y-4">
          <h4 className="text-base font-medium text-gray-900 md:text-lg">Productos Seleccionados</h4>
          {selectedItems.map(item => (
            <div key={item.id} className="flex items-center justify-between p-2 rounded-lg md:p-4 bg-gray-50 md:rounded-xl">
              <div className="flex items-center space-x-2 md:space-x-3">
                <img
                  src={item.image}
                  alt={item.name}
                  className="object-cover w-10 h-10 rounded-md md:w-12 md:h-12 md:rounded-lg"
                />
                <div>
                  <h5 className="font-medium text-gray-900">{item.name}</h5>
                  <p className="text-xs text-gray-600 md:text-sm">
                    ${item.price} x {item.quantity} = ${(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-1 md:space-x-2">
                <button
                  onClick={() => updateItemQuantity(item.id, item.quantity - 1)}
                  className="flex items-center justify-center transition-colors bg-white border border-gray-300 rounded-full w-7 h-7 md:w-8 md:h-8 hover:bg-gray-50"
                >
                  <Minus size={14} />
                </button>
                <span className="font-medium text-center w-7 md:w-8">{item.quantity}</span>
                <button
                  onClick={() => updateItemQuantity(item.id, item.quantity + 1)}
                  className="flex items-center justify-center text-white transition-colors rounded-full w-7 h-7 md:w-8 md:h-8 bg-accent hover:bg-supporting"
                  disabled={totalItems >= MAX_ITEMS}
                >
                  <Plus size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      <motion.div variants={itemVariants} className="flex justify-center space-x-2 md:space-x-4">
        <button
          onClick={prevStep}
          className="flex items-center px-4 py-2 space-x-1 text-sm text-gray-700 transition-all duration-200 rounded-lg md:px-6 md:py-3 md:space-x-2 bg-white/80 backdrop-blur-sm md:rounded-xl hover:bg-white md:text-base"
        >
          <ArrowLeft size={18} />
          <span>Atrás</span>
        </button>

        <button
          onClick={nextStep}
          className="flex items-center px-6 py-2 space-x-1 text-sm text-white transition-all duration-200 rounded-lg md:px-8 md:py-3 md:space-x-2 bg-gradient-to-r from-accent to-supporting md:rounded-xl hover:shadow-lg md:text-base"
        >
          <span>Ver Resumen</span>
          <ArrowRight size={18} />
        </button>
      </motion.div>
    </motion.div>
  );
};
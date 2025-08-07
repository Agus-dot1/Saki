import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, ShoppingCart } from 'lucide-react';
import { itemVariants, stepVariants, DISCOUNT_PERCENTAGE } from '../constants';
import { SelectedKitItem } from '../../../types/builder';

interface SummaryStepProps {
  kitName: string;
  selectedItems: SelectedKitItem[];
  totalItems: number;
  totalPrice: number;
  hasDiscount: boolean;
  discountAmount: number;
  finalPrice: number;
  canOrder: boolean;
  prevStep: () => void;
  handleAddToCart: () => void;
}

export const SummaryStep: React.FC<SummaryStepProps> = ({
  kitName,
  selectedItems,
  totalItems,
  totalPrice,
  hasDiscount,
  discountAmount,
  finalPrice,
  canOrder,
  prevStep,
  handleAddToCart,
}) => {
  return (
    <motion.div
      key="step-summary"
      variants={stepVariants}
      initial="initial"
      animate="animate"
      className="max-w-2xl mx-auto"
    >
      <div className="mb-8 text-center">
        <motion.div variants={itemVariants}>
          <h2 className="mb-4 text-3xl font-bold lg:text-5xl text-primary">
            Tu Kit Está Listo
          </h2>
          <p className="text-lg text-content">
            Revisá los detalles de <span className="font-medium text-accent">"{kitName}"</span> antes de agregarlo al carrito
          </p>
        </motion.div>
      </div>

      <motion.div variants={itemVariants} className="p-8 mb-8 shadow-lg bg-white/80 backdrop-blur-sm rounded-2xl">
        <div className="p-6 mb-6 bg-gradient-to-r from-accent/10 to-supporting/10 rounded-2xl">
          <h4 className="mb-2 text-xl font-semibold text-gray-900">
            {kitName}
          </h4>
          <p className="mb-4 text-gray-600">
            {totalItems} productos seleccionados para tu rutina perfecta
          </p>

          <div className="grid grid-cols-4 gap-2">
            {selectedItems.slice(0, 4).map(item => (
              <div key={item.id} className="relative">
                <img
                  src={item.image}
                  alt={item.name}
                  className="object-cover w-full rounded-lg aspect-square"
                />
                {item.quantity > 1 && (
                  <div className="absolute flex items-center justify-center w-5 h-5 text-xs text-white rounded-full -top-1 -right-1 bg-accent">
                    {item.quantity}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="p-6 bg-white border border-gray-200 rounded-2xl">
          <h4 className="mb-4 font-semibold text-gray-900">Detalle del Precio</h4>

          <div className="space-y-3">
            {selectedItems.map(item => (
              <div key={item.id} className="flex justify-between text-sm">
                <span className="text-gray-600">
                  {item.name} x{item.quantity}
                </span>
                <span className="font-medium">
                  ${(item.price * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}

            <div className="pt-3 border-t">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">${totalPrice.toFixed(2)}</span>
              </div>

              {hasDiscount && (
                <div className="flex justify-between text-accent">
                  <span>Descuento ({DISCOUNT_PERCENTAGE}%)</span>
                  <span>-${discountAmount.toFixed(2)}</span>
                </div>
              )}

              <div className="flex justify-between pt-3 mt-3 text-xl font-bold border-t text-accent">
                <span>Total</span>
                <span>${finalPrice.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div variants={itemVariants} className="flex justify-center space-x-4">
        <button
          onClick={prevStep}
          className="flex items-center px-6 py-3 space-x-2 text-gray-700 transition-all duration-200 bg-white/80 backdrop-blur-sm rounded-xl hover:bg-white"
        >
          <ArrowLeft size={18} />
          <span>Atrás</span>
        </button>

        <button
          onClick={handleAddToCart}
          disabled={!canOrder || selectedItems.length === 0}
          className="flex items-center px-8 py-4 space-x-3 text-white transition-all duration-300 transform text-basefont-medium bg-gradient-to-r from-accent to-supporting rounded-2xl hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none hover:scale-105"
        >
          <ShoppingCart size={20} />
          <span>Agregar al Carrito</span>
        </button>
      </motion.div>
    </motion.div>
  );
};
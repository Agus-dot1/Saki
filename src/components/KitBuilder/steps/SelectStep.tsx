import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Star, Plus, Minus, Check, Package } from 'lucide-react';
import { itemVariants, stepVariants, CATEGORIES, MIN_ORDER_AMOUNT } from '../constants';
import { SelectedKitItem } from '../../../types/builder';
import { KitItem } from '../../../services/kitbuilderService';
import LoadingSpinner from '../../LoadingSpinner';

interface SelectStepProps {
  kitName: string;
  availableItems: KitItem[];
  isLoading: boolean;
  error: string | null;
  activeCategory: string;
  setActiveCategory: (category: string) => void;
  filteredItems: KitItem[];
  selectedItems: SelectedKitItem[];
  addItemToKit: (item: KitItem) => void;
  updateItemQuantity: (itemId: number, quantity: number) => void;
  totalItems: number;
  MAX_ITEMS: number;
  finalPrice: number;
  progress: number;
  prevStep: () => void;
  nextStep: () => void;
  canContinueFromSelect: boolean;
}

export const SelectStep: React.FC<SelectStepProps> = ({
  kitName,
  availableItems,
  isLoading,
  error,
  activeCategory,
  setActiveCategory,
  filteredItems,
  selectedItems,
  addItemToKit,
  updateItemQuantity,
  totalItems,
  MAX_ITEMS,
  finalPrice,
  progress,
  prevStep,
  nextStep,
  canContinueFromSelect,
}) => {

  // Show loading state
  if (isLoading) {
    return (
      <motion.div
        key="step-select-loading"
        variants={stepVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        className="flex flex-col items-center justify-center h-full min-h-[60vh]"
      >
        <LoadingSpinner />
        <p className="mt-4 text-lg text-content">Cargando productos...</p>
      </motion.div>
    );
  }

  // Show error state
  if (error) {
    return (
      <motion.div
        key="step-select-error"
        variants={stepVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        className="flex flex-col items-center justify-center h-full min-h-[60vh] text-center"
      >
        <div className="p-8 rounded-2xl bg-red-50">
          <h3 className="mb-4 text-xl font-semibold text-red-800">
            Error al cargar productos
          </h3>
          <p className="mb-6 text-red-600">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 text-white transition-colors rounded-lg bg-accent hover:bg-supporting"
          >
            Intentar de nuevo
          </button>
        </div>
      </motion.div>
    );
  }

  // Show empty state if no items available
  if (availableItems.length === 0) {
    return (
      <motion.div
        key="step-select-empty"
        variants={stepVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        className="flex flex-col items-center justify-center h-full min-h-[60vh] text-center"
      >
        <div className="p-8 rounded-2xl bg-gray-50">
          <h3 className="mb-4 text-xl font-semibold text-gray-800">
            No hay productos disponibles
          </h3>
          <p className="mb-6 text-gray-600">
            No se encontraron productos para armar tu kit en este momento.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 text-white transition-colors rounded-lg bg-accent hover:bg-supporting"
          >
            Recargar
          </button>
        </div>
      </motion.div>
    );
  }



  return (
    <motion.div
      key="step-select"
      variants={stepVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="h-full"
    >
      <div className="mb-6 text-center md:mb-8">
        <motion.div variants={itemVariants}>
          <h2 className="mb-2 text-2xl font-bold md:mb-4 md:text-3xl lg:text-5xl text-primary">
            Elegí tus Productos
          </h2>
          <p className="max-w-xs mx-auto text-base md:max-w-2xl md:text-lg text-content">
            Seleccioná los productos que formarán parte de <span className="font-medium text-accent">"{kitName}"</span>
          </p>
        </motion.div>
      </div>

      {/* Category Selection */}
      <motion.div variants={itemVariants} className="mb-6 md:mb-8">
        <div className="flex justify-center">
          <div className="grid grid-cols-2 grid-rows-2 gap-2 p-2 shadow-lg bg-white/60 backdrop-blur-sm rounded-xl md:rounded-2xl md:grid-cols-4 md:grid-rows-1 md:gap-3 md:p-3">
            {CATEGORIES.map(category => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`flex items-center space-x-1 md:space-x-2 px-2 py-2 md:px-4 md:py-3 rounded-lg md:rounded-xl border-2 transition-all duration-200 text-xs md:text-base ${
                  activeCategory === category.id
                    ? category.color + ' scale-105 shadow-md'
                    : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                }`}
              >
                <span className="text-base md:text-lg">{category.icon}</span>
                <span className="font-medium">{category.name}</span>
              </button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Products Grid */}
      <motion.div
        variants={itemVariants}
        className="grid grid-cols-2 gap-3 mb-6 md:grid-cols-3 md:gap-6 md:mb-8 min-h-[200px]"
      >
        {filteredItems.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center col-span-full">
                    <p className="mb-4 text-lg text-gray-600">
                      {availableItems.length > 0
                        ? "No hay productos disponibles en esta categoría"
                        : "No hay productos disponibles"}
                    </p>
                    {availableItems.length > 0 && (
                                  <div className="flex flex-col gap-2">
                                    <button
                                      onClick={() => setActiveCategory('limpieza')}
                                      className="px-4 py-2 transition-colors text-accent hover:text-supporting"
                                    >
                                      Ver categoría de limpieza
                                    </button>
                                    <button
                                      onClick={() => {
                                        // Refresh by temporarily changing category and back
                                        const categories = ['limpieza', 'hidratacion', 'tratamiento', 'accesorios'];
                                        const nextCategory = categories.find(cat => cat !== activeCategory) || 'limpieza';
                                        setActiveCategory(nextCategory);
                                        setTimeout(() => {
                                          setActiveCategory(activeCategory);
                                        }, 10);
                                      }}
                                      className="px-4 py-2 transition-colors text-accent hover:text-supporting"
                                    >
                                      Refrescar productos
                                    </button>
                                  </div>
                                )}
                  </div>
        ) : (
          filteredItems.map(item => {
          const selectedItem = selectedItems.find(selected => selected.id === item.id);
          const isSelected = !!selectedItem;

          const getStockStatus = () => {
              if (item.stock == 0) {
                return { text: 'Sin Stock', color: 'text-gray-800 bg-gray-50', disabled: true };
              }
              if (item.stock < 3) {
                return { text: 'Últimos disponibles', color: 'text-red-600 bg-red-50', disabled: true };
              }
              if (item.stock >= 3 && item.stock <= 10) {
                return { text: 'Poco stock', color: 'text-yellow-600 bg-yellow-50', disabled: false };
              }
              if (item.stock > 10) {
                return { text: 'En Stock', color: 'text-green-600 bg-green-50', disabled: false };
              }
          }

          const stockStatus = getStockStatus();

          return (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className={`relative bg-white/80 backdrop-blur-sm rounded-xl md:rounded-2xl border-2 transition-all duration-300 hover:shadow-xl ${
                isSelected
                  ? 'border-accent shadow-lg shadow-accent/20 scale-105'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="relative overflow-hidden aspect-square rounded-t-xl md:rounded-t-2xl">
                <img
                  src={item.image}
                  alt={item.name}
                  className="object-contain w-full h-full transition-transform duration-300 scale-125 hover:scale-150"
                />
                {isSelected && (
                  <div className="absolute flex items-center justify-center w-6 h-6 rounded-full shadow-lg md:w-8 md:h-8 top-2 right-2 md:top-3 md:left-3 bg-accent">
                    <Check size={14} className="text-white" />
                  </div>
                )}
              </div>

              <div className="p-3 md:p-6">
                <h4 className="mb-1 text-base font-semibold text-gray-900 md:mb-2 md:text-lg">{item.name}</h4>
                <p className="mb-2 text-xs text-gray-600 md:mb-4 md:text-sm line-clamp-2">{item.description}</p>

                <div className="mb-2 md:mb-4">
                  <ul className="space-y-1">
                    {item.benefits.slice(0, 2).map((benefit, idx) => (
                      <li key={idx} className="flex items-center text-xs text-gray-600">
                        <Star size={10} className="mr-1 fill-current text-accent" />
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Stock indicator */}
                
                {stockStatus && (
                  <div className={`absolute top-3 right-3 lg:top-4 lg:right-4 px-2 py-1 lg:px-3 lg:py-1 rounded-full text-xs font-medium ${stockStatus.color}`}>
                  <div className="flex items-center space-x-1">
                    <Package size={12} />
                    <span>{stockStatus.text}</span>
                  </div>
                  </div>
                )}
              
                <div className="flex flex-col items-center justify-between">
                  <span className="self-start font-bold md:text-xl text-accent">
                    ${item.price}
                  </span>

                  {isSelected ? (
                    <div className="flex items-center self-end space-x-1 md:space-x-2">
                      <button
                        onClick={() => updateItemQuantity(item.id, selectedItem.quantity - 1)}
                        className="flex items-center justify-center w-4 h-4 transition-colors bg-gray-200 rounded-full md:w-10 md:h-10 hover:bg-gray-300"
                      >
                        <Minus size={12} />
                      </button>
                      <span className="font-medium text-center w-7 md:w-8">
                        {selectedItem.quantity}
                      </span>
                      <button
                        onClick={() => updateItemQuantity(item.id, selectedItem.quantity + 1)}
                        className="flex items-center justify-center w-4 h-4 text-white transition-colors rounded-full md:w-10 md:h-10 bg-accent hover:bg-supporting"
                        disabled={totalItems >= MAX_ITEMS}
                      >
                        <Plus size={12} />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => addItemToKit(item)}
                      disabled={totalItems >= MAX_ITEMS || item.stock === 0}
                      className="flex items-center self-end px-2 py-1 space-x-1 text-xs font-medium text-white transition-all duration-200 rounded-lg md:px-4 md:py-2 md:text-sm bg-accent md:rounded-xl hover:bg-supporting hover:scale-105 disabled:bg-gray-300 disabled:cursor-not-allowed disabled:transform-none"
                    >
                      <Plus size={12} />
                      <span>Agregar</span>
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })
        )}
      </motion.div>
      {selectedItems.length > 0 && (
        <div className="my-4">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-gray-600">
              Monto actual: <span className="font-semibold text-accent">${finalPrice.toFixed(2)}</span>
            </span>
            <span className="text-xs text-gray-600">
              Mínimo: <span className="font-semibold">${MIN_ORDER_AMOUNT}</span>
            </span>
          </div>
          <div className="w-full h-3 overflow-hidden bg-gray-200 rounded-full">
            <div
              className={`h-full rounded-full transition-all duration-300 ${finalPrice >= MIN_ORDER_AMOUNT ? 'bg-green-900' : 'bg-green-700'}`}
              style={{ width: `${progress}%` }}
            />
          </div>
          {finalPrice < MIN_ORDER_AMOUNT && (
            <div className="mt-2 text-xs text-center text-red-500">
              Te faltan <span className="font-bold">${(MIN_ORDER_AMOUNT - finalPrice).toFixed(2)}</span> para poder continuar.
            </div>
          )}
        </div>
      )}

      {/* Navigation */}
      <motion.div variants={itemVariants} className="flex justify-center space-x-2 md:space-x-4">
        <button
          onClick={prevStep}
          className="flex items-center px-4 py-2 space-x-1 text-sm text-gray-700 transition-all duration-200 rounded-lg md:px-6 md:py-3 md:space-x-2 bg-white/80 backdrop-blur-sm md:rounded-xl hover:bg-white md:text-base"
        >
          <ArrowLeft size={16} />
          <span>Atrás</span>
        </button>

        <button
          onClick={nextStep}
          disabled={!canContinueFromSelect}
          className="flex items-center px-6 py-2 space-x-1 text-sm text-white transition-all duration-200 rounded-lg md:px-8 md:py-3 md:space-x-2 bg-gradient-to-r from-accent to-supporting md:rounded-xl hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed md:text-base"
        >
          <span>Continuar</span>
          <ArrowRight size={16} />
        </button>
      </motion.div>
    </motion.div>
  );
};
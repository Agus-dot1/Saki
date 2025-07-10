import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X, Plus, Minus, Package, Star, Check, ShoppingCart, ArrowLeft, ArrowRight, Sparkles, Info } from 'lucide-react';
import { useCart } from '../../hooks/useCart';
import { useToast } from '../../hooks/useToast';
import { availableItems } from '../../data/builderData';
import { KitItem, SelectedKitItem, KitBuilderModalProps } from '../../types/builder';

const KitBuilderModal: React.FC<KitBuilderModalProps> = ({ isOpen, onClose }) => {
  const { addToCart } = useCart();
  const { showError, showSuccess } = useToast();
  
  const [selectedItems, setSelectedItems] = useState<SelectedKitItem[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('limpieza');
  const [kitName, setKitName] = useState('');
  const [step, setStep] = useState<'select' | 'customize' | 'summary'>('select');
  const [showCategoryMenu, setShowCategoryMenu] = useState(false);

  // Kit configuration
  const MIN_ORDER_AMOUNT = 50;
  const MAX_ITEMS = 8;
  const DISCOUNT_THRESHOLD = 100;
  const DISCOUNT_PERCENTAGE = 15;

  const categories = [
    { id: 'limpieza', name: 'Limpieza', icon: '🧼', color: 'bg-blue-50 text-blue-700 border-blue-200' },
    { id: 'hidratacion', name: 'Hidratación', icon: '💧', color: 'bg-cyan-50 text-cyan-700 border-cyan-200' },
    { id: 'tratamiento', name: 'Tratamiento', icon: '✨', color: 'bg-purple-50 text-purple-700 border-purple-200' },
    { id: 'accesorios', name: 'Accesorios', icon: '🛍️', color: 'bg-pink-50 text-pink-700 border-pink-200' }
  ];

  const totalPrice = selectedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const totalItems = selectedItems.reduce((sum, item) => sum + item.quantity, 0);
  const hasDiscount = totalPrice >= DISCOUNT_THRESHOLD;
  const discountAmount = hasDiscount ? (totalPrice * DISCOUNT_PERCENTAGE) / 100 : 0;
  const finalPrice = totalPrice - discountAmount;
  const canOrder = finalPrice >= MIN_ORDER_AMOUNT;
  const progress = Math.min((finalPrice / MIN_ORDER_AMOUNT) * 100, 100);

  const filteredItems = availableItems.filter(item => item.category === activeCategory);

  const addItemToKit = (item: KitItem) => {
    if (totalItems >= MAX_ITEMS) {
      showError('Límite Alcanzado', `Máximo ${MAX_ITEMS} productos por kit`);
      return;
    }

    setSelectedItems(prev => {
      const existing = prev.find(selected => selected.id === item.id);
      if (existing) {
        return prev.map(selected =>
          selected.id === item.id
            ? { ...selected, quantity: selected.quantity + 1 }
            : selected
        );
      } else {
        return [...prev, { ...item, quantity: 1 }];
      }
    });
  };

  const removeItemFromKit = (itemId: number) => {
    setSelectedItems(prev => prev.filter(item => item.id !== itemId));
  };

  const updateItemQuantity = (itemId: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItemFromKit(itemId);
      return;
    }

    setSelectedItems(prev =>
      prev.map(item =>
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const handleAddToCart = () => {
    if (!canOrder) {
      showError('Monto Mínimo', `El monto mínimo para armar un kit es $${MIN_ORDER_AMOUNT}`);
      return;
    }

    const customKit = {
      id: Date.now(),
      name: kitName || 'Mi Kit Personalizado',
      description: `Kit personalizado con ${totalItems} productos seleccionados`,
      shortDescription: `Kit personalizado - ${totalItems} productos`,
      price: finalPrice,
      contents: selectedItems.map(item => `${item.quantity}x ${item.name}`),
      images: [selectedItems[0]?.image || 'https://images.pexels.com/photos/4465821/pexels-photo-4465821.jpeg'],
      detailedDescription: `Kit personalizado creado por el usuario con los siguientes productos: ${selectedItems.map(item => `${item.quantity}x ${item.name}`).join(', ')}`,
      stock: 1,
      keyBenefits: ['Kit personalizado', 'Productos seleccionados por ti', 'Rutina completa'],
      featuredIngredients: ['Ingredientes naturales', 'Fórmulas premium'],
      discountPercentage: hasDiscount ? DISCOUNT_PERCENTAGE : 0,
      oldPrice: hasDiscount ? totalPrice : finalPrice,
      items: selectedItems.map(item => ({
        name: item.name,
        quantity: item.quantity
      }))
    };

    addToCart(customKit);
    showSuccess('Kit Agregado', 'Tu kit personalizado fue agregado al carrito');
    
    setSelectedItems([]);
    setKitName('');
    setStep('select');
    onClose();
  };

  const nextStep = () => {
    if (step === 'select') setStep('customize');
    else if (step === 'customize') setStep('summary');
  };

  const prevStep = () => {
    if (step === 'summary') setStep('customize');
    else if (step === 'customize') setStep('select');
  };

  const stepVariants = {
    initial: { opacity: 0, x: 60 },
    animate: { opacity: 1, x: 0, transition: { duration: 0.3, ease: [0.19, 1.12, 0.7, 0.97] } },
    exit: { opacity: 0, x: -60, transition: { duration: 0.2, ease: [0.19, 1.12, 0.7, 0.97] } },
  };

    const isContinueDisabled = () => {
    if (step === 'select') {
      return selectedItems.length === 0;
    }
    return false;
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-4 backdrop-blur-sm bg-black/70"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
      >
        <motion.div
          className="relative w-full h-full bg-white sm:h-[90vh] sm:max-w-6xl sm:rounded-2xl shadow-2xl overflow-hidden flex flex-col"
          initial={{ y: '100%', opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: '100%', opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          {/* Header */}
          <div className="relative flex items-center justify-between p-4 text-white bg-gradient-to-r from-accent to-supporting">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-full bg-white/20">
                <Sparkles size={24} />
              </div>
              <div>
                <h2 className="text-xl font-semibold">Arma tu Kit</h2>
                <p className="text-sm text-white/80">Creá tu rutina personalizada</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 transition-colors rounded-full hover:bg-white/20"
            >
              <X size={24} />
            </button>
          </div>

          {/* Progress Bar */}
          <div className="px-4 py-3 bg-white border-b">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">
                Progreso del Kit
              </span>
              <span className="text-sm text-gray-500">
                ${finalPrice.toFixed(2)} / ${MIN_ORDER_AMOUNT}
              </span>
            </div>
            <div className="w-full h-2 bg-gray-200 rounded-full">
              <motion.div
                className="h-2 rounded-full bg-gradient-to-r from-accent to-supporting"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
            {!canOrder && finalPrice > 0 && (
              <p className="mt-1 text-xs text-amber-600">
                Necesitas ${(MIN_ORDER_AMOUNT - finalPrice).toFixed(2)} más para continuar
              </p>
            )}
          </div>

          {/* Step Navigation */}
          <div className="flex items-center justify-between px-4 py-3 border-b bg-gray-50">
            <div className="flex items-center space-x-4">
              {['select', 'customize', 'summary'].map((stepName, index) => (
                <div key={stepName} className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    step === stepName 
                      ? 'bg-accent text-white' 
                      : index < ['select', 'customize', 'summary'].indexOf(step)
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-200 text-gray-500'
                  }`}>
                    {index < ['select', 'customize', 'summary'].indexOf(step) ? (
                      <Check size={16} />
                    ) : (
                      index + 1
                    )}
                  </div>
                  {index < 2 && (
                    <div className={`w-8 h-0.5 mx-2 ${
                      index < ['select', 'customize', 'summary'].indexOf(step)
                        ? 'bg-green-500'
                        : 'bg-gray-200'
                    }`} />
                  )}
                </div>
              ))}
            </div>
            <div className="text-sm text-gray-600 capitalize">
              {step === 'select' ? 'Seleccionar' : step === 'customize' ? 'Personalizar' : 'Confirmar'}
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 overflow-hidden">
            <AnimatePresence mode="wait">
              {step === 'select' && (
                <motion.div
                  key="step-select"
                  className="flex flex-col h-full"
                  variants={stepVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                >
                  {/* Category Selection */}
                  <div className="p-4 bg-white border-b">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-medium text-gray-900">Categorías</h3>
                      <button
                        onClick={() => setShowCategoryMenu(!showCategoryMenu)}
                        className="p-2 bg-gray-100 rounded-lg sm:hidden"
                      >
                        <Info size={16} />
                      </button>
                    </div>
                    
                    {/* Mobile Category Selector */}
                    <div className="sm:hidden">
                      <div className="grid grid-cols-2 gap-2">
                        {categories.map(category => (
                          <button
                            key={category.id}
                            onClick={() => setActiveCategory(category.id)}
                            className={`p-3 rounded-xl border-2 transition-all ${
                              activeCategory === category.id
                                ? category.color
                                : 'bg-gray-50 text-gray-600 border-gray-200'
                            }`}
                          >
                            <div className="mb-1 text-lg">{category.icon}</div>
                            <div className="text-xs font-medium">{category.name}</div>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Desktop Category Selector */}
                    <div className="hidden space-x-2 sm:flex">
                      {categories.map(category => (
                        <button
                          key={category.id}
                          onClick={() => setActiveCategory(category.id)}
                          className={`flex items-center space-x-2 px-4 py-2 rounded-xl border-2 transition-all ${
                            activeCategory === category.id
                              ? category.color
                              : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
                          }`}
                        >
                          <span>{category.icon}</span>
                          <span className="font-medium">{category.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Products Grid */}
                  <div className="flex-1 p-4 overflow-y-auto">
                    <motion.div
                      className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
                      layout
                    >
                      {filteredItems.map(item => {
                        const selectedItem = selectedItems.find(selected => selected.id === item.id);
                        const isSelected = !!selectedItem;
                        
                        return (
                          <motion.div
                            key={item.id}
                            layout
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className={`relative bg-white rounded-2xl border-2 transition-all ${
                              isSelected 
                                ? 'border-accent shadow-lg shadow-accent/20' 
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                          >
                            {/* Product Image */}
                            <div className="relative overflow-hidden aspect-square rounded-t-2xl">
                              <img
                                src={item.image}
                                alt={item.name}
                                className="object-cover w-full h-full"
                              />
                              {isSelected && (
                                <div className="absolute flex items-center justify-center w-6 h-6 rounded-full top-2 right-2 bg-accent">
                                  <Check size={14} className="text-white" />
                                </div>
                              )}
                            </div>

                            {/* Product Info */}
                            <div className="p-4">
                              <h4 className="mb-1 font-semibold text-gray-900">{item.name}</h4>
                              <p className="mb-3 text-sm text-gray-600 line-clamp-2">{item.description}</p>
                              
                              {/* Benefits */}
                              <div className="mb-4">
                                <ul className="space-y-1">
                                  {item.benefits.slice(0, 2).map((benefit, idx) => (
                                    <li key={idx} className="flex items-center text-xs text-gray-600">
                                      <Star size={10} className="mr-1 fill-current text-accent" />
                                      {benefit}
                                    </li>
                                  ))}
                                </ul>
                              </div>

                              {/* Price and Actions */}
                              <div className="flex items-center justify-between">
                                <span className="text-lg font-bold text-accent">
                                  ${item.price}
                                </span>
                                
                                {isSelected ? (
                                  <div className="flex items-center space-x-2">
                                    <button
                                      onClick={() => updateItemQuantity(item.id, selectedItem.quantity - 1)}
                                      className="flex items-center justify-center w-8 h-8 transition-colors bg-gray-200 rounded-full hover:bg-gray-300"
                                    >
                                      <Minus size={14} />
                                    </button>
                                    <span className="w-8 font-medium text-center">
                                      {selectedItem.quantity}
                                    </span>
                                    <button
                                      onClick={() => updateItemQuantity(item.id, selectedItem.quantity + 1)}
                                      className="flex items-center justify-center w-8 h-8 text-white transition-colors rounded-full bg-accent hover:bg-supporting"
                                      disabled={totalItems >= MAX_ITEMS}
                                    >
                                      <Plus size={14} />
                                    </button>
                                  </div>
                                ) : (
                                  <button
                                    onClick={() => addItemToKit(item)}
                                    disabled={totalItems >= MAX_ITEMS}
                                    className="flex items-center px-4 py-2 space-x-1 text-white transition-colors bg-accent rounded-xl hover:bg-supporting disabled:bg-gray-300 disabled:cursor-not-allowed"
                                  >
                                    <Plus size={14} />
                                    <span className="text-sm font-medium">Agregar</span>
                                  </button>
                                )}
                              </div>
                            </div>
                          </motion.div>
                        );
                      })}
                    </motion.div>
                  </div>
                </motion.div>
              )}

              {step === 'customize' && (
                <motion.div
                  key="step-customize"
                  className="flex flex-col h-full p-4 overflow-y-auto"
                  variants={stepVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                >
                  <h3 className="mb-6 text-xl font-semibold text-gray-900">
                    Personaliza tu Kit
                  </h3>
                  
                  {/* Kit Name Input */}
                  <div className="mb-6">
                    <label className="block mb-2 text-sm font-medium text-gray-700">
                      Nombre del Kit
                    </label>
                    <input
                      type="text"
                      placeholder="Ej: Mi Rutina Diaria"
                      value={kitName}
                      onChange={(e) => setKitName(e.target.value)}
                      className="w-full px-4 py-3 transition-colors border border-gray-300 rounded-xl focus:ring-2 focus:ring-accent focus:border-accent"
                    />
                  </div>
                  
                  {/* Selected Items */}
                  <div className="space-y-4">
                    <h4 className="font-medium text-gray-900">Productos Seleccionados</h4>
                    {selectedItems.map(item => (
                      <div key={item.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                        <div className="flex items-center space-x-3">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="object-cover w-12 h-12 rounded-lg"
                          />
                          <div>
                            <h5 className="font-medium text-gray-900">{item.name}</h5>
                            <p className="text-sm text-gray-600">
                              ${item.price} x {item.quantity} = ${(item.price * item.quantity).toFixed(2)}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => updateItemQuantity(item.id, item.quantity - 1)}
                            className="flex items-center justify-center w-8 h-8 transition-colors bg-white border border-gray-300 rounded-full hover:bg-gray-50"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="w-8 font-medium text-center">{item.quantity}</span>
                          <button
                            onClick={() => updateItemQuantity(item.id, item.quantity + 1)}
                            className="flex items-center justify-center w-8 h-8 text-white transition-colors rounded-full bg-accent hover:bg-supporting"
                            disabled={totalItems >= MAX_ITEMS}
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {step === 'summary' && (
                <motion.div
                  key="step-summary"
                  className="flex flex-col h-full p-4 overflow-y-auto"
                  variants={stepVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                >
                  <h3 className="mb-6 text-xl font-semibold text-gray-900">
                    Resumen de tu Kit
                  </h3>
                  
                  {/* Kit Preview */}
                  <div className="p-6 mb-6 bg-gradient-to-r from-accent/10 to-supporting/10 rounded-2xl">
                    <h4 className="mb-2 text-lg font-semibold text-gray-900">
                      {kitName || 'Mi Kit Personalizado'}
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
                  
                  {/* Price Breakdown */}
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
                          <div className="flex justify-between text-green-600">
                            <span>Descuento ({DISCOUNT_PERCENTAGE}%)</span>
                            <span>-${discountAmount.toFixed(2)}</span>
                          </div>
                        )}
                        
                        <div className="flex justify-between pt-3 mt-3 text-lg font-bold border-t text-accent">
                          <span>Total</span>
                          <span>${finalPrice.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Footer */}
          <div className="p-4 bg-white border-t">
            {/* Kit Summary Bar */}
            <div className="flex items-center justify-between p-3 mb-4 bg-gray-50 rounded-xl">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1 text-sm text-gray-600">
                  <Package size={16} />
                  <span>{totalItems}/{MAX_ITEMS}</span>
                </div>
                <div className="flex items-center space-x-1 text-sm">
                  <ShoppingCart size={16} className="text-gray-600" />
                  <span className="font-semibold text-accent">${finalPrice.toFixed(2)}</span>
                </div>
              </div>
              
              {hasDiscount && (
                <div className="px-2 py-1 text-xs font-medium text-green-800 bg-green-100 rounded-full">
                  {DISCOUNT_PERCENTAGE}% OFF
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-3">
              {step !== 'select' && (
                <button
                  onClick={prevStep}
                  className="flex items-center justify-center px-4 py-3 text-gray-700 transition-colors bg-gray-200 rounded-xl hover:bg-gray-300"
                >
                  <ArrowLeft size={18} className="mr-2" />
                  Atrás
                </button>
              )}
              
              {step === 'summary' ? (
                <button
                  onClick={handleAddToCart}
                  disabled={!canOrder || selectedItems.length === 0}
                  className="flex items-center justify-center flex-1 px-6 py-3 text-white transition-all bg-gradient-to-r from-accent to-supporting rounded-xl hover:shadow-lg disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  <ShoppingCart size={18} className="mr-2" />
                  Agregar al Carrito
                </button>
              ) : (
                <button
                  onClick={isContinueDisabled() ? undefined : nextStep}
                  disabled={step === 'select' && selectedItems.length === 0}
                  className="flex items-center justify-center flex-1 px-6 py-3 text-white transition-all bg-gradient-to-r from-accent to-supporting rounded-xl hover:shadow-lg disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  Continuar
                  <ArrowRight size={18} className="ml-2" />
                </button>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default KitBuilderModal;
import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X, Plus, Minus, Package, Star, Check, ShoppingCart } from 'lucide-react';
import { useCart } from '../../hooks/useCart';
import { useToast } from '../../hooks/useToast';
import { availableItems } from '../../data/builderData';
import { KitItem, SelectedKitItem, KitBuilderModalProps } from '../../types/builder';


const KitBuilderModal: React.FC<KitBuilderModalProps> = ({ isOpen, onClose }) => {
  const { addToCart } = useCart();
  const { showError } = useToast();
  
  const [selectedItems, setSelectedItems] = useState<SelectedKitItem[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('limpieza');
  const [kitName, setKitName] = useState('');
  const [step, setStep] = useState<'select' | 'customize' | 'summary'>('select');

  // Configuración del kit
  const MIN_ORDER_AMOUNT = 50;
  const MAX_ITEMS = 8;
  const DISCOUNT_THRESHOLD = 100;
  const DISCOUNT_PERCENTAGE = 15;



  const categories = [
    { id: 'limpieza', name: 'Limpieza', icon: '🧼' },
    { id: 'hidratacion', name: 'Hidratación', icon: '💧' },
    { id: 'tratamiento', name: 'Tratamiento', icon: '✨' },
    { id: 'accesorios', name: 'Accesorios', icon: '🛍️' }
  ];

  const totalPrice = selectedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const totalItems = selectedItems.reduce((sum, item) => sum + item.quantity, 0);
  const hasDiscount = totalPrice >= DISCOUNT_THRESHOLD;
  const discountAmount = hasDiscount ? (totalPrice * DISCOUNT_PERCENTAGE) / 100 : 0;
  const finalPrice = totalPrice - discountAmount;
  const canOrder = finalPrice >= MIN_ORDER_AMOUNT;

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

    // Crear producto personalizado para el carrito
    const customKit = {
      id: Date.now(), // ID único temporal
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
    
    // Reset y cerrar
    setSelectedItems([]);
    setKitName('');
    setStep('select');
    onClose();
  };

  const stepVariants = {
    initial: { opacity: 0, x: 60 },
    animate: { opacity: 1, x: 0, transition: { duration: 0.45, ease: [0.19, 1.12, 0.7, 0.97] } },
    exit: { opacity: 0, x: -60, transition: { duration: 0.35, ease: [0.19, 1.12, 0.7, 0.97] } },
  };


  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        key="modal-overlay"
        className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm bg-black/70"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
      >
        <motion.div
          key="modal-container"
          className="relative w-full max-w-6xl h-[90vh] bg-white rounded-2xl shadow-2xl overflow-hidden"
          initial={{ scale: 0.92, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.92, opacity: 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 22 }}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <Package className="text-accent" size={28} />
              <div>
                <h2 className="text-2xl font-medium text-primary">Arma tu Kit</h2>
                <p className="text-sm text-content">Creá tu rutina personalizada</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 transition-colors rounded-xl text-primary hover:text-accent"
            >
              <X size={24} />
            </button>
          </div>

          <div className="flex flex-col h-full overflow-y-auto lg:flex-row">
            {/* Sidebar - Categories (hidden on mobile) */}
            <div className="hidden w-full p-6 border-r border-gray-200 lg:block lg:w-56 bg-gray-50">
              <h3 className="mb-4 font-medium text-primary">Categorías</h3>
              <div className="space-y-2">
                {categories.map(category => (
                  <button
                    key={category.id}
                    onClick={() => setActiveCategory(category.id)}
                    className={`w-full p-3 text-left rounded-lg transition-colors ${
                      activeCategory === category.id
                        ? 'bg-accent text-white'
                        : 'hover:bg-gray-200 text-content'
                    }`}
                  >
                    <span className="mr-2">{category.icon}</span>
                    {category.name}
                  </button>
                ))}
              </div>

              {/* Kit Summary */}
              <div className="p-4 mt-6 bg-white border rounded-lg">
                <h4 className="mb-2 font-medium text-primary">Tu Kit</h4>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>Productos:</span>
                    <span>{totalItems}/{MAX_ITEMS}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>${totalPrice}</span>
                  </div>
                  {hasDiscount && (
                    <div className="flex justify-between text-green-600">
                      <span>Descuento ({DISCOUNT_PERCENTAGE}%):</span>
                      <span>-${discountAmount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between pt-1 font-medium border-t text-accent">
                    <span>Total:</span>
                    <span>${finalPrice.toFixed(2)}</span>
                  </div>
                </div>
                
                {!canOrder && (
                  <p className="mt-2 text-xs text-red-600">
                    Mínimo: ${MIN_ORDER_AMOUNT}
                  </p>
                )}
              </div>
            </div>

            {/* Main Content */}
            <div className="relative flex flex-col flex-1 pb-2 mb-20">
              {/* Sticky Top Navigation for Mobile */}
              <div className="sticky top-0 z-30">
                {/* Breadcrumb */}
                <div className="px-4 py-2 border-b bg-gray-50">
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span className={step === 'select' ? 'text-accent font-medium' : ''}>Seleccionar</span>
                    <span className={step === 'customize' ? 'text-accent font-medium' : ''}>Personalizar</span>
                    <span className={step === 'summary' ? 'text-accent font-medium' : ''}>Confirmar</span>
                  </div>
                  <div className="flex mt-2 space-x-1">
                    <div className={`h-1 flex-1 rounded ${step !== 'select' ? 'bg-green-800' : 'bg-gray-300'}`} />
                    <div className={`h-1 flex-1 rounded ${step === 'summary' ? 'bg-green-800' : 'bg-gray-300'}`} />
                  </div>
                </div>

                {/* Kit Summary Bar - Mobile */}
                {step === 'select' && (
                  <div className="p-4 border-b bg-green-50 sm:hidden">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 text-sm">
                        <span className="flex items-center space-x-1">
                          <Package size={16} className="text-gray-600" />
                          <span>{totalItems}/{MAX_ITEMS}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <ShoppingCart size={16} className="text-gray-600" />
                          <span className="font-medium text-supporting">${finalPrice.toFixed(2)}</span>
                        </span>
                      </div>
                      {selectedItems.length > 0 && (
                        <button
                          onClick={() => setStep('customize')}
                          disabled={!canOrder}
                          className="px-3 py-1 text-sm font-medium text-white rounded-lg bg-accent disabled:bg-gray-300"
                        >
                          Continuar
                        </button>
                      )}
                    </div>
                    {!canOrder && finalPrice > 0 && (
                      <p className="mt-1 text-xs text-amber-600">
                        Necesitas ${(MIN_ORDER_AMOUNT - finalPrice).toFixed(2)} más para continuar
                      </p>
                    )}
                  </div>
                )}

                {/* Mobile Category Tabs */}
                {step === 'select' && (
                  <div className="p-4 bg-white border-b sm:hidden">
                    <div className="flex space-x-1">
                      {categories.map(category => (
                        <button
                          key={category.id}
                          onClick={() => setActiveCategory(category.id)}
                          className={`flex-1 p-2 text-xs rounded-lg transition-colors ${
                            activeCategory === category.id
                              ? 'bg-accent text-white'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          <div className="text-base">{category.icon}</div>
                          <div className="mt-1 font-medium">{category.name}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              {/* Main Steps */}
              <AnimatePresence mode="wait">
                {step === 'select' && (
                  <motion.div
                    key="step-select"
                    className="flex-1 p-4 pb-10 overflow-y-auto lg:pt-6"
                    variants={stepVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                  >
                    <motion.div
                      className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3"
                    >
                      {filteredItems.map(item => {
                        const selectedItem = selectedItems.find(selected => selected.id === item.id);
                        const isSelected = !!selectedItem;
                        return (
                          <motion.div
                            key={item.id}
                            initial={{ opacity: 0, y: 200, scale: 0.96 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 32, scale: 0.96 }}
                            transition={{ duration: 0.32, ease: [0, 1.13, 0.7, 0.97] }}
                            className={`border rounded-lg p-4 transition-all ${
                              isSelected ? 'border-accent bg-accent/5' : 'border-gray-200 hover:border-accent/50'
                            }`}
                            whileHover={{ scale: 1.03, boxShadow: "0 4px 24px rgba(0,0,0,0.07)" }}
                          >
                            <div className="relative mb-3">
                              <img
                                src={item.image}
                                alt={item.name}
                                className="object-cover w-full h-32 rounded-lg"
                              />
                              {isSelected && (
                                <div className="absolute p-1 text-white rounded-full top-2 right-2 bg-accent">
                                  <Check size={16} />
                                </div>
                              )}
                            </div>
                            
                            <h4 className="mb-1 font-medium text-primary">{item.name}</h4>
                            <p className="mb-2 text-sm text-content">{item.description}</p>
                            
                            <div className="mb-3">
                              <ul className="space-y-1 text-xs text-content">
                                {item.benefits.slice(0, 2).map((benefit, idx) => (
                                  <li key={idx} className="flex items-center">
                                    <Star size={10} className="mr-1 text-accent" />
                                    {benefit}
                                  </li>
                                ))}
                              </ul>
                            </div>
                            
                            <div className="flex items-center justify-between">
                              <span className="font-medium text-accent">${item.price}</span>
                              
                              {isSelected ? (
                                <div className="flex items-center space-x-2">
                                  <button
                                    onClick={() => updateItemQuantity(item.id, selectedItem.quantity - 1)}
                                    className="flex items-center justify-center p-1 bg-gray-200 rounded-full hover:bg-gray-300"
                                  >
                                    <Minus size={14} />
                                  </button>
                                  <span className="w-8 text-center">{selectedItem.quantity}</span>
                                  <button
                                    onClick={() => updateItemQuantity(item.id, selectedItem.quantity + 1)}
                                    className="flex items-center justify-center p-1 text-white rounded-full bg-accent hover:bg-supporting"
                                    disabled={totalItems >= MAX_ITEMS}
                                  >
                                    <Plus size={14} />
                                  </button>
                                </div>
                              ) : (
                                <button
                                  onClick={() => addItemToKit(item)}
                                  disabled={totalItems >= MAX_ITEMS}
                                  className="flex items-center justify-center px-3 py-1 text-white rounded-lg bg-accent hover:bg-supporting disabled:bg-gray-300 disabled:cursor-not-allowed"
                                >
                                  <Plus size={16} />
                                </button>
                              )}
                            </div>
                          </motion.div>
                        );
                      })}
                    </motion.div>
                  </motion.div>
                )}
                {step === 'customize' && (
                  <motion.div
                    key="step-customize"
                    className="flex-1 p-6"
                    variants={stepVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                  >
                    <h3 className="mb-4 text-lg font-medium text-primary">
                      Personalizá tu Kit
                    </h3>
                    
                    <div className="mb-6">
                      <label className="block mb-2 text-sm font-medium text-content">
                        Nombre del Kit
                      </label>
                      <input
                        type="text"
                        placeholder="Ej: Mi Rutina Diaria"
                        value={kitName}
                        onChange={(e) => setKitName(e.target.value || "Mi Kit Personalizado")}
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:border-accent focus:ring-1 focus:ring-accent"
                      />
                    </div>
                    
                    <div className="space-y-4">
                      {selectedItems.map(item => (
                        <div key={item.id} className="flex items-center justify-between p-4 bg-white border rounded-lg">
                          <div>
                            <h4 className="text-sm font-medium text-primary">{item.name}</h4>
                            <p className="text-xs text-content">
                              ${item.price} x {item.quantity}
                            </p>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => updateItemQuantity(item.id, item.quantity - 1)}
                              className="flex items-center justify-center p-1 bg-gray-200 rounded-full hover:bg-gray-300"
                            >
                              <Minus size={14} />
                            </button>
                            <span className="w-8 text-center">{item.quantity}</span>
                            <button
                              onClick={() => updateItemQuantity(item.id, item.quantity + 1)}
                              className="flex items-center justify-center p-1 text-white rounded-full bg-accent hover:bg-supporting"
                              disabled={totalItems >= MAX_ITEMS}
                            >
                              <Plus size={14} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="flex justify-between mt-6">
                      <button
                        onClick={() => setStep('select')}
                        className="px-6 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 text-primary"
                      >
                        Atrás
                      </button>
                      <button
                        onClick={() => setStep('summary')}
                        className="px-6 py-2 text-white rounded-lg bg-accent hover:bg-supporting disabled:bg-gray-300 disabled:cursor-not-allowed"
                      >
                        Siguiente
                      </button>
                    </div>
                  </motion.div>
                )}
                {step === 'summary' && (
                  <motion.div
                    key="step-summary"
                    className="flex-1 p-6"
                    variants={stepVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                  >
                    <h3 className="mb-4 text-lg font-medium text-primary">
                      Resumen de tu Kit
                    </h3>
                    
                    <div className="mb-6">
                      <h4 className="mb-2 text-sm font-medium text-content">
                        Nombre del Kit
                      </h4>
                      <p className="text-lg font-semibold text-primary">{kitName || 'Mi Kit Personalizado'}</p>
                    </div>
                    
                    <div className="mb-6">
                      <h4 className="mb-2 text-sm font-medium text-content">
                        Productos Seleccionados
                      </h4>
                      <ul className="space-y-2 text-sm text-content">
                        {selectedItems.map(item => (
                          <li key={item.id} className="flex justify-between">
                            <span>{item.name}</span>
                            <span>{item.quantity}x</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span>Subtotal:</span>
                        <span>${totalPrice}</span>
                      </div>
                      {hasDiscount && (
                        <div className="flex justify-between text-green-600">
                          <span>Descuento ({DISCOUNT_PERCENTAGE}%):</span>
                          <span>-${discountAmount.toFixed(2)}</span>
                        </div>
                      )}
                      <div className="flex justify-between pt-1 font-medium border-t text-accent">
                        <span>Total:</span>
                        <span>${finalPrice.toFixed(2)}</span>
                      </div>
                    </div>

                    <div className="flex justify-between mt-6">
                      <button
                        onClick={() => setStep('customize')}
                        className="px-6 py-2 text-sm bg-gray-200 rounded-lg hover:bg-gray-300 text-primary"
                      >
                        Atrás
                      </button>
                      <button
                        onClick={handleAddToCart}
                        disabled={!canOrder || selectedItems.length === 0}
                        className="px-2 text-sm text-white rounded-lg lg:px-6 lg:py-2 bg-accent hover:bg-supporting disabled:bg-gray-300 disabled:cursor-not-allowed"
                      >
                        Confirmar y Agregar al Carrito
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default KitBuilderModal;
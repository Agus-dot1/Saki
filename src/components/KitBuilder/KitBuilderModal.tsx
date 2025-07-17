import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X, Plus, Minus, Package, Star, Check, ShoppingCart, ArrowLeft, ArrowRight, Shuffle, Sparkles } from 'lucide-react';
import { useCart } from '../../hooks/useCart';
import { useToast } from '../../hooks/useToast';
import { availableItems } from '../../data/builderData';
import { KitItem, SelectedKitItem, KitBuilderModalProps } from '../../types/builder';
import { cubicBezier } from "framer-motion";

// Predefined kit names for random selection
const SUGGESTED_KIT_NAMES = [
  'Mi Rutina Matutina',
  'Kit Glow-Up',
  'Ritual de Belleza',
  'Momento Zen',
  'Piel Radiante',
  'Cuidado Premium',
  'Ritual Nocturno',
  'Esencia Natural',
  'Brillo Interior',
  'Amor Propio',
  'Ritual Sagrado',
  'Piel de Seda',
  'Momento Mágico',
  'Cuidado Divino',
  'Ritual de Luz',
  'Glow Goals',
  'Self-Care Mode',
  'Beauty Vibes',
  'Skin Therapy',
  'Mi kit esencial',
  'Glow Session',
  'Ritual de Belleza',
  'Skin Love',
  'Pure Vibes',
];

type WizardStep = 'name' | 'select' | 'customize' | 'summary';

const KitBuilderModal: React.FC<KitBuilderModalProps> = ({ isOpen, onClose }) => {
  const { addToCart } = useCart();
  const { showError } = useToast();
  
  const [selectedItems, setSelectedItems] = useState<SelectedKitItem[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('limpieza');
  const [kitName, setKitName] = useState('');
  const [step, setStep] = useState<WizardStep>('name');

  // Kit configuration
  const MIN_ORDER_AMOUNT = 10000;
  const MAX_ITEMS = 8; 
  const DISCOUNT_THRESHOLD = 20000;
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

  // Generate random kit name
  const generateRandomName = () => {
    const randomName = SUGGESTED_KIT_NAMES[Math.floor(Math.random() * SUGGESTED_KIT_NAMES.length)];
    setKitName(randomName);
  };

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
    
    setSelectedItems([]);
    setKitName('');
    setStep('name');
    onClose();
  };

  const nextStep = () => {
    if (step === 'name') setStep('select');
    else if (step === 'select') setStep('customize');
    else if (step === 'customize') setStep('summary');
  };

  const prevStep = () => {
    if (step === 'summary') setStep('customize');
    else if (step === 'customize') setStep('select');
    else if (step === 'select') setStep('name');
  };

  const canContinueFromName = kitName.trim().length > 0;
  const canContinueFromSelect = selectedItems.length > 0 && finalPrice >= MIN_ORDER_AMOUNT;

  // Full-screen wizard animations
const wizardVariants = {
  initial: { opacity: 0 },
  animate: { 
    opacity: 1, 
    transition: { duration: 0.4, ease: cubicBezier(0.19, 1.12, 0.7, 0.97) }
  },
  exit: { 
    opacity: 0, 
    transition: { duration: 0.3, ease: cubicBezier(0.19, 1.12, 0.7, 0.97) }
  },
};

  const stepVariants = {
  initial: { opacity: 0, x: 60, scale: 0.98 },
  animate: { 
    opacity: 1, 
    x: 0, 
    scale: 1,
    transition: { 
      duration: 0.5,
      delay: 0,
      ease: cubicBezier(0.19, 1.12, 0.7, 0.97),
      staggerChildren: 0.1
    } 
  },
  exit: { 
    opacity: 0, 
    x: -60, 
    scale: 0.98,
    transition: { 
      duration: 0.3, 
      ease: cubicBezier(0.19, 1.12, 0.7, 0.97)
    } 
  },
};

  const itemVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 overflow-x-hidden overflow-y-auto py-14 bg-gradient-to-b from-white to-white/80 backdrop-blur-sm"
        variants={wizardVariants}
        initial="initial"
        animate="animate"
        exit="exit"
      >


        {/* Close Button */}
        <motion.button
          onClick={onClose}
          className="absolute z-20 flex items-center justify-center p-2 transition-all duration-200 rounded-full shadow-lg md:p-3 top-2 right-2 md:top-6 md:right-6 bg-white/80 backdrop-blur-sm hover:bg-white hover:scale-110"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <X size={22} className="text-primary" />
        </motion.button>

        {/* Progress Indicator */}
        <motion.div 
            className="absolute z-20 left-2 md:left-24 top-4 md:top-6"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex items-center px-4 py-2 space-x-2 text-xs rounded-full shadow-lg md:px-6 md:py-3 md:space-x-3 bg-white/80 backdrop-blur-sm md:text-base">
              {(['name', 'select', 'customize', 'summary'] as WizardStep[]).map((stepName, index) => (
                <div key={stepName} className="flex items-center">
                  <div className={`w-2 h-2 md:w-3 md:h-3 rounded-full transition-all duration-300 ${
                    step === stepName 
                      ? 'bg-accent scale-125' 
                      : index < (['name', 'select', 'customize', 'summary'] as WizardStep[]).indexOf(step)
                        ? 'bg-accent'
                        : 'bg-gray-200'
                  }`} />
                  {index < 3 && (
                    <div className={`w-4 h-0.5 md:w-8 mx-0.5 md:mx-1 transition-all duration-300 ${
                      index < (['name', 'select', 'customize', 'summary'] as WizardStep[]).indexOf(step)
                        ? 'bg-accent'
                        : 'bg-gray-200'
                    }`} />
                  )}
                </div>
              ))}
            </div>
          </motion.div>

        {/* Main Content */}
        <div className="flex items-center justify-center min-h-screen p-2 overflow-x-hidden md:p-6">
          <div className="w-full max-w-sm mx-auto md:max-w-4xl">
            <AnimatePresence mode="wait">
                <motion.div
                key={step}          
                variants={stepVariants}
                initial="initial"
                animate="animate"
                exit="exit"
              >
              {/* Step 1: Name Your Kit */}
              {step === 'name' && (
                <motion.div
                  key="step-name"
                  variants={stepVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  className="text-center"
                >
                  <motion.div variants={itemVariants} className="mb-6 md:mb-8">
                    <div className="flex items-center justify-center mb-4 md:mb-6">
                      <div className="p-3 rounded-full md:p-4 bg-gradient-to-br from-accent to-supporting">
                        <Sparkles size={24} className="text-white" />
                      </div>
                    </div>
                    <h1 className="mb-2 text-2xl font-bold md:mb-4 md:text-4xl lg:text-6xl text-primary">
                      Nombrá tu Kit
                    </h1>
                    <p className="max-w-xs mx-auto text-base leading-relaxed md:max-w-2xl md:text-lg lg:text-xl text-content">
                      Dale vida a tu rutina personalizada con un nombre único que refleje tu estilo y personalidad
                    </p>
                  </motion.div>

                  <motion.div variants={itemVariants} className="max-w-xs mx-auto mb-6 md:max-w-md md:mb-8">
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Ej: Mi Rutina Matutina"
                        value={kitName}
                        onChange={(e) => setKitName(e.target.value)}
                        className="w-full px-4 py-2 text-base text-center transition-all duration-200 border-2 md:px-6 md:py-4 md:text-xl border-accent/20 rounded-xl md:rounded-2xl focus:border-accent focus:ring-4 focus:ring-accent/20 bg-white/80 backdrop-blur-sm placeholder-content/60"
                        maxLength={50}
                      />
                      <div className="absolute right-0 text-xs md:text-sm -bottom-5 md:-bottom-6 text-content/60">
                        {kitName.length}/50
                      </div>
                    </div>
                  </motion.div>

                  <motion.div variants={itemVariants} className="mb-8 md:mb-12">
                    <button
                      type="button"
                      onClick={generateRandomName}
                      className="inline-flex items-center px-4 py-2 space-x-2 text-sm transition-colors duration-200 rounded-lg md:px-6 md:py-3 text-accent hover:text-supporting bg-accent/10 hover:bg-accent/20 md:rounded-xl md:text-base"
                    >
                      <Shuffle size={16} />
                      <span>Generar nombre aleatorio</span>
                    </button>
                  </motion.div>

                  <motion.div variants={itemVariants}>
                    <button
                      type="button"
                      onClick={nextStep}
                      disabled={!canContinueFromName}
                      className="inline-flex items-center px-6 py-3 space-x-2 text-base font-medium text-white transition-all duration-300 transform md:px-8 md:py-4 md:space-x-3 md:text-lg bg-gradient-to-r from-accent to-supporting rounded-xl md:rounded-2xl hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none hover:scale-105"
                    >
                      <span>Comenzar a Armar</span>
                      <ArrowRight size={18} />
                    </button>
                  </motion.div>
                </motion.div>
              )}

              {/* Step 2: Select Products */}
              {step === 'select' && (
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
                        {categories.map(category => (
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
                    className="grid grid-cols-2 gap-3 mb-6 md:grid-cols-3 md:gap-6 md:mb-8"
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
                          className={`relative bg-white/80 backdrop-blur-sm rounded-xl md:rounded-2xl border-2 transition-all duration-300 hover:shadow-xl ${
                            isSelected 
                              ? 'border-accent shadow-lg shadow-accent/20 scale-105' 
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          {/* Product Image */}
                          <div className="relative overflow-hidden aspect-square rounded-t-xl md:rounded-t-2xl">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="object-cover w-full h-full transition-transform duration-300 hover:scale-110"
                            />
                            {isSelected && (
                              <div className="absolute flex items-center justify-center w-6 h-6 rounded-full shadow-lg md:w-8 md:h-8 top-2 right-2 md:top-3 md:right-3 bg-accent">
                                <Check size={14} className="text-white" />
                              </div>
                            )}
                          </div>

                          {/* Product Info */}
                          <div className="p-3 md:p-6">
                            <h4 className="mb-1 text-base font-semibold text-gray-900 md:mb-2 md:text-lg">{item.name}</h4>
                            <p className="mb-2 text-xs text-gray-600 md:mb-4 md:text-sm line-clamp-2">{item.description}</p>
                            
                            {/* Benefits */}
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

                            {/* Price and Actions */}
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
                                  disabled={totalItems >= MAX_ITEMS}
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
                    })}
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
              )}

              {/* Step 3: Customize */}
              {step === 'customize' && (
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
                    {/* Kit Name Edit */}
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
                    
                    {/* Selected Items */}
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

                  {/* Navigation */}
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
              )}

              {/* Step 4: Summary */}
              {step === 'summary' && (
                <motion.div
                  key="step-summary"
                  variants={stepVariants}
                  initial="initial"
                  animate="animate"
                  exit={{ opacity: 0, x: 60, scale: 0.95, transition: { duration: 0.4, ease: cubicBezier(0.19, 1.12, 0.7, 0.97) } }}
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
                    {/* Kit Preview */}
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

                  {/* Navigation */}
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
              )}
              
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
{/* Kit Summary Bar - Only show after name step */}
              {step !== 'name' && (
                <motion.div 
                  className="z-20 flex items-end justify-end w-full pr-5 mt-5 md:pr-24"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <div className="flex items-center px-4 py-2 space-x-2 text-xs rounded-full shadow-lg md:px-6 md:py-3 md:space-x-4 bg-white/90 md:text-base">
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
              )}
      </motion.div>
    </AnimatePresence>
  );
};

export default KitBuilderModal;
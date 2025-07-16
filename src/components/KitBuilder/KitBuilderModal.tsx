import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X, Plus, Minus, Package, Star, Check, ShoppingCart, ArrowLeft, ArrowRight, Sparkles, Info, Shuffle, Wand2 } from 'lucide-react';
import { useCart } from '../../hooks/useCart';
import { useToast } from '../../hooks/useToast';
import { availableItems } from '../../data/builderData';
import { KitItem, SelectedKitItem, KitBuilderModalProps } from '../../types/builder';

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
  'Ritual de Luz'
];

type WizardStep = 'name' | 'select' | 'customize' | 'summary';

const KitBuilderModal: React.FC<KitBuilderModalProps> = ({ isOpen, onClose }) => {
  const { addToCart } = useCart();
  const { showError, showSuccess } = useToast();
  
  const [selectedItems, setSelectedItems] = useState<SelectedKitItem[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('limpieza');
  const [kitName, setKitName] = useState('');
  const [step, setStep] = useState<WizardStep>('name');
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
    showSuccess('Kit Agregado', 'Tu kit personalizado fue agregado al carrito');
    
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
  const canContinueFromSelect = selectedItems.length > 0;

  // Full-screen wizard animations
  const wizardVariants = {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: { duration: 0.4, ease: [0.19, 1.12, 0.7, 0.97] } },
    exit: { opacity: 0, transition: { duration: 0.3, ease: [0.19, 1.12, 0.7, 0.97] } },
  };

  const stepVariants = {
    initial: { opacity: 0, x: 60, scale: 0.98 },
    animate: { 
      opacity: 1, 
      x: 0, 
      scale: 1,
      transition: { 
        duration: 0.5, 
        ease: [0.19, 1.12, 0.7, 0.97],
        staggerChildren: 0.1
      } 
    },
    exit: { 
      opacity: 0, 
      x: -60, 
      scale: 0.98,
      transition: { 
        duration: 0.3, 
        ease: [0.19, 1.12, 0.7, 0.97] 
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
        className="fixed inset-0 z-50 bg-gradient-to-br from-accent/5 via-white to-supporting/5"
        variants={wizardVariants}
        initial="initial"
        animate="animate"
        exit="exit"
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute w-96 h-96 rounded-full -top-48 -left-48 bg-gradient-to-br from-accent/20 to-supporting/20 blur-3xl animate-pulse" />
          <div className="absolute w-96 h-96 rounded-full -bottom-48 -right-48 bg-gradient-to-br from-supporting/20 to-accent/20 blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        </div>

        {/* Close Button */}
        <motion.button
          onClick={onClose}
          className="absolute z-20 p-3 transition-all duration-200 rounded-full top-6 right-6 bg-white/80 backdrop-blur-sm hover:bg-white hover:scale-110 shadow-lg"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <X size={24} className="text-primary" />
        </motion.button>

        {/* Progress Indicator */}
        <motion.div 
          className="absolute top-6 left-1/2 transform -translate-x-1/2 z-20"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center space-x-3 px-6 py-3 bg-white/80 backdrop-blur-sm rounded-full shadow-lg">
            {(['name', 'select', 'customize', 'summary'] as WizardStep[]).map((stepName, index) => (
              <div key={stepName} className="flex items-center">
                <div className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  step === stepName 
                    ? 'bg-accent scale-125' 
                    : index < (['name', 'select', 'customize', 'summary'] as WizardStep[]).indexOf(step)
                      ? 'bg-green-500'
                      : 'bg-gray-200'
                }`} />
                {index < 3 && (
                  <div className={`w-8 h-0.5 mx-1 transition-all duration-300 ${
                    index < (['name', 'select', 'customize', 'summary'] as WizardStep[]).indexOf(step)
                      ? 'bg-green-500'
                      : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Main Content */}
        <div className="flex items-center justify-center min-h-screen p-6">
          <div className="w-full max-w-4xl">
            <AnimatePresence mode="wait">
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
                  <motion.div variants={itemVariants} className="mb-8">
                    <div className="flex items-center justify-center mb-6">
                      <div className="p-4 rounded-full bg-gradient-to-br from-accent to-supporting">
                        <Wand2 size={32} className="text-white" />
                      </div>
                    </div>
                    <h1 className="text-4xl lg:text-6xl font-light text-primary mb-4">
                      Nombrá tu Kit
                    </h1>
                    <p className="text-lg lg:text-xl text-content max-w-2xl mx-auto leading-relaxed">
                      Dale vida a tu rutina personalizada con un nombre único que refleje tu estilo y personalidad
                    </p>
                  </motion.div>

                  <motion.div variants={itemVariants} className="max-w-md mx-auto mb-8">
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Ej: Mi Rutina Matutina"
                        value={kitName}
                        onChange={(e) => setKitName(e.target.value)}
                        className="w-full px-6 py-4 text-xl text-center border-2 border-accent/20 rounded-2xl focus:border-accent focus:ring-4 focus:ring-accent/20 bg-white/80 backdrop-blur-sm transition-all duration-200 placeholder-content/60"
                        maxLength={50}
                      />
                      <div className="absolute -bottom-6 right-0 text-sm text-content/60">
                        {kitName.length}/50
                      </div>
                    </div>
                  </motion.div>

                  <motion.div variants={itemVariants} className="mb-12">
                    <button
                      onClick={generateRandomName}
                      className="inline-flex items-center space-x-2 px-6 py-3 text-accent hover:text-supporting transition-colors duration-200 bg-accent/10 hover:bg-accent/20 rounded-xl"
                    >
                      <Shuffle size={18} />
                      <span>Generar nombre aleatorio</span>
                    </button>
                  </motion.div>

                  <motion.div variants={itemVariants}>
                    <button
                      onClick={nextStep}
                      disabled={!canContinueFromName}
                      className="inline-flex items-center space-x-3 px-8 py-4 text-lg font-medium text-white bg-gradient-to-r from-accent to-supporting rounded-2xl hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none transform hover:scale-105"
                    >
                      <span>Comenzar a Armar</span>
                      <ArrowRight size={20} />
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
                  <div className="text-center mb-8">
                    <motion.div variants={itemVariants}>
                      <h2 className="text-3xl lg:text-5xl font-light text-primary mb-4">
                        Elegí tus Productos
                      </h2>
                      <p className="text-lg text-content max-w-2xl mx-auto">
                        Seleccioná los productos que formarán parte de <span className="font-medium text-accent">"{kitName}"</span>
                      </p>
                    </motion.div>
                  </div>

                  {/* Category Selection */}
                  <motion.div variants={itemVariants} className="mb-8">
                    <div className="flex justify-center">
                      <div className="flex flex-wrap gap-3 p-3 bg-white/60 backdrop-blur-sm rounded-2xl shadow-lg">
                        {categories.map(category => (
                          <button
                            key={category.id}
                            onClick={() => setActiveCategory(category.id)}
                            className={`flex items-center space-x-2 px-4 py-3 rounded-xl border-2 transition-all duration-200 ${
                              activeCategory === category.id
                                ? category.color + ' scale-105 shadow-md'
                                : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                            }`}
                          >
                            <span className="text-lg">{category.icon}</span>
                            <span className="font-medium">{category.name}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </motion.div>

                  {/* Products Grid */}
                  <motion.div 
                    variants={itemVariants}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8"
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
                          className={`relative bg-white/80 backdrop-blur-sm rounded-2xl border-2 transition-all duration-300 hover:shadow-xl ${
                            isSelected 
                              ? 'border-accent shadow-lg shadow-accent/20 scale-105' 
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          {/* Product Image */}
                          <div className="relative overflow-hidden aspect-square rounded-t-2xl">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="object-cover w-full h-full transition-transform duration-300 hover:scale-110"
                            />
                            {isSelected && (
                              <div className="absolute flex items-center justify-center w-8 h-8 rounded-full top-3 right-3 bg-accent shadow-lg">
                                <Check size={16} className="text-white" />
                              </div>
                            )}
                          </div>

                          {/* Product Info */}
                          <div className="p-6">
                            <h4 className="mb-2 text-lg font-semibold text-gray-900">{item.name}</h4>
                            <p className="mb-4 text-sm text-gray-600 line-clamp-2">{item.description}</p>
                            
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
                              <span className="text-xl font-bold text-accent">
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
                                  className="flex items-center px-4 py-2 space-x-1 text-white transition-all duration-200 bg-accent rounded-xl hover:bg-supporting hover:scale-105 disabled:bg-gray-300 disabled:cursor-not-allowed disabled:transform-none"
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

                  {/* Navigation */}
                  <motion.div variants={itemVariants} className="flex justify-center space-x-4">
                    <button
                      onClick={prevStep}
                      className="flex items-center space-x-2 px-6 py-3 text-gray-700 bg-white/80 backdrop-blur-sm rounded-xl hover:bg-white transition-all duration-200"
                    >
                      <ArrowLeft size={18} />
                      <span>Atrás</span>
                    </button>
                    
                    <button
                      onClick={nextStep}
                      disabled={!canContinueFromSelect}
                      className="flex items-center space-x-2 px-8 py-3 text-white bg-gradient-to-r from-accent to-supporting rounded-xl hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <span>Continuar</span>
                      <ArrowRight size={18} />
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
                  className="max-w-2xl mx-auto"
                >
                  <div className="text-center mb-8">
                    <motion.div variants={itemVariants}>
                      <h2 className="text-3xl lg:text-5xl font-light text-primary mb-4">
                        Personalizá tu Kit
                      </h2>
                      <p className="text-lg text-content">
                        Ajustá los detalles finales de <span className="font-medium text-accent">"{kitName}"</span>
                      </p>
                    </motion.div>
                  </div>

                  <motion.div variants={itemVariants} className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg mb-8">
                    {/* Kit Name Edit */}
                    <div className="mb-8">
                      <label className="block mb-3 text-lg font-medium text-gray-700">
                        Nombre del Kit
                      </label>
                      <input
                        type="text"
                        value={kitName}
                        onChange={(e) => setKitName(e.target.value)}
                        className="w-full px-4 py-3 border-2 border-accent/20 rounded-xl focus:border-accent focus:ring-4 focus:ring-accent/20 transition-all duration-200"
                        maxLength={50}
                      />
                    </div>
                    
                    {/* Selected Items */}
                    <div className="space-y-4">
                      <h4 className="text-lg font-medium text-gray-900">Productos Seleccionados</h4>
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

                  {/* Navigation */}
                  <motion.div variants={itemVariants} className="flex justify-center space-x-4">
                    <button
                      onClick={prevStep}
                      className="flex items-center space-x-2 px-6 py-3 text-gray-700 bg-white/80 backdrop-blur-sm rounded-xl hover:bg-white transition-all duration-200"
                    >
                      <ArrowLeft size={18} />
                      <span>Atrás</span>
                    </button>
                    
                    <button
                      onClick={nextStep}
                      className="flex items-center space-x-2 px-8 py-3 text-white bg-gradient-to-r from-accent to-supporting rounded-xl hover:shadow-lg transition-all duration-200"
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
                  exit="exit"
                  className="max-w-2xl mx-auto"
                >
                  <div className="text-center mb-8">
                    <motion.div variants={itemVariants}>
                      <h2 className="text-3xl lg:text-5xl font-light text-primary mb-4">
                        Tu Kit Está Listo
                      </h2>
                      <p className="text-lg text-content">
                        Revisá los detalles de <span className="font-medium text-accent">"{kitName}"</span> antes de agregarlo al carrito
                      </p>
                    </motion.div>
                  </div>

                  <motion.div variants={itemVariants} className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg mb-8">
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
                            <div className="flex justify-between text-green-600">
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
                      className="flex items-center space-x-2 px-6 py-3 text-gray-700 bg-white/80 backdrop-blur-sm rounded-xl hover:bg-white transition-all duration-200"
                    >
                      <ArrowLeft size={18} />
                      <span>Atrás</span>
                    </button>
                    
                    <button
                      onClick={handleAddToCart}
                      disabled={!canOrder || selectedItems.length === 0}
                      className="flex items-center space-x-3 px-8 py-4 text-lg font-medium text-white bg-gradient-to-r from-accent to-supporting rounded-2xl hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none transform hover:scale-105"
                    >
                      <ShoppingCart size={20} />
                      <span>Agregar al Carrito</span>
                    </button>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Kit Summary Bar - Only show after name step */}
        {step !== 'name' && (
          <motion.div 
            className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <div className="flex items-center space-x-4 px-6 py-3 bg-white/90 backdrop-blur-sm rounded-full shadow-lg border border-white/20">
              <div className="flex items-center space-x-1 text-sm text-gray-600">
                <Package size={16} />
                <span>{totalItems}/{MAX_ITEMS}</span>
              </div>
              <div className="flex items-center space-x-1 text-sm">
                <ShoppingCart size={16} className="text-gray-600" />
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
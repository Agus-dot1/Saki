import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingCart, Star, Shield, Truck, Share2, Gem, Ruler, Package, Award } from 'lucide-react';
import { JewelryItem } from '../../types/jewelry';
import { useCart } from '../../hooks/useCart';
import { useToast } from '../../hooks/useToast';
import OptimizedCarousel from '../Products/OptimizedCarousel';

interface JewelryDialogProps {
  item: JewelryItem;
  onClose: () => void;
  onOpenCart: () => void;
}

const JewelryDialog: React.FC<JewelryDialogProps> = ({ item, onClose, onOpenCart }) => {
  const { addToCart } = useCart();
  const { showSuccess, showInfo } = useToast();
  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState<string | undefined>(
    item.availableSizes && item.availableSizes.length > 0 ? item.availableSizes[0] : undefined
  );
  const [activeTab, setActiveTab] = useState<'details' | 'care' | 'specs'>('details');

  const handleAddToCart = () => {
    // Convert JewelryItem to Product format for cart compatibility
    const productForCart = {
      id: item.id,
      name: item.name,
      description: item.description,
      shortDescription: item.description,
      price: item.price,
      contents: [item.material],
      images: item.images,
      detailedDescription: item.detailedDescription,
      stock: item.stock,
      keyBenefits: item.features,
      featuredIngredients: item.gemstones || [],
      discountPercentage: item.discountPercentage || 0,
      oldPrice: item.oldPrice || item.price,
      sizes: item.availableSizes,
    };

    addToCart(productForCart, selectedQuantity);
    onClose();
    onOpenCart();
  };

  const handleSizeGuide = () => {
    if (item.category === 'rings') {
      document.dispatchEvent(new CustomEvent('openRingSizeGuide'));
    } else {
      showInfo(
        'Guía de Tallas',
        'La guía de tallas está disponible solo para anillos'
      );
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: item.name,
        text: item.description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      showSuccess('Enlace Copiado', 'El enlace del producto fue copiado al portapapeles');
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  // Prevent body scroll when dialog is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  const getStockStatus = () => {
    if (item.stock <= 0) {
      return { text: 'Sin Stock', color: 'text-red-600 bg-red-50 border-red-200', available: false };
    } else if (item.stock <= 3) {
      return { text: `Solo ${item.stock} disponibles`, color: 'text-amber-600 bg-amber-50 border-amber-200', available: true };
    } else if (item.stock <= 10) {
      return { text: `${item.stock} disponibles`, color: 'text-blue-600 bg-blue-50 border-blue-200', available: true };
    }
    
    return { text: 'En Stock', color: 'text-green-600 bg-green-50 border-green-200', available: true };
  };

  const stockStatus = getStockStatus();

  const containerVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: {
        duration: 0.2,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    },
    exit: { 
      opacity: 0, 
      scale: 0.9,
      transition: {
        duration: 0.2,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    }
  };

  const contentVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.3,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
      className="flex overflow-hidden fixed inset-0 z-50 justify-center items-center p-2 min-w-full min-h-screen backdrop-blur-sm bg-black/70 sm:p-4"
      onClick={handleBackdropClick}
      onKeyDown={handleKeyDown}
      role="dialog"
      aria-modal="true"
      aria-labelledby="jewelry-dialog-title"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      <motion.div 
        className="relative flex flex-col w-full max-w-6xl h-[95vh] overflow-hidden bg-white shadow-2xl rounded-xl lg:rounded-2xl"
        onClick={(e) => e.stopPropagation()}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        {/* Header with close and action buttons */}
        <div className="flex absolute top-3 right-3 z-20 items-center space-x-2 lg:top-6 lg:right-6 lg:space-x-4">
          <motion.button
            onClick={handleShare}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="p-2 lg:p-3 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white"
            aria-label="Compartir producto"
          >
            <Share2 size={18} className="text-primary lg:w-5 lg:h-5" />
          </motion.button>
          <motion.button 
            onClick={onClose}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="p-2 lg:p-3 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white"
            aria-label="Cerrar diálogo"
          >
            <X size={20} className="text-primary lg:w-6 lg:h-6" />
          </motion.button>
        </div>
        
        <div className="flex flex-col h-full lg:flex-row">
          {/* Image Section */}
          <div className="flex relative justify-center items-center p-3 bg-gradient-to-br lg:w-2/5 lg:p-6 from-secondary/30 to-secondary/60">
            <div className="overflow-hidden w-full max-w-sm bg-white rounded-xl shadow-lg lg:max-w-lg aspect-square">
              <OptimizedCarousel 
                images={item.images} 
                alt={item.name}
                className="object-contain h-full"
              />
            </div>
            
            {/* Floating stock indicator */}
            {stockStatus && (
              <motion.div 
                className={`absolute top-5 left-5 lg:top-6 lg:left-6 px-3 py-1.5 lg:px-4 lg:py-2 rounded-full text-xs lg:text-sm font-medium border ${stockStatus.color} backdrop-blur-sm shadow`}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
              >
                <div className="flex items-center space-x-1">
                  <Package size={12} />
                  <span>{stockStatus.text}</span>
                </div>
              </motion.div>
            )}

            {/* Discount badge */}
            {item.discountPercentage && item.discountPercentage > 0 && (
              <motion.div 
                className="absolute top-5 right-5 lg:top-6 lg:right-6 px-3 py-1.5 lg:px-4 lg:py-2 rounded-full text-xs lg:text-sm font-medium bg-accent text-white shadow"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 }}
              >
                -{item.discountPercentage}% OFF
              </motion.div>
            )}
          </div>
          
          {/* Content Section */}
          <motion.div 
            className="flex flex-col h-full bg-white lg:w-3/5"
            variants={contentVariants}
            initial="hidden"
            animate="visible"
          >
            <div className="flex-1 p-4 overflow-y-auto pb-[120px] lg:pb-6 lg:p-6">
              {/* Product Header */}
              <motion.div className="mb-4 lg:mb-6" variants={itemVariants}>
                <h2 
                  id="jewelry-dialog-title"
                  className="mb-2 text-2xl font-light leading-tight lg:mb-3 lg:text-3xl xl:text-4xl text-primary"
                >
                  {item.name}
                </h2>
                <div className="flex flex-wrap gap-2 items-baseline mb-3 lg:gap-3 lg:mb-4">
                  <span className="text-2xl font-medium lg:text-3xl xl:text-4xl text-accent">
                    ${item.price.toFixed(2)}
                  </span>
                  {item.oldPrice && item.oldPrice > item.price && (
                    <span className="text-base line-through lg:text-lg text-content">
                      ${item.oldPrice.toFixed(2)}
                    </span>
                  )}
                  {item.discountPercentage && (
                    <span className="px-2 py-1 text-xs font-medium rounded-full lg:px-3 lg:text-sm bg-accent/10 text-accent">
                      {item.discountPercentage}% OFF
                    </span>
                  )}
                </div>
                <p className="text-base leading-relaxed lg:text-lg text-content">
                  {item.description}
                </p>
              </motion.div>
              
              {/* Trust Indicators */}
              <motion.div 
                className="grid grid-cols-3 gap-2 p-3 mb-4 rounded-xl lg:gap-4 lg:p-4 lg:mb-6 bg-accent/10"
                variants={itemVariants}
              >
                <div className="text-center">
                  <Gem className="mx-auto mb-1 w-6 h-6 lg:mb-2 lg:w-8 lg:h-8 text-accent" />
                  <p className="text-xs font-medium lg:text-sm text-primary">Materiales Premium</p>
                </div>
                <div className="text-center">
                  <Award className="mx-auto mb-1 w-6 h-6 lg:mb-2 lg:w-8 lg:h-8 text-accent" />
                  <p className="text-xs font-medium lg:text-sm text-primary">Crafted a Mano</p>
                </div>
                <div className="text-center">
                  <Shield className="mx-auto mb-1 w-6 h-6 lg:mb-2 lg:w-8 lg:h-8 text-accent" />
                  <p className="text-xs font-medium lg:text-sm text-primary">
                    {item.warranty || 'Garantía Incluida'}
                  </p>
                </div>
              </motion.div>
              
              {/* Quantity and Size Selectors */}
              <motion.div className="mb-4 lg:mb-6" variants={itemVariants}>
                <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                  {/* Quantity */}
                  <div>
                    <label className="block mb-2 text-base font-medium lg:mb-3 lg:text-lg text-primary">
                      Cantidad
                    </label>
                    <div className="flex items-center rounded-lg border border-accent/20">
                      <button
                        onClick={() => setSelectedQuantity(Math.max(1, selectedQuantity - 1))}
                        className="px-4 py-3 transition-colors hover:bg-accent/20"
                        disabled={selectedQuantity <= 1}
                      >
                        -
                      </button>
                      <span className="px-6 py-3 select-none font-medium min-w-[60px] text-center">
                        {selectedQuantity}
                      </span>
                      <button
                        onClick={() => setSelectedQuantity(selectedQuantity + 1)}
                        className="px-4 py-3 transition-colors hover:bg-accent/20"
                        disabled={stockStatus?.available === false || selectedQuantity >= item.stock}
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Size Selection */}
                  {item.availableSizes && item.availableSizes.length > 0 && (
                    <div>
                      <div className="flex items-center justify-between mb-2 lg:mb-3">
                        <label className="text-base font-medium lg:text-lg text-primary">
                          Talla
                        </label>
                        {item.category === 'rings' && (
                          <button
                            onClick={handleSizeGuide}
                            className="flex items-center space-x-1 text-sm text-accent hover:text-supporting"
                          >
                            <Ruler size={14} />
                            <span>Guía de Tallas</span>
                          </button>
                        )}
                      </div>
                      <select
                        className="w-full px-3 py-3 rounded-lg border border-accent/20 focus:outline-none focus:ring-2 focus:ring-accent"
                        value={selectedSize}
                        onChange={e => setSelectedSize(e.target.value)}
                      >
                        {item.availableSizes.map((size, idx) => (
                          <option key={idx} value={size}>Talla {size}</option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>

                {/* Total Price */}
                <div className="mt-3 text-right">
                  <span className="text-sm lg:text-base text-content">
                    Total: <span className="font-medium text-primary">${(item.price * selectedQuantity).toFixed(2)}</span>
                  </span>
                </div>
              </motion.div>
              
              {/* Tabs */}
              <motion.div className="mb-4 lg:mb-6" variants={itemVariants}>
                <div className="flex p-2 mb-3 space-x-1 rounded-lg lg:mb-4 bg-accent/10">
                  {[
                    { id: 'details', label: 'Detalles' },
                    { id: 'care', label: 'Cuidados' },
                    { id: 'specs', label: 'Especificaciones' },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as 'details' | 'care' | 'specs')}
                      className={`flex-1 py-2 px-3 lg:py-3 lg:px-4 rounded-md text-sm font-medium transition-all duration-200 ${
                        activeTab === tab.id
                          ? 'bg-white text-primary shadow-sm scale-105'
                          : 'text-content hover:text-primary'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
                
                {/* Tab Content */}
                <div className="overflow-y-auto p-4 h-48 bg-white rounded-lg border transition-all duration-200 lg:h-64 border-secondary/20 lg:p-6">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeTab}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="h-full"
                    >
                      {activeTab === 'details' && (
                        <div className="space-y-4 lg:space-y-6">
                          <p className="text-sm leading-relaxed lg:text-base text-content">
                            {item.detailedDescription}
                          </p>
                          {item.features && item.features.length > 0 && (
                            <div className="p-3 rounded-lg lg:p-4 bg-accent/10">
                              <h4 className="mb-2 font-medium lg:mb-3 text-primary">Características:</h4>
                              <ul className="space-y-1 lg:space-y-2 text-content">
                                {item.features.map((feature, idx) => (
                                  <li key={idx} className="flex items-start text-sm lg:text-base">
                                    <span className="mr-2 text-accent">•</span>
                                    <span>{feature}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      )}
                      {activeTab === 'care' && (
                        <div className="space-y-4 lg:space-y-6">
                          <h4 className="mb-3 text-base font-medium lg:mb-4 lg:text-lg text-primary">Instrucciones de Cuidado:</h4>
                          <ul className="space-y-2 lg:space-y-3">
                            {item.careInstructions.map((instruction, idx) => (
                              <li key={idx} className="flex items-start text-sm lg:text-base">
                                <span className="mr-2 text-accent">•</span>
                                <span className="text-content">{instruction}</span>
                              </li>
                            ))}
                          </ul>
                          {item.warranty && (
                            <div className="p-3 bg-green-50 rounded-lg lg:p-4">
                              <h5 className="mb-2 font-medium text-green-800 lg:mb-3">Garantía:</h5>
                              <p className="text-sm text-green-700 lg:text-base">{item.warranty}</p>
                            </div>
                          )}
                        </div>
                      )}
                      {activeTab === 'specs' && (
                        <div className="space-y-4 lg:space-y-6">
                          <h4 className="mb-3 text-base font-medium lg:mb-4 lg:text-lg text-primary">Especificaciones Técnicas:</h4>
                          <div className="grid grid-cols-1 gap-3 lg:gap-4">
                            <div className="p-3 rounded-lg lg:p-4 bg-secondary/50">
                              <span className="font-medium text-primary">Material:</span>
                              <span className="ml-2 text-content">{item.material}</span>
                            </div>
                            {item.weight && (
                              <div className="p-3 rounded-lg lg:p-4 bg-secondary/50">
                                <span className="font-medium text-primary">Peso:</span>
                                <span className="ml-2 text-content">{item.weight}</span>
                              </div>
                            )}
                            {item.dimensions && (
                              <div className="p-3 rounded-lg lg:p-4 bg-secondary/50">
                                <span className="font-medium text-primary">Dimensiones:</span>
                                <span className="ml-2 text-content">{item.dimensions}</span>
                              </div>
                            )}
                            {item.gemstones && item.gemstones.length > 0 && (
                              <div className="p-3 rounded-lg lg:p-4 bg-secondary/50">
                                <span className="font-medium text-primary">Gemas:</span>
                                <span className="ml-2 text-content">{item.gemstones.join(', ')}</span>
                              </div>
                            )}
                            {item.plating && (
                              <div className="p-3 rounded-lg lg:p-4 bg-secondary/50">
                                <span className="font-medium text-primary">Baño:</span>
                                <span className="ml-2 text-content">{item.plating}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </motion.div>
                  </AnimatePresence>
                </div>
              </motion.div>
            </div>
            
            {/* Sticky Footer */}
            <motion.div 
              className="p-4 bg-white border-t lg:p-6 border-accent/10 shadow-[0_-2px_16px_-8px_rgba(0,0,0,0.06)] sticky bottom-0 z-10"
              variants={itemVariants}
            >
              <div className="flex flex-col gap-3 lg:gap-4 lg:flex-row">
                <motion.button 
                  onClick={handleAddToCart}
                  disabled={stockStatus?.available === false}
                  className="flex-1 bg-accent text-white py-3 px-6 lg:py-4 lg:px-8 rounded-xl flex items-center justify-center space-x-2 lg:space-x-3 hover:bg-supporting transition-all duration-200 transform hover:scale-[1.02] disabled:bg-gray-400 disabled:cursor-not-allowed disabled:transform-none text-base lg:text-lg font-medium shadow-lg"
                  whileHover={{ scale: stockStatus?.available ? 1.02 : 1 }}
                  whileTap={{ scale: stockStatus?.available ? 0.98 : 1 }}
                >
                  <ShoppingCart size={18} className="lg:w-5 lg:h-5" />
                  <span>
                    {stockStatus && !stockStatus.available ? 'Sin Stock' : 'Agregar al Carrito'}
                  </span>
                </motion.button>
              </div>
              <div className="flex flex-wrap justify-center items-center mt-3 space-x-4 text-xs lg:mt-4 lg:space-x-6 lg:text-sm text-content">
                <span className="flex items-center space-x-1">
                  <Truck size={14} className="lg:w-4 lg:h-4" />
                  <span>Envío gratis en CABA</span>
                </span>
                <span className="flex items-center space-x-1">
                  <Shield size={14} className="lg:w-4 lg:h-4" />
                  <span>Garantía incluida</span>
                </span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default JewelryDialog;
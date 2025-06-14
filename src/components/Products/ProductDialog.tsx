import React, { useState, useEffect } from 'react';
import { X, ShoppingCart, Star, Shield, Truck, Share2, Leaf } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Product } from '../../types';
import { useCart } from '../../hooks/useCart';
import { useToast } from '../../hooks/useToast';
import OptimizedCarousel from './OptimizedCarousel';
import ShippingLocationsModal from './ShippingLocationModal';

interface ProductDialogProps {
  product: Product;
  onClose: () => void;
  onOpenCart: () => void; 
} 

const ProductDialog: React.FC<ProductDialogProps> = ({ product, onClose, onOpenCart }) => {
  const { addToCart } = useCart();
  const { showSuccess } = useToast();
  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'description' | 'contenido'>('contenido');
  const [showShippingModal, setShowShippingModal] = useState(false);
  const [itemSelections, setItemSelections] = useState<{ [itemIdx: number]: { color?: string; size?: string } }>({});

  const [selectedColor, setSelectedColor] = useState<string | undefined>(
    product.colors && product.colors.length > 0 ? product.colors[0] : undefined
  );
  const [selectedSize, setSelectedSize] = useState<string | undefined>(
    product.sizes && product.sizes.length > 0 ? product.sizes[0] : undefined
  );

  const handleAddToCart = () => {
    let selectedItems;
    if (product.items && product.items.length > 0) {
      selectedItems = product.items.map((item, idx) => ({
        name: item.name,
        quantity: item.quantity ?? 1,
        color: itemSelections[idx]?.color,
        size: itemSelections[idx]?.size,
      }));
    }
    addToCart(product, selectedQuantity, selectedItems);
    showSuccess(
      '¡Agregado al Carrito!',
      `${product.name} ${selectedQuantity > 1 ? `(${selectedQuantity} unidades)` : ''}`
    );
    onClose();
    onOpenCart();
  };

  useEffect(() => {
    if (product.items) {
      const initialSelections: { [itemIdx: number]: { color?: string; size?: string } } = {};
      product.items.forEach((item, idx) => {
        initialSelections[idx] = {
          color: item.colorOptions && item.colorOptions.length > 0 ? item.colorOptions[0] : undefined,
          size: item.sizeOptions && item.sizeOptions.length > 0 ? item.sizeOptions[0] : undefined,
        };
      });
      setItemSelections(initialSelections);
    }
  }, [product]);

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

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: product.description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      showSuccess('Enlace Copiado', 'El enlace del producto fue copiado al portapapeles');
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
    if (!product.stock) return null;
    
    if (product.stock <= 0) {
      return { text: 'Sin Stock', color: 'text-red-600 bg-red-50 border-red-200', available: false };
    } else if (product.stock <= 5) {
      return { text: `Solo ${product.stock} disponibles`, color: 'text-amber-600 bg-amber-50 border-amber-200', available: true };
    } else if (product.stock <= 10) {
      return { text: `${product.stock} disponibles`, color: 'text-blue-600 bg-blue-50 border-blue-200', available: true };
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
        duration: 0.3,
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
        delay: 0.1,
        duration: 0.4,
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
      aria-labelledby="product-dialog-title"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      <motion.div 
        className="relative flex flex-col w-full max-w-7xl h-[95vh] overflow-hidden bg-white shadow-2xl rounded-xl lg:rounded-2xl"
        onClick={(e) => e.stopPropagation()}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        {/* Header with close and action buttons - Better mobile positioning */}
        <div className="flex absolute top-3 right-3 z-20 items-center space-x-2 lg:top-6 lg:right-6 lg:space-x-4">
          <motion.button
            onClick={handleShare}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="p-2 bg-white/90 rounded-full shadow-md lg:p-3"
            aria-label="Compartir producto"
          >
            <Share2 size={18} className="text-primary lg:w-5 lg:h-5" />
          </motion.button>
          <motion.button 
            onClick={onClose}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="p-2 bg-white/90 rounded-full shadow-md lg:p-3"
            aria-label="Cerrar diálogo"
          >
            <X size={20} className="text-primary lg:w-6 lg:h-6" />
          </motion.button>
        </div>
        
        <div className="flex flex-col h-full lg:flex-row">
          {/* Image Section - Better mobile layout */}
          <div className="flex relative justify-center items-center p-3 bg-gradient-to-br lg:w-2/5 lg:p-6 from-secondary/30 to-secondary/60">
            <div className="overflow-hidden w-full max-w-sm bg-white rounded-xl shadow-lg lg:max-w-lg aspect-square">
              <OptimizedCarousel 
                images={product.images} 
                alt={product.name}
                className="object-contain h-full"
              />
            </div>
            {/* Floating stock indicator - Better mobile positioning */}
            {stockStatus && (
              <motion.div 
                className={`absolute top-4 left-4 lg:top-6 lg:left-6 px-3 py-1.5 lg:px-4 lg:py-2 rounded-full text-xs lg:text-sm font-medium border ${stockStatus.color} backdrop-blur-sm shadow`}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
              >
                {stockStatus.text}
              </motion.div>
            )}
          </div>
          
          {/* Content Section - Improved mobile scrolling */}
          <motion.div 
            className="flex flex-col h-full bg-white lg:w-3/5"
            variants={contentVariants}
            initial="hidden"
            animate="visible"
          >
            <div className="overflow-y-auto flex-1 p-4 lg:p-6">
              {/* Product Header - Better mobile typography */}
              <motion.div className="mb-4 lg:mb-6" variants={itemVariants}>
                <h2 
                  id="product-dialog-title"
                  className="mb-2 text-2xl font-light leading-tight lg:mb-3 lg:text-3xl xl:text-4xl text-primary"
                >
                  {product.name}
                </h2>
                <div className="flex flex-wrap items-baseline gap-2 mb-3 lg:gap-3 lg:mb-4">
                  <span className="text-2xl font-medium lg:text-3xl xl:text-4xl text-accent">
                    ${product.price.toFixed(2)}
                  </span>
                  {product.oldPrice && (
                    <span className="text-base line-through lg:text-lg text-content">
                      ${product.oldPrice.toFixed(2)}
                    </span>
                  )}
                  {product.discountPercentage && (
                    <span className="px-2 py-1 text-xs font-medium rounded-full lg:px-3 lg:text-sm bg-accent/10 text-accent">
                      {product.discountPercentage}% OFF
                    </span>
                  )}
                </div>
                <p className="text-base leading-relaxed lg:text-lg text-content">
                  {product.description}
                </p>
              </motion.div>
              
              {/* Trust Indicators - Better mobile grid */}
              <motion.div 
                className="grid grid-cols-3 gap-2 p-3 mb-4 rounded-xl lg:gap-4 lg:p-4 lg:mb-6 bg-accent/10"
                variants={itemVariants}
              >
                <div className="text-center">
                  <Leaf className="mx-auto mb-1 w-6 h-6 lg:mb-2 lg:w-8 lg:h-8 text-accent" />
                  <p className="text-xs font-medium lg:text-sm text-primary">100% Natural</p>
                </div>
                <div className="text-center">
                  <Truck className="mx-auto mb-1 w-6 h-6 lg:mb-2 lg:w-8 lg:h-8 text-accent" />
                  <p className="text-xs font-medium lg:text-sm text-primary">
                    Entrega Gratis en{' '}
                    <span 
                      className="underline cursor-pointer text-accent"
                      onClick={() => setShowShippingModal(true)}
                      tabIndex={0}
                      role="button"
                    >
                      zonas seleccionadas
                    </span>
                  </p>
                </div>
                <ShippingLocationsModal
                  open={showShippingModal}
                  onClose={() => setShowShippingModal(false)}
                />
                <div className="text-center">
                  <Star className="mx-auto mb-1 w-6 h-6 lg:mb-2 lg:w-8 lg:h-8 text-accent" />
                  <p className="text-xs font-medium lg:text-sm text-primary">Calidad Premium</p>
                </div>
              </motion.div>
              
              {/* Quantity Selector - Better mobile layout */}
              <motion.div className="mb-4 lg:mb-6" variants={itemVariants}>
                <label className="block mb-2 text-base font-medium lg:mb-3 lg:text-lg text-primary">
                  Cantidad
                </label>
                <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:space-x-4">
                  <div className="flex overflow-hidden items-center rounded-lg border border-accent/10">
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
                      disabled={stockStatus?.available === false || (product.stock != null && selectedQuantity >= product.stock)}
                    >
                      +
                    </button>
                  </div>
                  <span className="text-sm lg:text-base text-content">
                    Total: <span className="font-medium text-primary">${(product.price * selectedQuantity).toFixed(2)}</span>
                  </span>
                </div>
              </motion.div>
              
              {/* Product options - Better mobile layout */}
              {product.items && product.items.length > 0 && product.items.map((item, idx) => (
                <motion.div className="mb-4 lg:mb-6" variants={itemVariants} key={idx}>
                  {item.colorOptions && item.colorOptions.length > 0 && (
                    <div className="mb-3">
                      <span className="block mb-1 text-sm font-medium lg:text-base text-content">Color para {item.name}</span>
                      <select
                        className="px-3 py-2 w-full rounded-lg border lg:px-4 lg:py-3 border-accent/20 focus:outline-none focus:ring-2 focus:ring-accent"
                        value={itemSelections[idx]?.color}
                        onChange={e =>
                          setItemSelections(selections => ({
                            ...selections,
                            [idx]: { ...selections[idx], color: e.target.value }
                          }))
                        }
                      >
                        {item.colorOptions.map((color, cidx) => (
                          <option key={cidx} value={color}>{color}</option>
                        ))}
                      </select>
                    </div>
                  )}
                  {item.sizeOptions && item.sizeOptions.length > 0 && (
                    <div>
                      <span className="block mb-1 text-sm font-medium lg:text-base text-content">Tamaño para {item.name}</span>
                      <select
                        className="px-3 py-2 w-full rounded-lg border lg:px-4 lg:py-3 border-accent/20 focus:outline-none focus:ring-2 focus:ring-accent"
                        value={itemSelections[idx]?.size}
                        onChange={e =>
                          setItemSelections(selections => ({
                            ...selections,
                            [idx]: { ...selections[idx], size: e.target.value }
                          }))
                        }
                      >
                        {item.sizeOptions.map((size, sidx) => (
                          <option key={sidx} value={size}>{size}</option>
                        ))}
                      </select>
                    </div>
                  )}
                </motion.div>
              ))}

              {!product.items && (
                <>
                  {product.colors && product.colors.length > 0 && (
                    <motion.div className="mb-4 lg:mb-6" variants={itemVariants}>
                      <label className="block mb-1 text-base font-medium lg:text-lg text-primary">
                        Color
                      </label>
                      <select
                        className="px-3 py-2 w-full rounded-lg border lg:px-4 lg:py-3 border-accent/20 focus:outline-none focus:ring-2 focus:ring-accent"
                        value={selectedColor}
                        onChange={e => setSelectedColor(e.target.value)}
                      >
                        {product.colors.map((color, idx) => (
                          <option key={idx} value={color}>{color}</option>
                        ))}
                      </select>
                    </motion.div>
                  )}
                  {product.sizes && product.sizes.length > 0 && (
                    <motion.div className="mb-4 lg:mb-6" variants={itemVariants}>
                      <label className="block mb-1 text-base font-medium lg:text-lg text-primary">
                        Talle
                      </label>
                      <select
                        className="px-3 py-2 w-full rounded-lg border lg:px-4 lg:py-3 border-accent/20 focus:outline-none focus:ring-2 focus:ring-accent"
                        value={selectedSize}
                        onChange={e => setSelectedSize(e.target.value)}
                      >
                        {product.sizes.map((size, idx) => (
                          <option key={idx} value={size}>{size}</option>
                        ))}
                      </select>
                    </motion.div>
                  )}
                </>
              )}

              {/* Tabs - Better mobile design */}
              <motion.div className="mb-4 lg:mb-6" variants={itemVariants}>
                <div className="flex p-1 mb-3 space-x-1 rounded-lg lg:mb-4 bg-accent/10">
                  {[
                    { id: 'description', label: 'Descripción' },
                    { id: 'contenido', label: 'Contenido' },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as 'description' | 'contenido')}
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
                
                {/* Fixed height container for tab content - Mobile optimized */}
                <div className="h-48 lg:h-64 overflow-y-auto transition-all duration-200 border border-secondary/20 rounded-lg p-4 lg:p-6 bg-white">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeTab}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="h-full"
                    >
                      {activeTab === 'description' && (
                        <div className="space-y-4 lg:space-y-6">
                          <p className="text-sm leading-relaxed lg:text-base text-content">
                            {product.detailedDescription}
                          </p>
                          {product.keyBenefits && product.keyBenefits.length > 0 && (
                            <div className="p-3 rounded-lg lg:p-4 bg-accent/10">
                              <h4 className="mb-2 font-medium lg:mb-3 text-primary">Beneficios Clave:</h4>
                              <ul className="space-y-1 lg:space-y-2 text-content">
                                {product.keyBenefits.map((benefit, idx) => (
                                  <li key={idx} className="flex items-start text-sm lg:text-base">
                                    <span className="mr-2 text-accent">•</span>
                                    <span>{benefit}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      )}
                      {activeTab === 'contenido' && (
                        <div className="space-y-4 lg:space-y-6">
                          <h4 className="mb-3 text-base font-medium lg:mb-4 lg:text-lg text-primary">Qué incluye este kit:</h4>
                          <ul className="space-y-2 lg:space-y-3">
                            {product.items && product.items.length > 0 && product.items.map((item, idx) => (
                              <li key={idx} className="text-sm lg:text-base">
                                <span className="font-medium text-primary">{item.name}</span>
                                {item.quantity && <span className="text-content"> (x{item.quantity})</span>}
                              </li>
                            ))}
                          </ul>
                          {product.featuredIngredients && product.featuredIngredients.length > 0 && (
                            <div className="p-3 bg-green-50 rounded-lg lg:p-4">
                              <h5 className="mb-2 font-medium text-green-800 lg:mb-3">Contenidos Destacados:</h5>
                              <ul className="space-y-1 text-green-700 lg:space-y-2">
                                {product.featuredIngredients.map((ingredient, idx) => (
                                  <li key={idx} className="text-sm lg:text-base">• {ingredient}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      )}
                    </motion.div>
                  </AnimatePresence>
                </div>
              </motion.div>
            </div>
            
            {/* Sticky Footer - Better mobile layout */}
            <motion.div 
              className="p-4 bg-white border-t lg:p-6 border-accent/10 shadow-[0_-2px_16px_-8px_rgba(0,0,0,0.06)]"
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
                <motion.button 
                  className="px-6 py-3 font-medium rounded-xl border-2 transition-all duration-200 lg:px-8 lg:py-4 lg:w-auto border-accent text-accent hover:bg-accent hover:text-white"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Comprar Ahora
                </motion.button>
              </div>
              <div className="flex flex-wrap justify-center items-center mt-3 space-x-4 text-xs lg:mt-4 lg:space-x-6 lg:text-sm text-content">
                <span className="flex items-center space-x-1">
                  <Truck size={14} className="lg:w-4 lg:h-4" />
                  <span>
                    Entregas gratis en{' '}
                    <span 
                      className="underline cursor-pointer text-accent"
                      onClick={() => setShowShippingModal(true)}
                      tabIndex={0}
                      role="button"
                    >
                      zonas seleccionadas
                    </span>
                  </span>
                </span>
                <span className="flex items-center space-x-1">
                  <Shield size={14} className="lg:w-4 lg:h-4" />
                  <span>Garantía 30 días</span>
                </span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ProductDialog;
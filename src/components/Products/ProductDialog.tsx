import React, { useState, useEffect } from 'react';
import { X, ShoppingCart, Star, Shield, Truck, Share2, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Product } from '../../types';
import { useCart } from '../../hooks/useCart';
import { useToast } from '../../hooks/useToast';
import OptimizedCarousel from './OptimizedCarousel';

interface ProductDialogProps {
  product: Product;
  onClose: () => void;
}

const ProductDialog: React.FC<ProductDialogProps> = ({ product, onClose }) => {
  const { addToCart } = useCart();
  const { showSuccess } = useToast();
  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'description' | 'ingredients' | 'reviews'>('description');
  
  const handleAddToCart = () => {
    addToCart(product, selectedQuantity);
    showSuccess(
      '¡Agregado al Carrito!',
      `${product.name} ${selectedQuantity > 1 ? `(${selectedQuantity} unidades)` : ''}`
    );
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

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: product.shortDescription,
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
      className="fixed inset-0 z-50 flex items-center justify-center min-w-full min-h-screen p-2 overflow-hidden backdrop-blur-sm bg-black/70 sm:p-4"
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
        className="relative flex flex-col w-full max-w-7xl h-[90vh] overflow-hidden bg-white shadow-2xl rounded-2xl"
        onClick={(e) => e.stopPropagation()}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        {/* Header with close and action buttons */}
        <div className="absolute z-20 flex items-center space-x-4 top-4 right-4 sm:top-6 sm:right-6">
          <motion.button
            onClick={handleShare}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            aria-label="Compartir producto"
            className="p-2 bg-white/90 rounded-full shadow-lg hover:bg-white"
          >
            <Share2 size={20} className="text-primary" />
          </motion.button>
          <motion.button 
            onClick={onClose}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            aria-label="Cerrar diálogo"
            className="p-2 bg-white/90 rounded-full shadow-lg hover:bg-white"
          >
            <X size={24} className="text-primary" />
          </motion.button>
        </div>
        
        <div className="flex flex-col h-full lg:flex-row">
          {/* Image Section - Better proportions */}
          <div className="relative flex items-center justify-center p-4 bg-gradient-to-br lg:w-2/5 from-secondary/30 to-secondary/60 sm:p-8">
            <div className="w-full max-w-lg aspect-square rounded-xl shadow-lg overflow-hidden bg-white">
              <OptimizedCarousel 
                images={product.images} 
                alt={product.name}
                className="h-full"
              />
            </div>
            {/* Floating stock indicator */}
            {stockStatus && (
              <motion.div 
                className={`absolute top-6 left-6 px-4 py-2 rounded-full text-sm font-medium border ${stockStatus.color} backdrop-blur-sm shadow`}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
              >
                {stockStatus.text}
              </motion.div>
            )}
          </div>
          
          {/* Content Section - More space for content */}
          <motion.div 
            className="flex flex-col bg-white lg:w-3/5 h-full"
            variants={contentVariants}
            initial="hidden"
            animate="visible"
          >
            <div className="flex-1 p-4 overflow-y-auto sm:p-6 lg:p-8">
              {/* Product Header */}
              <motion.div className="mb-6" variants={itemVariants}>
                <div className="flex items-center mb-2 space-x-2">
                  <div className="flex items-center space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={16} className="fill-accent text-accent" />
                    ))}
                  </div>
                  <span className="text-xs sm:text-sm text-content">(4.9) • 127 reseñas</span>
                </div>
                <h2 
                  id="product-dialog-title"
                  className="mb-3 text-2xl font-light leading-tight sm:text-3xl lg:text-4xl text-primary"
                >
                  {product.name}
                </h2>
                <div className="flex items-baseline mb-4 space-x-3">
                  <span className="text-3xl font-medium sm:text-4xl text-accent">
                    ${product.price.toFixed(2)}
                  </span>
                  <span className="text-lg line-through text-content">
                    ${(product.price * 1.2).toFixed(2)}
                  </span>
                  <span className="px-3 py-1 text-sm font-medium rounded-full bg-accent/10 text-accent">
                    17% OFF
                  </span>
                </div>
                <p className="text-lg leading-relaxed text-content">
                  {product.shortDescription}
                </p>
              </motion.div>
              
              {/* Trust Indicators */}
              <motion.div 
                className="grid grid-cols-3 gap-4 p-4 mb-6 rounded-xl bg-secondary/30"
                variants={itemVariants}
              >
                <div className="text-center">
                  <Shield className="w-8 h-8 mx-auto mb-2 text-accent" />
                  <p className="text-sm font-medium text-primary">100% Natural</p>
                </div>
                <div className="text-center">
                  <Truck className="w-8 h-8 mx-auto mb-2 text-accent" />
                  <p className="text-sm font-medium text-primary">Envío Gratis</p>
                </div>
                <div className="text-center">
                  <Star className="w-8 h-8 mx-auto mb-2 text-accent" />
                  <p className="text-sm font-medium text-primary">Premium</p>
                </div>
              </motion.div>
              
              {/* Quantity Selector */}
              <motion.div className="mb-6" variants={itemVariants}>
                <label className="block mb-3 text-lg font-medium text-primary">
                  Cantidad
                </label>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center overflow-hidden border rounded-lg border-secondary">
                    <button
                      onClick={() => setSelectedQuantity(Math.max(1, selectedQuantity - 1))}
                      className="px-4 py-3 transition-colors hover:bg-secondary/50"
                      disabled={selectedQuantity <= 1}
                    >
                      -
                    </button>
                    <span className="px-6 py-3 bg-secondary/30 font-medium min-w-[60px] text-center">
                      {selectedQuantity}
                    </span>
                    <button
                      onClick={() => setSelectedQuantity(selectedQuantity + 1)}
                      className="px-4 py-3 transition-colors hover:bg-secondary/50"
                      disabled={stockStatus?.available === false || (product.stock != null && selectedQuantity >= product.stock)}
                    >
                      +
                    </button>
                  </div>
                  <span className="text-base text-content">
                    Total: <span className="font-medium text-primary">${(product.price * selectedQuantity).toFixed(2)}</span>
                  </span>
                </div>
              </motion.div>
              
              {/* Tabs */}
              <motion.div className="mb-6" variants={itemVariants}>
                <div className="flex p-1 mb-4 space-x-1 rounded-lg bg-secondary/30">
                  {[
                    { id: 'description', label: 'Descripción' },
                    { id: 'ingredients', label: 'Ingredientes' },
                    { id: 'reviews', label: 'Reseñas' }
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as 'description' | 'ingredients' | 'reviews')}
                      className={`flex-1 py-3 px-4 rounded-md text-sm font-medium transition-all duration-200 ${
                        activeTab === tab.id
                          ? 'bg-white text-primary shadow-sm scale-105'
                          : 'text-content hover:text-primary'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
                
                {/* Fixed height container for tab content - Increased height */}
                <div className="h-[320px] sm:h-[360px] overflow-y-auto transition-all duration-200 border border-secondary/20 rounded-lg p-6 bg-white">
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
                        <div className="space-y-6">
                          <p className="text-base leading-relaxed text-content">
                            {product.detailedDescription}
                          </p>
                          <div className="p-4 rounded-lg bg-secondary/30">
                            <h4 className="mb-3 font-medium text-primary">Beneficios Clave:</h4>
                            <ul className="space-y-2 text-content">
                              <li className="flex items-start">
                                <span className="mr-2 text-accent">•</span>
                                <span>Hidratación profunda y duradera</span>
                              </li>
                              <li className="flex items-start">
                                <span className="mr-2 text-accent">•</span>
                                <span>Ingredientes 100% naturales argentinos</span>
                              </li>
                              <li className="flex items-start">
                                <span className="mr-2 text-accent">•</span>
                                <span>Resultados visibles en 2-3 semanas</span>
                              </li>
                              <li className="flex items-start">
                                <span className="mr-2 text-accent">•</span>
                                <span>Libre de químicos agresivos</span>
                              </li>
                            </ul>
                          </div>
                        </div>
                      )}
                      {activeTab === 'ingredients' && (
                        <div className="space-y-6">
                          <h4 className="mb-4 text-lg font-medium text-primary">Qué incluye este kit:</h4>
                          <ul className="space-y-3">
                            {product.contents.map((item, index) => (
                              <li key={index} className="flex items-start">
                                <ChevronRight size={16} className="flex-shrink-0 mt-1 mr-3 text-accent" />
                                <span className="text-content">{item}</span>
                              </li>
                            ))}
                          </ul>
                          <div className="p-4 rounded-lg bg-green-50">
                            <h5 className="mb-3 font-medium text-green-800">Ingredientes Destacados:</h5>
                            <ul className="space-y-2 text-green-700">
                              <li>• Aloe Vera patagónico</li>
                              <li>• Aceite de rosa mosqueta</li>
                              <li>• Extracto de manzanilla</li>
                              <li>• Ácido hialurónico natural</li>
                            </ul>
                          </div>
                        </div>
                      )}
                      {activeTab === 'reviews' && (
                        <div className="space-y-6">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <div className="flex items-center space-x-1">
                                {[...Array(5)].map((_, i) => (
                                  <Star key={i} size={16} className="fill-accent text-accent" />
                                ))}
                              </div>
                              <span className="font-medium">4.9 de 5</span>
                            </div>
                            <span className="text-sm text-content">127 reseñas</span>
                          </div>
                          
                          <div className="space-y-4">
                            <div className="p-4 border rounded-lg border-secondary/20">
                              <div className="flex items-center mb-2 space-x-1">
                                {[...Array(5)].map((_, i) => (
                                  <Star key={i} size={14} className="fill-accent text-accent" />
                                ))}
                              </div>
                              <p className="mb-2 text-content">
                                "Excelente producto, mi piel se ve increíble después de usarlo por 2 semanas. La hidratación es profunda y duradera."
                              </p>
                              <p className="text-xs text-content">- María G., Buenos Aires</p>
                            </div>
                            
                            <div className="p-4 border rounded-lg border-secondary/20">
                              <div className="flex items-center mb-2 space-x-1">
                                {[...Array(5)].map((_, i) => (
                                  <Star key={i} size={14} className="fill-accent text-accent" />
                                ))}
                              </div>
                              <p className="mb-2 text-content">
                                "Los ingredientes naturales se notan desde el primer uso. Mi piel sensible no tuvo ninguna reacción."
                              </p>
                              <p className="text-xs text-content">- Ana L., Córdoba</p>
                            </div>
                            
                            <div className="p-4 border rounded-lg border-secondary/20">
                              <div className="flex items-center mb-2 space-x-1">
                                {[...Array(4)].map((_, i) => (
                                  <Star key={i} size={14} className="fill-accent text-accent" />
                                ))}
                                <Star size={14} className="text-accent" />
                              </div>
                              <p className="mb-2 text-content">
                                "Muy buen producto, aunque el precio es un poco alto. Los resultados valen la pena."
                              </p>
                              <p className="text-xs text-content">- Sofia R., Mendoza</p>
                            </div>
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
              className="p-4 bg-white border-t sm:p-6 lg:p-8 border-secondary/20 shadow-[0_-2px_16px_-8px_rgba(0,0,0,0.06)]"
              variants={itemVariants}
            >
              <div className="flex flex-col gap-3 sm:gap-4 sm:flex-row">
                <motion.button 
                  onClick={handleAddToCart}
                  disabled={stockStatus?.available === false}
                  className="flex-1 bg-accent text-white py-4 px-8 rounded-xl flex items-center justify-center space-x-3 hover:bg-supporting transition-all duration-200 transform hover:scale-[1.02] disabled:bg-gray-400 disabled:cursor-not-allowed disabled:transform-none text-lg font-medium shadow-lg"
                  whileHover={{ scale: stockStatus?.available ? 1.02 : 1 }}
                  whileTap={{ scale: stockStatus?.available ? 0.98 : 1 }}
                >
                  <ShoppingCart size={20} />
                  <span>
                    {stockStatus && !stockStatus.available ? 'Sin Stock' : 'Agregar al Carrito'}
                  </span>
                </motion.button>
                <motion.button 
                  className="px-8 py-4 font-medium transition-all duration-200 border-2 rounded-xl sm:w-auto border-accent text-accent hover:bg-accent hover:text-white"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Comprar Ahora
                </motion.button>
              </div>
              <div className="flex flex-wrap items-center justify-center mt-4 space-x-6 text-sm text-content">
                <span className="flex items-center space-x-1">
                  <Truck size={16} />
                  <span>Envío gratis en CABA</span>
                </span>
                <span className="flex items-center space-x-1">
                  <Shield size={16} />
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
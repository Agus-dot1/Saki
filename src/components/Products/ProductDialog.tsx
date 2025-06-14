import React, { useState, useEffect } from 'react';
import { X, ShoppingCart, Star, Shield, Truck, Share2, Leaf } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Product } from '../../types';
import { useCart } from '../../hooks/useCart';
import { useToast } from '../../hooks/useToast';
import OptimizedCarousel from './OptimizedCarousel';
import ShippingLocationsModal from './ShippingLocationModal';

// Add this prop to ProductDialogProps:
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
        className="relative flex flex-col w-full max-w-7xl h-[90vh] overflow-hidden bg-white shadow-2xl rounded-2xl"
        onClick={(e) => e.stopPropagation()}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        {/* Header with close and action buttons */}
        <div className="flex absolute top-4 right-4 z-20 items-center space-x-8 sm:top-6 sm:right-10">
          <motion.button
            onClick={handleShare}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            aria-label="Compartir producto"
          >
            <Share2 size={20} className="text-primary" />
          </motion.button>
          <motion.button 
            onClick={onClose}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            aria-label="Cerrar diálogo"
          >
            <X size={24} className="text-primary" />
          </motion.button>
        </div>
        
        <div className="flex flex-col h-full lg:flex-row">
          {/* Image Section */}
          <div className="flex relative justify-center items-center p-4 bg-gradient-to-br lg:w-2/5 from-secondary/30 to-secondary/60 sm:p-8">
            <div className="overflow-hidden w-full max-w-lg bg-white rounded-xl shadow-lg aspect-square">
              <OptimizedCarousel 
                images={product.images} 
                alt={product.name}
                className="object-contain h-full"
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
          
          {/* Content Section */}
          <motion.div 
            className="flex flex-col h-full bg-white lg:w-3/5"
            variants={contentVariants}
            initial="hidden"
            animate="visible"
          >
            <div className="overflow-y-auto flex-1 p-4 sm:p-6 lg:p-8">
              {/* Product Header */}
              <motion.div className="mb-6" variants={itemVariants}>
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
                  {product.oldPrice && (
                    <span className="text-lg line-through text-content">
                      ${product.oldPrice.toFixed(2)}
                    </span>
                  )}
                  {product.discountPercentage && (
                    <span className="px-3 py-1 text-sm font-medium rounded-full bg-accent/10 text-accent">
                      {product.discountPercentage}% OFF
                    </span>
                  )}
                </div>
                <p className="text-lg leading-relaxed text-content">
                  {product.description}
                </p>
              </motion.div>
              
              {/* Trust Indicators */}
              <motion.div 
                className="grid grid-cols-3 gap-4 p-4 mb-6 rounded-xl bg-accent/10 sm:grid-cols-2 lg:grid-cols-3"
                variants={itemVariants}
              >
                <div className="text-center">
                  <Leaf className="mx-auto mb-2 w-8 h-8 text-accent" />
                  <p className="text-sm font-medium text-primary">100% Natural</p>
                </div>
                <div className="text-center">
                  <Truck className="mx-auto mb-2 w-8 h-8 text-accent" />
                  <p className="text-sm font-medium text-primary">Entrega Gratis en <br /> 
                    <span 
                    className="underline cursor-pointer text-accent"
                    onClick={() => setShowShippingModal(true)}
                    tabIndex={0}
                    role="button"
                  > zonas seleccionadas</span></p>
                </div>
                <ShippingLocationsModal
                  open={showShippingModal}
                  onClose={() => setShowShippingModal(false)}
                />
                <div className="text-center">
                  <Star className="mx-auto mb-2 w-8 h-8 text-accent" />
                  <p className="text-sm font-medium text-primary">Calidad Premium</p>
                </div>
              </motion.div>
              
              {/* Quantity Selector */}
              <motion.div className="mb-6" variants={itemVariants}>
                <label className="block mb-3 text-lg font-medium text-primary">
                  Cantidad
                </label>
                <div className="flex items-center space-x-4">
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
                  <span className="text-base text-content">
                    Total: <span className="font-medium text-primary">${(product.price * selectedQuantity).toFixed(2)}</span>
                  </span>
                </div>
              </motion.div>
              
              {product.items && product.items.length > 0 && product.items.map((item, idx) => (
  <motion.div className="mb-6" variants={itemVariants} key={idx}>
    {item.colorOptions && item.colorOptions.length > 0 && (
      <div className="mb-3">
        <span className="block mb-1 text-base text-content">Color</span>
        <select
          className="px-4 py-3 w-full rounded-lg border border-accent/20 focus:outline-none focus:ring-2 focus:ring-accent"
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
        <span className="block mb-1 text-base text-content">Tamaño</span>
        <select
          className="px-4 py-3 w-full rounded-lg border border-accent/20 focus:outline-none focus:ring-2 focus:ring-accent"
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
      <motion.div className="mb-6" variants={itemVariants}>
        <label className="block mb-1 text-lg font-medium text-primary">
          Color
        </label>
        <select
          className="px-4 py-3 w-full rounded-lg border border-accent/20 focus:outline-none focus:ring-2 focus:ring-accent"
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
      <motion.div className="mb-6" variants={itemVariants}>
        <label className="block mb-1 text-lg font-medium text-primary">
          Talle
        </label>
        <select
          className="px-4 py-3 w-full rounded-lg border border-accent/20 focus:outline-none focus:ring-2 focus:ring-accent"
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

              {/* Tabs */}
              <motion.div className="mb-6" variants={itemVariants}>
                <div className="flex p-1 px-4 mb-4 space-x-1 rounded-lg bg-accent/10">
                  {[
                    { id: 'description', label: 'Descripción' },
                    { id: 'contenido', label: 'Contenido' },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as 'description' | 'contenido')}
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
                          {product.keyBenefits && product.keyBenefits.length > 0 && (
                            <div className="p-4 rounded-lg bg-accent/10">
                              <h4 className="mb-3 font-medium text-primary">Beneficios Clave:</h4>
                              <ul className="space-y-2 text-content">
                                {product.keyBenefits.map((benefit, idx) => (
                                  <li key={idx} className="flex items-start">
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
                        <div className="space-y-6">
                            <h4 className="mb-4 text-lg font-medium text-primary">Qué incluye este kit:</h4>
                            <ul className="space-y-3">
                            {product.items && product.items.length > 0 && product.items.map((item, idx) => (
                              <li key={idx}>
                              <span className="font-medium text-primary">{item.name}</span>
                              {item.quantity && <span className="text-content"> (x{item.quantity})</span>}
                              </li>
                            ))}
                            </ul>
                          {product.featuredIngredients && product.featuredIngredients.length > 0 && (
                            <div className="p-4 bg-green-50 rounded-lg">
                              <h5 className="mb-3 font-medium text-green-800">Contenidos Destacados:</h5>
                              <ul className="space-y-2 text-green-700">
                                {product.featuredIngredients.map((ingredient, idx) => (
                                  <li key={idx}>• {ingredient}</li>
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
            
            {/* Sticky Footer */}
            <motion.div 
              className="p-4 bg-white border-t sm:p-6 lg:p-8 border-accent/10 shadow-[0_-2px_16px_-8px_rgba(0,0,0,0.06)]"
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
                  className="px-8 py-4 font-medium rounded-xl border-2 transition-all duration-200 sm:w-auto border-accent text-accent hover:bg-accent hover:text-white"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Comprar Ahora
                </motion.button>
              </div>
              <div className="flex flex-wrap justify-center items-center mt-4 space-x-6 text-sm text-content">
                <span className="flex items-center space-x-1">
                  <Truck size={16} />
                  <span>Entregas gratis en <span 
                    className="underline cursor-pointer text-accent"
                    onClick={() => setShowShippingModal(true)}
                    tabIndex={0}
                    role="button"
                  > zonas seleccionadas</span></span>
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
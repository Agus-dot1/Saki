import React, { useState, useEffect } from 'react';
import { X, ShoppingCart, Star, Shield, Truck, Share2, Leaf, Plus, Minus } from 'lucide-react';
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
    showSuccess('Agregado al Carrito', `${product.name} fue agregado exitosamente`);
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
    const scrollY = window.scrollY;
    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = '100%';
    
    return () => {
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      window.scrollTo(0, scrollY);
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
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { duration: 0.2 }
    },
    exit: { 
      opacity: 0,
      transition: { duration: 0.2 }
    }
  };

  const dialogVariants = {
    hidden: { opacity: 0, scale: 0.95, y: 20 },
    visible: { 
      opacity: 1, 
      scale: 1,
      y: 0,
      transition: {
        duration: 0.3,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    },
    exit: { 
      opacity: 0, 
      scale: 0.95,
      y: 20,
      transition: {
        duration: 0.2,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    }
  };

  return (
    <motion.div 
      className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-4 backdrop-blur-sm bg-black/70"
      onClick={handleBackdropClick}
      onKeyDown={handleKeyDown}
      role="dialog"
      aria-modal="true"
      aria-labelledby="product-dialog-title"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <motion.div 
        className="relative flex flex-col w-full max-w-lg bg-white shadow-2xl sm:rounded-2xl sm:max-h-[90vh] max-h-screen overflow-hidden"
        onClick={(e) => e.stopPropagation()}
        variants={dialogVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        {/* Mobile Header */}
        <div className="relative flex items-center justify-between p-4 border-b border-gray-100 sm:hidden">
          <h2 className="text-lg font-semibold text-primary line-clamp-1">
            {product.name}
          </h2>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleShare}
              className="p-2 text-gray-600 transition-colors hover:text-primary rounded-xl"
              aria-label="Compartir producto"
            >
              <Share2 size={20} />
            </button>
            <button 
              onClick={onClose}
              className="p-2 text-gray-600 transition-colors hover:text-primary rounded-xl"
              aria-label="Cerrar diálogo"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Desktop Header - Hidden on mobile */}
        <div className="absolute z-20 items-center hidden space-x-2 top-4 right-4 sm:flex">
          <button
            onClick={handleShare}
            className="p-2 text-white transition-colors bg-black/20 hover:bg-black/30 rounded-xl backdrop-blur-sm"
            aria-label="Compartir producto"
          >
            <Share2 size={18} />
          </button>
          <button 
            onClick={onClose}
            className="p-2 text-white transition-colors bg-black/20 hover:bg-black/30 rounded-xl backdrop-blur-sm"
            aria-label="Cerrar diálogo"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content Container */}
        <div className="flex flex-col flex-1 overflow-hidden">
          {/* Image Section - Mobile optimized */}
          <div className="relative flex items-center justify-center p-4 bg-gradient-to-br from-secondary/30 to-secondary/60 sm:p-6">
            <div className="w-full max-w-xs overflow-hidden bg-white shadow-lg rounded-xl aspect-square sm:max-w-sm">
              <OptimizedCarousel 
                images={product.images} 
                alt={product.name}
                className="object-contain h-full"
              />
            </div>
            
            {/* Floating stock indicator */}
            {stockStatus && (
              <div className={`absolute top-6 left-6 px-3 py-1.5 rounded-full text-xs font-medium border ${stockStatus.color} backdrop-blur-sm shadow-sm`}>
                {stockStatus.text}
              </div>
            )}
          </div>
          
          {/* Content Section - Mobile optimized scrolling */}
          <div className="flex flex-col flex-1 overflow-y-auto">
            <div className="p-4 space-y-4 sm:p-6 sm:space-y-6">
              {/* Product Header - Hidden on mobile (shown in mobile header) */}
              <div className="hidden sm:block">
                <h2 
                  id="product-dialog-title"
                  className="mb-2 text-2xl font-light leading-tight text-primary lg:text-3xl"
                >
                  {product.name}
                </h2>
                <p className="text-base leading-relaxed text-content lg:text-lg">
                  {product.description}
                </p>
              </div>

              {/* Mobile description - Only shown on mobile */}
              <div className="sm:hidden">
                <p className="text-sm leading-relaxed text-content">
                  {product.description}
                </p>
              </div>

              {/* Price Section */}
              <div className="flex flex-wrap items-baseline gap-2">
                <span className="text-2xl font-bold text-accent sm:text-3xl">
                  ${product.price.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
                {product.oldPrice && (
                  <span className="text-base line-through text-content lg:text-lg">
                    ${product.oldPrice.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                )}
                {product.discountPercentage && (
                  <span className="px-2 py-1 text-xs font-medium rounded-full bg-accent/10 text-accent lg:text-sm">
                    {product.discountPercentage}% OFF
                  </span>
                )}
              </div>
              
              {/* Trust Indicators - Mobile optimized */}
              <div className="grid grid-cols-3 gap-2 p-3 rounded-xl bg-accent/10 sm:gap-4 sm:p-4">
                <div className="text-center">
                  <Leaf className="w-5 h-5 mx-auto mb-1 text-accent sm:w-6 sm:h-6 sm:mb-2" />
                  <p className="text-xs font-medium text-primary sm:text-sm">100% Natural</p>
                </div>
                <div className="text-center">
                  <Truck className="w-5 h-5 mx-auto mb-1 text-accent sm:w-6 sm:h-6 sm:mb-2" />
                  <p className="text-xs font-medium text-primary sm:text-sm">
                    <span 
                      className="underline cursor-pointer text-accent"
                      onClick={() => setShowShippingModal(true)}
                      tabIndex={0}
                      role="button"
                    >
                      Envío Gratis
                    </span>
                  </p>
                </div>
                <div className="text-center">
                  <Star className="w-5 h-5 mx-auto mb-1 text-accent sm:w-6 sm:h-6 sm:mb-2" />
                  <p className="text-xs font-medium text-primary sm:text-sm">Calidad Premium</p>
                </div>
              </div>
              
              {/* Quantity Selector - Mobile optimized */}
              <div>
                <label className="block mb-2 text-base font-medium text-primary">
                  Cantidad
                </label>
                <div className="flex items-center justify-between">
                  <div className="flex items-center overflow-hidden border rounded-xl border-accent/20">
                    <button
                      onClick={() => setSelectedQuantity(Math.max(1, selectedQuantity - 1))}
                      className="p-3 transition-colors hover:bg-accent/10 active:bg-accent/20"
                      disabled={selectedQuantity <= 1}
                    >
                      <Minus size={16} />
                    </button>
                    <span className="px-4 py-3 font-medium min-w-[60px] text-center">
                      {selectedQuantity}
                    </span>
                    <button
                      onClick={() => setSelectedQuantity(selectedQuantity + 1)}
                      className="p-3 transition-colors hover:bg-accent/10 active:bg-accent/20"
                      disabled={stockStatus?.available === false || (product.stock != null && selectedQuantity >= product.stock)}
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                  <span className="text-sm font-medium text-content">
                    Total: <span className="text-primary">${(product.price * selectedQuantity).toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                  </span>
                </div>
              </div>
              
              {/* Product options - Mobile optimized */}
              {product.items && product.items.length > 0 && product.items.map((item, idx) => (
                <div key={idx}>
                  {item.colorOptions && item.colorOptions.length > 0 && (
                    <div className="mb-3">
                      <span className="block mb-2 text-sm font-medium text-content">Color para {item.name}</span>
                      <select
                        className="w-full px-3 py-3 text-base border rounded-xl border-accent/20 focus:outline-none focus:ring-2 focus:ring-accent"
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
                      <span className="block mb-2 text-sm font-medium text-content">Tamaño para {item.name}</span>
                      <select
                        className="w-full px-3 py-3 text-base border rounded-xl border-accent/20 focus:outline-none focus:ring-2 focus:ring-accent"
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
                </div>
              ))}

              {/* Global product options */}
              {!product.items && (
                <>
                  {product.colors && product.colors.length > 0 && (
                    <div>
                      <label className="block mb-2 text-base font-medium text-primary">
                        Color
                      </label>
                      <select
                        className="w-full px-3 py-3 text-base border rounded-xl border-accent/20 focus:outline-none focus:ring-2 focus:ring-accent"
                        value={selectedColor}
                        onChange={e => setSelectedColor(e.target.value)}
                      >
                        {product.colors.map((color, idx) => (
                          <option key={idx} value={color}>{color}</option>
                        ))}
                      </select>
                    </div>
                  )}
                  {product.sizes && product.sizes.length > 0 && (
                    <div>
                      <label className="block mb-2 text-base font-medium text-primary">
                        Talle
                      </label>
                      <select
                        className="w-full px-3 py-3 text-base border rounded-xl border-accent/20 focus:outline-none focus:ring-2 focus:ring-accent"
                        value={selectedSize}
                        onChange={e => setSelectedSize(e.target.value)}
                      >
                        {product.sizes.map((size, idx) => (
                          <option key={idx} value={size}>{size}</option>
                        ))}
                      </select>
                    </div>
                  )}
                </>
              )}

              {/* Kit Contents - Simplified */}
              {product.items && product.items.length > 0 && (
                <div>
                  <h4 className="mb-3 text-base font-medium text-primary">Qué incluye este kit:</h4>
                  <div className="space-y-2">
                    {product.items.map((item, idx) => (
                      <div key={idx} className="flex items-start p-3 rounded-lg bg-gray-50">
                        <Star size={16} className="mt-0.5 mr-2 text-accent flex-shrink-0" />
                        <div>
                          <span className="font-medium text-primary">{item.name}</span>
                          {item.quantity && <span className="text-content"> (x{item.quantity})</span>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Benefits - Simplified */}
              {product.keyBenefits && product.keyBenefits.length > 0 && (
                <div>
                  <h4 className="mb-3 text-base font-medium text-primary">Beneficios principales:</h4>
                  <ul className="space-y-2">
                    {product.keyBenefits.map((benefit, idx) => (
                      <li key={idx} className="flex items-start text-sm">
                        <span className="mr-2 text-accent">•</span>
                        <span className="text-content">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Detailed Description */}
              <div>
                <h4 className="mb-3 text-base font-medium text-primary">Descripción:</h4>
                <p className="text-sm leading-relaxed text-content">
                  {product.detailedDescription}
                </p>
              </div>
            </div>
            
            {/* Sticky Footer - Mobile optimized */}
            <div className="p-4 bg-white border-t border-gray-100 sm:p-6">
              <div className="space-y-3">
                <button 
                  onClick={handleAddToCart}
                  disabled={stockStatus?.available === false}
                  className="flex items-center justify-center w-full px-6 py-4 space-x-2 text-lg font-semibold text-white transition-all duration-200 rounded-xl bg-accent hover:bg-supporting disabled:bg-gray-400 disabled:cursor-not-allowed active:scale-95"
                >
                  <ShoppingCart size={20} />
                  <span>
                    {stockStatus && !stockStatus.available ? 'Sin Stock' : 'Agregar al Carrito'}
                  </span>
                </button>
                
                {/* Trust indicators footer */}
                <div className="flex items-center justify-center space-x-4 text-xs text-content">
                  <span className="flex items-center space-x-1">
                    <Truck size={12} />
                    <span 
                      className="underline cursor-pointer text-accent"
                      onClick={() => setShowShippingModal(true)}
                      tabIndex={0}
                      role="button"
                    >
                      Envío gratis
                    </span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <Shield size={12} />
                    <span>Garantía 30 días</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Shipping Locations Modal */}
      <ShippingLocationsModal
        open={showShippingModal}
        onClose={() => setShowShippingModal(false)}
      />
    </motion.div>
  );
};

export default ProductDialog;
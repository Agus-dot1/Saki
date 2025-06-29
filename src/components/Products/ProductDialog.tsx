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
      className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-6 backdrop-blur-sm bg-black/70"
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
      {/* Mobile Layout */}
      <motion.div 
        className="relative flex flex-col w-full bg-white shadow-2xl sm:hidden max-h-screen overflow-hidden"
        onClick={(e) => e.stopPropagation()}
        variants={dialogVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        {/* Mobile Header */}
        <div className="relative flex items-center justify-between p-4 border-b border-gray-100">
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

        {/* Mobile Content */}
        <div className="flex flex-col flex-1 overflow-hidden">
          {/* Image Section */}
          <div className="relative flex items-center justify-center p-4 bg-gradient-to-br from-secondary/30 to-secondary/60">
            <div className="w-full max-w-xs overflow-hidden bg-white shadow-lg rounded-xl aspect-square">
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
          
          {/* Content Section with bottom padding for fixed button */}
          <div className="flex flex-col flex-1 overflow-y-auto pb-20">
            <div className="p-4 space-y-4">
              {/* Mobile description */}
              <div>
                <p className="text-sm leading-relaxed text-content">
                  {product.description}
                </p>
              </div>

              {/* Price Section */}
              <div className="flex flex-wrap items-baseline gap-2">
                <span className="text-2xl font-bold text-accent">
                  ${product.price.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
                {product.oldPrice && (
                  <span className="text-base line-through text-content">
                    ${product.oldPrice.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                )}
                {product.discountPercentage && (
                  <span className="px-2 py-1 text-xs font-medium rounded-full bg-accent/10 text-accent">
                    {product.discountPercentage}% OFF
                  </span>
                )}
              </div>
              
              {/* Trust Indicators */}
              <div className="grid grid-cols-3 gap-2 p-3 rounded-xl bg-accent/10">
                <div className="text-center">
                  <Leaf className="w-5 h-5 mx-auto mb-1 text-accent" />
                  <p className="text-xs font-medium text-primary">100% Natural</p>
                </div>
                <div className="text-center">
                  <Truck className="w-5 h-5 mx-auto mb-1 text-accent" />
                  <p className="text-xs font-medium text-primary">
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
                  <Star className="w-5 h-5 mx-auto mb-1 text-accent" />
                  <p className="text-xs font-medium text-primary">Calidad Premium</p>
                </div>
              </div>
              
              {/* Quantity Selector */}
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

              {/* Kit Contents */}
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

              {/* Benefits */}
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
          </div>
        </div>

        {/* Fixed Add to Cart Button - Mobile */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-100 shadow-lg">
          <button 
            onClick={handleAddToCart}
            disabled={stockStatus?.available === false}
            className="flex items-center justify-center w-full px-6 py-4 space-x-2 text-lg font-semibold text-white transition-all duration-200 rounded-xl bg-accent hover:bg-supporting disabled:bg-gray-400 disabled:cursor-not-allowed active:scale-95 shadow-lg"
          >
            <ShoppingCart size={20} />
            <span>
              {stockStatus && !stockStatus.available ? 'Sin Stock' : 'Agregar al Carrito'}
            </span>
          </button>
        </div>
      </motion.div>

      {/* Desktop Layout */}
      <motion.div 
        className="relative hidden w-full max-w-6xl bg-white shadow-2xl sm:flex rounded-2xl max-h-[85vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
        variants={dialogVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        {/* Desktop Header */}
        <div className="absolute z-20 flex items-center space-x-3 top-6 right-6">
          <button
            onClick={handleShare}
            className="p-3 text-white transition-colors bg-black/20 hover:bg-black/30 rounded-xl backdrop-blur-sm"
            aria-label="Compartir producto"
          >
            <Share2 size={20} />
          </button>
          <button 
            onClick={onClose}
            className="p-3 text-white transition-colors bg-black/20 hover:bg-black/30 rounded-xl backdrop-blur-sm"
            aria-label="Cerrar diálogo"
          >
            <X size={22} />
          </button>
        </div>

        {/* Left Side - Image */}
        <div className="relative flex items-center justify-center w-1/2 p-8 bg-gradient-to-br from-secondary/30 to-secondary/60">
          <div className="w-full max-w-md overflow-hidden bg-white shadow-lg rounded-2xl aspect-square">
            <OptimizedCarousel 
              images={product.images} 
              alt={product.name}
              className="object-contain h-full"
            />
          </div>
          
          {/* Floating stock indicator */}
          {stockStatus && (
            <div className={`absolute top-8 left-8 px-4 py-2 rounded-full text-sm font-medium border ${stockStatus.color} backdrop-blur-sm shadow-sm`}>
              {stockStatus.text}
            </div>
          )}
        </div>

        {/* Right Side - Content */}
        <div className="flex flex-col w-1/2">
          {/* Content Area - Scrollable */}
          <div className="flex-1 p-8 overflow-y-auto">
            {/* Product Header */}
            <div className="mb-6">
              <h2 
                id="product-dialog-title"
                className="mb-3 text-3xl font-light leading-tight text-primary"
              >
                {product.name}
              </h2>
              <p className="text-lg leading-relaxed text-content">
                {product.description}
              </p>
            </div>

            {/* Price Section */}
            <div className="flex flex-wrap items-baseline gap-3 mb-6">
              <span className="text-4xl font-bold text-accent">
                ${product.price.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
              {product.oldPrice && (
                <span className="text-xl line-through text-content">
                  ${product.oldPrice.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              )}
              {product.discountPercentage && (
                <span className="px-3 py-1 text-sm font-medium rounded-full bg-accent/10 text-accent">
                  {product.discountPercentage}% OFF
                </span>
              )}
            </div>
            
            {/* Trust Indicators */}
            <div className="grid grid-cols-3 gap-4 p-6 mb-6 rounded-xl bg-accent/10">
              <div className="text-center">
                <Leaf className="w-8 h-8 mx-auto mb-2 text-accent" />
                <p className="text-sm font-medium text-primary">100% Natural</p>
              </div>
              <div className="text-center">
                <Truck className="w-8 h-8 mx-auto mb-2 text-accent" />
                <p className="text-sm font-medium text-primary">
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
                <Star className="w-8 h-8 mx-auto mb-2 text-accent" />
                <p className="text-sm font-medium text-primary">Calidad Premium</p>
              </div>
            </div>
            
            {/* Quantity Selector */}
            <div className="mb-6">
              <label className="block mb-3 text-lg font-medium text-primary">
                Cantidad
              </label>
              <div className="flex items-center justify-between">
                <div className="flex items-center overflow-hidden border rounded-xl border-accent/20">
                  <button
                    onClick={() => setSelectedQuantity(Math.max(1, selectedQuantity - 1))}
                    className="p-4 transition-colors hover:bg-accent/10 active:bg-accent/20"
                    disabled={selectedQuantity <= 1}
                  >
                    <Minus size={18} />
                  </button>
                  <span className="px-6 py-4 text-lg font-medium min-w-[80px] text-center">
                    {selectedQuantity}
                  </span>
                  <button
                    onClick={() => setSelectedQuantity(selectedQuantity + 1)}
                    className="p-4 transition-colors hover:bg-accent/10 active:bg-accent/20"
                    disabled={stockStatus?.available === false || (product.stock != null && selectedQuantity >= product.stock)}
                  >
                    <Plus size={18} />
                  </button>
                </div>
                <span className="text-lg font-medium text-content">
                  Total: <span className="text-primary">${(product.price * selectedQuantity).toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </span>
              </div>
            </div>

            {/* Kit Contents */}
            {product.items && product.items.length > 0 && (
              <div className="mb-6">
                <h4 className="mb-4 text-lg font-medium text-primary">Qué incluye este kit:</h4>
                <div className="space-y-3">
                  {product.items.map((item, idx) => (
                    <div key={idx} className="flex items-start p-4 rounded-lg bg-gray-50">
                      <Star size={18} className="mt-0.5 mr-3 text-accent flex-shrink-0" />
                      <div>
                        <span className="text-base font-medium text-primary">{item.name}</span>
                        {item.quantity && <span className="text-content"> (x{item.quantity})</span>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Benefits */}
            {product.keyBenefits && product.keyBenefits.length > 0 && (
              <div className="mb-6">
                <h4 className="mb-4 text-lg font-medium text-primary">Beneficios principales:</h4>
                <ul className="space-y-3">
                  {product.keyBenefits.map((benefit, idx) => (
                    <li key={idx} className="flex items-start text-base">
                      <span className="mr-3 text-accent">•</span>
                      <span className="text-content">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Detailed Description */}
            <div className="mb-6">
              <h4 className="mb-4 text-lg font-medium text-primary">Descripción:</h4>
              <p className="text-base leading-relaxed text-content">
                {product.detailedDescription}
              </p>
            </div>
          </div>

          {/* Fixed Footer - Desktop */}
          <div className="p-8 border-t border-gray-100 bg-gray-50">
            <div className="space-y-4">
              <button 
                onClick={handleAddToCart}
                disabled={stockStatus?.available === false}
                className="flex items-center justify-center w-full px-8 py-4 space-x-3 text-xl font-semibold text-white transition-all duration-200 rounded-xl bg-accent hover:bg-supporting disabled:bg-gray-400 disabled:cursor-not-allowed hover:scale-105 active:scale-95 shadow-lg"
              >
                <ShoppingCart size={24} />
                <span>
                  {stockStatus && !stockStatus.available ? 'Sin Stock' : 'Agregar al Carrito'}
                </span>
              </button>
              
              {/* Trust indicators footer */}
              <div className="flex items-center justify-center space-x-6 text-sm text-content">
                <span className="flex items-center space-x-2">
                  <Truck size={16} />
                  <span 
                    className="underline cursor-pointer text-accent"
                    onClick={() => setShowShippingModal(true)}
                    tabIndex={0}
                    role="button"
                  >
                    Envío gratis en zonas seleccionadas
                  </span>
                </span>
                <span className="flex items-center space-x-2">
                  <Shield size={16} />
                  <span>Garantía 30 días</span>
                </span>
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
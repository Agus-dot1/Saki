import React from 'react';
import { ShoppingCart, Package, Star } from 'lucide-react';
import { Product } from '../../types';
import { useCart } from '../../hooks/useCart';
import { motion } from 'framer-motion';

interface ProductCardProps {
  product: Product;
  onClick: () => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onClick }) => {
  const { addToCart } = useCart();
  
  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    // Auto-select first available color and size if they exist
    const selectedColor = product.colors && product.colors.length > 0 ? product.colors[0] : undefined;
    const selectedSize = product.sizes && product.sizes.length > 0 ? product.sizes[0] : undefined;
    
    // Handle kit items with auto-selection of variants
    let selectedItems;
    if (product.items && product.items.length > 0) {
      selectedItems = product.items.map((item) => ({
        name: item.name,
        quantity: item.quantity ?? 1,
        color: item.colorOptions && item.colorOptions.length > 0 ? item.colorOptions[0] : undefined,
        size: item.sizeOptions && item.sizeOptions.length > 0 ? item.sizeOptions[0] : undefined,
      }));
    }
    
    // Add to cart with selected variants
    addToCart(
      { ...product, selectedColor, selectedSize },
      1, // Default quantity
      selectedItems
    );
  };

  const getStockStatus = () => {
    
    if (product.stock <= 0) {
      return { text: 'Sin Stock', color: 'text-red-600 bg-red-50', disabled: true };
    } else if (product.stock <= 5) {
      return { text: `Solo ${product.stock}`, color: 'text-yellow-600 bg-yellow-50', disabled: false };
    } else if (product.stock <= 10) {
      return { text: `${product.stock} disponibles`, color: 'text-blue-600 bg-blue-50', disabled: false };
    }
    
    return { text: 'En Stock', color: 'text-green-600 bg-green-50', disabled: false };
  };

  const stockStatus = getStockStatus();
  
  return (
    <motion.div 
      className={`flex flex-col w-full h-full overflow-hidden transition-all duration-300 transform cursor-pointer rounded-2xl bg-white border-2 shadow-sm
      ${product.isNew ? 'border-accent shadow-accent/10' : 'border-gray-100'}
      hover:shadow-lg hover:-translate-y-1 hover:border-accent/50 active:scale-[0.98]`}
      onClick={onClick}
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Image container - Mobile optimized */}
      <div className="relative h-48 overflow-hidden sm:h-56 lg:h-64">
        {/* NEW badge - Mobile optimized */}
        {product.isNew && (
          <div className="absolute z-20 px-2 py-1 text-xs font-bold tracking-wide uppercase text-white rounded-full shadow-lg top-2 left-2 sm:px-3 sm:py-1.5 sm:top-3 sm:left-3 bg-gradient-to-r from-accent to-supporting border border-white">
            ¡Nuevo!
          </div>
        )}

        <img 
          src={product.images[0]} 
          alt={product.name} 
          className={`object-contain scale-[2.8]  w-full h-full transition-transform duration-500 ${
            product.isNew ? 'scale-150' : 'scale-150 opacity-90'
          }`}
          loading="lazy"
        />
        
        {/* Stock indicator - Mobile optimized */}
        {stockStatus && (
          <div className={`absolute top-2 right-2 sm:top-3 sm:right-3 px-2 py-1 rounded-full text-xs font-medium ${stockStatus.color} border border-white/50 backdrop-blur-sm`}>
            <div className="flex items-center space-x-1">
              <Package size={10} />
              <span>{stockStatus.text}</span>
            </div>
          </div>
        )}

        {/* Discount badge - Mobile optimized */}
        {product.discountPercentage && (
          <div className="absolute px-2 py-1 text-xs font-bold text-white border rounded-full bottom-2 right-2 sm:bottom-3 sm:right-3 bg-supporting border-white/50">
            {product.discountPercentage}% OFF
          </div>
        )}

        {/* Quick add button overlay - Mobile optimized */}
        <div className="absolute inset-0 flex items-center justify-center transition-opacity duration-300 opacity-0 bg-black/20 hover:opacity-100">
          <button
            onClick={handleAddToCart}
            disabled={stockStatus?.disabled}
            className="flex items-center justify-center w-12 h-12 text-white transition-all duration-200 rounded-full bg-accent/90 hover:bg-accent hover:scale-110 disabled:bg-gray-400 disabled:cursor-not-allowed active:scale-95"
            aria-label="Agregar al carrito"
          >
            <ShoppingCart size={20} />
          </button>
        </div>
      </div>
      
      {/* Content - Mobile optimized spacing */}
      <div className="flex flex-col flex-grow p-4 sm:p-5">
        {/* Header */}
        <div className="mb-3">
          <h3 className={`mb-2 text-lg font-semibold leading-tight sm:text-xl ${
            product.isNew ? 'text-accent' : 'text-primary'
          }`}>
            {product.name}
          </h3>
          <p className="text-sm leading-relaxed text-content sm:text-base">
            {product.shortDescription}
          </p>
        </div>
        
        {/* Items preview - Mobile optimized */}
        <div className="flex-grow mb-4">
          <h4 className="mb-2 text-sm font-medium text-primary sm:text-base">Incluye:</h4>
          <ul className="space-y-1">
            {product.items && product.items.length > 0 && product.items.slice(0, 3).map((item, idx) => (
              <li key={idx} className="flex items-start text-xs sm:text-sm">
                <Star size={12} className="mt-0.5 mr-2 text-accent flex-shrink-0" />
                <span>
                  <span className="font-medium text-primary">{item.name}</span>
                  {item.quantity && <span className="text-content"> (x{item.quantity})</span>}
                </span>
              </li>
            ))}
          </ul>
          {product.items && product.items.length > 3 && (
            <span className="text-xs font-medium text-accent sm:text-sm">
              +{product.items.length - 3} más...
            </span>
          )}
        </div>
        
        {/* Footer - Mobile optimized */}
        <div className="pt-3 mt-auto border-t border-gray-100">
          {/* Price */}
          <div className="flex items-baseline justify-between mb-3">
            <div className="flex items-baseline space-x-2">
              <span className={`text-xl font-bold sm:text-2xl ${
                product.isNew ? 'text-accent' : 'text-primary'
              }`}>
                ${product.price.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
              {product.oldPrice && (
                <span className="text-sm text-gray-400 line-through">
                  ${product.oldPrice.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              )}
            </div>
          </div>

          {/* Action button - Mobile optimized */}
          <button 
            onClick={handleAddToCart}
            disabled={stockStatus?.disabled}
            className={`w-full px-4 py-3 text-sm font-semibold text-white transition-all duration-200 rounded-xl sm:text-base
              ${product.isNew ? 'bg-accent/90 hover:bg-accent' : 'bg-accent hover:bg-supporting'} 
              disabled:bg-gray-400 disabled:cursor-not-allowed active:scale-95 hover:scale-[1.02]`}
          >
            {stockStatus?.disabled ? 'Sin Stock' : 'Agregar al Carrito'}
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default React.memo(ProductCard);
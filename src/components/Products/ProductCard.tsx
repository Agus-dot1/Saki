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
    
    const selectedColor = product.colors && product.colors.length > 0 ? product.colors[0] : undefined;
    const selectedSize = product.sizes && product.sizes.length > 0 ? product.sizes[0] : undefined;
    
    let selectedItems;
    if (product.items && product.items.length > 0) {
      selectedItems = product.items.map((item) => ({
        name: item.name,
        quantity: item.quantity ?? 1,
        color: item.colorOptions && item.colorOptions.length > 0 ? item.colorOptions[0] : undefined,
        size: item.sizeOptions && item.sizeOptions.length > 0 ? item.sizeOptions[0] : undefined,
      }));
    }
    
    addToCart(
      { ...product, selectedColor, selectedSize },
      1,
      selectedItems
    );
  };

  const getStockStatus = () => {
    if (product.stock === undefined || product.stock === null) return null;
    
    if (product.stock <= 0) {
      return { text: 'Sin Stock', color: 'text-red-400 bg-red-500/20', disabled: true };
    } else if (product.stock <= 5) {
      return { text: `Solo ${product.stock}`, color: 'text-yellow-400 bg-yellow-500/20', disabled: false };
    } else if (product.stock <= 10) {
      return { text: `${product.stock} disponibles`, color: 'text-blue-400 bg-blue-500/20', disabled: false };
    }
    
    return { text: 'En Stock', color: 'text-green-400 bg-green-500/20', disabled: false };
  };

  const stockStatus = getStockStatus();
  
  return (
    <motion.div 
      className={`relative flex flex-col w-full h-full overflow-hidden transition-shadow duration-300 ease-in-out transform cursor-pointer rounded-2xl shadow-sm
      hover:shadow-accent hover:shadow-2xl hover:-translate-y-1 active:scale-[0.98]`}
      onClick={onClick}
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Background Image */}
      <div className="absolute inset-0">
      <img 
        src={product.images[0]} 
        alt={product.name} 
        className="object-cover w-full h-full transition-transform duration-500 scale-110"
        loading="lazy"
      />
      {/* Black gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent"></div>
      </div>

      {/* Content overlay */}
      <div className="relative z-10 flex flex-col flex-grow p-4 sm:p-5">
      {/* Top badges row */}
      <div className="flex items-start justify-between mb-3">
        {/* NEW badge */}
        {product.isNew && (
        <div className="px-2 py-1 text-xs font-bold tracking-wide uppercase text-white rounded-full shadow-lg sm:px-3 sm:py-1.5 bg-gradient-to-r from-accent to-supporting border border-white/30 backdrop-blur-sm">
          ¡Nuevo!
        </div>
        )}
        
        <div className="flex flex-col items-end gap-2 ml-auto">
        {/* Stock indicator */}
        {stockStatus && (
          <div className={`px-2 py-1 rounded-full text-xs font-medium ${stockStatus.color} border border-white/30 backdrop-blur-sm`}>
          <div className="flex items-center space-x-1">
            <Package size={10} />
            <span>{stockStatus.text}</span>
          </div>
          </div>
        )}

        {/* Discount badge */}
        {product.discountPercentage && (
          <div className="px-2 py-1 text-xs font-bold text-white border rounded-full bg-supporting/90 border-white/30 backdrop-blur-sm">
          {product.discountPercentage}% OFF
          </div>
        )}
        </div>
      </div>

      {/* Spacer to push content to bottom */}
      <div className="flex-grow min-h-[250px]"></div>

      {/* Main content at bottom */}
      <div className="mt-auto">
        {/* Title and description */}
        <div className="mb-3">
        <h3 className="mb-2 text-lg font-semibold leading-tight text-white sm:text-xl drop-shadow-lg">
          {product.name}
        </h3>
        <p className="text-sm leading-relaxed text-white/90 sm:text-base drop-shadow-md">
          {product.shortDescription}
        </p>
        </div>
        
        {/* Items preview */}
        <div className="mb-4">
        <h4 className="mb-2 text-sm font-medium text-white sm:text-base">Incluye:</h4>
        <ul className="space-y-1">
          {product.items && product.items.length > 0 && product.items.slice(0, 3).map((item, idx) => (
          <li key={idx} className="flex items-start text-xs sm:text-sm">
            <Star size={12} className="mt-0.5 mr-2 text-accent flex-shrink-0 drop-shadow-md" />
            <span className="text-white/90 drop-shadow-md">
            <span className="font-medium">{item.name}</span>
            {item.quantity && <span> (x{item.quantity})</span>}
            </span>
          </li>
          ))}
        </ul>
        {product.items && product.items.length > 3 && (
          <span className="text-xs font-medium text-accent sm:text-sm drop-shadow-md">
          +{product.items.length - 3} más...
          </span>
        )}
        </div>
        
        {/* Price and button */}
        <div className="pt-3 border-t border-white/20">
        <div className="flex items-baseline justify-between mb-3">
          <div className="flex items-baseline space-x-2">
          <span className="text-xl font-bold text-white sm:text-2xl drop-shadow-lg">
            ${product.price.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
          {product.oldPrice && (
            <span className="text-sm line-through text-white/50 drop-shadow-md">
            ${product.oldPrice.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          )}
          </div>
        </div>

        {/* Action button */}
        <button 
          onClick={handleAddToCart}
          disabled={stockStatus?.disabled}
          className={`w-full px-4 py-3 text-sm font-semibold text-white transition-all duration-200 rounded-xl sm:text-base backdrop-blur-sm
          ${product.isNew ? 'bg-accent/90 hover:bg-accent' : 'bg-accent/90 hover:bg-supporting'} 
          disabled:bg-gray-600/50 disabled:cursor-not-allowed active:scale-95 hover:scale-[1.02] shadow-lg`}
        >
          {stockStatus?.disabled ? 'Sin Stock' : 'Agregar al Carrito'}
        </button>
        </div>
      </div>
      </div>

    </motion.div>
  );
};

export default React.memo(ProductCard);

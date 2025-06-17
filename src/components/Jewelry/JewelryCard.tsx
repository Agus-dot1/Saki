import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, Info, Ruler, Package } from 'lucide-react';
import { JewelryItem } from '../../types/jewelry';
import { useCart } from '../../hooks/useCart';
import { useToast } from '../../hooks/useToast';

interface JewelryCardProps {
  item: JewelryItem;
  onClick: () => void;
}

const JewelryCard: React.FC<JewelryCardProps> = ({ item, onClick }) => {
  const { addToCart } = useCart();
  const { showSuccess, showInfo } = useToast();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    
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

    addToCart(productForCart);
  };

  const handleSizeGuide = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (item.category === 'rings') {
      // Dispatch custom event to open size guide
      document.dispatchEvent(new CustomEvent('openRingSizeGuide'));
    } else {
      showInfo(
        'Guía de Tallas',
        'La guía de tallas está disponible solo para anillos'
      );
    }
  };

  const getStockStatus = () => {
    if (item.stock <= 0) {
      return { text: 'Sin Stock', color: 'text-red-600 bg-red-50', disabled: true };
    } else if (item.stock <= 3) {
      return { text: `Solo ${item.stock} disponibles`, color: 'text-yellow-600 bg-yellow-50', disabled: false };
    } else if (item.stock <= 10) {
      return { text: `${item.stock} disponibles`, color: 'text-blue-600 bg-blue-50', disabled: false };
    }
    
    return { text: 'En Stock', color: 'text-green-600 bg-green-50', disabled: false };
  };

  const stockStatus = getStockStatus();

  const getCategoryIcon = () => {
    switch (item.category) {
      case 'rings':
        return '💍';
      case 'necklaces':
        return '📿';
      case 'bracelets':
        return '🔗';
      case 'earrings':
        return '👂';
      default:
        return '💎';
    }
  };

  return (
    <motion.div 
      className="flex flex-col h-full overflow-hidden transition-all duration-300 transform cursor-pointer rounded-2xl bg-white hover:shadow-xl hover:-translate-y-2 group"
      onClick={onClick}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Image container */}
      <div className="relative h-64 overflow-hidden lg:h-72">
        <img 
          src={item.images[0]} 
          alt={item.name} 
          className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
        />
        
        {/* Overlay with quick actions */}
        <div className="absolute inset-0 transition-opacity duration-300 opacity-0 bg-black/20 group-hover:opacity-100">
          <div className="absolute flex flex-col gap-2 top-3 right-3">
            <button
              onClick={handleAddToCart}
              disabled={stockStatus.disabled}
              className="p-2 transition-all duration-200 bg-white rounded-full shadow-lg hover:bg-accent hover:text-white disabled:bg-gray-200 disabled:cursor-not-allowed"
              aria-label="Agregar al carrito"
            >
              <ShoppingCart size={16} />
            </button>
            
            {item.category === 'rings' && (
              <button
                onClick={handleSizeGuide}
                className="p-2 transition-all duration-200 bg-white rounded-full shadow-lg hover:bg-accent hover:text-white"
                aria-label="Guía de tallas"
              >
                <Ruler size={16} />
              </button>
            )}
          </div>
        </div>
        
        {/* Stock indicator */}
        <div className={`absolute top-3 left-3 px-2 py-1 lg:px-3 lg:py-1 rounded-full text-xs font-medium ${stockStatus.color}`}>
          <div className="flex items-center space-x-1">
            <Package size={12} />
            <span>{stockStatus.text}</span>
          </div>
        </div>

        {/* Category badge */}
        <div className="absolute bottom-3 left-3 px-2 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-medium text-primary">
          <span className="mr-1">{getCategoryIcon()}</span>
          {item.category.charAt(0).toUpperCase() + item.category.slice(1)}
        </div>

        {/* Discount badge */}
        {item.discountPercentage && item.discountPercentage > 0 && (
          <div className="absolute top-3 right-3 px-2 py-1 bg-accent text-white rounded-full text-xs font-medium">
            -{item.discountPercentage}%
          </div>
        )}
      </div>
      
      {/* Content */}
      <div className="flex flex-col flex-grow p-4 lg:p-6">
        <div className="flex-grow">
          <h3 className="mb-2 text-lg font-medium lg:text-xl text-primary line-clamp-2">
            {item.name}
          </h3>
          
          <p className="mb-3 text-sm lg:text-base text-content line-clamp-2">
            {item.description}
          </p>

          {/* Material info */}
          <div className="mb-3 text-xs lg:text-sm text-content">
            <span className="font-medium">Material:</span> {item.material}
          </div>

          {/* Features */}
          {item.features && item.features.length > 0 && (
            <div className="mb-4">
              <ul className="space-y-1">
                {item.features.slice(0, 2).map((feature, idx) => (
                  <li key={idx} className="flex items-start text-xs lg:text-sm text-content">
                    <span className="mr-2 text-accent">•</span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
        
        {/* Footer */}
        <div className="pt-4 mt-auto border-t border-secondary/20">
          {/* Price */}
          <div className="flex items-baseline gap-2 mb-3">
            <span className="text-xl font-medium lg:text-2xl text-primary">
              ${item.price.toFixed(2)}
            </span>
            {item.oldPrice && item.oldPrice > item.price && (
              <span className="text-sm line-through lg:text-base text-content">
                ${item.oldPrice.toFixed(2)}
              </span>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex gap-2">
            <button 
              onClick={onClick}
              className="flex items-center justify-center flex-1 px-3 py-2 space-x-2 text-sm font-medium transition-colors border rounded-lg lg:text-base border-accent text-accent hover:bg-accent hover:text-white"
            >
              <Info size={16} />
              <span>Más Info</span>
            </button>
            
            <button 
              onClick={handleAddToCart}
              disabled={stockStatus.disabled}
              className="flex items-center justify-center px-3 py-2 text-sm font-medium text-white transition-colors rounded-lg lg:text-base bg-accent hover:bg-supporting disabled:bg-gray-400 disabled:cursor-not-allowed"
              aria-label="Agregar al carrito"
            >
              <ShoppingCart size={16} />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default JewelryCard;
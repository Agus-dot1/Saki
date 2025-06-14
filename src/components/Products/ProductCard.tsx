import React from 'react';
import { ShoppingCart, Package } from 'lucide-react';
import { Product } from '../../types';
import { useCart } from '../../hooks/useCart';

interface ProductCardProps {
  product: Product;
  onClick: () => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onClick }) => {
  const { addToCart } = useCart();
  
  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product);
  };

  const getStockStatus = () => {
    if (!product.stock) return null;
    
    if (product.stock <= 0) {
      return { text: 'Sin Stock', color: 'text-red-600 bg-red-50', disabled: true };
    } else if (product.stock <= 5) {
      return { text: `Solo ${product.stock} disponibles`, color: 'text-yellow-600 bg-yellow-50', disabled: false };
    } else if (product.stock <= 10) {
      return { text: `${product.stock} disponibles`, color: 'text-blue-600 bg-blue-50', disabled: false };
    }
    
    return { text: 'En Stock', color: 'text-green-600 bg-green-50', disabled: false };
  };

  const stockStatus = getStockStatus();
  
  return (
    <div 
      className="flex overflow-hidden flex-col w-full h-full rounded-lg transition-all duration-300 transform cursor-pointer bg-secondary hover:shadow-lg hover:-translate-y-1"
      onClick={onClick}
    >
      {/* Image container - Better mobile aspect ratio */}
      <div className="overflow-hidden relative h-64 lg:h-80">
        <img 
          src={product.images[0]} 
          alt={product.name} 
          className="object-contain w-full h-full scale-150 lg:scale-[1.8]"
        />
        
        {/* Stock indicator - Better mobile positioning */}
        {stockStatus && (
          <div className={`absolute top-3 right-3 lg:top-4 lg:right-4 px-2 py-1 lg:px-3 lg:py-1 rounded-full text-xs font-medium ${stockStatus.color}`}>
            <div className="flex items-center space-x-1">
              <Package size={12} />
              <span>{stockStatus.text}</span>
            </div>
          </div>
        )}
      </div>
      
      {/* Content - Better mobile spacing */}
      <div className="flex flex-col flex-grow p-4 lg:p-6">
        <h3 className="mb-2 text-xl font-medium lg:mb-3 lg:text-2xl text-primary">{product.name}</h3>
        <p className="mb-4 text-base lg:mb-6 lg:text-lg text-content">{product.shortDescription}</p>
        
        {/* Items list - Improved mobile layout */}
        <div className="flex-grow mb-4 lg:mb-6">
          <h4 className="mb-2 text-base font-medium lg:mb-3 lg:text-lg text-primary">Incluye:</h4>
          <ul className="space-y-2 lg:space-y-3">
            {product.items && product.items.length > 0 && product.items.slice(0, 4).map((item, idx) => (
              <li key={idx} className="text-sm lg:text-base">
                <span className="font-medium text-primary">{item.name}</span>
                {item.quantity && <span className="text-content"> (x{item.quantity})</span>}
              </li>
            ))}
          </ul>
          <span className="mt-3 text-sm font-medium lg:mt-4 text-primary">
            y más...
          </span>
        </div>
        
        {/* Footer - Better mobile layout */}
        <div className="flex flex-col gap-3 pt-4 mt-auto border-t lg:flex-row lg:justify-between lg:items-center lg:pt-6 border-supporting/20">
          <span className="text-xl font-medium lg:text-2xl text-primary">${product.price.toFixed(2)}</span>
          
          <button 
            onClick={handleAddToCart}
            disabled={stockStatus?.disabled}
            className="flex items-center justify-center w-full px-4 py-3 space-x-2 text-white rounded-md transition-colors lg:w-auto lg:px-6 bg-accent hover:bg-supporting disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            <ShoppingCart size={18} />
            <span>{stockStatus?.disabled ? 'Sin Stock' : 'Agregar'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
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
      className={`flex flex-col w-full h-full overflow-hidden transition-all duration-300 transform cursor-pointer rounded-3xl bg-secondary border-2 
      ${product.isNew ? 'border-accent shadow-[0_4px_24px_0_rgba(59,130,246,0.15)' : 'border-transparent'}
      hover:shadow-lg hover:-translate-y-1
      hover:border-accent`}
      onClick={onClick}
    >
      {/* Image container - Better mobile aspect ratio */}
      <div className="relative h-64 overflow-hidden lg:h-80">
      {/* NEW badge */}
      {product.isNew && (
        <div className="absolute z-20 px-3 py-1.5 text-xs font-bold tracking-wide uppercase text-white rounded-full shadow-lg top-3 left-3 lg:top-4 lg:left-4 bg-gradient-to-r from-accent to-supporting border-2 border-white">
        ¡Nuevo!
        </div>
      )}
      <img 
        src={product.images[0]} 
        alt={product.name} 
        className={`object-contain w-full h-full ${product.isNew ? 'scale-150' : 'scale-150 opacity-90' } lg:scale-[2.1]`}
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
      <h3 className={`mb-2 text-xl font-medium lg:mb-3 lg:text-2xl ${product.isNew ? 'text-accent' : 'text-primary'}`}>{product.name}</h3>
      <p className="mb-4 text-base lg:mb-6 lg:text-lg text-content">{product.shortDescription}</p>
      
      {/* Items list - Improved mobile layout */}
      <div className="flex-grow mb-4 lg:mb-6">
        <h4 className="mb-2 text-base font-medium lg:mb-3 lg:text-lg text-primary">Incluye:</h4>
        <ul className="space-y-2 lg:space-y-1">
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
        <span className={`text-xl font-medium lg:text-2xl ${product.isNew ? 'text-accent' : 'text-primary'}`}>${product.price}
        {product.oldPrice && (
        <span className="ml-2 text-base text-gray-400 line-through">
          ${product.oldPrice}
        </span>
        )}</span> 
        
        <button 
        onClick={handleAddToCart}
        disabled={stockStatus?.disabled}
        className={`flex items-center justify-center w-full px-4 py-3 space-x-2 text-white transition-colors rounded-2xl lg:w-auto lg:px-6 
          ${product.isNew ? 'bg-accent/90 hover:bg-accent' : 'bg-accent hover:bg-supporting'} 
          disabled:bg-gray-400 disabled:cursor-not-allowed`}
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
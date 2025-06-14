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
      className="flex overflow-hidden flex-col max-w-xl h-full rounded-lg transition-all duration-300 transform cursor-pointer bg-secondary hover:shadow-lg hover:-translate-y-1"
      onClick={onClick}
    >
      
      <div className="overflow-hidden relative h-96">
        <img 
          src={product.images[0]} 
          alt={product.name} 
          className="object-contain w-full h-full scale-[1.8]"
        />
        
        {/* Stock indicator */}
        {stockStatus && (
          <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-medium ${stockStatus.color}`}>
            <div className="flex items-center space-x-1">
              <Package size={12} />
              <span>{stockStatus.text}</span>
            </div>
          </div>
        )}
      </div>
      
      <div className="flex flex-col flex-grow p-8">
        <h3 className="mb-3 text-2xl font-medium text-primary">{product.name}</h3>
        <p className="mb-6 text-lg text-content">{product.shortDescription}</p>
        
        <div className="flex-grow mb-6">
          <h4 className="mb-3 text-lg font-medium text-primary">Incluye:</h4>
          <ul className="space-y-3">
          {product.items && product.items.length > 0 && product.items.slice(0, 4).map((item, idx) => (
            <li key={idx}>
              <span className="font-medium text-primary">{item.name}</span>
              {item.quantity && <span className="text-content"> (x{item.quantity})</span>}
            </li>
          ))}
        </ul>
        <span className="mt-4 text-sm font-medium text-primary">
          y más...
        </span>
        </div>
        
        <div className="flex justify-between items-center pt-6 mt-auto border-t border-supporting/20">
          <span className="text-2xl font-medium text-primary">${product.price.toFixed(2)}</span>
          
          <button 
            onClick={handleAddToCart}
            disabled={stockStatus?.disabled}
            className="flex items-center px-6 py-3 space-x-2 text-white rounded-md transition-colors bg-accent hover:bg-supporting disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            <ShoppingCart size={20} />
            <span>{stockStatus?.disabled ? 'Sin Stock' : 'Agregar'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
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
      className="bg-secondary rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 cursor-pointer h-full flex flex-col"
      onClick={onClick}
    >
      <div className="h-96 overflow-hidden relative">
        <img 
          src={product.images[0]} 
          alt={product.name} 
          className="w-full h-full object-cover transition-transform hover:scale-105 duration-500"
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
      
      <div className="p-8 flex flex-col flex-grow">
        <h3 className="text-2xl font-medium text-primary mb-3">{product.name}</h3>
        <p className="text-content text-lg mb-6">{product.shortDescription}</p>
        
        <div className="mb-6 flex-grow">
          <h4 className="text-lg font-medium text-primary mb-3">Incluye:</h4>
          <ul className="text-content space-y-2">
            {product.contents.slice(0, 3).map((item, index) => (
              <li key={index} className="flex items-start">
                <span className="text-accent mr-2">•</span>
                <span>{item}</span>
              </li>
            ))}
            {product.contents.length > 3 && (
              <li className="text-supporting">+ {product.contents.length - 3} más</li>
            )}
          </ul>
        </div>
        
        <div className="flex justify-between items-center mt-auto pt-6 border-t border-supporting/20">
          <span className="text-2xl font-medium text-primary">${product.price.toFixed(2)}</span>
          
          <button 
            onClick={handleAddToCart}
            disabled={stockStatus?.disabled}
            className="bg-accent text-white px-6 py-3 rounded-md flex items-center space-x-2 hover:bg-supporting transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
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
import React from 'react';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { CartItem as CartItemType } from '../../types';
import { useCart } from '../../hooks/useCart';

interface CartItemProps {
  item: CartItemType;
}

const CartItem: React.FC<CartItemProps> = ({ item }) => {
  const { increaseQuantity, decreaseQuantity, removeFromCart } = useCart();
  const { product, quantity } = item;
  
  return (
    <div className="flex space-x-4">
      {/* Product image */}
      <div className="w-20 h-20 bg-secondary rounded-md overflow-hidden flex-shrink-0">
        <img 
          src={product.images[0]} 
          alt={product.name} 
          className="w-full h-full object-cover"
        />
      </div>
      
      {/* Product details */}
      <div className="flex-1">
        <h3 className="text-primary font-medium">{product.name}</h3>
        <p className="text-content text-sm">${product.price.toFixed(2)}</p>
        
        <div className="flex items-center mt-2">
          {/* Quantity controls */}
          <div className="flex items-center space-x-2">
            <button 
              onClick={() => decreaseQuantity(product.id)}
              className="p-1 rounded-full bg-secondary hover:bg-secondary/80 transition-colors"
              aria-label="Disminuir cantidad"
            >
              <Minus size={16} className="text-primary" />
            </button>
            
            <span className="text-primary w-6 text-center">{quantity}</span>
            
            <button 
              onClick={() => increaseQuantity(product.id)}
              className="p-1 rounded-full bg-secondary hover:bg-secondary/80 transition-colors"
              aria-label="Aumentar cantidad"
            >
              <Plus size={16} className="text-primary" />
            </button>
          </div>
          
          {/* Remove button */}
          <button 
            onClick={() => removeFromCart(product.id)}
            className="ml-auto p-2 text-content hover:text-accent transition-colors"
            aria-label="Eliminar producto"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
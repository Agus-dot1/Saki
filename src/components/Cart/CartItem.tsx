import React, { useState } from 'react';
import { Minus, Plus, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import { CartItem as CartItemType } from '../../types';
import { useCart } from '../../hooks/useCart';
import { buildVariantLabel } from '../../utils/variantUtils';
import LazyImage from '../LazyImage';

interface CartItemProps {
  item: CartItemType;
}

const CartItem: React.FC<CartItemProps> = ({ item }) => {
  const { increaseQuantity, decreaseQuantity, removeFromCart } = useCart();
  const { product, quantity } = item;
  const [expanded, setExpanded] = useState(false);
  const variantLabel = buildVariantLabel(item);

  // Check if product is a kit (has items array)
  const isKit = Array.isArray(product.items) && product.items.length > 0;

  const kitItems = item.selectedItems ?? product.items;

  return (
    <div className="flex space-x-4">
      {/* Product image */}
      <div className="w-20 h-20 overflow-hidden rounded-lg">
        <LazyImage
          src={item.product.images[0]}
          alt={item.product.name}
          className="object-cover w-full h-full"
          threshold={0.1}
          rootMargin="50px"
        />
      </div>
      
      {/* Product details */}
      <div className="flex-1">
        <div className="flex items-center">
          <h3 className="font-medium text-primary">{product.name}</h3>
          {variantLabel && (
            <span className="ml-2 text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded">
              {variantLabel}
            </span>
          )}
          {isKit && (
            <button
              className="p-1 ml-2 text-primary hover:text-accent"
              onClick={() => setExpanded(e => !e)}
              aria-label={expanded ? "Ocultar contenido del kit" : "Mostrar contenido del kit"}
            >
              {expanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </button>
          )}
        </div>
        <p className="text-sm text-content">${product.price.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>

        {/* Kit items expandable list */}
        {isKit && kitItems && expanded && (
          <ul className="pl-2 mt-2 ml-2 space-y-1 text-sm border-l border-accent/30">
            {kitItems.map((kitItem, idx) => (
              <li key={idx} className="flex flex-col">
                <span>
                  x{('quantity' in kitItem ? kitItem.quantity : 1)} {kitItem.name}
                  {('size' in kitItem || 'color' in kitItem) && (kitItem.size || kitItem.color) && (
                    <>
                      {' ('}
                      {kitItem.size && <>{kitItem.size}</>}
                      {kitItem.size && kitItem.color && ', '}
                      {kitItem.color && <>{kitItem.color}</>}
                      {')'}
                    </>
                  )}
                </span>
              </li>
            ))}
          </ul>
        )}

        <div className="flex items-center mt-2">
          <div className="flex items-center space-x-2">
            <button 
              onClick={() => decreaseQuantity(
                product.id,
                product.modelNumber,
                product.selectedSize,
                item.selectedItems
              )}
              className="p-1 transition-colors rounded-full bg-secondary hover:bg-secondary/80"
              aria-label="Disminuir cantidad"
            >
              <Minus size={16} className="text-primary" />
            </button>
            
            <span className="w-6 text-center text-primary">{quantity}</span>
            
            <button 
              onClick={() => increaseQuantity(
                product.id,
                product.modelNumber,
                product.selectedSize,
                item.selectedItems
              )}
              className="p-1 transition-colors rounded-full bg-secondary hover:bg-secondary/80"
              aria-label="Aumentar cantidad"
            >
              <Plus size={16} className="text-primary" />
            </button>
          </div>
          
          <button 
            onClick={() =>
              removeFromCart(
                product.id,
                product.modelNumber,
                product.selectedSize,
                item.selectedItems
              )}
            className="p-2 ml-auto transition-colors text-content hover:text-accent"
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
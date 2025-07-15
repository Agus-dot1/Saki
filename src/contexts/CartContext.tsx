import React, { createContext, useState, useEffect } from 'react';
import { Product, CartItem, SelectedKitItem } from '../types';
import { useToast } from '../hooks/useToast';
import { createCartItemKey } from '../utils/variantUtils';
import { createCartItemKey } from '../utils/variantUtils';

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: Product, quantity?: number, selectedItems?: SelectedKitItem[]) => void;
  removeFromCart: (productId: number, modelNumber?: number, selectedSize?: string, selectedItems?: SelectedKitItem[]) => void;
  increaseQuantity: (productId: number, modelNumber?: number, selectedSize?: string, selectedItems?: SelectedKitItem[]) => void;
  decreaseQuantity: (productId: number, modelNumber?: number, selectedSize?: string, selectedItems?: SelectedKitItem[]) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
  isProcessingCheckout: boolean;
}

export const CartContext = createContext<CartContextType>({
  cartItems: [],
  addToCart: () => {},
  removeFromCart: () => {},
  increaseQuantity: () => {},
  decreaseQuantity: () => {},
  clearCart: () => {},
  totalItems: 0,
  totalPrice: 0,
  isProcessingCheckout: false,
});

const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isProcessingCheckout] = useState(false);
  const { showSuccess, showError, showInfo, showWarning } = useToast();
  
  // Load cart from localStorage on initial render
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart));
      } catch (error) {
        console.error('Failed to parse cart from localStorage:', error);
        showError('Error', 'No se pudo cargar el carrito guardado');
      }
    }
  }, [showError]);
  
  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const checkStock = (product: Product, requestedQuantity: number): boolean => {
    const currentQuantity = cartItems.find(item => item.product.id === product.id)?.quantity || 0;
    const totalQuantity = currentQuantity + requestedQuantity;
    
    if (product.stock && totalQuantity > product.stock) {
      showWarning(
        'Stock Limitado',
        `Solo quedan ${product.stock} unidades de ${product.name}. Tenés ${currentQuantity} en tu carrito.`
      );
      return false;
    }
    return true;
  };
  
  // Utility to compare selectedItems deeply
  function areSelectedItemsEqual(a?: SelectedKitItem[], b?: SelectedKitItem[]) {
    if (!a && !b) return true;
    if (!a || !b) return false;
    if (a.length !== b.length) return false;
    return a.every((item, idx) => {
      const other = b[idx];
      return (
        item.name === other.name &&
        item.quantity === other.quantity &&
        item.color === other.color &&
        item.size === other.size
      );
    });
  }

  const addToCart = (product: Product, quantity: number = 1, selectedItems?: SelectedKitItem[]) => {
    if (!checkStock(product, quantity)) return;

    setCartItems(prevItems => {
      // Create a unique key for the new item
      const newItemKey = createCartItemKey({ product, quantity, selectedItems });
      
      // Check if an item with the same key already exists
      const existingItem = prevItems.find(item => 
        createCartItemKey(item) === newItemKey
      );

      // Create a unique key for the new item
      const newItemKey = createCartItemKey({ product, quantity, selectedItems });
      
      // Check if an item with the same key already exists
      const existingItem = prevItems.find(item => 
        createCartItemKey(item) === newItemKey
      );

      if (existingItem) {
        const updatedItems = prevItems.map(item => {
          const itemKey = createCartItemKey(item);
          return itemKey === newItemKey
            ? { ...item, quantity: item.quantity + quantity }
            : item;
        });

        showSuccess(
          'Producto Actualizado',
          `${product.name} (cantidad: ${existingItem.quantity + quantity})`
        );

        return updatedItems;
        });

        showSuccess(
          'Producto Actualizado',
          `${product.name} (cantidad: ${existingItem.quantity + quantity})`
        );

        return updatedItems;
      } else {
        showSuccess(
          'Agregado al Carrito',
          `${product.name} ${quantity > 1 ? `(${quantity} unidades)` : ''}`
        );

        showSuccess(
          'Agregado al Carrito',
          `${product.name} ${quantity > 1 ? `(${quantity} unidades)` : ''}`
        );

        return [...prevItems, { product, quantity, selectedItems }];
      }
    });
  };
  
  // Also update these functions to consider model and size
  const removeFromCart = (productId: number, modelNumber?: number, selectedSize?: string, selectedItems?: SelectedKitItem[]) => {
    const targetKey = createCartItemKey({ 
      product: { id: productId, modelNumber, selectedSize } as Product, 
      quantity: 1, 
      selectedItems 
    });
    
    const targetKey = createCartItemKey({ 
      product: { id: productId, modelNumber, selectedSize } as Product, 
      quantity: 1, 
      selectedItems 
    });
    
    setCartItems(prevItems =>
      prevItems.filter(item => createCartItemKey(item) !== targetKey)
    );
  };

  const increaseQuantity = (productId: number, modelNumber?: number, selectedSize?: string, selectedItems?: SelectedKitItem[]) => {
    const targetKey = createCartItemKey({ 
      product: { id: productId, modelNumber, selectedSize } as Product, 
      quantity: 1, 
      selectedItems 
    });
    
    const targetKey = createCartItemKey({ 
      product: { id: productId, modelNumber, selectedSize } as Product, 
      quantity: 1, 
      selectedItems 
    });
    
    setCartItems(prevItems =>
      prevItems.map(item => {
        const itemKey = createCartItemKey(item);
        return itemKey === targetKey
        return itemKey === targetKey
          ? { ...item, quantity: item.quantity + 1 }
          : item;
      })
    );
  };

  const decreaseQuantity = (productId: number, modelNumber?: number, selectedSize?: string, selectedItems?: SelectedKitItem[]) => {
    const targetKey = createCartItemKey({ 
      product: { id: productId, modelNumber, selectedSize } as Product, 
      quantity: 1, 
      selectedItems 
    });
    
    const targetKey = createCartItemKey({ 
      product: { id: productId, modelNumber, selectedSize } as Product, 
      quantity: 1, 
      selectedItems 
    });
    
    setCartItems(prevItems => {
      const item = prevItems.find(item => createCartItemKey(item) === targetKey);

      if (item?.quantity === 1) {
        return prevItems.filter(item => createCartItemKey(item) !== targetKey);
      }

      return prevItems.map(item => {
        const itemKey = createCartItemKey(item);
        return itemKey === targetKey
        return itemKey === targetKey
          ? { ...item, quantity: item.quantity - 1 }
          : item;
      });
    });
  };
  
  const clearCart = () => {
    const itemCount = cartItems.length;
    setCartItems([]);
    showInfo(
      'Carrito Vaciado',
      `Se eliminaron ${itemCount} producto${itemCount !== 1 ? 's' : ''} del carrito`
    );
  };
  const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);
  
  const totalPrice = cartItems.reduce(
    (total, item) => total + item.product.price * item.quantity, 
    0
  );
  
  const contextValue: CartContextType = {
    cartItems,
    addToCart,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
    clearCart,
    totalItems,
    totalPrice,
    isProcessingCheckout,
  };
  
  return (
    <CartContext.Provider value={contextValue}>
      {children}
    </CartContext.Provider>
  );
};

export default CartProvider;
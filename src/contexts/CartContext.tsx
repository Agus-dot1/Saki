import React, { createContext, useState, useEffect, useMemo, useCallback } from 'react';
import { Product, CartItem, SelectedKitItem } from '../types';
import { useToast } from '../hooks/useToast';
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
  

  const addToCart = useCallback((product: Product, quantity: number = 1, selectedItems?: SelectedKitItem[]) => {
    if (!checkStock(product, quantity)) return;

    setCartItems(prevItems => {
      const newItemKey = createCartItemKey({ product, quantity, selectedItems });
      const existingItem = prevItems.find(item => createCartItemKey(item) === newItemKey);

      if (existingItem) {
        const updatedItems = prevItems.map(item =>
          createCartItemKey(item) === newItemKey
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
        showSuccess('Producto Actualizado', `${product.name} (cantidad: ${existingItem.quantity + quantity})`);
        return updatedItems;
      } else {
        showSuccess('Agregado al Carrito', `${product.name} ${quantity > 1 ? `(${quantity} unidades)` : ''}`);
        return [...prevItems, { product, quantity, selectedItems }];
      }
    });
  }, [showSuccess]);

  const removeFromCart = useCallback((productId: number, modelNumber?: number, selectedSize?: string, selectedItems?: SelectedKitItem[]) => {
    const targetKey = createCartItemKey({ product: { id: productId, modelNumber, selectedSize } as Product, quantity: 1, selectedItems });
    setCartItems(prevItems => prevItems.filter(item => createCartItemKey(item) !== targetKey));
  }, []);

  const increaseQuantity = useCallback((productId: number, modelNumber?: number, selectedSize?: string, selectedItems?: SelectedKitItem[]) => {
    const targetKey = createCartItemKey({ product: { id: productId, modelNumber, selectedSize } as Product, quantity: 1, selectedItems });
    setCartItems(prevItems =>
      prevItems.map(item =>
        createCartItemKey(item) === targetKey
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
  }, []);

  const decreaseQuantity = useCallback((productId: number, modelNumber?: number, selectedSize?: string, selectedItems?: SelectedKitItem[]) => {
    const targetKey = createCartItemKey({ product: { id: productId, modelNumber, selectedSize } as Product, quantity: 1, selectedItems });
    setCartItems(prevItems => {
      const item = prevItems.find(item => createCartItemKey(item) === targetKey);
      if (item?.quantity === 1) {
        return prevItems.filter(i => createCartItemKey(i) !== targetKey);
      }
      return prevItems.map(i =>
        createCartItemKey(i) === targetKey
          ? { ...i, quantity: i.quantity - 1 }
          : i
      );
    });
  }, []);

  const clearCart = useCallback(() => {
    const itemCount = cartItems.length;
    setCartItems([]);
    showInfo('Carrito Vaciado', `Se eliminaron ${itemCount} producto${itemCount !== 1 ? 's' : ''} del carrito`);
  }, [cartItems.length, showInfo]);

  const totalItems = useMemo(() => cartItems.reduce((total, item) => total + item.quantity, 0), [cartItems]);
  
  const totalPrice = useMemo(() => cartItems.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0
  ), [cartItems]);
  
  const contextValue = useMemo(() => ({
    cartItems,
    addToCart,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
    clearCart,
    totalItems,
    totalPrice,
    isProcessingCheckout,
  }), [cartItems, totalItems, totalPrice, isProcessingCheckout, addToCart, removeFromCart, increaseQuantity, decreaseQuantity, clearCart]);
  
  return (
    <CartContext.Provider value={contextValue}>
      {children}
    </CartContext.Provider>
  );
};

export default CartProvider;
import React, { createContext, useState, useEffect } from 'react';
import { Product, CartItem } from '../types';
import { useToast } from '../hooks/useToast';

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: number) => void;
  increaseQuantity: (productId: number) => void;
  decreaseQuantity: (productId: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
  isProcessingCheckout: boolean;
  processCheckout: () => Promise<boolean>;
  openCheckoutForm: () => void;
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
  processCheckout: async () => false,
  openCheckoutForm: () => {},
});

const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isProcessingCheckout, setIsProcessingCheckout] = useState(false);
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
  
  const addToCart = (product: Product, quantity: number = 1) => {
    if (!checkStock(product, quantity)) return;
    
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.product.id === product.id);
      
      if (existingItem) {
        const updatedItems = prevItems.map(item => 
          item.product.id === product.id 
            ? { ...item, quantity: item.quantity + quantity } 
            : item
        );
        
        showSuccess(
          'Producto Actualizado',
          `${product.name} (cantidad: ${existingItem.quantity + quantity})`,
          {
            action: {
              label: 'Ver Carrito',
              onClick: () => {
                document.dispatchEvent(new CustomEvent('openCart'));
              }
            }
          }
        );
        
        return updatedItems;
      } else {
        showSuccess(
          'Agregado al Carrito',
          `${product.name} ${quantity > 1 ? `(${quantity} unidades)` : ''}`,
          {
            action: {
              label: 'Ver Carrito',
              onClick: () => {
                document.dispatchEvent(new CustomEvent('openCart'));
              }
            }
          }
        );
        
        return [...prevItems, { product, quantity }];
      }
    });
  };
  
  const removeFromCart = (productId: number) => {
    const item = cartItems.find(item => item.product.id === productId);
    if (item) {
      setCartItems(prevItems => prevItems.filter(item => item.product.id !== productId));
      showInfo(
        'Producto Eliminado',
        `${item.product.name} fue eliminado del carrito`,
        {
          action: {
            label: 'Deshacer',
            onClick: () => addToCart(item.product, item.quantity)
          }
        }
      );
    }
  };
  
  const increaseQuantity = (productId: number) => {
    const item = cartItems.find(item => item.product.id === productId);
    if (item && checkStock(item.product, 1)) {
      setCartItems(prevItems => 
        prevItems.map(item => 
          item.product.id === productId 
            ? { ...item, quantity: item.quantity + 1 } 
            : item
        )
      );
    }
  };
  
  const decreaseQuantity = (productId: number) => {
    setCartItems(prevItems => {
      const item = prevItems.find(item => item.product.id === productId);
      
      if (item && item.quantity === 1) {
        removeFromCart(productId);
        return prevItems;
      }
      
      return prevItems.map(item => 
        item.product.id === productId 
          ? { ...item, quantity: item.quantity - 1 } 
          : item
      );
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

  const openCheckoutForm = () => {
    document.dispatchEvent(new CustomEvent('openCheckoutForm'));
  };

  const processCheckout = async (): Promise<boolean> => {
    if (cartItems.length === 0) {
      showWarning('Carrito Vacío', 'Agregá productos antes de finalizar la compra');
      return false;
    }

    // Abrir formulario de checkout en lugar de procesar directamente
    openCheckoutForm();
    return true;
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
    processCheckout,
    openCheckoutForm,
  };
  
  return (
    <CartContext.Provider value={contextValue}>
      {children}
    </CartContext.Provider>
  );
};

export default CartProvider;
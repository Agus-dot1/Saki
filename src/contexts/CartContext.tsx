import React, { createContext, useState, useEffect } from 'react';
import { Product, CartItem, SelectedKitItem } from '../types';
import { useToast } from '../hooks/useToast';

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: Product, quantity?: number, selectedItems?: SelectedKitItem[]) => void;
  removeFromCart: (productId: number, modelNumber?: number, selectedSize?: string) => void;
  increaseQuantity: (productId: number, modelNumber?: number, selectedSize?: string) => void;
  decreaseQuantity: (productId: number, modelNumber?: number, selectedSize?: string) => void;
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
  
  const addToCart = (product: Product, quantity: number = 1, selectedItems?: SelectedKitItem[]) => {
    if (!checkStock(product, quantity)) return;

    setCartItems(prevItems => {
      // Check if the product with the same ID, model, and size exists
      const existingItem = prevItems.find(item => 
        item.product.id === product.id && 
        item.product.modelNumber === product.modelNumber &&
        item.product.selectedSize === product.selectedSize
      );

      if (existingItem) {
        const updatedItems = prevItems.map(item =>
          item.product.id === product.id &&
          item.product.modelNumber === product.modelNumber &&
          item.product.selectedSize === product.selectedSize
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );

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

        return [...prevItems, { product, quantity, selectedItems }];
      }
    });
  };
  
  // Also update these functions to consider model and size
  const removeFromCart = (productId: number, modelNumber?: number, selectedSize?: string) => {
    const item = cartItems.find(item => 
      item.product.id === productId &&
      item.product.modelNumber === modelNumber &&
      item.product.selectedSize === selectedSize
    );
    
    if (item) {
      setCartItems(prevItems => prevItems.filter(item => 
        !(item.product.id === productId &&
          item.product.modelNumber === modelNumber &&
          item.product.selectedSize === selectedSize)
      ));
    }
  };

  const increaseQuantity = (productId: number, modelNumber?: number, selectedSize?: string) => {
    setCartItems(prevItems => 
      prevItems.map(item => 
        item.product.id === productId &&
        item.product.modelNumber === modelNumber &&
        item.product.selectedSize === selectedSize
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
  };

  const decreaseQuantity = (productId: number, modelNumber?: number, selectedSize?: string) => {
    setCartItems(prevItems => {
      const item = prevItems.find(item => 
        item.product.id === productId &&
        item.product.modelNumber === modelNumber &&
        item.product.selectedSize === selectedSize
      );

      if (item?.quantity === 1) {
        removeFromCart(productId, modelNumber, selectedSize);
        return prevItems;
      }

      return prevItems.map(item => 
        item.product.id === productId &&
        item.product.modelNumber === modelNumber &&
        item.product.selectedSize === selectedSize
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

    openCheckoutForm();


      try {
    const res = await fetch('https://jvrvhoyepfcznosljvjw.supabase.co/functions/v1/create-payment-preference', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: 'Pan de masa madre',
        price: 5500,
      }),
    });

    if (!res.ok) {
      const errorText = await res.text()
      console.error('Checkout request failed:', res.status, errorText)
      return false
    }

    const data = await res.json()

    if (data.init_point) {
      window.location.href = data.init_point // redirigís al checkout de MP
      return true
    } else {
      console.error('No init_point en respuesta:', data)
      return false
    }
  } catch (error) {
    console.error('Error during checkout process:', error)
    return false
  }

    // if (cartItems.length === 0) {
    //   showWarning('Carrito Vacío', 'Agregá productos antes de finalizar la compra');
    //   return false;
    // }

    // // Abrir formulario de checkout en lugar de procesar directamente
    // openCheckoutForm();
    // return true;
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
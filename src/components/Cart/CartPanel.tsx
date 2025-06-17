import React, { useEffect } from 'react';
import { X, ArrowRight, Loader2 } from 'lucide-react';
import { useCart } from '../../hooks/useCart';
import { useToast } from '../../hooks/useToast';
import CartItem from './CartItem';

interface CartPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const CartPanel: React.FC<CartPanelProps> = ({ isOpen, onClose }) => {
  const { 
    cartItems, totalPrice, clearCart, processCheckout, isProcessingCheckout
  } = useCart();
  const { showInfo } = useToast();
  
  // Listen for custom cart opening events
  useEffect(() => {
    const handleOpenCart = () => {
      if (!isOpen) {
        document.dispatchEvent(new CustomEvent('requestOpenCart'));
      }
    };

    document.addEventListener('openCart', handleOpenCart);
    return () => document.removeEventListener('openCart', handleOpenCart);
  }, [isOpen]);

  const handleCheckout = async () => {
    const success = await processCheckout();
    if (success) {
      onClose();
    }
  };

  const handleWhatsAppCheckout = () => {
    if (cartItems.length === 0) {
      showInfo('Carrito Vacío', 'Agregá productos antes de contactarnos');
      return;
    }

    const orderSummary = cartItems.map(
      item => `${item.quantity}x ${item.product.name} - $${(item.product.price * item.quantity).toFixed(2)}`
    ).join('\n');
    
    const message = `Hola, me gustaría hacer un pedido:\n\n${orderSummary}\n\nTotal: $${totalPrice.toFixed(2)}`;
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/5411XXXXXXXX?text=${encodedMessage}`;
    
    window.open(whatsappUrl, '_blank');
    
    showInfo(
      'Redirigiendo a WhatsApp',
      'Te estamos conectando con nuestro equipo de ventas'
    );
  };
  
  return (
    <div className="flex flex-col h-full bg-white shadow-xl">
      {/* Header - Better mobile spacing */}
      <div className="flex justify-between items-center p-4 border-b lg:p-6 border-secondary/20">
        <h2 className="text-xl font-medium lg:text-2xl text-primary">Tu Carrito</h2>
        <button 
          onClick={onClose}
          className="p-2 rounded-xl transition-colors text-primary hover:text-accent"
          aria-label="Cerrar carrito"
          disabled={isProcessingCheckout}
        >
          <X size={24} />
        </button>
      </div>
      
      {/* Cart items - Better mobile scrolling */}
      <div className="overflow-y-auto flex-1 p-4 lg:p-6">
        {cartItems.length === 0 ? (
          <div className="flex flex-col justify-center items-center h-full text-center">
            <p className="mb-6 text-base lg:text-lg text-content">Tu carrito está vacío</p>
            <button 
              onClick={onClose}
              className="px-6 py-3 text-white rounded-md transition-colors bg-accent hover:bg-supporting"
            >
              Seguir Comprando
            </button>
          </div>
        ) : (
          <div className="space-y-4 lg:space-y-6">
            {cartItems.map(item => (
              <CartItem key={item.product.id} item={item} />
            ))}
          </div>
        )}
      </div>
      
      {/* Footer - Better mobile layout */}
      {cartItems.length > 0 && (
        <div className="p-4 border-t lg:p-6 border-secondary/20">

          {/* Price breakdown - Better mobile typography */}
          <div className="flex justify-between items-center mb-2">
            <span className="text-base lg:text-lg text-primary">Subtotal</span>
            <span className="text-base lg:text-lg text-primary">${totalPrice}</span>
          </div>
          <div className="flex justify-between items-center mb-4 font-bold lg:mb-6">
            <span className="text-base lg:text-lg text-primary">Total</span>
            <span className="text-xl font-medium lg:text-2xl text-primary">
              ${totalPrice}
            </span>
          </div>
          
          {/* Action buttons - Better mobile layout */}
          <div className="space-y-3">
            {/* Primary checkout button */}
            <button 
              onClick={handleCheckout}
              disabled={isProcessingCheckout}
              className="flex justify-center items-center px-4 py-3 space-x-2 w-full text-base font-medium text-white rounded-md transition-colors lg:text-lg bg-accent hover:bg-supporting disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isProcessingCheckout ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  <span>Procesando...</span>
                </>
              ) : (
                <>
                  <span>Finalizar Compra</span>
                  <ArrowRight size={18} />
                </>
              )}
            </button>

            {/* WhatsApp checkout alternative */}
            <button 
              onClick={handleWhatsAppCheckout}
              disabled={isProcessingCheckout}
              className="px-4 py-3 w-full text-base font-medium rounded-md border transition-colors lg:text-lg border-accent text-accent hover:bg-accent/10 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Pedir por WhatsApp
            </button>

            {/* Clear cart button */}
            <button 
              onClick={clearCart}
              disabled={isProcessingCheckout}
              className="w-full text-sm transition-colors lg:text-base text-content hover:text-accent disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Vaciar Carrito
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPanel;
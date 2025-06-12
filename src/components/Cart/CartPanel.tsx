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
  const { cartItems, totalPrice, clearCart, processCheckout, isProcessingCheckout } = useCart();
  const { showInfo } = useToast();
  
  // Listen for custom cart opening events
  useEffect(() => {
    const handleOpenCart = () => {
      if (!isOpen) {
        // This would be handled by the parent component
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
    <div className="h-full bg-white shadow-xl flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-secondary/20 flex justify-between items-center">
        <h2 className="text-2xl font-medium text-primary">Tu Carrito</h2>
        <button 
          onClick={onClose}
          className="p-2 text-primary hover:text-accent transition-colors"
          aria-label="Cerrar carrito"
          disabled={isProcessingCheckout}
        >
          <X size={24} />
        </button>
      </div>
      
      {/* Cart items */}
      <div className="flex-1 overflow-y-auto p-6">
        {cartItems.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center">
            <p className="text-content mb-6">Tu carrito está vacío</p>
            <button 
              onClick={onClose}
              className="bg-accent text-white px-6 py-2 rounded-md hover:bg-supporting transition-colors"
            >
              Seguir Comprando
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {cartItems.map(item => (
              <CartItem key={item.product.id} item={item} />
            ))}
          </div>
        )}
      </div>
      
      {/* Footer */}
      {cartItems.length > 0 && (
        <div className="p-6 border-t border-secondary/20">
          <div className="flex justify-between items-center mb-6">
            <span className="text-lg text-primary">Total</span>
            <span className="text-2xl font-medium text-primary">${totalPrice.toFixed(2)}</span>
          </div>
          
          <div className="space-y-3">
            {/* Primary checkout button */}
            <button 
              onClick={handleCheckout}
              disabled={isProcessingCheckout}
              className="w-full bg-accent text-white px-4 py-3 rounded-md flex items-center justify-center space-x-2 hover:bg-supporting transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
              className="w-full border border-accent text-accent px-4 py-3 rounded-md hover:bg-accent/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Pedir por WhatsApp
            </button>

            {/* Clear cart button */}
            <button 
              onClick={clearCart}
              disabled={isProcessingCheckout}
              className="w-full text-content hover:text-accent transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
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
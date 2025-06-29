import React, { useEffect, useMemo } from 'react';
import { X, ArrowRight, Loader2, MessageCircle } from 'lucide-react';
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

  const devCheckoutEnabled = useMemo(() => {
    if (typeof window === 'undefined') return false
    const params = new URLSearchParams(window.location.search)
    return params.get('mp') === 'agus'
  }, [])

  const handleWhatsAppCheckout = () => {
    if (cartItems.length === 0) {
      showInfo('Carrito Vacío', 'Agregá productos antes de contactarnos');
      return;
    }
    const orderCode = `SAKI-${Date.now()}`;
    const orderSummary = cartItems.map(
      item => `${item.quantity}x ${item.product.name} - $${(item.product.price * item.quantity).toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
    ).join('\n');

    const message = `Hola, me gustaría hacer un pedido:\n\n${orderSummary}\n\nTotal: $${totalPrice.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}\n\nCódigo de Pedido: ${orderCode}`;
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/541126720095?text=${encodedMessage}`;
    
    window.open(whatsappUrl, '_blank');
    
    showInfo(
      'Redirigiendo a WhatsApp',
      'Te estamos conectando con nuestro equipo de ventas'
    );
  };
  
  return (
    <div className="flex flex-col h-full bg-white shadow-xl">
      {/* Header - Mobile optimized */}
      <div className="flex items-center justify-between p-4 border-b border-secondary/20 sm:p-6">
        <h2 className="text-lg font-semibold text-primary sm:text-xl lg:text-2xl">
          Tu Carrito
          {cartItems.length > 0 && (
            <span className="ml-2 text-sm font-normal text-content">
              ({cartItems.length} {cartItems.length === 1 ? 'producto' : 'productos'})
            </span>
          )}
        </h2>
        <button 
          onClick={onClose}
          className="p-2 transition-colors rounded-xl text-primary hover:text-accent hover:bg-gray-100 active:scale-95"
          aria-label="Cerrar carrito"
          disabled={isProcessingCheckout}
        >
          <X size={24} />
        </button>
      </div>
      
      {/* Cart items - Mobile optimized scrolling */}
      <div className="flex-1 overflow-y-auto">
        {cartItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full p-6 text-center">
            <div className="w-16 h-16 mb-4 rounded-full bg-gray-100 flex items-center justify-center">
              <MessageCircle size={24} className="text-gray-400" />
            </div>
            <h3 className="mb-2 text-lg font-medium text-primary">Tu carrito está vacío</h3>
            <p className="mb-6 text-sm text-content">Agregá productos para comenzar tu rutina de cuidado</p>
            <button 
              onClick={onClose}
              className="px-6 py-3 text-white transition-all duration-200 rounded-xl bg-accent hover:bg-supporting active:scale-95"
            >
              Explorar Productos
            </button>
          </div>
        ) : (
          <div className="p-4 space-y-4 sm:p-6 sm:space-y-6">
            {cartItems.map((item, index) => (
              <div key={`${item.product.id}-${index}`}>
                <CartItem item={item} />
                {index < cartItems.length - 1 && (
                  <div className="mt-4 border-b border-gray-100"></div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Footer - Mobile optimized */}
      {cartItems.length > 0 && (
        <div className="p-4 border-t border-secondary/20 bg-gray-50 sm:p-6">
          {/* Price summary - Mobile optimized */}
          <div className="mb-4 space-y-2">
            <div className="flex items-center justify-between text-sm text-content">
              <span>Subtotal</span>
              <span>${totalPrice.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            </div>
            <div className="flex items-center justify-between text-sm text-content">
              <span>Envío</span>
              <span className="text-green-600 font-medium">Gratis en zonas seleccionadas</span>
            </div>
            <div className="pt-2 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <span className="text-lg font-semibold text-primary">Total</span>
                <span className="text-xl font-bold text-accent">
                  ${totalPrice.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
            </div>
          </div>
          
          {/* Action buttons - Mobile optimized */}
          <div className="space-y-3">
            {/* WhatsApp checkout - Primary option */}
            <button 
              onClick={handleWhatsAppCheckout}
              disabled={isProcessingCheckout}
              className="flex items-center justify-center w-full px-4 py-3 space-x-2 text-base font-semibold text-white transition-all duration-200 rounded-xl bg-accent hover:bg-supporting disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
            >
              <MessageCircle size={18} />
              <span>Pedir por WhatsApp</span>
            </button>

            {/* Mercado Pago checkout - Secondary option */}
            {devCheckoutEnabled && (
              <button 
                onClick={handleCheckout}
                disabled={isProcessingCheckout}
                className="flex items-center justify-center w-full px-4 py-3 space-x-2 text-base font-medium transition-all duration-200 border rounded-xl border-accent text-accent hover:bg-accent/10 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
              >
                {isProcessingCheckout ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    <span>Procesando...</span>
                  </>
                ) : (
                  <>
                    <span>Pagar con Mercado Pago</span>
                    <ArrowRight size={18} />
                  </>
                )}
              </button>
            )}

            {/* Clear cart button */}
            <button 
              onClick={clearCart}
              disabled={isProcessingCheckout}
              className="w-full text-sm text-content hover:text-accent disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 py-2"
            >
              Vaciar Carrito
            </button>
          </div>

          {/* Trust indicators - Mobile optimized */}
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex items-center justify-center space-x-4 text-xs text-content">
              <span className="flex items-center">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-1"></span>
                Pago Seguro
              </span>
              <span className="flex items-center">
                <span className="w-2 h-2 bg-blue-500 rounded-full mr-1"></span>
                Envío Gratis
              </span>
              <span className="flex items-center">
                <span className="w-2 h-2 bg-purple-500 rounded-full mr-1"></span>
                Garantía 30 días
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPanel;
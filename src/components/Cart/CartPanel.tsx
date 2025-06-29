import React, { useEffect, useMemo } from 'react';
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
        {/* Header - Better mobile spacing */}
        <div className="flex items-center justify-between p-4 border-b lg:p-6 border-secondary/20">
          <h2 className="text-xl font-medium lg:text-2xl text-primary">Tu Carrito</h2>
          <button 
            onClick={onClose}
            className="p-2 transition-colors rounded-xl text-primary hover:text-accent"
            aria-label="Cerrar carrito"
            disabled={isProcessingCheckout}
          >
            <X size={24} />
          </button>
        </div>
        
        {/* Cart items - Better mobile scrolling */}
        <div className="flex-1 p-4 overflow-y-auto lg:p-6">
          {cartItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <p className="mb-6 text-base lg:text-lg text-content">Tu carrito está vacío</p>
              <button 
                onClick={onClose}
                className="px-6 py-3 text-white transition-colors rounded-md bg-accent hover:bg-supporting"
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
            <div className="flex items-center justify-between mb-2">
              <span className="text-base lg:text-lg text-primary">Subtotal</span>
              <span className="text-base lg:text-lg text-primary">${totalPrice.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            </div>
            <div className="flex items-center justify-between mb-4 font-bold lg:mb-6">
              <span className="text-base lg:text-lg text-primary">Total</span>
              <span className="text-xl font-medium lg:text-2xl text-primary">
                ${totalPrice.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
            
            {/* Action buttons - Better mobile layout */}
            <div className="space-y-3">
              {/* WhatsApp checkout alternative */}
              <button 
                onClick={handleWhatsAppCheckout}
                disabled={isProcessingCheckout}
                className="w-full px-4 py-3 text-base font-medium transition-colors border rounded-md lg:text-lg border-accent text-accent hover:bg-accent/10 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Pedir por WhatsApp
              </button>
                          {/* Primary checkout button */}
              {devCheckoutEnabled && (
                  <button 
                    onClick={handleCheckout}
                    disabled={isProcessingCheckout}
                    className="flex items-center justify-center w-full px-4 py-3 space-x-2 text-base font-medium text-white transition-colors rounded-md lg:text-lg bg-accent hover:bg-supporting disabled:opacity-50 disabled:cursor-not-allowed"
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
                )}


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
import React, { useEffect } from 'react';
import { X, ArrowRight, Loader2 } from 'lucide-react';
import { useCart } from '../../hooks/useCart';
import { useToast } from '../../hooks/useToast';
import CartItem from './CartItem';

interface CartPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const shippingOptions = [
  { value: 'punto', label: 'Punto de Entrega gratis (Ituzaingó, Morón, Castelar)' },
  { value: 'caba', label: 'CABA' },
  { value: 'interior', label: 'Interior' },
];


const CartPanel: React.FC<CartPanelProps> = ({ isOpen, onClose }) => {
  const { 
    cartItems, totalPrice, clearCart, processCheckout, isProcessingCheckout, 
    shippingLocation, setShippingLocation, shippingCost 
  } = useCart();
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
    <div className="flex flex-col h-full bg-white shadow-xl">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-secondary/20">
        <h2 className="text-2xl font-medium text-primary">Tu Carrito</h2>
        <button 
          onClick={onClose}
          className="p-2 transition-colors text-primary hover:text-accent"
          aria-label="Cerrar carrito"
          disabled={isProcessingCheckout}
        >
          <X size={24} />
        </button>
      </div>
      
      {/* Cart items */}
      <div className="flex-1 p-6 overflow-y-auto">
        {cartItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <p className="mb-6 text-content">Tu carrito está vacío</p>
            <button 
              onClick={onClose}
              className="px-6 py-2 text-white transition-colors rounded-md bg-accent hover:bg-supporting"
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
          {/* Shipping location selector */}
          <div className="mb-4">
            <label className="block mb-1 font-medium text-primary">Método de entrega</label>
            <select
              className="w-full px-4 py-2 border rounded-lg border-accent/20 focus:outline-none focus:ring-2 focus:ring-accent"
              value={shippingLocation}
              onChange={e => setShippingLocation(e.target.value)}
            >
              {shippingOptions.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
            {shippingLocation === 'punto' && (
              <div className="mt-2 text-sm text-green-700">
                Entrega gratis en Ituzaingó, Morón y Castelar.
              </div>
            )}
            {shippingLocation === 'caba' && (
                <div className="mt-2 text-sm text-primary">
                Envío por Correo Argentino a CABA ($6000).{' '}
                </div>
            )}
            {shippingLocation === 'interior' && (
              <div className="mt-2 text-sm text-primary">
                Envío por Correo Argentino al interior ($2500).
              </div>
            )}
          </div>

          <div className="flex items-center justify-between mb-2">
            <span className="text-lg text-primary">Subtotal</span>
            <span className="text-lg text-primary">${totalPrice.toFixed(2)}</span>
          </div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-lg text-primary">Envío</span>
            <span className="text-lg text-primary">
              {shippingCost === 0 ? 'Gratis' : `$${shippingCost.toFixed(2)}`}
            </span>
          </div>
          <div className="flex items-center justify-between mb-6 font-bold">
            <span className="text-lg text-primary">Total</span>
            <span className="text-2xl font-medium text-primary">
              ${(totalPrice + shippingCost).toFixed(2)}
            </span>
          </div>
          
          <div className="space-y-3">
            {/* Primary checkout button */}
            <button 
              onClick={handleCheckout}
              disabled={isProcessingCheckout}
              className="flex items-center justify-center w-full px-4 py-3 space-x-2 text-white transition-colors rounded-md bg-accent hover:bg-supporting disabled:opacity-50 disabled:cursor-not-allowed"
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
              className="w-full px-4 py-3 transition-colors border rounded-md border-accent text-accent hover:bg-accent/10 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Pedir por WhatsApp
            </button>

            {/* Clear cart button */}
            <button 
              onClick={clearCart}
              disabled={isProcessingCheckout}
              className="w-full text-sm transition-colors text-content hover:text-accent disabled:opacity-50 disabled:cursor-not-allowed"
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
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CreditCard, User, MapPin, Mail, Loader2, X } from 'lucide-react';
import { useCart } from '../../hooks/useCart';
import { useToast } from '../../hooks/useToast';
import { CheckoutService } from '../../services/checkoutService';
import { buildCheckoutData } from '../../utils/buildCheckoutData';

interface CheckoutFormProps {
  onClose: () => void;
}

const CheckoutForm: React.FC<CheckoutFormProps> = ({ onClose }) => {
  const { cartItems, totalPrice, clearCart } = useCart();
  const { showSuccess, showError, showInfo } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  
  const [customerData, setCustomerData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    phone: '',
    address: '',
    city: '',
    postalCode: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!customerData.email) {
      newErrors.email = 'El email es requerido';
    } else if (!/\S+@\S+\.\S+/.test(customerData.email)) {
      newErrors.email = 'El email no es válido';
    }

    if (!customerData.firstName) {
      newErrors.firstName = 'El nombre es requerido';
    }

    if (!customerData.lastName) {
      newErrors.lastName = 'El apellido es requerido';
    }

    if (!customerData.phone) {
      newErrors.phone = 'El teléfono es requerido';
    }

    if (!customerData.address) {
      newErrors.address = 'La dirección es requerida';
    }

    if (!customerData.city) {
      newErrors.city = 'La ciudad es requerida';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      showError('Datos Incompletos', 'Por favor completá todos los campos requeridos');
      return;
    }

    if (cartItems.length === 0) {
      showError('Carrito Vacío', 'Agregá productos antes de continuar');
      return;
    }

    setIsProcessing(true);

    try {
      showInfo(
        'Procesando...',
        'Estamos preparando tu pago con Mercado Pago',
        { duration: 0, dismissible: false }
      );
      
  const checkoutData = buildCheckoutData(cartItems, customerData);
      
  console.log('Request body received:', JSON.stringify(checkoutData, null, 2));

      const preference = await CheckoutService.createPaymentPreference(checkoutData);

      // Guardar orden ID en localStorage para tracking
      localStorage.setItem('currentOrderId', preference.orderId);

      showSuccess(
        'Redirigiendo a Mercado Pago',
        `Orden #${preference.orderNumber} creada exitosamente`,
        { duration: 3000 }
      );

      // Limpiar carrito antes de redireccionar
      clearCart();
      
      // Redireccionar a Mercado Pago
      setTimeout(() => {
        CheckoutService.redirectToMercadoPago(preference.initPoint);
      }, 1000);

    } catch (error) {
      console.error('Checkout error:', error);
      showError(
        'Error en el Checkout',
        error instanceof Error ? error.message : 'Ocurrió un error inesperado',
        {
          action: {
            label: 'Contactar Soporte',
            onClick: () => {
              const message = `Hola, tuve un problema en el checkout. Total: $${totalPrice.toFixed(2)}`;
              const encodedMessage = encodeURIComponent(message);
              window.open(`https://wa.me/5411XXXXXXXX?text=${encodedMessage}`, '_blank');
            }
          }
        }
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setCustomerData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="flex items-center text-2xl font-medium text-primary">
          <CreditCard className="mr-3" size={24} />
          Finalizar Compra
        </h2>
        <button
          onClick={onClose}
          disabled={isProcessing}
          className="p-2 transition-colors text-content hover:text-primary disabled:opacity-50"
        >
          <X size={24} />
        </button>
      </div>

      {/* Resumen del pedido */}
      <div className="p-4 mb-6 rounded-lg bg-secondary/30">
        <h3 className="mb-3 font-medium text-primary">Resumen del Pedido</h3>
        <div className="space-y-2">
          {cartItems.map(item => (
            <div key={item.product.id} className="flex justify-between text-sm">
              <span>{item.product.name} x{item.quantity}</span>
              <span>${(item.product.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
        </div>
        <div className="flex justify-between pt-3 mt-3 font-medium border-t border-secondary">
          <span>Total:</span>
          <span className="text-accent">${totalPrice.toFixed(2)}</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Datos personales */}
        <div>
          <h3 className="flex items-center mb-4 font-medium text-primary">
            <User className="mr-2" size={20} />
            Datos Personales
          </h3>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="block mb-1 text-sm font-medium text-content">
                Nombre *
              </label>
              <input
                type="text"
                value={customerData.firstName}
                onChange={(e) => handleInputChange('firstName', e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-accent focus:border-accent ${
                  errors.firstName ? 'border-red-500' : 'border-secondary'
                }`}
                disabled={isProcessing}
              />
              {errors.firstName && (
                <p className="mt-1 text-xs text-red-500">{errors.firstName}</p>
              )}
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium text-content">
                Apellido *
              </label>
              <input
                type="text"
                value={customerData.lastName}
                onChange={(e) => handleInputChange('lastName', e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-accent focus:border-accent ${
                  errors.lastName ? 'border-red-500' : 'border-secondary'
                }`}
                disabled={isProcessing}
              />
              {errors.lastName && (
                <p className="mt-1 text-xs text-red-500">{errors.lastName}</p>
              )}
            </div>
          </div>
        </div>

        {/* Contacto */}
        <div>
          <h3 className="flex items-center mb-4 font-medium text-primary">
            <Mail className="mr-2" size={20} />
            Información de Contacto
          </h3>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="block mb-1 text-sm font-medium text-content">
                Email *
              </label>
              <input
                type="email"
                value={customerData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-accent focus:border-accent ${
                  errors.email ? 'border-red-500' : 'border-secondary'
                }`}
                disabled={isProcessing}
              />
              {errors.email && (
                <p className="mt-1 text-xs text-red-500">{errors.email}</p>
              )}
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium text-content">
                Teléfono *
              </label>
              <input
                type="tel"
                value={customerData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-accent focus:border-accent ${
                  errors.phone ? 'border-red-500' : 'border-secondary'
                }`}
                disabled={isProcessing}
              />
              {errors.phone && (
                <p className="mt-1 text-xs text-red-500">{errors.phone}</p>
              )}
            </div>
          </div>
        </div>

        {/* Dirección */}
        <div>
          <h3 className="flex items-center mb-4 font-medium text-primary">
            <MapPin className="mr-2" size={20} />
            Dirección de Envío
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block mb-1 text-sm font-medium text-content">
                Dirección *
              </label>
              <input
                type="text"
                value={customerData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                placeholder="Calle y número"
                className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-accent focus:border-accent ${
                  errors.address ? 'border-red-500' : 'border-secondary'
                }`}
                disabled={isProcessing}
              />
              {errors.address && (
                <p className="mt-1 text-xs text-red-500">{errors.address}</p>
              )}
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="block mb-1 text-sm font-medium text-content">
                  Ciudad *
                </label>
                <input
                  type="text"
                  value={customerData.city}
                  onChange={(e) => handleInputChange('city', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-accent focus:border-accent ${
                    errors.city ? 'border-red-500' : 'border-secondary'
                  }`}
                  disabled={isProcessing}
                />
                {errors.city && (
                  <p className="mt-1 text-xs text-red-500">{errors.city}</p>
                )}
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium text-content">
                  Código Postal
                </label>
                <input
                  type="text"
                  value={customerData.postalCode}
                  onChange={(e) => handleInputChange('postalCode', e.target.value)}
                  className="w-full px-3 py-2 border rounded-md border-secondary focus:ring-2 focus:ring-accent focus:border-accent"
                  disabled={isProcessing}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Botones */}
        <div className="flex flex-col gap-3 pt-6 border-t sm:flex-row border-secondary">
          <button
            type="button"
            onClick={onClose}
            disabled={isProcessing}
            className="flex-1 px-6 py-3 transition-colors border rounded-md border-secondary text-content hover:bg-secondary/50 disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isProcessing}
            className="flex items-center justify-center flex-1 px-6 py-3 text-white transition-colors rounded-md bg-accent hover:bg-supporting disabled:opacity-50"
          >
            {isProcessing ? (
              <>
                <Loader2 size={20} className="mr-2 animate-spin" />
                Procesando...
              </>
            ) : (
              <>
                <CreditCard size={20} className="mr-2" />
                Pagar con Mercado Pago
              </>
            )}
          </button>
        </div>
      </form>

      <div className="p-4 mt-6 rounded-lg bg-blue-50">
        <p className="text-sm text-blue-800">
          🔒 <strong>Pago Seguro:</strong> Serás redirigido a Mercado Pago para completar tu compra de forma segura.
          Aceptamos tarjetas de crédito, débito y otros métodos de pago.
        </p>
      </div>
    </motion.div>
  );
};

export default CheckoutForm;
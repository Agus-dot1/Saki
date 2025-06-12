import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CreditCard, User, MapPin, Mail, Phone, Loader2, X } from 'lucide-react';
import { useCart } from '../../hooks/useCart';
import { useToast } from '../../hooks/useToast';
import { CheckoutService } from '../../services/checkoutService';

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
        'Estamos preparando tu pago',
        { duration: 0, dismissible: false }
      );

      const checkoutData = {
        items: cartItems,
        customer: customerData
      };

      // Para desarrollo, usar checkout simulado
      // En producción, usar: CheckoutService.createPaymentPreference(checkoutData)
      const result = await CheckoutService.simulateCheckout(checkoutData);

      if (result.success) {
        showSuccess(
          '¡Pago Exitoso!',
          `Orden #${result.orderNumber} procesada correctamente`,
          { 
            duration: 8000,
            action: {
              label: 'Ver Detalles',
              onClick: () => {
                showInfo(
                  'Detalles del Pedido',
                  `Orden: ${result.orderNumber}\nTotal: $${totalPrice.toFixed(2)}\nEstado: Confirmado\nSe enviará confirmación por email`
                );
              }
            }
          }
        );

        // Limpiar carrito y cerrar formulario
        clearCart();
        onClose();
      } else {
        throw new Error('El pago no pudo ser procesado');
      }

    } catch (error) {
      console.error('Checkout error:', error);
      showError(
        'Error en el Pago',
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
        <h2 className="text-2xl font-medium text-primary flex items-center">
          <CreditCard className="mr-3" size={24} />
          Finalizar Compra
        </h2>
        <button
          onClick={onClose}
          disabled={isProcessing}
          className="p-2 text-content hover:text-primary transition-colors disabled:opacity-50"
        >
          <X size={24} />
        </button>
      </div>

      {/* Resumen del pedido */}
      <div className="bg-secondary/30 rounded-lg p-4 mb-6">
        <h3 className="font-medium text-primary mb-3">Resumen del Pedido</h3>
        <div className="space-y-2">
          {cartItems.map(item => (
            <div key={item.product.id} className="flex justify-between text-sm">
              <span>{item.product.name} x{item.quantity}</span>
              <span>${(item.product.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
        </div>
        <div className="border-t border-secondary mt-3 pt-3 flex justify-between font-medium">
          <span>Total:</span>
          <span className="text-accent">${totalPrice.toFixed(2)}</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Datos personales */}
        <div>
          <h3 className="font-medium text-primary mb-4 flex items-center">
            <User className="mr-2" size={20} />
            Datos Personales
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-content mb-1">
                Nombre *
              </label>
              <input
                type="text"
                value={customerData.firstName}
                onChange={(e) => handleInputChange('firstName', e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-accent focus:border-accent transition-colors ${
                  errors.firstName ? 'border-red-500' : 'border-secondary'
                }`}
                disabled={isProcessing}
              />
              {errors.firstName && (
                <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-content mb-1">
                Apellido *
              </label>
              <input
                type="text"
                value={customerData.lastName}
                onChange={(e) => handleInputChange('lastName', e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-accent focus:border-accent transition-colors ${
                  errors.lastName ? 'border-red-500' : 'border-secondary'
                }`}
                disabled={isProcessing}
              />
              {errors.lastName && (
                <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>
              )}
            </div>
          </div>
        </div>

        {/* Contacto */}
        <div>
          <h3 className="font-medium text-primary mb-4 flex items-center">
            <Mail className="mr-2" size={20} />
            Información de Contacto
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-content mb-1">
                Email *
              </label>
              <input
                type="email"
                value={customerData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-accent focus:border-accent transition-colors ${
                  errors.email ? 'border-red-500' : 'border-secondary'
                }`}
                disabled={isProcessing}
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">{errors.email}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-content mb-1">
                Teléfono *
              </label>
              <input
                type="tel"
                value={customerData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-accent focus:border-accent transition-colors ${
                  errors.phone ? 'border-red-500' : 'border-secondary'
                }`}
                disabled={isProcessing}
              />
              {errors.phone && (
                <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
              )}
            </div>
          </div>
        </div>

        {/* Dirección */}
        <div>
          <h3 className="font-medium text-primary mb-4 flex items-center">
            <MapPin className="mr-2" size={20} />
            Dirección de Envío
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-content mb-1">
                Dirección *
              </label>
              <input
                type="text"
                value={customerData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                placeholder="Calle y número"
                className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-accent focus:border-accent transition-colors ${
                  errors.address ? 'border-red-500' : 'border-secondary'
                }`}
                disabled={isProcessing}
              />
              {errors.address && (
                <p className="text-red-500 text-xs mt-1">{errors.address}</p>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-content mb-1">
                  Ciudad *
                </label>
                <input
                  type="text"
                  value={customerData.city}
                  onChange={(e) => handleInputChange('city', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-accent focus:border-accent transition-colors ${
                    errors.city ? 'border-red-500' : 'border-secondary'
                  }`}
                  disabled={isProcessing}
                />
                {errors.city && (
                  <p className="text-red-500 text-xs mt-1">{errors.city}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-content mb-1">
                  Código Postal
                </label>
                <input
                  type="text"
                  value={customerData.postalCode}
                  onChange={(e) => handleInputChange('postalCode', e.target.value)}
                  className="w-full px-3 py-2 border border-secondary rounded-md focus:ring-2 focus:ring-accent focus:border-accent transition-colors"
                  disabled={isProcessing}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Botones */}
        <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-secondary">
          <button
            type="button"
            onClick={onClose}
            disabled={isProcessing}
            className="flex-1 px-6 py-3 border border-secondary text-content rounded-md hover:bg-secondary/50 transition-colors disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isProcessing}
            className="flex-1 bg-accent text-white px-6 py-3 rounded-md hover:bg-supporting transition-colors disabled:opacity-50 flex items-center justify-center"
          >
            {isProcessing ? (
              <>
                <Loader2 size={20} className="animate-spin mr-2" />
                Procesando...
              </>
            ) : (
              <>
                <CreditCard size={20} className="mr-2" />
                Finalizar Compra
              </>
            )}
          </button>
        </div>
      </form>

      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <p className="text-sm text-blue-800">
          🔒 <strong>Pago Seguro:</strong> Tu información está protegida con encriptación de nivel bancario.
          Procesamos pagos de forma segura y confiable.
        </p>
      </div>
    </motion.div>
  );
};

export default CheckoutForm;
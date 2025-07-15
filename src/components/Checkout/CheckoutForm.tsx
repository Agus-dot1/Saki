import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CreditCard, User, MapPin, Mail, Loader2, X, Gift } from 'lucide-react';
import { useCart } from '../../hooks/useCart';
import { useToast } from '../../hooks/useToast';
import { CheckoutService } from '../../services/checkoutService';
import ShippingMethodSelector from '../Cart/ShippingMethodSelector';
import OrderSummary from './OrderSummary';
import { normalizeCartItems } from '../../utils/variantUtils';

interface ShippingOption {
  id: string;
  name: string;
  cost: number;
  estimatedDelivery: string;
  description: string;
}


interface CheckoutFormProps {
  onClose: () => void;
}

const CheckoutForm: React.FC<CheckoutFormProps> = ({ onClose }) => {
  const { cartItems, totalPrice, clearCart } = useCart();
  const { showSuccess, showError, showInfo } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Shipping state
  const [shippingMethod, setShippingMethod] = useState<'shipping' | 'pickup' | null>(() => {
    const stored = localStorage.getItem('shippingOption');
    return stored ? 'shipping' : null;
  });
  
  const [selectedShipping, setSelectedShipping] = useState<ShippingOption | null>(() => {
    const stored = localStorage.getItem('shippingOption');
    return stored ? JSON.parse(stored) : null;
  });
  
  const [customerData, setCustomerData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    areaCode: '',
    phoneNumber: '',
    streetName: '',
    streetNumber: '',
    city: '',
    postalCode: '',
    receivePromotions: false,
  });
  
  
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Calculate final total including shipping
  const shippingCost = selectedShipping?.cost || 0;
  const finalTotal = totalPrice + shippingCost;

  const handleShippingChange = (method: 'shipping' | 'pickup', option?: ShippingOption) => {
    setShippingMethod(method);
    if (method === 'pickup') {
      setSelectedShipping(null);
    } else if (option) {
      setSelectedShipping(option);
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Basic info always required
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

    if (!customerData.areaCode) {
      newErrors.areaCode = 'El código de área es requerido';
    }

    if (!customerData.phoneNumber) {
      newErrors.phoneNumber = 'El número es requerido';
    }

    // Address only required for shipping
    if (shippingMethod === 'shipping') { 
      if (!customerData.streetName) {
        newErrors.streetName = 'La calle es requerida para el envío';
      }

      if (!customerData.streetNumber) {
        newErrors.streetNumber = 'El número es requerido para el envío';
      }

      if (!customerData.city) {
        newErrors.city = 'La ciudad es requerida para el envío';
      }

      if (!customerData.postalCode) {
        newErrors.postalCode = 'El código postal es requerido para el envío';
      }
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

      // Normalize cart items with variant data
      const normalizedItems = normalizeCartItems(cartItems);

      const checkoutData = {
        items: normalizedItems,
        customer: customerData,
        shipping: {
          method: shippingMethod,
          option: selectedShipping,
          cost: shippingCost
        }
      };

      const preference = await CheckoutService.createPaymentPreference(checkoutData);
      localStorage.setItem('currentOrderId', preference.orderId);

      showSuccess(
        'Redirigiendo a Mercado Pago',
        `Orden #${preference.orderNumber} creada exitosamente`,
        { duration: 3000 }
      );

      clearCart();

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
              const message = `Hola, tuve un problema en el checkout. Total: $${finalTotal.toFixed(2)}`;
              const encodedMessage = encodeURIComponent(message);
              window.open(`https://wa.me/541126720095?text=${encodedMessage}`, '_blank');
            }
          }
        }
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const handleInputChange = (field: string, value: string | boolean) => {
  setCustomerData(prev => ({ ...prev, [field]: value }));
  if (errors[field]) {
    setErrors(prev => ({ ...prev, [field]: '' }));
  }
};

    const InputField = ({
      label,
      field,
      type = 'text',
      placeholder,
      maxLength,
      className = ''
    }: {
      label: string;
      field: string;
      type?: string;
      placeholder?: string;
      maxLength?: number;
      className?: string;
    }) => {
  const fieldValue = customerData[field as keyof typeof customerData];
  
  if (type === 'checkbox') {
    return (
      <div className={className}>
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={fieldValue as boolean}
            onChange={(e) => handleInputChange(field, e.target.checked)}
            className="border-gray-300 rounded text-accent focus:ring-accent"
            disabled={isProcessing}
          />
          <span className="text-sm font-medium text-content">{label}</span>
        </label>
        {errors[field] && (
          <p className="mt-1 text-xs text-red-500">{errors[field]}</p>
        )}
      </div>
    );
  }

  return (
    <div className={className}>
      <label className="block mb-1 text-sm font-medium text-content">
        {label} *
      </label>
      <input
        type={type}
        value={fieldValue as string}
        onChange={(e) => handleInputChange(field, e.target.value)}
        className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-accent focus:border-accent ${
          errors[field] ? 'border-red-500' : 'border-gray-200'
        }`}
        disabled={isProcessing}
        placeholder={placeholder}
        maxLength={maxLength}
      />
      {errors[field] && (
        <p className="mt-1 text-xs text-red-500">{errors[field]}</p>
      )}
    </div>
  );
};

   const PromotionsCheckbox = () => (
    <div className="p-4 border border-purple-200 rounded-lg bg-gradient-to-r from-purple-50 to-pink-50">
      <div className="flex items-start space-x-3">
        <div className="flex items-center h-5">
          <input
            id="promotions-checkbox"
            type="checkbox"
            checked={customerData.receivePromotions}
            onChange={(e) => handleInputChange('receivePromotions', e.target.checked)}
            className="w-4 h-4 text-purple-600 bg-white border-gray-300 rounded focus:ring-purple-500 focus:ring-2"
            disabled={isProcessing}
          />
        </div>
        <label htmlFor="promotions-checkbox" className="flex-1 text-sm cursor-pointer">
          <div className="flex items-center mb-1">
            <Gift size={16} className="mr-1 text-purple-600" />
            <span className="font-medium text-purple-800">
              Quiero recibir ofertas y promociones exclusivas
            </span>
          </div>
          <p className="text-xs text-purple-600">
            Te enviaremos ofertas especiales, descuentos y novedades por email. 
            Podés cancelar tu suscripción en cualquier momento.
          </p>
        </label>
      </div>
    </div>
  );



  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="bg-white shadow-2xl w-full max-w-7xl mx-auto overflow-y-scroll rounded-t-2xl md:rounded-2xl max-h-screen md:max-h-[90vh]"
    >
      <div className="flex flex-col h-full md:flex-row">
        {/* Form Section */}
        <div className="flex flex-col w-full md:w-2/3">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-100 md:p-6">
            <h2 className="flex items-center text-lg font-medium md:text-2xl text-primary">
              <CreditCard className="mr-2 md:mr-3" size={20} />
              Finalizar Compra
            </h2>
            <button
              onClick={onClose}
              disabled={isProcessing}
              className="p-2 transition-colors text-content hover:text-primary disabled:opacity-50"
            >
              <X size={20} />
            </button>
          </div>

          {/* Mobile Order Summary */}
          <div className="block p-4 md:hidden bg-secondary/30">
            <OrderSummary 
              shippingMethod={shippingMethod}
              selectedShipping={selectedShipping}
              shippingCost={shippingCost}
            />
          </div>

          {/* Form Content */}
          <div className="flex-1 p-4 overflow-y-auto md:p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Personal Data */}
              <div>
                <h3 className="flex items-center mb-4 font-medium text-primary">
                  <User className="mr-2" size={20} />
                  Datos Personales
                </h3>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <InputField label="Nombre" field="firstName" />
                  <InputField label="Apellido" field="lastName" />
                </div>
              </div>

              {/* Contact Info */}
              <div>
                <h3 className="flex items-center mb-4 font-medium text-primary">
                  <Mail className="mr-2" size={20} />
                  Información de Contacto
                </h3>
                <div className="space-y-4">
                  <InputField label="Email" field="email" type="email" />
                  <div className="grid grid-cols-3 gap-2">
                    <InputField 
                      label="Área" 
                      field="areaCode" 
                      placeholder="Ej: 11" 
                      maxLength={5} 
                    />
                    <InputField 
                      label="Teléfono" 
                      field="phoneNumber" 
                      placeholder="Ej: 12345678" 
                      className="col-span-2" 
                    />
                  </div>
                </div>
              </div>

              {/* Shipping Method Selector */}
              <div>
                <h3 className="mb-4 text-lg font-medium text-primary">Método de Entrega</h3>
                <ShippingMethodSelector
                  cartItems={cartItems}
                  onShippingChange={handleShippingChange}
                  selectedMethod={shippingMethod}
                  selectedShipping={selectedShipping}
                />
              </div>

              {/* Shipping Address - Only show for shipping method */}
              {shippingMethod === 'shipping' && (
                <div>
                  <h3 className="flex items-center mb-4 font-medium text-primary">
                    <MapPin className="mr-2" size={20} />
                    Dirección de Envío
                  </h3>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <InputField 
                        label="Calle" 
                        field="streetName" 
                        placeholder="Ej: Av. Siempre Viva" 
                      />
                      <InputField 
                        label="Número" 
                        field="streetNumber" 
                        placeholder="Ej: 742" 
                      />
                    </div>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <InputField label="Ciudad" field="city" />
                      <InputField label="Código Postal" field="postalCode" />
                    </div>
                  </div>
                </div>
              )}

            
            </form>
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-gray-100 md:p-6 bg-gray-50">
            <div className="flex flex-col gap-3 md:flex-row">
              <button
                onClick={handleSubmit}
                disabled={isProcessing || (shippingMethod === 'shipping' && !customerData.postalCode)}
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
                            <button
                type="button"
                onClick={onClose}
                disabled={isProcessing}
                className="flex-1 px-6 py-3 transition-colors border border-gray-200 rounded-md text-content hover:bg-secondary/50 disabled:opacity-50"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>

        {/* Desktop Order Summary Sidebar */}
        <div className="hidden w-1/3 p-6 space-y-5 border-l border-gray-100 md:block bg-gray-50">
          <OrderSummary 
            shippingMethod={shippingMethod}
            selectedShipping={selectedShipping}
            shippingCost={shippingCost}
          />
          <PromotionsCheckbox />
        </div>
      </div>
    </motion.div>
  );
};

export default CheckoutForm;
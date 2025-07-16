import React, { useState } from 'react';
import { Package, MapPin, Truck, Store, ChevronDown, ChevronUp } from 'lucide-react';
import { ShippingService } from '../../services/shippingService';
import ShippingCalculator from './ShippingCalculator';
import { Product } from '../../types';

interface ShippingOption {
  id: string;
  name: string;
  cost: number;
  estimatedDelivery: string;
  description: string;
}

interface ShippingMethodSelectorProps {
  cartItems: Array<{ product: Product; quantity: number }>;

  onShippingChange: (method: 'shipping' | 'pickup', option?: ShippingOption) => void;
  selectedMethod: 'shipping' | 'pickup' | null;
  selectedShipping: ShippingOption | null;
  postalCode: string; // <-- add
  setPostalCode: (postal: string) => void; // <-- add
}

const ShippingMethodSelector: React.FC<ShippingMethodSelectorProps> = ({
  cartItems,
  onShippingChange,
  selectedMethod,
  selectedShipping,
  postalCode,
  setPostalCode
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const shippingMethods = ShippingService.getShippingMethods();

  const handleMethodSelect = (methodId: 'shipping' | 'pickup') => {
  if (methodId === 'pickup') {
    onShippingChange('pickup');
    return;
  }

  const stored = localStorage.getItem('shippingOption');
  const option = stored ? (JSON.parse(stored) as ShippingOption) : undefined;

  onShippingChange('shipping', option);  
};

  const handleShippingOptionSelect = (option: ShippingOption | null) => {
  if (selectedMethod === 'shipping') {
    onShippingChange('shipping', option ?? undefined);
  }
};

  return (
    <div className="space-y-4">
      {/* Method Selector Header */}
      <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
        <button
          onClick={(e) => {
            e.preventDefault();
            setIsExpanded(!isExpanded);
        }}
          className="flex items-center justify-between w-full text-left"
        >
          <div className="flex items-center">
            <Truck size={16} className="mr-2 text-accent" />
            <span className="text-sm font-medium text-primary">
              Método de entrega
            </span>
          </div>
          {isExpanded ? (
            <ChevronUp size={16} className="text-content" />
          ) : (
            <ChevronDown size={16} className="text-content" />
          )}
        </button>

        {isExpanded && (
          <div className="mt-4 space-y-3">
            {shippingMethods.map((method) => (
              <div
                key={method.id}
                className={`p-3 border rounded-lg cursor-pointer transition-all ${
                  selectedMethod === method.id
                    ? 'border-accent bg-accent/10'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={(e) => {
                    e.preventDefault();
                    handleMethodSelect(method.id);
                }}
              >
                <div className="flex items-center">
                  <div className={`w-4 h-4 rounded-full border-2 mr-3 ${
                    selectedMethod === method.id
                      ? 'border-accent bg-accent'
                      : 'border-gray-300'
                  }`}>
                    {selectedMethod === method.id && (
                      <div className="w-full h-full scale-50 bg-white rounded-full"></div>
                    )}
                  </div>
                  <div className="flex items-center flex-1">
                    {method.id === 'shipping' ? (
                      <Package size={16} className="mr-2 text-accent" />
                    ) : (
                      <Store size={16} className="mr-2 text-accent" />
                    )}
                    <div>
                      <div className="text-sm font-medium text-primary">{method.name}</div>
                      <div className="text-xs text-content">{method.description}</div>
                    </div>
                  </div>
                  {method.id === 'pickup' && (
                    <div className="text-sm font-semibold text-green-600">Gratis</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Shipping Calculator - Only show if shipping method is selected */}
      {selectedMethod === 'shipping' && (
        <ShippingCalculator
          cartItems={cartItems}
          onShippingSelect={handleShippingOptionSelect}
          selectedShipping={selectedShipping}
          onPostalCodeChange={setPostalCode} // <-- pass down
          postalCode={postalCode} // <-- pass down
        />
      )}

      {/* Pickup Information */}
      {selectedMethod === 'pickup' && (
        <div className="p-4 border border-green-200 rounded-lg bg-green-50">
          <div className="flex items-start">
            <MapPin size={16} className="mr-2 mt-0.5 text-green-600" />
            <div>
              <div className="mb-1 text-sm font-medium text-green-800">
                Retiro en zonas seleccionadas - GRATIS
              </div>
              <div className="space-y-1 text-xs text-green-700">
                <p><strong>Zonas:</strong> Ituzaingó, Morón, Castelar</p>
                <p><strong>Horarios:</strong> Lun a Vie 9:00 - 18-00 | Sab 9:00 - 13:00</p>
                <p><strong>Preparación:</strong> Tu pedido estará listo en 2-4 horas</p>
                <p><strong>Importante:</strong> Recordá traer tu DNI para retirar el pedido</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShippingMethodSelector;
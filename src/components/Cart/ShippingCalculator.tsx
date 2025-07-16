import React, { useState } from 'react';
import { MapPin, Truck, AlertCircle, CheckCircle } from 'lucide-react';
import { ShippingService } from '../../services/shippingService';
import { Product } from '../../types';

interface ShippingOption {
  id: string;
  name: string;
  cost: number;
  estimatedDelivery: string;
  description: string;
}

interface ShippingCalculatorProps {
  cartItems: Array<{ product: Product; quantity: number }>;
  onShippingSelect: (option: ShippingOption | null) => void;
  selectedShipping: ShippingOption | null;
}

const ShippingCalculator: React.FC<ShippingCalculatorProps> = ({
  onShippingSelect,
}) => {
  const [postalCode, setPostalCode] = useState(() => {
  return localStorage.getItem('postalCode') || '';
  });
  const [shippingOption, setShippingOption] = useState<ShippingOption | null>(() => {
  const stored = localStorage.getItem('shippingOption');
  return stored ? JSON.parse(stored) : null;
  });
  const [error, setError] = useState('');
  const [hasCalculated, setHasCalculated] = useState(false);

  const calculateShipping = () => {
    if (!postalCode.trim()) {
      setError('Ingresá tu código postal');
      return;
    }

    if (!ShippingService.validatePostalCode(postalCode)) {
      setError('Código postal inválido. Ej: 1234 o C1234ABC');
      return;
    }

    const option = ShippingService.calculateShipping(postalCode);
    
    if (option) {
      setShippingOption(option);
      setHasCalculated(true);
      setError('');
      onShippingSelect(option);

      localStorage.setItem('postalCode', postalCode);
      localStorage.setItem('shippingOption', JSON.stringify(option));
    } else {
      setError('No se pudo calcular el envío para este código postal');
    }
};

  const handlePostalCodeChange = (value: string) => {
    // Allow letters and numbers for Argentina postal codes
    const cleanValue = value.replace(/[^a-zA-Z0-9]/g, '').toUpperCase().slice(0, 8);
    setPostalCode(cleanValue);
    setError('');
    
    if (hasCalculated) {
      setHasCalculated(false);
      setShippingOption(null);
      onShippingSelect(null);

       localStorage.removeItem('postalCode');
       localStorage.removeItem('shippingOption');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      calculateShipping();
    }
  };

  return (
    <div className="space-y-4">
      {/* Postal Code Input */}
      <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
        <div className="flex items-center mb-3">
          <MapPin size={16} className="mr-2 text-accent" />
          <span className="text-sm font-medium text-primary">Calculá el costo de envío</span>
        </div>
        
        <div className="flex space-x-2">
          <div className="flex-1">
            <input
              type="text"
              value={postalCode}
              onChange={(e) => handlePostalCodeChange(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Código postal (ej: 1234 o C1234ABC)"
              className={`w-full px-3 py-2 text-sm border rounded-md focus:ring-2 focus:ring-accent focus:border-accent ${
                error ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {error && (
              <p className="flex items-center mt-1 text-xs text-red-500">
                <AlertCircle size={12} className="mr-1" />
                {error}
              </p>
            )}
          </div>
          
          <button
            onClick={(e) => {
                e.preventDefault();
                calculateShipping();
            }}
            disabled={!postalCode.trim()}
            className="px-4 py-2 text-sm font-medium text-white transition-colors rounded-md bg-accent hover:bg-supporting disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Calcular
          </button>
        </div>
      </div>

      {/* Shipping Result */}
      {shippingOption && hasCalculated && (
        <div className="space-y-2">
          <div className="flex items-center mb-2">
            <Truck size={16} className="mr-2 text-accent" />
            <span className="text-sm font-medium text-primary">Opción de envío</span>
          </div>
          
          <div
            className="p-3 transition-all border rounded-lg cursor-pointer border-accent bg-accent/10"
            onClick={() => onShippingSelect(shippingOption)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-4 h-4 mr-3 border-2 rounded-full border-accent bg-accent">
                  <div className="w-full h-full scale-50 bg-white rounded-full"></div>
                </div>
                <div>
                  <div className="text-sm font-medium text-primary">{shippingOption.name}</div>
                  <div className="text-xs text-content">{shippingOption.estimatedDelivery}</div>
                  <div className="text-xs text-content">{shippingOption.description}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-semibold text-accent">
                  {ShippingService.formatShippingCost(shippingOption.cost)}
                </div>
                {shippingOption.cost === 0 && (
                  <div className="flex items-center text-xs text-green-600">
                    <CheckCircle size={12} className="mr-1" />
                    Envío gratis
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShippingCalculator;
import React from 'react';
import { Package, Store } from 'lucide-react';
import { useCart } from '../../hooks/useCart';
import { buildVariantLabel } from '../../utils/variantUtils';

interface ShippingOption {
  id: string;
  name: string;
  cost: number;
  estimatedDelivery: string;
  description: string;
}

interface OrderSummaryProps {
  shippingMethod?: 'shipping' | 'pickup' | null;
  selectedShipping?: ShippingOption | null;
  shippingCost?: number;
}

const OrderSummary: React.FC<OrderSummaryProps> = ({ 
  shippingMethod, 
  selectedShipping, 
  shippingCost = 0 
}) => {
  const { cartItems, totalPrice } = useCart();
  const finalTotal = totalPrice + shippingCost;

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-primary">Resumen del Pedido</h3>
      
      {/* Product Items */}
      <div className="space-y-3">
        {cartItems.map((item, index) => {
          const variantLabel = buildVariantLabel(item);
          
          return (
            <div key={`${item.product.id}-${index}`} className="flex flex-col gap-1">
              <div className="flex justify-between text-sm">
                <div className="flex-1">
                  <span className="font-medium">{item.product.name}</span>
                  <span className="ml-1 text-content">x{item.quantity}</span>
                  {variantLabel && (
                    <div className="text-xs text-gray-600 mt-0.5">
                      {variantLabel}
                    </div>
                  )}
                </div>
                <span className="font-medium text-right">
                  ${(item.product.price * item.quantity).toFixed(2)}
                </span>
              </div>
              
              {/* Kit Items */}
              {item.selectedItems && item.selectedItems.length > 0 && (
                <div className="pl-4 space-y-1">
                  {item.selectedItems.map((kitItem, kitIndex) => (
                    <div key={kitIndex} className="text-xs text-gray-600">
                      – {kitItem.name}
                      {kitItem.quantity && kitItem.quantity > 1 && (
                        <span className="ml-1">x{kitItem.quantity}</span>
                      )}
                      {(kitItem.color || kitItem.size) && (
                        <span className="ml-1">
                          ({[kitItem.color, kitItem.size].filter(Boolean).join(', ')})
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
      
      {/* Shipping Info */}
      {shippingMethod && (
        <div className="pt-3 mt-3 border-t border-gray-200">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center">
              {shippingMethod === 'pickup' ? (
                <Store size={14} className="mr-2" />
              ) : (
                <Package size={14} className="mr-2" />
              )}
              <span>
                {shippingMethod === 'pickup' 
                  ? 'Retiro en tienda' 
                  : selectedShipping?.name || 'Envío'
                }
              </span>
            </div>
            <span className={shippingCost === 0 ? 'text-green-600 font-medium' : ''}>
              {shippingCost === 0 ? 'Gratis' : `$${shippingCost.toFixed(2)}`}
            </span>
          </div>
        </div>
      )}
      
      {/* Total */}
      <div className="flex justify-between pt-3 mt-3 text-lg font-medium border-t border-gray-200">
        <span>Total:</span>
        <span className="text-accent">${finalTotal.toFixed(2)}</span>
      </div>

      {/* Security Notice */}
      <div className="p-4 mt-6 rounded-lg bg-blue-50">
        <p className="text-sm text-blue-800">
          🔒 <strong>Pago Seguro:</strong> Serás redirigido a Mercado Pago para completar tu compra de forma segura.
        </p>
      </div>
    </div>
  );
};

export default OrderSummary;
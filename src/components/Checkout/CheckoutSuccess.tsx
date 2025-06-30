import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, Package } from 'lucide-react';
import { CheckoutService } from '../../services/checkoutService';
import LoadingSpinner from '../LoadingSpinner';
import { useLocation } from 'react-router-dom';


interface OrderData {
  order_number: string;
  total_amount: number;
  order_items: {
    id: number;
    product_name: string;
    quantity: number;
  }[];
  status: string;
}

const CheckoutSuccess: React.FC = () => {
  const navigate = useNavigate();
  const [orderData, setOrderData] = useState<OrderData | null>(null);
  const [loading, setLoading] = useState(true);


    
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const queryOrderId = queryParams.get('orderId');
  const orderId = queryOrderId || localStorage.getItem('currentOrderId');

  useEffect(() => {
    const loadOrderData = async () => {
      try {
        if (orderId) {
          const data = await CheckoutService.getOrderStatus(orderId);
          setOrderData(data);
          localStorage.removeItem('currentOrderId');
        }
      } catch (error) {
        console.error('Error loading order data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadOrderData();
  }, [orderId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-secondary/30">
      <div className="w-full max-w-md p-8 text-center bg-white rounded-lg">
        <div className="mb-6">
          <CheckCircle size={64} className="mx-auto mb-4 text-green-500" />
          <h1 className="mb-2 text-2xl font-medium text-primary">
            ¡Pago Exitoso!
          </h1>
          <p className="text-content">
            Tu pedido ha sido confirmado y procesado correctamente.
          </p>
          
        </div>
        
        {(orderData?.order_items ?? []).length > 0 && (
          <div className="mt-4 text-sm">
            <h4 className="mb-1 font-medium">Productos:</h4>
            <ul className="list-disc list-inside">
              {(orderData?.order_items ?? []).map((item: OrderData['order_items'][number]) => (
                <li key={item.id}>
                  {item.product_name} x {item.quantity}
                </li>
              ))}
            </ul>
          </div>
        )}

        {orderData && (
          <div className="p-4 mb-6 text-left rounded-lg bg-secondary/30">
            <h3 className="mb-2 font-medium text-primary">Detalles del Pedido</h3>
            <div className="space-y-1 text-sm">
              <p><strong>Número:</strong> {orderData.order_number}</p>
              <p><strong>Total:</strong> ${orderData.total_amount}</p>
              <p><strong>Estado:</strong> {orderData.status === 'paid' ? 'Pagado' : 'Pendiente'}</p>
            </div>
          </div>
        )}

        <div className="space-y-3">
          <button
            onClick={() => navigate('/')}
            className="flex items-center justify-center w-full px-6 py-3 text-white transition-colors rounded-md bg-accent hover:bg-supporting"
          >
            <Package size={20} className="mr-2" />
            Seguir Comprando
          </button>
          
          <p className="text-sm text-content">
            Recibirás un email de confirmación con los detalles de tu pedido.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CheckoutSuccess;
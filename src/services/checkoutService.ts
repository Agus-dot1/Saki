import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

export interface CheckoutData {
  items: Array<{
    product: {
      id: number;
      name: string;
      price: number;
    };
    quantity: number;
  }>;
  customer: {
    email: string;
    firstName: string;
    lastName: string;
    phone?: string;
    address?: string;
    city?: string;
    postalCode?: string;
  };
}

export interface PaymentPreference {
  preferenceId: string;
  initPoint: string;
  orderId: string;
  orderNumber: string;
}

export class CheckoutService {
  static async createPaymentPreference(data: CheckoutData): Promise<PaymentPreference> {
    try {
      const { data: response, error } = await supabase.functions.invoke(
        'create-payment-preference',
        {
          body: data
        }
      );

      if (error) throw error;
      if (response.error) throw new Error(response.error);

      return response;
    } catch (error) {
      console.error('Error creating payment preference:', error);
      throw new Error('No se pudo crear la preferencia de pago');
    }
  }

  static async getOrderStatus(orderId: string) {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          customer:customers(*),
          order_items(*),
          payments(*)
        `)
        .eq('id', orderId)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error getting order status:', error);
      throw new Error('No se pudo obtener el estado de la orden');
    }
  }

  static redirectToMercadoPago(initPoint: string) {
    window.location.href = initPoint;
  }
}
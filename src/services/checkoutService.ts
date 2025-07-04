import supabase from "../utils/supabase";

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
    areaCode: string;
    phoneNumber: string;
    streetName: string;
    streetNumber: string;
    city: string;
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
      console.log('Creating payment preference with data:', data);
      
      const { data: response, error } = await supabase.functions.invoke(
        'create-payment-preference',
        {
          body: data
        }
      );

      console.log('Supabase function response:', response);
      console.log('Supabase function error:', error);

      if (error) {
        console.error('Supabase function error:', error);
        throw new Error(`Error en la función: ${error.message}`);
      }
      
      if (response?.error) {
        console.error('Response error:', response.error);
        throw new Error(response.error);
      }

      if (!response?.preferenceId) {
        console.error('Invalid response format:', response);
        throw new Error('Respuesta inválida del servidor');
      }

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
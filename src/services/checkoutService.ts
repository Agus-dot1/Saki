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
  // Método para simular el checkout (para desarrollo sin Supabase configurado)
  static async simulateCheckout(data: CheckoutData): Promise<{ success: boolean; orderId?: string; orderNumber?: string }> {
    try {
      // Simular delay de procesamiento
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simular 90% de éxito
      const isSuccess = Math.random() > 0.1;
      
      if (isSuccess) {
        const orderId = `sim-${Date.now()}`;
        const orderNumber = `SIM-${Date.now().toString().slice(-6)}`;
        
        return {
          success: true,
          orderId,
          orderNumber
        };
      } else {
        throw new Error('Pago simulado rechazado');
      }
    } catch (error) {
      console.error('Error in simulated checkout:', error);
      return { success: false };
    }
  }

  // Métodos para cuando Supabase esté configurado
  static async createPaymentPreference(data: CheckoutData): Promise<PaymentPreference> {
    // Verificar si Supabase está configurado
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey || supabaseUrl === 'your_supabase_project_url_here') {
      console.warn('Supabase not configured, using simulated checkout');
      const result = await this.simulateCheckout(data);
      if (result.success) {
        return {
          preferenceId: result.orderId!,
          initPoint: '#',
          orderId: result.orderId!,
          orderNumber: result.orderNumber!
        };
      } else {
        throw new Error('Checkout simulado falló');
      }
    }

    try {
      const { createClient } = await import('@supabase/supabase-js');
      const supabase = createClient(supabaseUrl, supabaseKey);

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
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey || supabaseUrl === 'your_supabase_project_url_here') {
      // Retornar datos simulados
      return {
        id: orderId,
        order_number: `SIM-${orderId.slice(-6)}`,
        status: 'paid',
        total_amount: 89.99,
        customer: {
          first_name: 'Usuario',
          last_name: 'Demo',
          email: 'demo@ejemplo.com'
        }
      };
    }

    try {
      const { createClient } = await import('@supabase/supabase-js');
      const supabase = createClient(supabaseUrl, supabaseKey);

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
    if (initPoint === '#') {
      console.log('Modo simulado: redirección a Mercado Pago simulada');
      return;
    }
    window.location.href = initPoint;
  }
}
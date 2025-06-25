import { createClient } from 'npm:@supabase/supabase-js@2';
import { MercadoPagoConfig, Preference } from 'npm:mercadopago@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

interface CartItem {
  product: {
    id: number;
    name: string;
    price: number;
  };
  quantity: number;
}

interface CustomerData {
  email: string;
  firstName: string;
  lastName: string;
  areaCode: string;
  phoneNumber: string;
  streetName: string;
  streetNumber: string;
  city: string;
  postalCode?: string;
}

interface CreatePreferenceRequest {
  items: CartItem[];
  customer: CustomerData;
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Inicializar Supabase
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Obtener datos del request
    const { items, customer }: CreatePreferenceRequest = await req.json();

    // Validar datos
    if (!items || items.length === 0) {
      throw new Error('No hay items en el carrito');
    }

    if (!customer.email || !customer.firstName || !customer.lastName) {
      throw new Error('Datos del cliente incompletos');
    }

    // Crear o actualizar cliente en la base de datos
    const { data: customerData, error: customerError } = await supabase
      .from('customers')
      .upsert({
        email: customer.email,
        first_name: customer.firstName,
        last_name: customer.lastName,
        phone: `${customer.areaCode}${customer.phoneNumber}`,
        address: `${customer.streetName} ${customer.streetNumber}`,
        city: customer.city,
        postal_code: customer.postalCode || '',
      })
      .select()
      .single();

    if (customerError) {
      console.error('Error creating customer:', customerError);
      throw new Error('Error al crear el cliente');
    }

    // Calcular total
    const totalAmount = items.reduce((total, item) => 
      total + (item.product.price * item.quantity), 0
    );

    // Crear orden en la base de datos
    const { data: orderData, error: orderError } = await supabase
      .from('orders')
      .insert({
        customer_id: customerData.id,
        total_amount: totalAmount,
        status: 'pending',
        currency: 'ARS'
      })
      .select()
      .single();

    if (orderError) {
      console.error('Error creating order:', orderError);
      throw new Error('Error al crear la orden');
    }

    // Crear items de la orden
    const orderItems = items.map(item => ({
      order_id: orderData.id,
      product_id: item.product.id,
      product_name: item.product.name,
      quantity: item.quantity,
      unit_price: item.product.price,
      total_price: item.product.price * item.quantity
    }));

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems);

    if (itemsError) {
      console.error('Error creating order items:', itemsError);
      throw new Error('Error al crear los items de la orden');
    }

    // Configurar Mercado Pago
    const accessToken = Deno.env.get('MERCADO_PAGO_ACCESS_TOKEN_SANDBOX') || 
                       Deno.env.get('MERCADO_PAGO_ACCESS_TOKEN_PROD');
    
    if (!accessToken) {
      throw new Error('Access token de Mercado Pago no configurado');
    }

    const client = new MercadoPagoConfig({ 
      accessToken: accessToken,
      options: {
        timeout: 5000,
        idempotencyKey: `order-${orderData.id}-${Date.now()}`
      }
    });

    // Preparar items para Mercado Pago
    const mpItems = items.map(item => ({
      id: item.product.id.toString(),
      title: item.product.name,
      quantity: item.quantity,
      unit_price: item.product.price,
      currency_id: 'ARS'
    }));

    // Crear preferencia de pago
    const preference = new Preference(client);
    
    const preferenceData = {
      items: mpItems,
      payer: {
        name: customer.firstName,
        surname: customer.lastName,
        email: customer.email,
        phone: {
          area_code: customer.areaCode,
          number: customer.phoneNumber
        },
        address: {
          street_name: customer.streetName,
          street_number: customer.streetNumber,
          zip_code: customer.postalCode || ''
        }
      },
      back_urls: {
        success: `${req.headers.get('origin')}/checkout/success`,
        failure: `${req.headers.get('origin')}/checkout/failure`,
        pending: `${req.headers.get('origin')}/checkout/pending`
      },
      auto_return: 'approved' as const,
      notification_url: `${Deno.env.get('SUPABASE_URL')}/functions/v1/mercado-pago-webhook`,
      external_reference: orderData.id,
      statement_descriptor: 'SAKI SKINCARE',
      expires: true,
      expiration_date_from: new Date().toISOString(),
      expiration_date_to: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 horas
    };

    console.log('Creating preference with data:', JSON.stringify(preferenceData, null, 2));

    const preferenceResponse = await preference.create({
      body: preferenceData
    });

    console.log('Preference created:', preferenceResponse);

    // Actualizar orden con preference_id
    await supabase
      .from('orders')
      .update({ 
        mercado_pago_preference_id: preferenceResponse.id 
      })
      .eq('id', orderData.id);

    return new Response(
      JSON.stringify({
        preferenceId: preferenceResponse.id,
        initPoint: preferenceResponse.init_point,
        orderId: orderData.id,
        orderNumber: orderData.order_number
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    );

  } catch (error) {
    console.error('Error creating payment preference:', error);
    
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Error interno del servidor',
        details: error.toString()
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    );
  }
});
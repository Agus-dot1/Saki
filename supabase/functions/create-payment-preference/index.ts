import { createClient } from 'npm:@supabase/supabase-js@2';

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
  phone?: string;
  address?: string;
  city?: string;
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
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { items, customer }: CreatePreferenceRequest = await req.json();

    // Validar datos
    if (!items || items.length === 0) {
      throw new Error('No hay items en el carrito');
    }

    if (!customer.email || !customer.firstName || !customer.lastName) {
      throw new Error('Datos del cliente incompletos');
    }

    // Crear o actualizar cliente
    const { data: customerData, error: customerError } = await supabase
      .from('customers')
      .upsert({
        email: customer.email,
        first_name: customer.firstName,
        last_name: customer.lastName,
        phone: customer.phone,
        address: customer.address,
        city: customer.city,
        postal_code: customer.postalCode,
      })
      .select()
      .single();

    if (customerError) throw customerError;

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
        status: 'pending'
      })
      .select()
      .single();

    if (orderError) throw orderError;

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

    if (itemsError) throw itemsError;

    // Preparar items para Mercado Pago
    const mpItems = items.map(item => ({
      id: item.product.id.toString(),
      title: item.product.name,
      quantity: item.quantity,
      unit_price: item.product.price,
      currency_id: 'ARS'
    }));

    // Crear preferencia en Mercado Pago
    const accessToken = Deno.env.get('MERCADO_PAGO_ACCESS_TOKEN_SANDBOX');
    
    const preferenceData = {
      items: mpItems,
      payer: {
        name: customer.firstName,
        surname: customer.lastName,
        email: customer.email,
        phone: {
          number: customer.phone || ''
        },
        address: {
          street_name: customer.address || '',
          zip_code: customer.postalCode || ''
        }
      },
      back_urls: {
        success: `${req.headers.get('origin')}/checkout/success`,
        failure: `${req.headers.get('origin')}/checkout/failure`,
        pending: `${req.headers.get('origin')}/checkout/pending`
      },
      auto_return: 'approved',
      notification_url: `${Deno.env.get('SUPABASE_URL')}/functions/v1/mercado-pago-webhook`,
      external_reference: orderData.id,
      statement_descriptor: 'SAKI SKINCARE'
    };

    const mpResponse = await fetch('https://api.mercadopago.com/checkout/preferences', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(preferenceData)
    });

    if (!mpResponse.ok) {
      const errorData = await mpResponse.text();
      throw new Error(`Error de Mercado Pago: ${errorData}`);
    }

    const preference = await mpResponse.json();

    // Actualizar orden con preference_id
    await supabase
      .from('orders')
      .update({ mercado_pago_preference_id: preference.id })
      .eq('id', orderData.id);

    return new Response(
      JSON.stringify({
        preferenceId: preference.id,
        initPoint: preference.init_point,
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
        error: error.message || 'Error interno del servidor' 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    );
  }
});
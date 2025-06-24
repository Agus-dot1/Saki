import { createClient } from 'npm:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS'
};

interface CartItem {
  id: string;
  product_name: string;
  price: number;
  quantity: number;
  image_url?: string;
}

interface CustomerData {
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  address?: string;
}

interface CheckoutData {
  items: CartItem[];
  customer: CustomerData;
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const body: CheckoutData = await req.json();
    console.log('Creating payment preference for:', body);

    // Validate required data
    if (!body.items || !body.customer) {
      return new Response(
        JSON.stringify({ error: 'Items and customer data are required' }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Calculate total amount
    const totalAmount = body.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    // Create or get customer
    const { data: existingCustomer } = await supabase
      .from('customers')
      .select('id')
      .eq('email', body.customer.email)
      .single();

    let customerId;
    if (existingCustomer) {
      customerId = existingCustomer.id;
      // Update customer data
      await supabase
        .from('customers')
        .update({
          first_name: body.customer.first_name,
          last_name: body.customer.last_name,
          phone: body.customer.phone,
          address: body.customer.address,
          updated_at: new Date().toISOString()
        })
        .eq('id', customerId);
    } else {
      const { data: newCustomer, error: customerError } = await supabase
        .from('customers')
        .insert({
          first_name: body.customer.first_name,
          last_name: body.customer.last_name,
          email: body.customer.email,
          phone: body.customer.phone,
          address: body.customer.address
        })
        .select('id')
        .single();

      if (customerError) {
        console.error('Error creating customer:', customerError);
        throw new Error('Error creating customer');
      }
      customerId = newCustomer.id;
    }

    // Generate order number
    const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 5).toUpperCase()}`;

    // Create order
    const { data: orderData, error: orderError } = await supabase
      .from('orders')
      .insert({
        customer_id: customerId,
        order_number: orderNumber,
        total_amount: totalAmount,
        status: 'pending',
        created_at: new Date().toISOString()
      })
      .select('id')
      .single();

    if (orderError) {
      console.error('Error creating order:', orderError);
      throw new Error('Error creating order');
    }

    // Create order items
    const orderItems = body.items.map(item => ({
      order_id: orderData.id,
      product_name: item.product_name,
      quantity: item.quantity,
      unit_price: item.price,
      total_price: item.price * item.quantity
    }));

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems);

    if (itemsError) {
      console.error('Error creating order items:', itemsError);
      throw new Error('Error creating order items');
    }

    // Prepare Mercado Pago preference
    const accessToken = Deno.env.get('MERCADO_PAGO_ACCESS_TOKEN');
    const webhookUrl = Deno.env.get('MERCADO_PAGO_WEBHOOK_URL'); // Your webhook URL

    if (!accessToken) {
      throw new Error('Mercado Pago access token not configured');
    }

    const preferenceData = {
      items: body.items.map(item => ({
        id: item.id,
        title: item.product_name,
        quantity: item.quantity,
        unit_price: item.price,
        currency_id: 'ARS', // Change to your currency
        picture_url: item.image_url
      })),
      payer: {
        name: body.customer.first_name,
        surname: body.customer.last_name,
        email: body.customer.email,
        phone: {
          number: body.customer.phone || ''
        },
        address: {
          street_name: body.customer.address || ''
        }
      },
      back_urls: {
        success: `${Deno.env.get('FRONTEND_URL')}/checkout/success`,
        failure: `${Deno.env.get('FRONTEND_URL')}/checkout/failure`,
        pending: `${Deno.env.get('FRONTEND_URL')}/checkout/pending`
      },
      auto_return: 'approved',
      external_reference: orderData.id.toString(), // This is crucial for your webhook
      notification_url: webhookUrl,
      statement_descriptor: 'Saki Skincare',
      expires: true,
      expiration_date_from: new Date().toISOString(),
      expiration_date_to: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 hours
    };

    // Create preference in Mercado Pago
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
      console.error('Mercado Pago error:', errorData);
      throw new Error('Error creating Mercado Pago preference');
    }

    const preference = await mpResponse.json();

    // Update order with Mercado Pago preference ID
    await supabase
      .from('orders')
      .update({
        mercado_pago_preference_id: preference.id
      })
      .eq('id', orderData.id);

    const response = {
      orderId: orderData.id,
      orderNumber: orderNumber,
      initPoint: preference.init_point,
      sandboxInitPoint: preference.sandbox_init_point,
      preferenceId: preference.id
    };

    return new Response(
      JSON.stringify(response),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('Error creating payment preference:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
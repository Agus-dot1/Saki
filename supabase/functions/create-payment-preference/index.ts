// functions/create-payment-preference/index.ts
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, PUT, DELETE'
};
const ACCESS_TOKEN = Deno.env.get('MERCADO_PAGO_ACCESS_TOKEN') || Deno.env.get('MERCADO_PAGO_ACCESS_TOKEN_SANDBOX');
const SUPABASE_URL = Deno.env.get('SUPABASE_URL') ?? '';
const SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);
serve(async (req)=>{
  if (req.method === 'OPTIONS') {
    return new Response('ok', {
      headers: corsHeaders
    });
  }
  try {
    const { items, customer } = await req.json();
    if (!items?.length) throw new Error('No hay items en el carrito');
    if (!customer?.email || !customer?.firstName || !customer?.lastName) {
      throw new Error('Datos del cliente incompletos');
    }
    if (!ACCESS_TOKEN) throw new Error('Falta el ACCESS_TOKEN de Mercado Pago');
    // 🧑 Crear o actualizar cliente
    const { data: customerData, error: customerError } = await supabase.from('customers').upsert({
      email: customer.email,
      first_name: customer.firstName,
      last_name: customer.lastName,
      phone: `${customer.areaCode}${customer.phoneNumber}`,
      address: `${customer.streetName} ${customer.streetNumber}`,
      city: customer.city,
      postal_code: customer.postalCode || ''
    }, {
      onConflict: 'email'
    }).select().single();
    if (customerError) throw new Error(`Error al crear cliente: ${customerError.message}`);
    // 🧾 Crear orden
    const totalAmount = items.reduce((acc, item)=>acc + item.product.price * item.quantity, 0);
    const { data: orderData, error: orderError } = await supabase.from('orders').insert({
      customer_id: customerData.id,
      total_amount: totalAmount,
      status: 'pending',
      currency: 'ARS'
    }).select().single();
    if (orderError) throw new Error(`Error al crear orden: ${orderError.message}`);
    // 📦 Crear items de la orden
    const orderItems = items.map((item)=>({
        order_id: orderData.id,
        product_id: item.product.id,
        product_name: item.product.name,
        quantity: item.quantity,
        unit_price: item.product.price,
        total_price: item.product.price * item.quantity
      }));
    const { error: itemsError } = await supabase.from('order_items').insert(orderItems);
    if (itemsError) throw new Error(`Error al crear items: ${itemsError.message}`);
    // 🧾 Crear preferencia de pago
    const origin = req.headers.get('origin') || 'https://saki-tau.vercel.app';
    const preferenceData = {
      items: items.map((item)=>({
          id: item.product.id.toString(),
          title: item.product.name,
          quantity: item.quantity,
          unit_price: item.product.price,
          currency_id: 'ARS',
          description: item.product.description,
          category_id: 'BEAUTY'
        })),
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
        success: `${origin}/checkout/success`,
        failure: `${origin}/checkout/failure`,
        pending: `${origin}/checkout/pending`
      },
      auto_return: 'approved',
      notification_url: `${SUPABASE_URL}/functions/v1/mercado-pago-webhook`,
      external_reference: orderData.id,
      statement_descriptor: 'SAKI SKINCARE',
      expires: true,
      expiration_date_from: new Date().toISOString(),
      expiration_date_to: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
    };
    const mpRes = await fetch('https://api.mercadopago.com/checkout/preferences', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${ACCESS_TOKEN}`
      },
      body: JSON.stringify(preferenceData)
    });
    const mpData = await mpRes.json();
    if (!mpRes.ok) {
      throw new Error(`MercadoPago error: ${JSON.stringify(mpData)}`);
    }
    // 📝 Guardar preference_id en la orden
    await supabase.from('orders').update({
      mercado_pago_preference_id: mpData.id
    }).eq('id', orderData.id);
    // ✅ Devolver init_point
    return new Response(JSON.stringify({
      preferenceId: mpData.id,
      initPoint: mpData.init_point,
      orderId: orderData.id,
      orderNumber: orderData.order_number
    }), {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json'
      },
      status: 200
    });
  } catch (err) {
    console.error('Error:', err);
    return new Response(JSON.stringify({
      error: err.message ?? 'Error interno'
    }), {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json'
      },
      status: 500
    });
  }
});

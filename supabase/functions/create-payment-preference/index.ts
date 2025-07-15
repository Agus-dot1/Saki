import { createClient } from 'npm:@supabase/supabase-js@2';
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS'
};
Deno.serve(async (req)=>{
  console.log('🔍 Incoming request:', req.method, req.url);
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: corsHeaders
    });
  }
  // Endpoint de test para Resend
  if (req.method === 'GET') {
    const url = new URL(req.url);
    if (url.searchParams.get('test') === 'resend') {
      const result = await testResendEndpoint();
      return new Response(JSON.stringify(result, null, 2), {
        status: result.success ? 200 : 500,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }
    return new Response('Mercado Pago Webhook is running! ✅\nThis endpoint expects POST requests from Mercado Pago.', {
      status: 200,
      headers: {
        'Content-Type': 'text/plain'
      }
    });
  }
  if (req.method === 'POST') {
    try {
      const supabase = createClient(Deno.env.get('SUPABASE_URL') ?? '', Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '');
      const url = new URL(req.url);
      const contentType = req.headers.get('content-type');
      let type = null;
      let paymentId = null;
      if (contentType?.includes('application/json')) {
        // Soporta POST con body (para usar desde Postman)
        const body = await req.json();
        console.log('📩 Webhook POST body:', body);
        type = body.type;
        paymentId = body.data?.id?.toString() || null;
      } else {
        // Soporta POST con query params (como Mercado Pago)
        type = url.searchParams.get("type");
        paymentId = url.searchParams.get("data.id");
        console.log('🌐 Webhook POST query params:', {
          type,
          paymentId
        });
      }
      if (type !== "payment" || !paymentId) {
        console.warn('❌ No es notificación de pago o falta el ID');
        return new Response('Not a valid payment notification', {
          status: 200,
          headers: corsHeaders
        });
      }
      const accessToken = Deno.env.get('MERCADO_PAGO_ACCESS_TOKEN_SANDBOX') || Deno.env.get('MERCADO_PAGO_ACCESS_TOKEN');
      if (!accessToken) {
        throw new Error('Access token de Mercado Pago no configurado');
      }
      const paymentRes = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });
      if (!paymentRes.ok) {
        throw new Error(`Error fetching payment from MP: ${paymentRes.status}`);
      }
      const paymentData = await paymentRes.json();
      console.log('💵 Payment data:', paymentData);
      const { data: orderData, error: orderError } = await supabase.from('orders').select('*, customer:customers(*), order_items(*)').eq('id', paymentData.external_reference).maybeSingle();
      console.log('🧾 Order lookup result:', orderData, orderError);
      if (orderError || !orderData) {
        console.error('❌ Order not found');
        return new Response('Order not found', {
          status: 404,
          headers: corsHeaders
        });
      }
      const { error: paymentInsertError } = await supabase.from('payments').upsert({
        order_id: orderData.id,
        mercado_pago_payment_id: paymentId,
        status: paymentData.status,
        status_detail: paymentData.status_detail,
        payment_method: paymentData.payment_method_id,
        payment_type: paymentData.payment_type_id,
        amount: paymentData.transaction_amount,
        currency: paymentData.currency_id,
        webhook_data: paymentData
      }, {
        onConflict: 'mercado_pago_payment_id'
      });
      if (paymentInsertError) {
        console.error('❌ Error inserting payment:', paymentInsertError);
      }
      if (paymentData.status === 'approved') {
        const { error: updateError } = await supabase.from('orders').update({
          status: 'paid',
          mercado_pago_payment_id: paymentId,
          payment_method: paymentData.payment_method_id
        }).eq('id', orderData.id);
        if (updateError) {
          console.error('❌ Error updating order:', updateError);
        }
        await sendOrderConfirmationEmail(orderData, paymentData);
      }
      return new Response('OK', {
        status: 200,
        headers: corsHeaders
      });
    } catch (error) {
      console.error('❌ Webhook error:', error);
      return new Response('Error', {
        status: 500,
        headers: corsHeaders
      });
    }
  }
  // Método no permitido
  return new Response('Method not allowed', {
    status: 405,
    headers: corsHeaders
  });
});
// --- Test Resend ---
async function testResendEndpoint() {
  const resendApiKey = Deno.env.get('RESEND_API_KEY');
  const adminEmail = Deno.env.get('ADMIN_EMAIL');
  if (!resendApiKey || !adminEmail) {
    return {
      success: false,
      error: 'Missing configuration'
    };
  }
  const testEmailData = {
    from: 'Test <noreply@saki.beauty>',
    to: [
      adminEmail
    ],
    subject: '🧪 Test Email from Webhook',
    text: 'Este es un email de prueba para verificar que Resend funciona correctamente desde el webhook.'
  };
  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(testEmailData)
    });
    return {
      success: res.ok,
      status: res.status,
      data: await res.text()
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
}
// --- Email de confirmación ---
async function sendOrderConfirmationEmail(orderData, paymentData) {
  try {
    const resendApiKey = Deno.env.get('RESEND_API_KEY');
    const adminEmail = Deno.env.get('ADMIN_EMAIL');
    if (!resendApiKey || !adminEmail) return;
    const productDetails = orderData.order_items.map((item)=>`- ${item.product_name} (x${item.quantity}) - $${item.total_price}`).join('\n');
    const emailContent = `
Hola! Tenés un nuevo pedido confirmado.

🧾 Detalle del pedido:
${productDetails}

💰 Total: $${orderData.total_amount}
📋 Número de orden: ${orderData.order_number}

📬 Cliente:
- ${orderData.customer.first_name} ${orderData.customer.last_name}
- ${orderData.customer.email}
- ${orderData.customer.phone || 'Sin teléfono'}
- ${orderData.customer.address || 'Sin dirección'}

💳 Pago:
- Método: ${paymentData.payment_method_id}
- ID: ${paymentData.id}
- Estado: Aprobado ✅
    `.trim();
    const emailData = {
      from: 'Saki Skincare <noreply@saki.beauty>',
      to: [
        adminEmail
      ],
      subject: `🛍️ Pedido #${orderData.order_number} - $${orderData.total_amount}`,
      text: emailContent
    };
    const emailResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(emailData)
    });
    if (!emailResponse.ok) {
      console.error('❌ Error sending email:', await emailResponse.text());
    } else {
      console.log('✅ Email de confirmación enviado');
    }
  } catch (error) {
    console.error('❌ Error en sendOrderConfirmationEmail:', error);
  }
}

import { createClient } from 'npm:@supabase/supabase-js@2';
import { MercadoPagoConfig, Payment } from 'npm:mercadopago@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const body = await req.json();
    console.log('Webhook received:', JSON.stringify(body, null, 2));

    // Verificar que es una notificación de pago
    if (body.type !== 'payment') {
      console.log('Not a payment notification, ignoring');
      return new Response('OK', { status: 200 });
    }

    const paymentId = body.data.id;
    
    // Configurar Mercado Pago
    const accessToken = Deno.env.get('MERCADO_PAGO_ACCESS_TOKEN_SANDBOX') || 
                       Deno.env.get('MERCADO_PAGO_ACCESS_TOKEN');
    
    if (!accessToken) {
      throw new Error('Access token de Mercado Pago no configurado');
    }

    const client = new MercadoPagoConfig({ accessToken });
    const payment = new Payment(client);

    // Obtener detalles del pago desde Mercado Pago
    const paymentData = await payment.get({ id: paymentId });
    console.log('Payment data:', JSON.stringify(paymentData, null, 2));

    // Buscar la orden por external_reference
    const { data: orderData, error: orderError } = await supabase
      .from('orders')
      .select(`
        *,
        customer:customers(*),
        order_items(*)
      `)
      .eq('id', paymentData.external_reference)
      .single();

    if (orderError || !orderData) {
      console.error('Order not found:', orderError);
      return new Response('Order not found', { status: 404 });
    }

    // Registrar el pago
    const { error: paymentInsertError } = await supabase
      .from('payments')
      .upsert({
        order_id: orderData.id,
        mercado_pago_payment_id: paymentId.toString(),
        status: paymentData.status,
        status_detail: paymentData.status_detail,
        payment_method: paymentData.payment_method_id,
        payment_type: paymentData.payment_type_id,
        amount: paymentData.transaction_amount,
        currency: paymentData.currency_id,
        webhook_data: paymentData
      });

    if (paymentInsertError) {
      console.error('Error inserting payment:', paymentInsertError);
    }

    // Actualizar estado de la orden si el pago fue aprobado
    if (paymentData.status === 'approved') {
      const { error: updateError } = await supabase
        .from('orders')
        .update({
          status: 'paid',
          mercado_pago_payment_id: paymentId.toString(),
          payment_method: paymentData.payment_method_id
        })
        .eq('id', orderData.id);

      if (updateError) {
        console.error('Error updating order:', updateError);
      }

      // Enviar email de confirmación (opcional)
      await sendOrderConfirmationEmail(orderData, paymentData);
    }

    return new Response('OK', { status: 200 });

  } catch (error) {
    console.error('Webhook error:', error);
    return new Response('Error', { status: 500 });
  }
});

async function sendOrderConfirmationEmail(orderData: any, paymentData: any) {
  try {
    const resendApiKey = Deno.env.get('RESEND_API_KEY');
    const adminEmail = Deno.env.get('ADMIN_EMAIL');

    if (!resendApiKey || !adminEmail) {
      console.log('Email configuration missing, skipping email');
      return;
    }

    // Preparar detalles de productos con variantes
    const productDetails = orderData.order_items
      .map((item: any) => {
        let itemText = `- ${item.product_name}`;
        
        // Add variant information if available
        if (item.variant_label) {
          itemText += ` (${item.variant_label})`;
        }
        
        itemText += ` (x${item.quantity}) - $${item.total_price}`;
        
        // Add kit items if available
        if (item.kit_items && Array.isArray(item.kit_items)) {
          const kitItemsText = item.kit_items.map((kitItem: any) => {
            let kitText = `  – ${kitItem.name}`;
            if (kitItem.quantity && kitItem.quantity > 1) {
              kitText += ` x${kitItem.quantity}`;
            }
            if (kitItem.color || kitItem.size) {
              const variants = [kitItem.color, kitItem.size].filter(Boolean);
              if (variants.length > 0) {
                kitText += ` (${variants.join(', ')})`;
              }
            }
            return kitText;
          }).join('\n');
          
          if (kitItemsText) {
            itemText += '\n' + kitItemsText;
          }
        }
        
        return itemText;
      })
      .join('\n');

    const emailContent = `
Hola! Tenés un nuevo pedido confirmado a través de la tienda.

🧾 Detalle del pedido:
${productDetails}

💰 Total: $${orderData.total_amount}
📋 Número de orden: ${orderData.order_number}

📬 Datos del cliente:
- Nombre: ${orderData.customer.first_name} ${orderData.customer.last_name}
- Email: ${orderData.customer.email}
- Teléfono: ${orderData.customer.phone || 'No proporcionado'}
- Dirección: ${orderData.customer.address || 'No proporcionada'}

💳 Información del pago:
- Método: ${paymentData.payment_method_id}
- ID de pago: ${paymentData.id}
- Estado: Aprobado ✅

El pago fue aprobado por Mercado Pago.
Podés preparar el pedido y coordinar el envío 😊
    `.trim();

    const emailData = {
      from: 'Saki Skincare <noreply@sakiskincare.com>',
      to: [adminEmail],
      subject: `🛍️ Nuevo Pedido #${orderData.order_number} - $${orderData.total_amount}`,
      text: emailContent
    };

    const emailResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(emailData)
    });

    if (!emailResponse.ok) {
      const errorData = await emailResponse.text();
      console.error('Error sending email:', errorData);
    } else {
      console.log('Order confirmation email sent successfully');
    }

  } catch (error) {
    console.error('Error in sendOrderConfirmationEmail:', error);
  }
}
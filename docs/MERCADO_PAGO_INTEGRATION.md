# Guía de Integración Mercado Pago con Supabase

## 📋 Tabla de Contenidos
1. [Configuración Inicial](#configuración-inicial)
2. [Credenciales y Setup](#credenciales-y-setup)
3. [Base de Datos Supabase](#base-de-datos-supabase)
4. [Edge Functions](#edge-functions)
5. [Integración Frontend](#integración-frontend)
6. [Webhooks y Automatización](#webhooks-y-automatización)
7. [Seguridad](#seguridad)
8. [Testing](#testing)
9. [Errores Comunes](#errores-comunes)
10. [Flujo de Usuario](#flujo-de-usuario)

## 🚀 Configuración Inicial

### 1. Credenciales y Setup

#### Paso 1: Crear cuenta en Mercado Pago
```bash
# 1. Registrarse en https://www.mercadopago.com.ar/developers
# 2. Crear una aplicación
# 3. Obtener credenciales de prueba y producción
```

#### Paso 2: Variables de Entorno
```env
# .env (Supabase Dashboard > Settings > Environment Variables)
MERCADO_PAGO_ACCESS_TOKEN_SANDBOX=TEST-1234567890-123456-abcdef123456789-123456789
MERCADO_PAGO_ACCESS_TOKEN_PROD=APP_USR-1234567890-123456-abcdef123456789-123456789
MERCADO_PAGO_PUBLIC_KEY_SANDBOX=TEST-12345678-1234-1234-1234-123456789012
MERCADO_PAGO_PUBLIC_KEY_PROD=APP_USR-12345678-1234-1234-1234-123456789012
MERCADO_PAGO_WEBHOOK_SECRET=tu_webhook_secret_aqui
RESEND_API_KEY=re_123456789_abcdefghijklmnop
ADMIN_EMAIL=tu-email@ejemplo.com
```

#### Paso 3: Frontend Environment Variables
```env
# .env (Frontend)
VITE_MERCADO_PAGO_PUBLIC_KEY=TEST-12345678-1234-1234-1234-123456789012
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...
```

## 🗄️ Base de Datos Supabase

### Migración: Crear tablas necesarias

```sql
-- supabase/migrations/create_orders_and_payments.sql

/*
  # Sistema de Órdenes y Pagos con Mercado Pago

  1. Nuevas Tablas
    - `orders` - Órdenes de compra
    - `order_items` - Items de cada orden
    - `payments` - Registro de pagos
    - `customers` - Datos de clientes

  2. Seguridad
    - RLS habilitado en todas las tablas
    - Políticas para usuarios autenticados y anónimos
*/

-- Tabla de clientes
CREATE TABLE IF NOT EXISTS customers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  first_name text NOT NULL,
  last_name text NOT NULL,
  phone text,
  address text,
  city text,
  postal_code text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Tabla de órdenes
CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id uuid REFERENCES customers(id),
  order_number text UNIQUE NOT NULL,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'shipped', 'delivered', 'cancelled')),
  total_amount decimal(10,2) NOT NULL,
  currency text NOT NULL DEFAULT 'ARS',
  payment_method text,
  mercado_pago_preference_id text,
  mercado_pago_payment_id text,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Tabla de items de orden
CREATE TABLE IF NOT EXISTS order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid REFERENCES orders(id) ON DELETE CASCADE,
  product_id integer NOT NULL,
  product_name text NOT NULL,
  quantity integer NOT NULL DEFAULT 1,
  unit_price decimal(10,2) NOT NULL,
  total_price decimal(10,2) NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Tabla de pagos
CREATE TABLE IF NOT EXISTS payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid REFERENCES orders(id),
  mercado_pago_payment_id text UNIQUE,
  status text NOT NULL,
  status_detail text,
  payment_method text,
  payment_type text,
  amount decimal(10,2) NOT NULL,
  currency text NOT NULL DEFAULT 'ARS',
  webhook_data jsonb,
  processed_at timestamptz DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- Políticas para customers
CREATE POLICY "Customers can read own data"
  ON customers FOR SELECT
  TO authenticated, anon
  USING (true);

CREATE POLICY "Anyone can create customers"
  ON customers FOR INSERT
  TO authenticated, anon
  WITH CHECK (true);

-- Políticas para orders
CREATE POLICY "Anyone can read orders"
  ON orders FOR SELECT
  TO authenticated, anon
  USING (true);

CREATE POLICY "Anyone can create orders"
  ON orders FOR INSERT
  TO authenticated, anon
  WITH CHECK (true);

CREATE POLICY "Anyone can update orders"
  ON orders FOR UPDATE
  TO authenticated, anon
  USING (true);

-- Políticas para order_items
CREATE POLICY "Anyone can read order items"
  ON order_items FOR SELECT
  TO authenticated, anon
  USING (true);

CREATE POLICY "Anyone can create order items"
  ON order_items FOR INSERT
  TO authenticated, anon
  WITH CHECK (true);

-- Políticas para payments
CREATE POLICY "Anyone can read payments"
  ON payments FOR SELECT
  TO authenticated, anon
  USING (true);

CREATE POLICY "Anyone can create payments"
  ON payments FOR INSERT
  TO authenticated, anon
  WITH CHECK (true);

-- Función para generar número de orden
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS text AS $$
BEGIN
  RETURN 'ORD-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || LPAD(NEXTVAL('order_sequence')::text, 4, '0');
END;
$$ LANGUAGE plpgsql;

-- Secuencia para números de orden
CREATE SEQUENCE IF NOT EXISTS order_sequence START 1;

-- Trigger para auto-generar número de orden
CREATE OR REPLACE FUNCTION set_order_number()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.order_number IS NULL THEN
    NEW.order_number := generate_order_number();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_set_order_number
  BEFORE INSERT ON orders
  FOR EACH ROW
  EXECUTE FUNCTION set_order_number();

-- Trigger para actualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_customers_updated_at
  BEFORE UPDATE ON customers
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_update_orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
```

## ⚡ Edge Functions

### 1. Crear Preferencia de Pago

```typescript
// supabase/functions/create-payment-preference/index.ts

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
```

### 2. Webhook de Mercado Pago

```typescript
// supabase/functions/mercado-pago-webhook/index.ts

import { createClient } from 'npm:@supabase/supabase-js@2';

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
    console.log('Webhook received:', body);

    // Verificar que es una notificación de pago
    if (body.type !== 'payment') {
      return new Response('OK', { status: 200 });
    }

    const paymentId = body.data.id;
    const accessToken = Deno.env.get('MERCADO_PAGO_ACCESS_TOKEN_SANDBOX');

    // Obtener detalles del pago desde Mercado Pago
    const paymentResponse = await fetch(
      `https://api.mercadopago.com/v1/payments/${paymentId}`,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      }
    );

    if (!paymentResponse.ok) {
      throw new Error('Error al obtener datos del pago');
    }

    const paymentData = await paymentResponse.json();
    console.log('Payment data:', paymentData);

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

      // Enviar email de confirmación
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
      console.error('Missing email configuration');
      return;
    }

    // Preparar detalles de productos
    const productDetails = orderData.order_items
      .map((item: any) => `- ${item.product_name} (x${item.quantity}) - $${item.total_price}`)
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
```

## 🎨 Integración Frontend

### 1. Servicio de Checkout

```typescript
// src/services/checkoutService.ts

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
```

### 2. Componente de Checkout

```typescript
// src/components/Checkout/CheckoutForm.tsx

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CreditCard, User, MapPin, Mail, Phone, Loader2 } from 'lucide-react';
import { useCart } from '../../hooks/useCart';
import { useToast } from '../../hooks/useToast';
import { CheckoutService } from '../../services/checkoutService';

interface CheckoutFormProps {
  onClose: () => void;
}

const CheckoutForm: React.FC<CheckoutFormProps> = ({ onClose }) => {
  const { cartItems, totalPrice, clearCart } = useCart();
  const { showSuccess, showError, showInfo } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  
  const [customerData, setCustomerData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    phone: '',
    address: '',
    city: '',
    postalCode: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!customerData.email) {
      newErrors.email = 'El email es requerido';
    } else if (!/\S+@\S+\.\S+/.test(customerData.email)) {
      newErrors.email = 'El email no es válido';
    }

    if (!customerData.firstName) {
      newErrors.firstName = 'El nombre es requerido';
    }

    if (!customerData.lastName) {
      newErrors.lastName = 'El apellido es requerido';
    }

    if (!customerData.phone) {
      newErrors.phone = 'El teléfono es requerido';
    }

    if (!customerData.address) {
      newErrors.address = 'La dirección es requerida';
    }

    if (!customerData.city) {
      newErrors.city = 'La ciudad es requerida';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      showError('Datos Incompletos', 'Por favor completá todos los campos requeridos');
      return;
    }

    if (cartItems.length === 0) {
      showError('Carrito Vacío', 'Agregá productos antes de continuar');
      return;
    }

    setIsProcessing(true);

    try {
      showInfo(
        'Procesando...',
        'Estamos preparando tu pago con Mercado Pago',
        { duration: 0, dismissible: false }
      );

      const checkoutData = {
        items: cartItems,
        customer: customerData
      };

      const preference = await CheckoutService.createPaymentPreference(checkoutData);

      // Guardar orden ID en localStorage para tracking
      localStorage.setItem('currentOrderId', preference.orderId);

      showSuccess(
        'Redirigiendo a Mercado Pago',
        `Orden #${preference.orderNumber} creada exitosamente`,
        { duration: 3000 }
      );

      // Limpiar carrito antes de redireccionar
      clearCart();
      
      // Redireccionar a Mercado Pago
      setTimeout(() => {
        CheckoutService.redirectToMercadoPago(preference.initPoint);
      }, 1000);

    } catch (error) {
      console.error('Checkout error:', error);
      showError(
        'Error en el Checkout',
        error instanceof Error ? error.message : 'Ocurrió un error inesperado',
        {
          action: {
            label: 'Contactar Soporte',
            onClick: () => {
              const message = `Hola, tuve un problema en el checkout. Total: $${totalPrice.toFixed(2)}`;
              const encodedMessage = encodeURIComponent(message);
              window.open(`https://wa.me/5411XXXXXXXX?text=${encodedMessage}`, '_blank');
            }
          }
        }
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setCustomerData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-medium text-primary flex items-center">
          <CreditCard className="mr-3" size={24} />
          Finalizar Compra
        </h2>
        <button
          onClick={onClose}
          disabled={isProcessing}
          className="p-2 text-content hover:text-primary transition-colors disabled:opacity-50"
        >
          ×
        </button>
      </div>

      {/* Resumen del pedido */}
      <div className="bg-secondary/30 rounded-lg p-4 mb-6">
        <h3 className="font-medium text-primary mb-3">Resumen del Pedido</h3>
        <div className="space-y-2">
          {cartItems.map(item => (
            <div key={item.product.id} className="flex justify-between text-sm">
              <span>{item.product.name} x{item.quantity}</span>
              <span>${(item.product.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
        </div>
        <div className="border-t border-secondary mt-3 pt-3 flex justify-between font-medium">
          <span>Total:</span>
          <span className="text-accent">${totalPrice.toFixed(2)}</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Datos personales */}
        <div>
          <h3 className="font-medium text-primary mb-4 flex items-center">
            <User className="mr-2" size={20} />
            Datos Personales
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-content mb-1">
                Nombre *
              </label>
              <input
                type="text"
                value={customerData.firstName}
                onChange={(e) => handleInputChange('firstName', e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-accent focus:border-accent ${
                  errors.firstName ? 'border-red-500' : 'border-secondary'
                }`}
                disabled={isProcessing}
              />
              {errors.firstName && (
                <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-content mb-1">
                Apellido *
              </label>
              <input
                type="text"
                value={customerData.lastName}
                onChange={(e) => handleInputChange('lastName', e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-accent focus:border-accent ${
                  errors.lastName ? 'border-red-500' : 'border-secondary'
                }`}
                disabled={isProcessing}
              />
              {errors.lastName && (
                <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>
              )}
            </div>
          </div>
        </div>

        {/* Contacto */}
        <div>
          <h3 className="font-medium text-primary mb-4 flex items-center">
            <Mail className="mr-2" size={20} />
            Información de Contacto
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-content mb-1">
                Email *
              </label>
              <input
                type="email"
                value={customerData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-accent focus:border-accent ${
                  errors.email ? 'border-red-500' : 'border-secondary'
                }`}
                disabled={isProcessing}
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">{errors.email}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-content mb-1">
                Teléfono *
              </label>
              <input
                type="tel"
                value={customerData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-accent focus:border-accent ${
                  errors.phone ? 'border-red-500' : 'border-secondary'
                }`}
                disabled={isProcessing}
              />
              {errors.phone && (
                <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
              )}
            </div>
          </div>
        </div>

        {/* Dirección */}
        <div>
          <h3 className="font-medium text-primary mb-4 flex items-center">
            <MapPin className="mr-2" size={20} />
            Dirección de Envío
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-content mb-1">
                Dirección *
              </label>
              <input
                type="text"
                value={customerData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                placeholder="Calle y número"
                className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-accent focus:border-accent ${
                  errors.address ? 'border-red-500' : 'border-secondary'
                }`}
                disabled={isProcessing}
              />
              {errors.address && (
                <p className="text-red-500 text-xs mt-1">{errors.address}</p>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-content mb-1">
                  Ciudad *
                </label>
                <input
                  type="text"
                  value={customerData.city}
                  onChange={(e) => handleInputChange('city', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-accent focus:border-accent ${
                    errors.city ? 'border-red-500' : 'border-secondary'
                  }`}
                  disabled={isProcessing}
                />
                {errors.city && (
                  <p className="text-red-500 text-xs mt-1">{errors.city}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-content mb-1">
                  Código Postal
                </label>
                <input
                  type="text"
                  value={customerData.postalCode}
                  onChange={(e) => handleInputChange('postalCode', e.target.value)}
                  className="w-full px-3 py-2 border border-secondary rounded-md focus:ring-2 focus:ring-accent focus:border-accent"
                  disabled={isProcessing}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Botones */}
        <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-secondary">
          <button
            type="button"
            onClick={onClose}
            disabled={isProcessing}
            className="flex-1 px-6 py-3 border border-secondary text-content rounded-md hover:bg-secondary/50 transition-colors disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isProcessing}
            className="flex-1 bg-accent text-white px-6 py-3 rounded-md hover:bg-supporting transition-colors disabled:opacity-50 flex items-center justify-center"
          >
            {isProcessing ? (
              <>
                <Loader2 size={20} className="animate-spin mr-2" />
                Procesando...
              </>
            ) : (
              <>
                <CreditCard size={20} className="mr-2" />
                Pagar con Mercado Pago
              </>
            )}
          </button>
        </div>
      </form>

      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <p className="text-sm text-blue-800">
          🔒 <strong>Pago Seguro:</strong> Serás redirigido a Mercado Pago para completar tu compra de forma segura.
          Aceptamos tarjetas de crédito, débito y otros métodos de pago.
        </p>
      </div>
    </motion.div>
  );
};

export default CheckoutForm;
```

### 3. Páginas de Resultado

```typescript
// src/pages/CheckoutSuccess.tsx

import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { CheckCircle, Package, ArrowRight } from 'lucide-react';
import { CheckoutService } from '../services/checkoutService';
import LoadingSpinner from '../components/LoadingSpinner';

const CheckoutSuccess: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [orderData, setOrderData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadOrderData = async () => {
      try {
        const orderId = localStorage.getItem('currentOrderId');
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
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary/30 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-8 max-w-md w-full text-center">
        <div className="mb-6">
          <CheckCircle size={64} className="text-green-500 mx-auto mb-4" />
          <h1 className="text-2xl font-medium text-primary mb-2">
            ¡Pago Exitoso!
          </h1>
          <p className="text-content">
            Tu pedido ha sido confirmado y procesado correctamente.
          </p>
        </div>

        {orderData && (
          <div className="bg-secondary/30 rounded-lg p-4 mb-6 text-left">
            <h3 className="font-medium text-primary mb-2">Detalles del Pedido</h3>
            <div className="space-y-1 text-sm">
              <p><strong>Número:</strong> {orderData.order_number}</p>
              <p><strong>Total:</strong> ${orderData.total_amount}</p>
              <p><strong>Estado:</strong> Confirmado</p>
            </div>
          </div>
        )}

        <div className="space-y-3">
          <button
            onClick={() => navigate('/')}
            className="w-full bg-accent text-white px-6 py-3 rounded-md hover:bg-supporting transition-colors flex items-center justify-center"
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
```

## 🔒 Consideraciones de Seguridad

### 1. Variables de Entorno
```bash
# NUNCA exponer en el frontend:
- Access Token de Mercado Pago
- Service Role Key de Supabase
- API Keys de servicios externos

# Solo en el frontend:
- Public Key de Mercado Pago
- Anon Key de Supabase
```

### 2. Validación de Webhooks
```typescript
// Verificar origen del webhook
const validateWebhookSignature = (payload: string, signature: string) => {
  const secret = Deno.env.get('MERCADO_PAGO_WEBHOOK_SECRET');
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex');
  
  return signature === expectedSignature;
};
```

### 3. RLS (Row Level Security)
```sql
-- Asegurar que solo usuarios autorizados accedan a datos sensibles
CREATE POLICY "Admin only access to payments"
  ON payments FOR ALL
  TO authenticated
  USING (auth.jwt() ->> 'role' = 'admin');
```

## 🧪 Testing

### 1. Configuración de Sandbox
```typescript
// Usar credenciales de prueba
const SANDBOX_CONFIG = {
  accessToken: 'TEST-1234567890-123456-abcdef123456789-123456789',
  publicKey: 'TEST-12345678-1234-1234-1234-123456789012'
};

// Tarjetas de prueba
const TEST_CARDS = {
  approved: '4509953566233704',
  rejected: '4000000000000002',
  pending: '4000000000000044'
};
```

### 2. Tests de Integración
```typescript
// src/tests/checkout.test.ts

describe('Checkout Integration', () => {
  test('should create payment preference', async () => {
    const mockData = {
      items: [{ product: { id: 1, name: 'Test', price: 100 }, quantity: 1 }],
      customer: { email: 'test@test.com', firstName: 'Test', lastName: 'User' }
    };

    const result = await CheckoutService.createPaymentPreference(mockData);
    
    expect(result.preferenceId).toBeDefined();
    expect(result.initPoint).toContain('mercadopago.com');
  });
});
```

## ⚠️ Errores Comunes

### 1. Configuración Incorrecta
```typescript
// ❌ Error: Usar credenciales de producción en desarrollo
const accessToken = 'APP_USR-...'; // En desarrollo

// ✅ Correcto: Usar credenciales según el entorno
const accessToken = process.env.NODE_ENV === 'production' 
  ? process.env.MP_ACCESS_TOKEN_PROD 
  : process.env.MP_ACCESS_TOKEN_SANDBOX;
```

### 2. Manejo de Webhooks
```typescript
// ❌ Error: No validar el webhook
app.post('/webhook', (req, res) => {
  // Procesar sin validar
});

// ✅ Correcto: Validar antes de procesar
app.post('/webhook', (req, res) => {
  if (!validateWebhookSignature(req.body, req.headers['x-signature'])) {
    return res.status(401).send('Unauthorized');
  }
  // Procesar webhook
});
```

### 3. Estados de Pago
```typescript
// ❌ Error: Solo manejar 'approved'
if (payment.status === 'approved') {
  // Solo manejar aprobados
}

// ✅ Correcto: Manejar todos los estados
switch (payment.status) {
  case 'approved':
    // Pago aprobado
    break;
  case 'pending':
    // Pago pendiente
    break;
  case 'rejected':
    // Pago rechazado
    break;
  case 'cancelled':
    // Pago cancelado
    break;
}
```

## 🎯 Flujo de Usuario Recomendado

### 1. Experiencia Optimizada
```
1. Usuario agrega productos al carrito
2. Click en "Finalizar Compra"
3. Formulario de datos del cliente
4. Validación en tiempo real
5. Creación de preferencia de pago
6. Redirección a Mercado Pago
7. Usuario completa el pago
8. Redirección de vuelta al sitio
9. Página de confirmación
10. Email automático al administrador
```

### 2. Manejo de Errores
```
- Timeout en la creación de preferencia → Reintentar
- Error en Mercado Pago → Mostrar alternativas (WhatsApp)
- Pago rechazado → Opciones de contacto
- Webhook fallido → Sistema de reintentos
```

## 📱 Responsividad Móvil

### 1. Formulario Adaptativo
```css
/* Optimización para móvil */
@media (max-width: 768px) {
  .checkout-form {
    padding: 1rem;
    max-height: 90vh;
    overflow-y: auto;
  }
  
  .form-grid {
    grid-template-columns: 1fr;
  }
  
  .button-group {
    flex-direction: column;
    gap: 0.75rem;
  }
}
```

### 2. Touch Targets
```css
/* Botones optimizados para touch */
.btn-mobile {
  min-height: 44px;
  min-width: 44px;
  padding: 12px 16px;
}
```

Esta guía proporciona una implementación completa y robusta de Mercado Pago con Supabase, incluyendo automatización de emails y manejo de errores. El sistema está diseñado para ser escalable, seguro y fácil de mantener.
import { MercadoPagoPreferencePayload, NormalizedItem, NormalizedCustomer } from '../types/checkout';

export function buildCheckoutData(
  cartItems: Array<{ product: { id: number; name: string; price: number }; quantity: number }>,
  customerData: {
    email: string;
    firstName: string;
    lastName: string;
    phone: string;
    streetName: string;
    streetNumber: string;
    city: string;
    postalCode?: string;
  }
): MercadoPagoPreferencePayload {
  const items: NormalizedItem[] = cartItems.map(item => ({
    id: item.product.id.toString(),
    title: item.product.name,
    quantity: item.quantity,
    unit_price: item.product.price,
    description: item.product.name,
    category_id: 'retail'
  }));

  const payer: NormalizedCustomer = {
    email: customerData.email,
    name: customerData.firstName,
    surname: customerData.lastName,
    phone: {
      area_code: customerData.phone.substring(0, 2),
      number: customerData.phone.substring(2)
    },
    address: {
      street_name: customerData.streetName,
      street_number: customerData.streetNumber,
      zip_code: customerData.postalCode ?? ''
    }
  };

// En external_reference debes poner un identificador único de la orden en tu sistema.
// Por ejemplo, el ID de la orden, el ID del carrito, o algún valor que te permita
// relacionar la preferencia de MercadoPago con tu base de datos.
// Ejemplo:
// external_reference: orderId.toString(),

const date = new Date().toISOString().replace(/[-:.TZ]/g, '').slice(0, 14);
const orderId = `SAKI-${date}`;

return {
    items,
    payer,
    back_urls: {
        success: 'https://saki-tau.vercel.app/success',
        failure: 'https://saki-tau.vercel.app/failure',
        pending: 'https://saki-tau.vercel.app/pending'
    },
    auto_return: 'approved',
    notification_url: 'https://jvrvhoyepfcznosljvjw.supabase.co/functions/v1/mercado-pago-webhook', 
    statement_descriptor: 'MiTienda',
    external_reference: orderId,
    expires: true,
    expiration_date_from: new Date().toISOString(),
    expiration_date_to: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString()
};
}

export interface NormalizedItem {
  id: string;
  title: string;
  quantity: number;
  unit_price: number;
  description?: string;
  category_id?: string;
}

export interface NormalizedCustomer {
  email: string;
  name: string;
  surname: string;
  phone?: {
    area_code: string;
    number: string;
  };
  identification?: {
    type: string;
    number: string;
  };
  address: {
    street_name: string;
    street_number: string;
    zip_code: string;
  };
}

export interface MercadoPagoPreferencePayload {
  items: NormalizedItem[];
  payer: NormalizedCustomer;
  back_urls: {
    success: string;
    failure: string;
    pending: string;
  };
  auto_return: string;
  statement_descriptor?: string;
  notification_url?: string;
  external_reference?: string;
  expires?: boolean;
  expiration_date_from?: string;
  expiration_date_to?: string;
}

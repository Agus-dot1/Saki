import { Product } from ".";

// Para frontend / lógica interna
export interface CartItem {
  product: Product;
  quantity: number;
  
}

// Para enviar al backend (lo que espera Supabase + Mercado Pago)
export interface BackendCheckoutItem {
  product: {
    id: number;
    name: string;
    price: number;
  };
  quantity: number;
}

export interface BackendCheckoutData {
  items: BackendCheckoutItem[];
  customer: {
    email: string;
    firstName: string;
    lastName: string;
    phone?: PhoneInfo;
    address?: AddressInfo;
  };
}

interface PhoneInfo {
    areaCode: string;
    number: string;
}

interface AddressInfo {
    streetName: string;
    streetNumber: string;
    city: string;
    postalCode: string;
}
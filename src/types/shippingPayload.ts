interface ShippingOption {
  id: string;
  name: string;
  cost: number;
  estimatedDelivery: string;
  description: string;
}

export interface ShippingPayload {
  method: 'shipping' | 'pickup' | null;
  option: ShippingOption | null;
  postalCode?: string;
}
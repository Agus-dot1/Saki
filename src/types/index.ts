export interface Product {
  id: number;
  name: string;
  description: string;
  shortDescription: string;
  price: number;
  contents: string[];
  images: string[];
  detailedDescription: string;
  stock?: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Toast {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  message: string;
  duration?: number;
  dismissible?: boolean;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export interface CheckoutProgress {
  step: 'cart' | 'shipping' | 'payment' | 'confirmation';
  completed: boolean;
}

export interface OrderStatus {
  orderId: string;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered';
  estimatedDelivery?: string;
  trackingNumber?: string;
}
export interface ProductItemOption {
  name: string;
  quantity?: number;
  colorOptions?: string[]; 
  sizeOptions?: string[];  
}

export interface Product {
  id: number;
  name: string;
  description: string;
  shortDescription: string;
  price: number;
  contents: string[];
  images: string[];
  detailedDescription: string;
  stock: number;
  keyBenefits: string[];
  featuredIngredients: string[];
  discountPercentage: number;
  oldPrice: number;
  sizeGuide?: string;
  colors?: string[];
  sizes?: string[];
  items?: ProductItemOption[];
  modelNumber?: number; 
  selectedSize?: string;
}

export interface SelectedKitItem {
  name: string;
  quantity?: number;
  color?: string;
  size?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedItems?: SelectedKitItem[];
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



export interface NormalizedItem {
  id: number;
  product_name: string;
  price: number;
  quantity: number;
}

export interface CheckoutData {
  items: NormalizedItem[];
  customer: {
    email: string;
    firstName: string;
    lastName: string;
    phone: string;
    address: string;
    city: string;
    postalCode: string;
  };
}
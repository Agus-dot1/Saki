export interface JewelryItem {
  id: number;
  name: string;
  category: 'rings' | 'necklaces' | 'bracelets' | 'earrings';
  price: number;
  oldPrice?: number;
  discountPercentage?: number;
  images: string[];
  description: string;
  detailedDescription: string;
  material: string;
  weight?: string;
  dimensions?: string;
  availableSizes?: string[];
  stock: number;
  careInstructions: string[];
  features: string[];
  isCustomizable?: boolean;
  gemstones?: string[];
  plating?: string;
  warranty?: string;
}

export interface RingSize {
  us: string;
  uk: string;
  eu: string;
  circumference: string;
  diameter: string;
}

export interface SizeGuideStep {
  id: number;
  title: string;
  description: string;
  image?: string;
  tip?: string;
}
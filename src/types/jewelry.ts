export interface JewelryItem {
  id: number;
  name: string;
  category: 'anillo' | 'pulsera';
  price: number;
  oldPrice?: number;
  discountPercentage?: number;
  coverImage: string; 
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
  contents?: string[]; 
  keyBenefits?: string[]; 
  featuredIngredients?: string[];
  modelNumber?: number; 
  selectedSize?: string; 
  isGrid?: boolean; 
  models?: string[]; 
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
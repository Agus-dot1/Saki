import supabase from '../utils/supabase';
import { JewelryItem } from '../types/jewelry';

// Database interface that matches your Supabase table structure
interface JewelryDbRow {
  id: number;
  name: string;
  category: string;
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
  created_at?: string;
  updated_at?: string;
  user_id?: string;
  isGrid?: boolean;
  models?: string[];
}

// Function to map database row to JewelryItem interface
function mapDbRowToJewelryItem(row: JewelryDbRow): JewelryItem {
  return {
    id: typeof row.id === 'string' ? Number(row.id) : row.id,
    name: row.name,
    category: row.category as 'anillo' | 'pulsera',
    price: Number(row.price),
    oldPrice: row.oldPrice ? Number(row.oldPrice) : undefined,
    discountPercentage: row.discountPercentage || undefined,
    coverImage: row.coverImage,
    images: row.images || [],
    description: row.description,
    detailedDescription: row.detailedDescription,
    material: row.material,
    weight: row.weight,
    dimensions: row.dimensions,
    availableSizes: row.availableSizes || [],
    stock: row.stock,
    careInstructions: row.careInstructions || [],
    features: row.features || [],
    isCustomizable: row.isCustomizable || false,
    gemstones: row.gemstones || [],
    plating: row.plating,
    warranty: row.warranty,
    contents: row.contents || [],
    keyBenefits: row.keyBenefits || [],
    featuredIngredients: row.featuredIngredients || [],
    isGrid: row.isGrid ?? false,
    models: row.models ?? [],
  };
}

export async function fetchJewelryItems(): Promise<JewelryItem[]> {
  try {
    
    const { data, error } = await supabase
      .from('jewelry')
      .select('*')
      .order('id', { ascending: true });

    if (error) {
      console.error('Supabase error fetching jewelry:', error);
      throw new Error(`Failed to fetch jewelry items: ${error.message}`);
    }
    
    if (!data || data.length === 0) {
      console.log('No jewelry items found in database');
      return [];
    }

    // Map the database rows to JewelryItem objects
    const mappedItems = data.map(mapDbRowToJewelryItem);
    
    return mappedItems;
  } catch (error) {
    console.error('Error in fetchJewelryItems:', error);
    throw error;
  }
}

export async function fetchJewelryById(id: number): Promise<JewelryItem | null> {
  try {
    const { data, error } = await supabase
      .from('jewelry')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching jewelry item:', error);
      throw new Error(`Failed to fetch jewelry item: ${error.message}`);
    }

    return data ? mapDbRowToJewelryItem(data) : null;
  } catch (error) {
    console.error('Error in fetchJewelryById:', error);
    throw error;
  }
}

export async function fetchJewelryByCategory(category: string): Promise<JewelryItem[]> {
  try {
    const { data, error } = await supabase
      .from('jewelry')
      .select('*')
      .eq('category', category)
      .order('id', { ascending: true });

    if (error) {
      console.error('Error fetching jewelry by category:', error);
      throw new Error(`Failed to fetch jewelry by category: ${error.message}`);
    }

    return data ? data.map(mapDbRowToJewelryItem) : [];
  } catch (error) {
    console.error('Error in fetchJewelryByCategory:', error);
    throw error;
  }
}
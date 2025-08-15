import supabase from '../utils/supabase';

// Database interface that matches your Supabase table structure
interface KitBuilderDbRow {
  id: number | string | BigInt;
  name: string;
  image: string;
  description: string;
  category: string;
  benefits: string[];
  price: number | string | BigInt | null;
  stock: number | string | BigInt | null;
  created_at?: string;
  updated_at?: string;
}

// KitItem interface for the application
export interface KitItem {
  id: number;
  name: string;
  price: number;
  image: string;
  category: 'limpieza' | 'hidratacion' | 'tratamiento' | 'accesorios';
  description: string;
  benefits: string[];
  stock: number;
}

// Function to map database row to KitItem interface
function mapDbRowToKitItem(row: KitBuilderDbRow): KitItem {
  return {
    id: typeof row.id === 'string' || typeof row.id === 'bigint' ? Number(row.id) : row.id,
    name: row.name,
    price: row.price !== undefined && row.price !== null ? Number(row.price) : 0,
    image: row.image,
    category: row.category as 'limpieza' | 'hidratacion' | 'tratamiento' | 'accesorios',
    description: row.description,
    benefits: row.benefits || [],
    stock: row.stock !== undefined && row.stock !== null ? Number(row.stock) : 0,
  };
}

export async function fetchKitBuilderItems(): Promise<KitItem[]> {
  try {
    console.log('Fetching kit builder items from Supabase...');
    const { data, error } = await supabase
      .from('builder_item')
      .select('*')
      .order('category', { ascending: true })
      .order('name', { ascending: true });

    console.log('Supabase response:', { data, error });

    if (error) {
      console.error('Supabase error fetching kit builder items:', error);
      throw new Error(`Failed to fetch kit builder items: ${error.message}`);
    }
    
    if (!data || data.length === 0) {
      console.log('No kit builder items found in database');
      return [];
    }

    console.log(`Found ${data.length} items in database`);

    // Map the database rows to KitItem objects
    const mappedItems = data.map((row, index) => {
      console.log(`Mapping item ${index + 1}:`, row);
      return mapDbRowToKitItem(row);
    });
    
    console.log('Mapped items:', mappedItems);
    return mappedItems;
  } catch (error) {
    console.error('Error in fetchKitBuilderItems:', error);
    throw error;
  }
}

export async function fetchKitBuilderItemById(id: number): Promise<KitItem | null> {
  try {
    const { data, error } = await supabase
      .from('builder_item')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching kit builder item:', error);
      throw new Error(`Failed to fetch kit builder item: ${error.message}`);
    }

    return data ? mapDbRowToKitItem(data) : null;
  } catch (error) {
    console.error('Error in fetchKitBuilderItemById:', error);
    throw error;
  }
}

export async function fetchKitBuilderItemsByCategory(category: string): Promise<KitItem[]> {
  try {
    const { data, error } = await supabase
      .from('builder_item')
      .select('*')
      .eq('category', category)
      .order('name', { ascending: true });

    if (error) {
      console.error('Error fetching kit builder items by category:', error);
      throw new Error(`Failed to fetch kit builder items by category: ${error.message}`);
    }

    return data ? data.map(mapDbRowToKitItem) : [];
  } catch (error) {
    console.error('Error in fetchKitBuilderItemsByCategory:', error);
    throw error;
  }
}
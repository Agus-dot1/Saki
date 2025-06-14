import supabase from '../utils/supabase';
import { Product } from '../types';

export async function fetchProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('id', { ascending: true });

  if (error) {
    console.error('Error fetching products:', error.message);
    throw new Error('Failed to fetch products');
  }

  return data || [];
}

export async function fetchProductById(id: number): Promise<Product | null> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching product:', error.message);
    throw new Error('Failed to fetch product');
  }

  return data;
}
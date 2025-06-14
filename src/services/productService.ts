import supabase from '../utils/supabase';
import { Product } from '../types';
import { products } from '../data/products';

export async function fetchProducts(): Promise<Product[]> {
  // If Supabase is not configured, return mock data
  if (!supabase) {
    console.log('Supabase not configured, using mock data');
    return products;
  }

  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('id', { ascending: true });

    if (error) {
      console.error('Error fetching products:', error.message);
      // Fallback to mock data on error
      return products;
    }

    return data || products;
  } catch (error) {
    console.error('Error fetching products:', error);
    // Fallback to mock data on error
    return products;
  }
}

export async function fetchProductById(id: number): Promise<Product | null> {
  // If Supabase is not configured, return mock data
  if (!supabase) {
    console.log('Supabase not configured, using mock data');
    return products.find(p => p.id === id) || null;
  }

  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching product:', error.message);
      // Fallback to mock data on error
      return products.find(p => p.id === id) || null;
    }

    return data;
  } catch (error) {
    console.error('Error fetching product:', error);
    // Fallback to mock data on error
    return products.find(p => p.id === id) || null;
  }
}
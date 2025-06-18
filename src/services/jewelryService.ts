import supabase from '../utils/supabase';
import { JewelryItem } from '../types/jewelry';

export async function fetchJewelryItems(): Promise<JewelryItem[]> {
  try {
    console.log('Fetching jewelry items from Supabase...');
    
    const { data, error } = await supabase
      .from('jewelry')
      .select('*')
      .order('id', { ascending: true });

    if (error) {
      console.error('Supabase error fetching jewelry:', error);
      throw new Error(`Failed to fetch jewelry items: ${error.message}`);
    }

    console.log('Successfully fetched jewelry data:', data);
    return data || [];
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

    return data;
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

    return data || [];
  } catch (error) {
    console.error('Error in fetchJewelryByCategory:', error);
    throw error;
  }
}
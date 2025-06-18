@ -0,0 +1,33 @@
import supabase from '../utils/supabase';
import { JewelryItem } from '../types/jewelry';

export async function fetchJewelryItems(): Promise<JewelryItem[]> {
  console.log('Fetching jewelry items...');
  const { data, error } = await supabase
    .from('jewelry')
    .select('*')
    .order('id', { ascending: true });

  if (error) {
    console.error('Error fetching jewelry:', error);
    throw new Error(`Failed to fetch jewelry items: ${error.message}`);
  }

  console.log('Fetched jewelry data:', data);
  return data || [];
}

export async function fetchJewelryById(id: number): Promise<JewelryItem | null> {
  const { data, error } = await supabase
    .from('jewelry')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching jewelry item:', error.message);
    throw new Error('Failed to fetch jewelry item');
  }

  return data;
}
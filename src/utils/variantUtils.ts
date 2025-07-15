import { CartItem, Product } from '../types';

export interface VariantDetails {
  model?: number;
  size?: string;
  color?: string;
  tone?: string;
}

export interface NormalizedCartItem {
  product: {
    id: number;
    name: string;
    price: number;
    description: string;
    category_id?: string;
    variant_details: VariantDetails;
  };
  quantity: number;
  variantLabel?: string;
  kitItems?: Array<{
    name: string;
    quantity?: number;
    color?: string;
    size?: string;
  }>;
}

/**
 * Builds a human-readable variant label from product variant data
 */
export function buildVariantLabel(item: CartItem): string | undefined {
  const variantParts: string[] = [];
  
  const variantFields = {
    modelNumber: 'Modelo',
    selectedSize: 'Talle', 
    selectedColor: null, // Direct value without prefix
    selectedTone: 'Tono'
  };

  Object.entries(variantFields).forEach(([field, prefix]) => {
    const value = item.product[field as keyof Product];
    if (value) {
      variantParts.push(
        prefix ? `${prefix}: ${value}` : String(value)
      );
    }
  });

  return variantParts.length > 0 ? variantParts.join(' | ') : undefined;
}

/**
 * Extracts variant details from a product
 */
export function extractVariantDetails(product: Product): VariantDetails {
  return {
    model: product.modelNumber,
    size: product.selectedSize,
    color: product.selectedColor,
    tone: product.selectedTone
  };
}

/**
 * Normalizes cart items with variant data for checkout processing
 */
export function normalizeCartItems(cartItems: CartItem[]): NormalizedCartItem[] {
  return cartItems.map((item) => ({
    product: {
      id: item.product.id,
      name: item.product.name,
      price: item.product.price,
      description: item.product.description,
      category_id: item.product.categoryId,
      variant_details: extractVariantDetails(item.product)
    },
    quantity: item.quantity,
    variantLabel: buildVariantLabel(item),
    kitItems: item.selectedItems ?? item.product.items
  }));
}

/**
 * Formats variant information for display in emails
 */
export function formatVariantForEmail(variantDetails: VariantDetails): string {
  const parts: string[] = [];
  
  if (variantDetails.model) {
    parts.push(`Modelo: ${variantDetails.model}`);
  }
  if (variantDetails.size) {
    parts.push(`Talle: ${variantDetails.size}`);
  }
  if (variantDetails.color) {
    parts.push(variantDetails.color);
  }
  if (variantDetails.tone) {
    parts.push(`Tono: ${variantDetails.tone}`);
  }
  
  return parts.length > 0 ? ` (${parts.join(' | ')})` : '';
}

/**
 * Creates a unique identifier for cart items including variants
 */
export function createCartItemKey(item: CartItem): string {
  const baseKey = `${item.product.id}`;
  const variantKey = [
    item.product.modelNumber,
    item.product.selectedSize,
    item.product.selectedColor,
    item.product.selectedTone
  ].filter(Boolean).join('-');
  
  const kitItemsKey = item.selectedItems 
    ? item.selectedItems.map(ki => `${ki.name}-${ki.color || ''}-${ki.size || ''}`).join('_')
    : '';
  
  return [baseKey, variantKey, kitItemsKey].filter(Boolean).join('|');
}
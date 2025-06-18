import { JewelryItem } from '../types/jewelry';
import { Product } from '../types';

export const mapJewelryToProduct = (jewelry: JewelryItem): Product => {
  return {
    ...jewelry,
    shortDescription: jewelry.description,
    contents: jewelry.contents || [],
    keyBenefits: jewelry.keyBenefits || [],
    featuredIngredients: jewelry.featuredIngredients || [],
    discountPercentage: jewelry.discountPercentage || 0,
    oldPrice: jewelry.oldPrice || jewelry.price,
    modelNumber: jewelry.modelNumber, // Keep the modelNumber
    selectedSize: jewelry.selectedSize, // Keep the selectedSize
  };
};
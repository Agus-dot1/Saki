import React, { useCallback } from 'react';
import ProductCard from './ProductCard';
import { Product } from '../../types';

interface MemoizedProductCardProps {
  product: Product;
  onProductSelect: (product: Product) => void;
}

const MemoizedProductCard: React.FC<MemoizedProductCardProps> = ({ product, onProductSelect }) => {
  const handleSelect = useCallback(() => {
    onProductSelect(product);
  }, [onProductSelect, product]);

  return <ProductCard product={product} onClick={handleSelect} />;
};

export default React.memo(MemoizedProductCard);
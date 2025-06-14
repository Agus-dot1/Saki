import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import ProductCard from './ProductCard';
import LoadingSpinner from '../LoadingSpinner';
import { Product } from '../../types';
import { Package } from 'lucide-react';
import { products } from '../../data/products';

interface ProductsSectionProps {
  onProductSelect: (product: Product) => void;
}

const ProductsSection: React.FC<ProductsSectionProps> = ({ 
  onProductSelect
}) => {
  const [productList, setProductList] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  // Use mock data for now
  useEffect(() => {
    const timer = setTimeout(() => {
      setProductList(products);
      setIsLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
    },
  };

  if (isLoading) {
    return (
      <section id="products" className="px-4 py-12 bg-white lg:px-6 lg:py-16">
        <div className="mx-auto max-w-7xl">
          <LoadingSpinner />
        </div>
      </section>
    );
  }

  return (
    <section id="products" className="px-4 py-12 bg-slate-50 lg:px-6 lg:py-16" ref={ref}>
      <motion.div
        className="max-w-6xl mx-auto"
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
        variants={containerVariants}
      >
        <motion.div className="mb-12 text-center lg:mb-16" variants={itemVariants}>
          <div className="flex items-center justify-center gap-2 mb-4">
            <Package className="text-accent" size={24} />
            <span className="text-base font-medium lg:text-lg">Kits de calidad</span>
          </div>
          <h2 className="mb-4 text-3xl font-light lg:text-4xl text-primary">
            Nuestros productos
          </h2>
          <p className="max-w-2xl mx-auto text-base leading-relaxed lg:text-lg text-content">
            Cada kit combina productos esenciales que potencian tu rutina diaria y te ayudan a lograr una piel radiante y saludable.
          </p>
        </motion.div>
        
        {productList.length === 0 ? (
          <motion.div 
            className="py-12 text-center"
            variants={itemVariants}
          >
            <p className="mb-4 text-base lg:text-lg text-content">No hay productos disponibles en este momento.</p>
          </motion.div>
        ) : (
          <motion.div 
            className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-8"
            variants={containerVariants}
          >
            {productList.map(product => (
              <motion.div key={product.id} variants={itemVariants}>
                <ProductCard 
                  product={product}
                  onClick={() => onProductSelect(product)}
                />
              </motion.div>
            ))}
          </motion.div>
        )}
      </motion.div>
    </section>
  );
}

export default ProductsSection;
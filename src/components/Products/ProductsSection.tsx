import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import ProductCard from './ProductCard';
import LoadingSpinner from '../LoadingSpinner';
import { Product } from '../../types';

interface ProductsSectionProps {
  onProductSelect: (product: Product) => void;
  products: Product[];
  searchQuery?: string;
  activeFilters?: string[];
}

const ProductsSection: React.FC<ProductsSectionProps> = ({ 
  onProductSelect, 
  products, 
  searchQuery = '', 
  activeFilters = [] 
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  // Simulate loading state
  React.useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000);
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
      <section id="products" className="py-16 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <LoadingSpinner />
        </div>
      </section>
    );
  }

  const hasActiveSearch = searchQuery || activeFilters.length > 0;

  return (
    <section id="products" className="py-16 px-6 bg-white" ref={ref}>
      <motion.div
        className="max-w-7xl mx-auto"
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
        variants={containerVariants}
      >
        <motion.h2 
          className="text-3xl md:text-4xl font-medium text-primary mb-3"
          variants={itemVariants}
        >
          {hasActiveSearch ? 'Resultados de Búsqueda' : 'Nuestros Productos'}
        </motion.h2>
        <motion.p 
          className="text-content text-lg mb-12 max-w-2xl"
          variants={itemVariants}
        >
          {hasActiveSearch 
            ? `Encontramos ${products.length} producto${products.length !== 1 ? 's' : ''} que coincide${products.length !== 1 ? 'n' : ''} con tu búsqueda.`
            : 'Descubrí nuestras colecciones de cuidado de la piel artesanales, cada una diseñada para abordar necesidades específicas de la piel con los mejores ingredientes naturales de Argentina.'
          }
        </motion.p>
        
        {/* Active filters display */}
        {activeFilters.length > 0 && (
          <motion.div 
            className="mb-8 flex flex-wrap gap-2"
            variants={itemVariants}
          >
            <span className="text-sm text-content mr-2">Filtros activos:</span>
            {activeFilters.map(filter => (
              <span 
                key={filter}
                className="px-3 py-1 bg-accent/10 text-accent rounded-full text-sm font-medium"
              >
                {filter}
              </span>
            ))}
          </motion.div>
        )}
        
        {products.length === 0 ? (
          <motion.div 
            className="text-center py-12"
            variants={itemVariants}
          >
            <p className="text-lg text-content mb-4">No encontramos productos que coincidan con tu búsqueda.</p>
            <p className="text-content">Probá ajustando los términos de búsqueda o filtros.</p>
          </motion.div>
        ) : (
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
            variants={containerVariants}
          >
            {products.map(product => (
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
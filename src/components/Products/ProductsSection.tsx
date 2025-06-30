import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import ProductCard from './ProductCard';
import LoadingSpinner from '../LoadingSpinner';
import { Product } from '../../types';
import { Package, Sparkles } from 'lucide-react';
import { fetchProducts } from '../../services/productService';

interface ProductsSectionProps {
  onProductSelect: (product: Product) => void;
}

const ProductsSection: React.FC<ProductsSectionProps> = ({ 
  onProductSelect
}) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  // Fetch products from the server
  useEffect(() => {
    fetchProducts()
      .then(setProducts)
      .catch(() => setProducts([]))
      .finally(() => setIsLoading(false));
  }, []);

  const containerVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  if (isLoading) {
    return (
      <section id="products" className="px-4 py-16 bg-white sm:px-6">
        <div className="mx-auto max-w-7xl">
          <div className="flex justify-center">
            <LoadingSpinner />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="products" className="px-4 py-12 bg-slate-50 sm:px-6 sm:py-16 lg:py-20" ref={ref}>
      <motion.div
        className="max-w-5xl mx-auto"
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
        variants={containerVariants}
      >
        {/* Section Header - Mobile optimized */}
        <motion.div className="mb-8 text-center sm:mb-12 lg:mb-16" variants={itemVariants}>
          <div className="flex items-center justify-center gap-2 mb-4">
            <Package className="w-5 h-5 text-accent sm:w-6 sm:h-6" />
            <span className="text-base font-semibold sm:text-lg">Kits de calidad</span>
          </div>
          <h2 className="mb-4 text-3xl font-light text-primary sm:text-4xl lg:text-5xl">
            Nuestros productos
          </h2>
          <p className="max-w-2xl mx-auto text-base leading-relaxed text-content sm:text-lg lg:text-xl">
            Cada kit combina productos esenciales que potencian tu rutina diaria y te ayudan a lograr una piel radiante y saludable.
          </p>
        </motion.div>
        
        {products.length === 0 ? (
          <motion.div 
            className="py-12 text-center"
            variants={itemVariants}
          >
            <div className="max-w-md mx-auto">
              <Sparkles size={48} className="mx-auto mb-4 text-accent" />
              <h3 className="mb-2 text-xl font-medium text-primary">Próximamente</h3>
              <p className="text-base text-content">
                Estamos preparando productos increíbles para vos. ¡Volvé pronto!
              </p>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:gap-8"
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

        {/* Call to action - Mobile optimized */}
        {products.length > 0 && (
          <motion.div 
            className="mt-8 text-center sm:mt-12"
            variants={itemVariants}
          >
            <p className="text-sm text-content sm:text-base">
              ¿Necesitás ayuda para elegir? 
              <a 
                href="https://wa.me/541126720095?text=Hola%2C%20necesito%20ayuda%20para%20elegir%20un%20kit"
                target="_blank"
                rel="noopener noreferrer"
                className="ml-1 font-medium underline text-accent hover:text-supporting"
              >
                Contactanos por WhatsApp
              </a>
            </p>
          </motion.div>
        )}
      </motion.div>
    </section>
  );
}

export default ProductsSection;
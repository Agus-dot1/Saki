import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Gem, Filter } from 'lucide-react';
import JewelryCard from './JewelryCard';
import LoadingSpinner from '../LoadingSpinner';
import { JewelryItem } from '../../types/jewelry';
import { jewelryItems } from '../../data/jewelryData';

interface JewelrySectionProps {
  onItemSelect: (item: JewelryItem) => void;
}

type CategoryFilter = 'all' | 'rings' | 'bracelets';

const JewelrySection: React.FC<JewelrySectionProps> = ({ onItemSelect }) => {
  const [items, setItems] = useState<JewelryItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<JewelryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<CategoryFilter>('all');
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  // Simulate loading jewelry items
  useEffect(() => {
    const loadItems = async () => {
      setIsLoading(true);
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 800));
      setItems(jewelryItems);
      setFilteredItems(jewelryItems);
      setIsLoading(false);
    };

    loadItems();
  }, []);

  // Filter items based on category
  useEffect(() => {
    const filterMap: Record<CategoryFilter, string | null> = {
      all: 'todos',
      rings: 'anillo',
      bracelets: 'pulsera',
    };

    if (activeFilter === 'all') {
      setFilteredItems(items);
    } else {
      setFilteredItems(items.filter(item => item.category === filterMap[activeFilter]));
    }
  }, [activeFilter, items]);

  const categoryLabels: Record<CategoryFilter, string> = {
    all: 'Todos',
    rings: 'Anillos',
    bracelets: 'Pulseras',
  };

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

  const filterVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 },
  };

  if (isLoading) {
    return (
      <section id="jewelry" className="px-4 py-16 bg-white lg:px-6">
        <div className="mx-auto max-w-7xl">
          <div className="flex justify-center">
            <LoadingSpinner />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="jewelry" className="px-4 py-16 bg-slate-50 lg:px-6" ref={ref}>
      <motion.div
        className="mx-auto max-w-7xl"
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
        variants={containerVariants}
      >
        {/* Section Header */}
        <motion.div className="mb-12 text-center lg:mb-16" variants={itemVariants}>
          <div className="flex items-center justify-center gap-2 mb-4">
            <Gem className="text-accent" size={24} />
            <span className="text-base font-medium lg:text-lg">Joyería Artesanal</span>
          </div>
          <h2 className="mb-4 text-3xl font-light lg:text-4xl text-primary">
            Colección de Joyería
          </h2>
          <p className="max-w-2xl mx-auto text-base leading-relaxed lg:text-lg text-content">
            Piezas únicas crafteadas con materiales de la más alta calidad. 
            Cada joya cuenta una historia de elegancia y sofisticación.
          </p>
        </motion.div>

        {/* Category Filters */}
        <motion.div 
          className="flex justify-center mb-8 lg:mb-12"
          variants={filterVariants}
        >
          <div className="flex flex-wrap items-center gap-2 p-2 rounded-xl lg:gap-3 lg:p-3 bg-white/80 backdrop-blur-sm">
            <Filter size={18} className="text-content" />
            {Object.entries(categoryLabels).map(([category, label]) => (
              <button
                key={category}
                onClick={() => setActiveFilter(category as CategoryFilter)}
                className={`px-3 py-2 lg:px-4 lg:py-2 rounded-lg text-sm lg:text-base font-medium transition-all duration-200 ${
                  activeFilter === category
                    ? 'bg-accent text-white shadow-md scale-105'
                    : 'text-content hover:text-primary hover:bg-secondary/50'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Items Grid */}
        {filteredItems.length === 0 ? (
          <motion.div 
            className="py-12 text-center"
            variants={itemVariants}
          >
            <p className="mb-4 text-lg text-content">
              No hay productos disponibles en esta categoría.
            </p>
            <button
              onClick={() => setActiveFilter('all')}
              className="px-6 py-3 text-white transition-colors rounded-lg bg-accent hover:bg-supporting"
            >
              Ver Todos los Productos
            </button>
          </motion.div>
        ) : (
          <motion.div 
            className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 lg:gap-8"
            variants={containerVariants}
          >
            {filteredItems.map(item => (
              <motion.div key={item.id} variants={itemVariants}>
                <JewelryCard 
                  item={item}
                  onClick={() => onItemSelect(item)}
                />
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Category Stats */}
        <motion.div 
          className="mt-12 text-center lg:mt-16"
          variants={itemVariants}
        >
          <p className="text-sm lg:text-base text-content">
            Mostrando {filteredItems.length} de {items.length} productos
            {activeFilter !== 'all' && (
              <span className="ml-2 text-accent">
                en {categoryLabels[activeFilter]}
              </span>
            )}
          </p>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default JewelrySection;
import React from 'react';
import { motion } from 'framer-motion';
import { Star, Users } from 'lucide-react';
import BentoGrid from './BentoGrid';

const Hero: React.FC = () => {
  const scrollToProducts = () => {
    const productsSection = document.getElementById('products');
    if (productsSection) {
      productsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="home" className="min-h-screen px-3 py-5">
      <div className="grid grid-cols-1 md:grid-cols-2">
        {/* Left Content */}
        <motion.div 
          className="flex items-center px-6 py-16 md:px-12 lg:px-16 md:py-24"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="max-w-xl space-y-8">
            {/* Trust Indicators */}
            <div className="flex items-center gap-2 text-supporting">
              <Star className="fill-accent text-accent" size={20} />
              <span className="font-medium text-primary">4.9</span>
              <Users className="text-content" size={20} />
              <span className="text-content">12K Confían</span>
            </div>
            
            {/* Main Heading */}
<div>
<h1 className="mb-4 text-5xl font-light md:text-6xl lg:text-7xl text-primary">
  Con Saki,
  <br />
  <span className="italic text-primary">tu piel</span> brilla
</h1>
  <p className="max-w-md text-lg text-content">
    Pureza que se siente. Resultados que se ven. 
    El cuidado de la piel como debería ser.
  </p>
</div>
            
            {/* CTA Button */}
            <motion.button 
              onClick={scrollToProducts}
              className="px-8 py-4 text-lg text-white transition-all transform rounded-md bg-accent hover:bg-supporting hover:-translate-y-1"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Comprar Ahora
            </motion.button>
          
          </div>
        </motion.div>

        {/* Right Content */}
        <motion.div 
          className="bg-[#4F614F] p-6 md:p-12 flex items-center rounded-3xl"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="w-full max-w-2xl mx-auto">
            <BentoGrid />
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
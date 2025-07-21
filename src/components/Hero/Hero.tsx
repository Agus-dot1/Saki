import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Star, Users, ArrowDown } from 'lucide-react';

const Hero: React.FC = () => {
  const scrollToProducts = () => {
    const productsSection = document.getElementById('products');
    if (productsSection) {
      productsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="home" className="relative min-h-screen bg-white overflow-hidde">
      {/* Mobile-first background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute w-32 h-32 rounded-full -top-8 -left-8 sm:w-48 sm:h-48 sm:-top-12 sm:-left-12 lg:w-72 lg:h-72 lg:top-20 lg:left-10 blur-2xl animate-pulse bg-emerald-200/30"></div>
        <div className="absolute w-40 h-40 rounded-full -bottom-10 -right-10 sm:w-56 sm:h-56 sm:-bottom-14 sm:-right-14 lg:w-96 lg:h-96 lg:bottom-20 lg:right-10 blur-3xl animate-pulse bg-sage-300/20 animation-delay-1000"></div>
      </div>

      <div className="relative z-10 flex flex-col min-h-screen px-4 pt-24 mx-auto max-w-7xl sm:px-6 lg:px-8">
        {/* Mobile-optimized layout */}
        <div className="flex flex-col flex-1 lg:grid lg:grid-cols-2 lg:gap-12 lg:items-center">
          
          {/* Content Section - Mobile First */}
          <motion.div 
            className="flex flex-col justify-center text-center lg:text-left"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Trust Indicators - Mobile optimized */}
            <div className="flex items-center justify-center gap-3 mb-6 lg:justify-start">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-accent text-accent" />
                <span className="text-sm font-semibold text-primary">4.9</span>
              </div>
              <div className="w-1 h-1 rounded-full bg-content/30"></div>
              <div className="flex items-center gap-1">
                <Users className="w-4 h-4 text-content" />
                <span className="text-sm text-content">+50 Clientes</span>
              </div>
            </div>
            
            {/* Main Heading - Mobile optimized typography */}
            <div className="mb-6">
              <h1 className="mb-4 text-3xl font-light leading-tight text-stone-900 sm:text-4xl lg:text-5xl xl:text-6xl">
                Con Saki,
                <br />
                <span className="font-medium text-primary">tu piel</span>{' '}
                <span className="relative inline-flex items-center text-transparent bg-clip-text bg-gradient-to-r from-primary via-emerald-500 to-emerald-600">
                  brilla
                  <Sparkles size={20} className="ml-2 text-emerald-300 sm:w-6 sm:h-6 lg:w-8 lg:h-8" />
                </span>
              </h1>
              <p className="max-w-lg mx-auto text-base leading-relaxed sm:text-lg lg:mx-0 lg:text-xl text-content">
                Pureza que se siente. Resultados que se ven. 
                El cuidado de la piel como debería ser.
              </p>
            </div>
            
            {/* CTA Button - Mobile optimized */}
            <div className="flex flex-col items-center gap-4 mb-20 lg:items-start">
              <motion.button 
                onClick={scrollToProducts}
                className="w-full max-w-xs px-8 py-4 text-lg font-semibold text-white transition-all transform shadow-lg rounded-2xl sm:w-auto bg-accent hover:bg-supporting hover:scale-105 active:scale-95 hover:shadow-xl"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Ver Productos
              </motion.button>
              
              {/* Scroll indicator for mobile */}
              <motion.div 
                className="flex flex-col items-center mt-4 lg:hidden"
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <span className="text-xs text-content">Deslizá para ver más</span>
                <ArrowDown size={16} className="mt-1 text-accent" />
              </motion.div>
            </div>
          </motion.div>

          {/* Video Section - Mobile optimized */}
          <motion.div 
            className="flex items-center justify-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <StorySlideshow />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

const slides = [
  {
    id: 1,
    title: "Pureza que se siente.",
    image: "https://jvrvhoyepfcznosljvjw.supabase.co/storage/v1/object/public/images//nawi%203.jpg",
    productImage: "https://res.cloudinary.com/do17gdc0b/image/upload/v1750901904/kit_sami_1_p3xqxg.webp",
    objectPosition: "center 40%",
  },
  {
    id: 2,
    title: "Resultados que se ven.",
    image: "https://jvrvhoyepfcznosljvjw.supabase.co/storage/v1/object/public/images//sami%202.jpg",
    productImage: "https://res.cloudinary.com/do17gdc0b/image/upload/v1749864084/KitPaki_1_ujvfwq.webp",
    objectPosition: "center 30%",
  },
  {
    id: 3,
    title: "El cuidado como debe ser.",
    image: "https://jvrvhoyepfcznosljvjw.supabase.co/storage/v1/object/public/images//paki%202.jpg",
    productImage: "https://res.cloudinary.com/do17gdc0b/image/upload/v1750901904/kit_sami_1_p3xqxg.webp",
    objectPosition: "center 50%",
  },
];

const StorySlideshow = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative w-full max-w-lg mx-auto overflow-hidden bg-white shadow-2xl aspect-video md:aspect-square rounded-3xl">
      <AnimatePresence initial={false}>
        <motion.div
          key={current}
          className="absolute inset-0"
          initial={{ opacity: 0, x: 300, scale: 0.9 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: -300, scale: 0.9 }}
          transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
        >
          <img
            src={slides[current].image}
            alt={slides[current].title}
            className="object-contain w-full h-full scale-[2.4]"
            style={{ objectPosition: slides[current].objectPosition }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
        </motion.div>
      </AnimatePresence>

      <div className="absolute inset-0 flex flex-col justify-end p-8 text-white">
        {/* Removed product image */}
        <AnimatePresence mode="wait">
          <motion.h3
            key={`title-${current}`}
            className="text-2xl font-medium leading-tight md:text-3xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0, transition: { delay: 0.1, duration: 0.6 } }}
            exit={{ opacity: 0, y: -20 }}
          >
            {slides[current].title}
          </motion.h3>
        </AnimatePresence>
      </div>

      <div className="absolute flex space-x-2 -translate-x-1/2 bottom-4 left-1/2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              i === current ? 'bg-white scale-125' : 'bg-white/50 hover:bg-white'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default Hero;
import React from 'react';
import { Quote, Star } from 'lucide-react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

interface Testimonial {
  id: number;
  name: string;
  content: string;
  rating?: number;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Camila",
    content: "Compré el kit que viene con la guasha, la vinchita y todo. Es hermoso, re delicado y de muy buena calidad. La joyería me encantó, es 100% plata, muy delicado y hermoso. Volvería a comprar sin dudarlo.",
    rating: 5,
  },
  {
    id: 2,
    name: "Valentina",
    content: "Compré el kit de skin care y unos anillos, me encantó todo, muy buena calidad y los anillos son hermosos, quedé encantada con la presentación del kit y sus productos.",
    rating: 5,
  },
  {
    id: 3,
    name: "Mirta",
    content: "Me encantaron los productos de skincare, super recomendable ✨.",
    rating: 4,
  },
  {
    id: 4,
    name: "Patricia",
    content: "La verdad que las mascarillas me gustaron bastante, super recomendable. El antifz para la desinfección de ojeras también, buenísimo y los anillitos super elegantes y muy estéticos.",
    rating: 5,
  }
];

const TestimonialsSection: React.FC = () => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  // Duplicate testimonials for seamless marquee
  const marqueeTestimonials = [...testimonials, ...testimonials];

  const containerVariants = {
    hidden: { opacity: 0, y: 30 },
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

  return (
    <section className="relative py-12 overflow-hidden sm:py-16 lg:py-20 bg-secondary/30" ref={ref}>
      {/* Gradient overlay for mobile */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        <div className="absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-secondary/30 to-transparent sm:w-16"></div>
        <div className="absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-secondary/30 to-transparent sm:w-16"></div>
      </div>

      <motion.div
        className="mx-auto max-w-7xl"
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
        variants={containerVariants}
      >
        {/* Header - Mobile optimized */}
        <motion.div 
          className="relative z-20 px-4 mb-8 text-center sm:px-6 sm:mb-12 lg:mb-16"
          variants={itemVariants}
        >
          <div className="flex items-center justify-center gap-2 mb-4">
            <Star className="w-5 h-5 fill-accent text-accent sm:w-6 sm:h-6" />
            <span className="text-base font-semibold sm:text-lg">Confianza de miles</span>
          </div>
          <h2 className="mb-4 text-3xl font-light text-primary sm:text-4xl lg:text-5xl">
            Palabras de Mis Clientes
          </h2>
          <p className="max-w-2xl mx-auto text-base leading-relaxed text-content sm:text-lg lg:text-xl">
            Descubrí por qué nuestros clientes aman los productos naturales de cuidado de la piel de Saki y sus resultados transformadores.
          </p>
        </motion.div>

        {/* Marquee - Mobile optimized */}
        <motion.div 
          className="relative w-full overflow-x-hidden"
          variants={itemVariants}
        >
          <div className="flex gap-4 w-max marquee sm:gap-6 lg:gap-8">
            {marqueeTestimonials.map((testimonial, idx) => (
              <div
                key={idx}
                className="min-w-[280px] max-w-xs p-4 transition-shadow shadow-sm sm:min-w-[320px] sm:p-6 lg:p-8 bg-white rounded-2xl hover:shadow-md flex flex-col justify-between border border-gray-100"
              >
                <div className="flex items-center gap-3 mb-3 sm:gap-4 sm:mb-4">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-accent/10 sm:w-12 sm:h-12">
                    <Quote className="w-4 h-4 text-accent sm:w-5 sm:h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-primary sm:text-lg">
                      {testimonial.name}
                    </h3>
                    {testimonial.rating && (
                      <div className="flex items-center mt-1">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star key={i} className="w-3 h-3 text-accent fill-accent sm:w-4 sm:h-4" />
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                <blockquote className="text-sm leading-relaxed text-content sm:text-base">
                  "{testimonial.content}"
                </blockquote>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Call to action - Mobile optimized */}
        <motion.div 
          className="relative z-20 px-4 mt-8 text-center sm:px-6 sm:mt-12"
          variants={itemVariants}
        >
          <p className="text-sm text-content sm:text-base">
            ¿Querés ser parte de nuestras historias de éxito?{' '}
            <a 
              href="https://wa.me/541126720095?text=Hola%2C%20quiero%20conocer%20más%20sobre%20los%20productos"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium underline text-accent hover:text-supporting"
            >
              Contactanos
            </a>
          </p>
        </motion.div>
      </motion.div>

      {/* Marquee animation styles - Mobile optimized */}
      <style>
        {`
          .marquee {
            animation: marquee 60s linear infinite;
          }
          @keyframes marquee {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
          @media (max-width: 640px) {
            .marquee {
              animation: marquee 45s linear infinite;
            }
          }
          @media (prefers-reduced-motion: reduce) {
            .marquee {
              animation: none;
            }
          }
        `}
      </style>
    </section>
  );
};

export default TestimonialsSection;
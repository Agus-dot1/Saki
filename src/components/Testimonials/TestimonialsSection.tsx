import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Star } from 'lucide-react';

interface Testimonial {
  id: number;
  name: string;
  role: string;
  company: string;
  content: string;
  image: string;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "María Rodríguez",
    role: "Entusiasta del Cuidado de la Piel",
    company: "Beauty Blogger",
    content: "El Kit de Hidratación Esencial transformó mi rutina de cuidado de la piel. Los ingredientes naturales son suaves pero efectivos, y mi piel nunca se vio mejor.",
    image: "https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=800"
  },
  {
    id: 2,
    name: "Sofía Chen",
    role: "Coach de Bienestar",
    company: "Salud Holística",
    content: "Lo que distingue a Saki es su compromiso con los ingredientes naturales. El Sistema de Recuperación Anti-Edad se convirtió en un elemento básico de mi rutina diaria.",
    image: "https://images.pexels.com/photos/1587009/pexels-photo-1587009.jpeg?auto=compress&cs=tinysrgb&w=800"
  },
  {
    id: 3,
    name: "Emma Thompson",
    role: "Dermatóloga",
    company: "Clínica de Piel",
    content: "Recomiendo los productos Saki a mis clientes con confianza. Los resultados hablan por sí mismos: cuidado de la piel natural y efectivo que realmente funciona.",
    image: "https://images.pexels.com/photos/1181695/pexels-photo-1181695.jpeg?auto=compress&cs=tinysrgb&w=800"
  }
];

const TestimonialsSection: React.FC = () => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.2,
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
    <section className="py-24 px-6 bg-secondary/30" ref={ref}>
      <motion.div
        className="max-w-7xl mx-auto"
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
        variants={containerVariants}
      >
        {/* Header */}
        <motion.div className="text-center mb-16" variants={itemVariants}>
          <div className="flex items-center justify-center gap-2 mb-4">
            <Star className="fill-accent text-accent" size={24} />
            <span className="text-lg font-medium">Confianza de miles</span>
          </div>
          <h2 className="text-4xl font-light text-primary mb-4">
            Palabras de Nuestra Comunidad
          </h2>
          <p className="text-content text-lg max-w-2xl mx-auto">
            Descubrí por qué nuestros clientes aman los productos naturales de cuidado de la piel de Saki y sus resultados transformadores.
          </p>
        </motion.div>

        {/* Testimonials Grid */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
          variants={containerVariants}
        >
          {testimonials.map((testimonial) => (
            <motion.div
              key={testimonial.id}
              className="bg-white p-8 rounded-3xl shadow-sm hover:shadow-md transition-shadow"
              variants={itemVariants}
              whileHover={{ y: -5 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center gap-4 mb-6">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-14 h-14 rounded-full object-cover"
                />
                <div>
                  <h3 className="font-medium text-primary">{testimonial.name}</h3>
                  <p className="text-sm text-content">{testimonial.role}</p>
                  <p className="text-sm text-content">{testimonial.company}</p>
                </div>
              </div>
              <blockquote className="text-content leading-relaxed">
                "{testimonial.content}"
              </blockquote>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
};

export default TestimonialsSection;
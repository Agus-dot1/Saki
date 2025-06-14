import React from 'react';
import { Quote, Star } from 'lucide-react';

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
    content: "La verdad que las mascarillas me gustaron bastante, super recomendable. El antifz para la desinfección de ojeras tambiénm, buenísimo y los anillitos super elegantes y muy estéticos.",
    rating: 5,
  }
];

const TestimonialsSection: React.FC = () => {
  // Duplicate testimonials for seamless marquee
  const marqueeTestimonials = [...testimonials, ...testimonials];

  return (
    <section className="relative py-24 overflow-hidden bg-secondary/30">
      {/* Gradient overlay */}
      <div className="pointer-events-none absolute inset-0 z-10 after:content-[''] after:absolute after:inset-0 after:bg-gradient-to-r after:from-white after:via-transparent after:to-white after:w-full after:h-full" />
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="relative z-20 mb-16 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Star className="fill-accent text-accent" size={24} />
            <span className="text-lg font-medium">Confianza de miles</span>
          </div>
          <h2 className="mb-4 text-4xl font-light text-primary">
            Palabras de Mis Clientes
          </h2>
          <p className="max-w-2xl mx-auto text-lg text-content">
            Descubrí por qué nuestros clientes aman los productos naturales de cuidado de la piel de Saki y sus resultados transformadores.
          </p>
        </div>

        {/* Marquee */}
        <div className="relative w-full overflow-x-hidden">
          <div className="flex gap-8 marquee w-max">
            {marqueeTestimonials.map((testimonial, idx) => (
              <div
                key={idx}
                className="min-w-[320px] max-w-xs p-8 transition-shadow shadow-sm bg-accent/10 rounded-3xl hover:shadow-md flex flex-col justify-between"
              >
                <div className="flex items-center gap-4 mb-6">
                  <div>
                    <h3 className="font-medium text-primary">
                      <Quote className="inline-block mr-1 text-accent" /> {testimonial.name}
                    </h3>
                  </div>
                </div>
                <blockquote className="leading-relaxed text-content">
                  "{testimonial.content}"
                </blockquote>
                {testimonial.rating && (
                  <div className="flex items-center mt-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="text-accent fill-accent" size={16} />
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Marquee animation styles */}
      <style>
        {`
          .marquee {
            animation: marquee 110s linear infinite;
          }
          @keyframes marquee {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
        `}
      </style>
    </section>
  );
};

export default TestimonialsSection;
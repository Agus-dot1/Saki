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
    <section className="relative py-16 overflow-hidden lg:px-5 lg:py-24 bg-secondary/30">
      {/* Gradient overlay */}
      <div className="pointer-events-none lg:absolute inset-0 z-10 after:content-[''] after:absolute after:inset-0 after:bg-gradient-to-r after:from-white after:via-transparent after:to-white after:w-full after:h-full" />
      <div className="mx-auto max-w-7xl">
        {/* Header - Better mobile spacing */}
        <div className="relative z-20 px-5 mb-12 text-center lg:mb-16">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Star className="fill-accent text-accent" size={24} />
            <span className="text-base font-medium lg:text-lg">Confianza de miles</span>
          </div>
          <h2 className="mb-4 text-3xl font-light lg:text-4xl text-primary">
            Palabras de Mis Clientes
          </h2>
          <p className="max-w-2xl mx-auto text-base leading-relaxed lg:text-lg text-content">
            Descubrí por qué nuestros clientes aman los productos naturales de cuidado de la piel de Saki y sus resultados transformadores.
          </p>
        </div>

        {/* Marquee - Better mobile sizing */}
        <div className="relative w-full overflow-x-hidden">
          <div className="flex gap-4 w-max marquee lg:gap-8">
            {marqueeTestimonials.map((testimonial, idx) => (
              <div
                key={idx}
                className="min-w-[280px] max-w-xs p-6 transition-shadow shadow-sm lg:min-w-[320px] lg:p-8 bg-accent/10 rounded-2xl lg:rounded-3xl hover:shadow-md flex flex-col justify-between"
              >
                <div className="flex items-center gap-3 mb-4 lg:gap-4 lg:mb-6">
                  <div>
                    <h3 className="text-base font-medium lg:text-lg text-primary">
                      <Quote className="inline-block mr-1 text-accent" size={16} /> {testimonial.name}
                    </h3>
                  </div>
                </div>
                <blockquote className="text-sm leading-relaxed lg:text-base text-content">
                  "{testimonial.content}"
                </blockquote>
                {testimonial.rating && (
                  <div className="flex items-center mt-3 lg:mt-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="text-accent fill-accent" size={14} />
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Marquee animation styles - Responsive speed */}
      <style>
        {`
          .marquee {
            animation: marquee 120s linear infinite;
          }
          @keyframes marquee {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
          @media (max-width: 768px) {
            .marquee {
              animation: marquee 90s linear infinite;
            }
          }
        `}
      </style>
    </section>
  );
};

export default TestimonialsSection;
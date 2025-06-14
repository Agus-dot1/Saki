import React from 'react';
import { Instagram, Facebook, Twitter, CreditCard, MapPin, Mail, Phone } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer id="contact" className="px-4 py-12 lg:px-6 lg:py-16 bg-secondary">
      <div className="grid grid-cols-1 gap-8 mx-auto max-w-7xl lg:grid-cols-3 lg:gap-12">
        <div>
          <h3 className="mb-3 text-xl font-medium lg:mb-4 lg:text-2xl text-primary">Saki</h3>
          <p className="mb-4 text-sm leading-relaxed lg:mb-6 lg:text-base text-content">
            Productos premium de cuidado de la piel elaborados con ingredientes naturales de Argentina. 
            Nuestras fórmulas combinan sabiduría ancestral con ciencia moderna para una piel 
            saludable y radiante.
          </p>
          <div className="flex space-x-4">
            <a href="#" className="transition-colors text-supporting hover:text-accent" aria-label="Instagram">
              <Instagram size={20} />
            </a>
            <a href="#" className="transition-colors text-supporting hover:text-accent" aria-label="Facebook">
              <Facebook size={20} />
            </a>
            <a href="#" className="transition-colors text-supporting hover:text-accent" aria-label="Twitter">
              <Twitter size={20} />
            </a>
          </div>
        </div>
        
        <div>
          <h3 className="mb-3 text-lg font-medium lg:mb-4 lg:text-xl text-primary">Contactanos</h3>
          <ul className="space-y-2 lg:space-y-3">
            <li className="flex items-center space-x-2">
              <MapPin size={16} className="text-supporting lg:w-5 lg:h-5" />
              <span className="text-sm lg:text-base text-content">Buenos Aires, Argentina</span>
            </li>
            <li className="flex items-center space-x-2">
              <Mail size={16} className="text-supporting lg:w-5 lg:h-5" />
              <span className="text-sm lg:text-base text-content">hola@sakiskincare.com</span>
            </li>
            <li className="flex items-center space-x-2">
              <Phone size={16} className="text-supporting lg:w-5 lg:h-5" />
              <span className="text-sm lg:text-base text-content">+54 11 1234 5678</span>
            </li>
          </ul>
        </div>
        
        <div>
          <h3 className="mb-3 text-lg font-medium lg:mb-4 lg:text-xl text-primary">Métodos de Pago</h3>
          <div className="flex flex-wrap gap-2 mb-4 lg:mb-6">
            <CreditCard size={20} className="text-supporting lg:w-6 lg:h-6" />
            <span className="text-sm lg:text-base text-content">Aceptamos todas las tarjetas principales</span>
          </div>
        </div>
      </div>
      
      <div className="pt-4 mx-auto mt-8 text-center border-t lg:pt-6 lg:mt-12 max-w-7xl border-supporting/20 text-content">
        <p className="text-sm lg:text-base">© {new Date().getFullYear()} Saki Skincare. Todos los derechos reservados.</p>
      </div>
    </footer>
  );
};

export default Footer;
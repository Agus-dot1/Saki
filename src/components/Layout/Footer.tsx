import React from 'react';
import { Instagram, Facebook, Twitter, CreditCard, MapPin, Mail, Phone } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer id="contact" className="px-6 py-16 bg-secondary">
      <div className="grid grid-cols-1 gap-12 mx-auto max-w-7xl md:grid-cols-3">
        <div>
          <h3 className="mb-4 text-2xl font-medium text-primary">Saki</h3>
          <p className="mb-6 text-content">
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
          <h3 className="mb-4 text-xl font-medium text-primary">Contactanos</h3>
          <ul className="space-y-3">
            <li className="flex items-center space-x-2">
              <MapPin size={18} className="text-supporting" />
              <span className="text-content">Buenos Aires, Argentina</span>
            </li>
            <li className="flex items-center space-x-2">
              <Mail size={18} className="text-supporting" />
              <span className="text-content">hola@sakiskincare.com</span>
            </li>
            <li className="flex items-center space-x-2">
              <Phone size={18} className="text-supporting" />
              <span className="text-content">+54 11 1234 5678</span>
            </li>
          </ul>
        </div>
        
        <div>
          <h3 className="mb-4 text-xl font-medium text-primary">Métodos de Pago</h3>
          <div className="flex flex-wrap gap-2 mb-6">
            <CreditCard size={24} className="text-supporting" />
            <span className="text-content">Aceptamos todas las tarjetas principales</span>
          </div>
        </div>
      </div>
      
      <div className="pt-6 mx-auto mt-12 text-center border-t max-w-7xl border-supporting/20 text-content">
        <p>© {new Date().getFullYear()} Saki Skincare. Todos los derechos reservados.</p>
      </div>
    </footer>
  );
};

export default Footer;
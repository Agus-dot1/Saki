import React from 'react';
import { Instagram, Facebook, Twitter, CreditCard, MapPin, Mail, Phone } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer id="contact" className="bg-secondary py-16 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
        <div>
          <h3 className="text-2xl font-medium text-primary mb-4">Saki</h3>
          <p className="text-content mb-6">
            Productos premium de cuidado de la piel elaborados con ingredientes naturales de Argentina. 
            Nuestras fórmulas combinan sabiduría ancestral con ciencia moderna para una piel 
            saludable y radiante.
          </p>
          <div className="flex space-x-4">
            <a href="#" className="text-supporting hover:text-accent transition-colors" aria-label="Instagram">
              <Instagram size={20} />
            </a>
            <a href="#" className="text-supporting hover:text-accent transition-colors" aria-label="Facebook">
              <Facebook size={20} />
            </a>
            <a href="#" className="text-supporting hover:text-accent transition-colors" aria-label="Twitter">
              <Twitter size={20} />
            </a>
          </div>
        </div>
        
        <div>
          <h3 className="text-xl font-medium text-primary mb-4">Contactanos</h3>
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
          <h3 className="text-xl font-medium text-primary mb-4">Métodos de Pago</h3>
          <div className="flex flex-wrap gap-2 mb-6">
            <CreditCard size={24} className="text-supporting" />
            <span className="text-content">Aceptamos todas las tarjetas principales</span>
          </div>
          
          <h3 className="text-xl font-medium text-primary mb-4 mt-8">Newsletter</h3>
          <div className="flex">
            <input
              type="email"
              placeholder="Tu email"
              className="px-4 py-2 w-full rounded-l focus:outline-none"
            />
            <button className="bg-accent text-white px-4 py-2 rounded-r hover:bg-accent/90 transition-colors">
              Suscribirse
            </button>
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto mt-12 pt-6 border-t border-supporting/20 text-center text-content">
        <p>© {new Date().getFullYear()} Saki Skincare. Todos los derechos reservados.</p>
      </div>
    </footer>
  );
};

export default Footer;
import React from 'react';
import { Instagram, MapPin, Mail, Phone } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer id="contact" className="px-4 py-12 lg:px-6 lg:py-16 bg-secondary">
      <div className="flex gap-8 mx-auto justify-evenly max-w-7xl ">
        <div className="flex flex-col justify-between max-w-sm">
          <h3 className="mb-3 text-xl font-medium lg:mb-4 lg:text-2xl text-primary">Saki</h3>
          <p className="mb-4 text-sm leading-relaxed lg:mb-6 lg:text-base text-content">
            Saki representa amor propio, conexión y rituales que miman el alma.
            No es solo un kit de cuidado personal: es una experiencia pensada para que te sientas bien, te veas linda y disfrutes de ese momento que tanto te merecés.
          </p>
          <div className="flex space-x-4">
            <a target="_blank" href="https://www.instagram.com/accs_saki?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" className="transition-colors text-supporting hover:text-accent" aria-label="Instagram">
              <Instagram size={20} />
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
              <span className="text-sm lg:text-base text-content">denise_yevrasky1@hotmail.com</span>
            </li>
            <li className="flex items-center space-x-2">
              <Phone size={16} className="text-supporting lg:w-5 lg:h-5" />
              <span className="text-sm lg:text-base text-content">+54 11 2672-0095</span>
            </li>
          </ul>
        </div>
      </div>
      
      <div className="pt-4 mx-auto mt-8 text-center border-t lg:pt-6 lg:mt-12 max-w-7xl border-supporting/20 text-content">
        <p className="text-sm lg:text-base">© {new Date().getFullYear()} Saki Skincare. Todos los derechos reservados.</p>
      </div>
    </footer>
  );
};

export default Footer;
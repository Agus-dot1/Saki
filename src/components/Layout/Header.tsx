import React, { useState } from 'react';
import { ShoppingCart, Home, Package, Mail, Menu, X } from 'lucide-react';
import { useCart } from '../../hooks/useCart';
import { motion, AnimatePresence } from 'framer-motion';

interface HeaderProps {
  toggleCart: () => void;
}


const Header: React.FC<HeaderProps> = ({ toggleCart }) => {
  const { totalItems } = useCart();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    if (!isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
    document.body.style.overflow = 'unset';
  };

  const menuItems = [
    { icon: Home, label: 'Inicio', href: '#home', id: 'home' },
    { icon: Package, label: 'Productos', href: '#products', id: 'products' },
    { icon: Mail, label: 'Contacto', href: '#contact', id: 'contact' },
  ];

  const handleMenuClick = (href: string) => {
    closeMobileMenu();
    if (href.startsWith('#')) {
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };
  
  return (
    <>
      {/* Desktop Sidebar */}
      <header className="fixed top-0 left-0 z-50 flex-col items-center justify-between hidden w-20 h-screen py-6 bg-white border-r border-secondary/20 md:flex">
        {/* Logo */}
        <div className="flex flex-col items-center justify-between h-full">
          <a href="#" className="text-2xl font-medium transform -rotate-90 text-primary whitespace-nowrap">
            Saki
          </a>
          {/* Desktop Navigation */}
          <nav className="flex flex-col space-y-2">
            {menuItems.map(({ icon: Icon, label, href, id }) => (
              <a
                key={id}
                href={href}
                onClick={(e) => {
                  e.preventDefault();
                  handleMenuClick(href);
                }}
                className="relative p-3 transition-colors duration-200 border rounded-lg group text-primary hover:text-accent"
                aria-label={label}
                title={label}
              >
                <Icon size={24} />
                
                {/* Tooltip */}
                <div className="absolute z-50 px-3 py-2 ml-4 text-sm text-white transition-opacity duration-200 transform -translate-y-1/2 rounded-md opacity-0 pointer-events-none left-full top-1/2 bg-primary whitespace-nowrap group-hover:opacity-100">
                  {label}
                  <div className="absolute transform -translate-y-1/2 border-4 border-transparent right-full top-1/2 border-r-primary"></div>
                </div>
              </a>
            ))}
          </nav>
                  {/* Desktop Actions */}
        <div className="flex flex-col space-y-4">
          <button 
            className="relative p-3 transition-colors duration-200 text-primary hover:text-accent"
            onClick={toggleCart}
            aria-label="Abrir carrito"
            title="Carrito de Compras"
          >
            <ShoppingCart size={24} />
            {totalItems > 0 && (
              <span className="absolute flex items-center justify-center w-5 h-5 text-xs font-medium text-white rounded-full -top-1 -right-1 bg-accent">
                {totalItems}
              </span>
            )}
          </button>
        </div>
        </div>
      </header>

      {/* Mobile Header */}
      <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between h-16 px-4 bg-white border-b border-secondary/20 md:hidden">
        {/* Mobile Logo */}
        <a href="#" className="text-xl font-medium text-primary">
          Saki
        </a>

        {/* Mobile Actions */}
        <div className="flex items-center space-x-2">
          
          <button 
            className="relative p-2 transition-colors duration-200 text-primary hover:text-accent"
            onClick={toggleCart}
            aria-label="Abrir carrito"
          >
            <ShoppingCart size={24} />
            {totalItems > 0 && (
              <span className="absolute flex items-center justify-center w-5 h-5 text-xs font-medium text-white rounded-full -top-1 -right-1 bg-accent">
                {totalItems}
              </span>
            )}
          </button>

          <button
            className="p-2 transition-colors duration-200 text-primary hover:text-accent"
            onClick={toggleMobileMenu}
            aria-label="Abrir menú"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 bg-black/60 md:hidden"
              onClick={closeMobileMenu}
            />
            
            {/* Mobile Menu */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="fixed right-0 top-0 h-full w-80 max-w-[85vw] bg-white z-50 md:hidden shadow-xl"
            >
              <div className="flex flex-col h-full">
                {/* Mobile Menu Header */}
                <div className="flex items-center justify-between p-6 border-b border-secondary/20">
                  <span className="text-xl font-medium text-primary">Menú</span>
                  <button
                    onClick={closeMobileMenu}
                    className="p-2 transition-colors duration-200 text-primary hover:text-accent"
                    aria-label="Cerrar menú"
                  >
                    <X size={24} />
                  </button>
                </div>

                {/* Mobile Navigation */}
                <nav className="flex-1 py-6">
                  <ul className="space-y-2">
                    {menuItems.map(({ icon: Icon, label, href, id }) => (
                      <li key={id}>
                        <a
                          href={href}
                          onClick={(e) => {
                            e.preventDefault();
                            handleMenuClick(href);
                          }}
                          className="flex items-center px-6 py-4 space-x-4 transition-all duration-200 text-primary hover:text-accent hover:bg-secondary/30"
                        >
                          <Icon size={24} />
                          <span className="text-lg font-medium">{label}</span>
                        </a>
                      </li>
                    ))}
                  </ul>
                </nav>

                {/* Mobile Menu Footer */}
                <div className="p-6 border-t border-secondary/20">
                  <div className="text-sm text-content">
                    <p className="mb-2">Seguinos:</p>
                    <div className="flex space-x-4">
                      <a href="#" className="transition-colors text-primary hover:text-accent">Instagram</a>
                      <a href="#" className="transition-colors text-primary hover:text-accent">Facebook</a>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;
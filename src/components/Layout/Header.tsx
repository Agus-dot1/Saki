import React, { useState } from 'react';
import { ShoppingCart, Home, Package, Mail, X, Menu } from 'lucide-react';
import { useCart } from '../../hooks/useCart';
import { motion, AnimatePresence } from 'framer-motion';

interface HeaderProps {
  toggleCart: () => void;
}

const Header: React.FC<HeaderProps> = ({ toggleCart }) => {
  const { totalItems } = useCart();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
    document.body.style.overflow = 'unset';
  };

  const openMobileMenu = () => {
    setIsMobileMenuOpen(true);
    document.body.style.overflow = 'hidden';
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
      {/* Mobile Header Bar */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-100 lg:hidden">
        <div className="flex items-center justify-between px-4 py-3">
          {/* Logo */}
          <div className="flex items-center">
            <h1 className="text-xl font-semibold text-primary">Saki</h1>
          </div>

          {/* Mobile Actions */}
          <div className="flex items-center space-x-3">
            {/* Cart Button */}
            <button
              className="relative p-2 text-gray-600 transition-colors hover:text-primary rounded-xl"
              onClick={toggleCart}
              aria-label="Abrir carrito"
            >
              <ShoppingCart size={24} />
              {totalItems > 0 && (
                <span className="absolute flex items-center justify-center w-5 h-5 text-xs font-bold text-white rounded-full -top-1 -right-1 bg-accent">
                  {totalItems}
                </span>
              )}
            </button>

            {/* Menu Button */}
            <button
              onClick={openMobileMenu}
              className="p-2 text-gray-600 transition-colors hover:text-primary rounded-xl"
              aria-label="Abrir menú"
            >
              <Menu size={24} />
            </button>
          </div>
        </div>
      </header>

      {/* Desktop Sidebar - Hidden on mobile */}
      <header className="fixed z-20 hidden transform -translate-y-1/2 top-1/2 right-4 xl:right-6 lg:block">
        <nav className="flex flex-col items-center p-3 space-y-2 border shadow-lg bg-white/90 backdrop-blur-md rounded-2xl border-white/20">
          {menuItems.map(({ icon: Icon, label, href, id }) => (
            <a
              key={id}
              href={href}
              onClick={(e) => {
                e.preventDefault();
                handleMenuClick(href);
              }}
              className="relative p-3 text-gray-600 transition-all duration-200 group hover:text-green-700 hover:bg-green-50 rounded-xl"
              aria-label={label}
              title={label}
            >
              <Icon size={20} />

              {/* Tooltip */}
              <div className="absolute z-50 px-3 py-2 mr-4 text-sm text-white transition-opacity duration-200 transform -translate-y-1/2 bg-gray-800 rounded-md opacity-0 pointer-events-none right-full top-1/2 whitespace-nowrap group-hover:opacity-100">
                {label}
                <div className="absolute transform -translate-y-1/2 border-4 border-transparent left-full top-1/2 border-r-gray-800"></div>
              </div>
            </a>
          ))}

          {/* Cart Button */}
          <button
            className="relative p-3 text-gray-600 transition-all duration-200 hover:text-green-700 hover:bg-green-50 rounded-xl"
            onClick={toggleCart}
            aria-label="Abrir carrito"
            title="Carrito de Compras"
          >
            <ShoppingCart size={20} />
            {totalItems > 0 && (
              <span className="absolute flex items-center justify-center w-5 h-5 text-xs font-medium text-white bg-green-600 rounded-full -top-1 -right-1">
                {totalItems}
              </span>
            )}
          </button>
        </nav>
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
              className="fixed inset-0 z-50 bg-black/60 lg:hidden"
              onClick={closeMobileMenu}
            />

            {/* Mobile Menu */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="fixed right-0 top-0 h-full w-80 max-w-[85vw] bg-white z-50 lg:hidden shadow-xl"
            >
              <div className="flex flex-col h-full">
                {/* Mobile Menu Header */}
                <div className="flex items-center justify-between p-6 border-b border-secondary/20">
                  <span className="text-xl font-medium text-primary">Menú</span>
                  <button
                    onClick={closeMobileMenu}
                    className="p-2 transition-colors duration-200 text-primary hover:text-accent rounded-xl"
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
                          onClick={e => {
                            e.preventDefault();
                            handleMenuClick(href);
                          }}
                          className="flex items-center px-6 py-4 mx-3 space-x-4 transition-all duration-200 text-primary hover:text-accent hover:bg-secondary/30 rounded-xl"
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
                      <a 
                        href="https://www.instagram.com/accs_saki?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" 
                        target="_blank"
                        rel="noopener noreferrer"
                        className="transition-colors text-primary hover:text-accent"
                      >
                        Instagram
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Floating Bottom Nav for Mobile - Simplified */}
      <nav className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-30 lg:hidden">
        <div className="flex items-center justify-center px-4 py-3 bg-white/95 backdrop-blur-md border border-white/20 shadow-lg rounded-2xl">
          <button
            className="relative flex flex-col items-center justify-center p-3 text-gray-600 transition-all duration-200 hover:text-accent rounded-xl active:scale-95"
            onClick={toggleCart}
            aria-label="Abrir carrito"
          >
            <ShoppingCart size={24} />
            <span className="text-xs font-medium mt-1">Carrito</span>
            {totalItems > 0 && (
              <span className="absolute flex items-center justify-center w-5 h-5 text-xs font-bold text-white rounded-full -top-1 -right-1 bg-accent">
                {totalItems}
              </span>
            )}
          </button>
        </div>
      </nav>
    </>
  );
};

export default Header;
import React, { useState, useEffect, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Header from './components/Layout/Header';
import Hero from './components/Hero/Hero';
import ProductsSection from './components/Products/ProductsSection';
import TestimonialsSection from './components/Testimonials/TestimonialsSection';
import Footer from './components/Layout/Footer';
import CartProvider from './contexts/CartContext';
import ToastProvider from './contexts/ToastContext';
import CartPanel from './components/Cart/CartPanel';
import ProductDialog from './components/Products/ProductDialog';
import CheckoutForm from './components/Checkout/CheckoutForm';
import CheckoutSuccess from './pages/CheckoutSuccess';
import CheckoutFailure from './pages/CheckoutFailure';
import CheckoutPending from './pages/CheckoutPending';
import ToastContainer from './components/Toast/ToastContainer';
import ErrorBoundary from './components/ErrorBoundary';
import LoadingSpinner from './components/LoadingSpinner';
import { Product } from './types';
import JewelryContainer from './components/Jewelry/JewelryContainer';

// Main App Component
const MainApp: React.FC = () => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isKitBuilderOpen, setIsKitBuilderOpen] = useState(false);


  // Mobile-first body scroll management
  useEffect(() => {
    const isModalOpen = isCartOpen || selectedProduct || isCheckoutOpen || isKitBuilderOpen;
    if (isModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isCartOpen, selectedProduct, isCheckoutOpen, isKitBuilderOpen]);

  // Listen for cart opening requests
  useEffect(() => {
    const handleRequestOpenCart = () => {
      setIsCartOpen(true);
    };

    const handleOpenCheckoutForm = () => {
      setIsCartOpen(false);
      setIsCheckoutOpen(true);
    };

    const handleOpenKitBuilder = () => {
      setIsKitBuilderOpen(true);
    };

    document.addEventListener('requestOpenCart', handleRequestOpenCart);
    document.addEventListener('openCart', handleRequestOpenCart);
    document.addEventListener('openCheckoutForm', handleOpenCheckoutForm);
    document.addEventListener('openKitBuilder', handleOpenKitBuilder);
    
    return () => {
      document.removeEventListener('requestOpenCart', handleRequestOpenCart);
      document.removeEventListener('openCart', handleRequestOpenCart);
      document.removeEventListener('openCheckoutForm', handleOpenCheckoutForm);
      document.removeEventListener('openKitBuilder', handleOpenKitBuilder);
    };
  }, []);

  return (
    <div className="min-h-screen text-primary font-jost">
      <Header 
        toggleCart={() => setIsCartOpen(!isCartOpen)}
      />
      
      {/* Main content with mobile-first spacing */}
      <main className="transition-all duration-300">
        <div className="max-w-[1920px] mx-auto">
          <Suspense fallback={<LoadingSpinner />}>
            <Hero />
            <ProductsSection 
              onProductSelect={setSelectedProduct}
            />
            <JewelryContainer />
            <TestimonialsSection />
          </Suspense>
        </div>
      </main>
      
      <Footer />
      
      <AnimatePresence>
        {isCartOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 bg-black/60 mobile-backdrop"
              onClick={() => setIsCartOpen(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="fixed top-0 right-0 z-50 w-full h-full max-w-md lg:max-w-lg"
            >
              <CartPanel 
                isOpen={isCartOpen} 
                onClose={() => setIsCartOpen(false)} 
              />
            </motion.div>
          </>
        )}
        
        {selectedProduct && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 bg-black/60 mobile-backdrop"
              onClick={() => setSelectedProduct(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-2 lg:p-6"
            >
              <ProductDialog 
                product={selectedProduct} 
                onClose={() => setSelectedProduct(null)} 
                onOpenCart={() => setIsCartOpen(true)}
              />
            </motion.div>
          </>
        )}

        {isCheckoutOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 bg-black/60 mobile-backdrop"
              onClick={() => setIsCheckoutOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-2 lg:p-6"
            >
              <CheckoutForm onClose={() => setIsCheckoutOpen(false)} />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Toast Container */}
      <ToastContainer />
    </div>
  );
};

function App() {
  return (
    <ErrorBoundary>
      <ToastProvider>
        <CartProvider>
          <Router>
            <Routes>
              <Route path="/" element={<MainApp />} />
              <Route path="/checkout/success" element={<CheckoutSuccess />} />
              <Route path="/checkout/failure" element={<CheckoutFailure />} />
              <Route path="/checkout/pending" element={<CheckoutPending />} />
            </Routes>
          </Router>
        </CartProvider>
      </ToastProvider>
    </ErrorBoundary>
  );
}

export default App;
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Ruler, ChevronLeft, ChevronRight } from 'lucide-react';

interface RingSizeGuideProps {
  isOpen: boolean;
  onClose: () => void;
}

const measurementMethods = [
  {
    title: 'Medir con Papel',
    steps: [
      'Cortá una tira fina de papel, envolvé alrededor de tu dedo y marcá donde se superpone',
      'Medí con regla (en mm) y dividí por 3.14 para el diámetro',
      'Buscá en la tabla tu talla y listo!'
    ]
  },
  {
    title: 'Anillo Existente',
    steps: [
      'Tomá un anillo que te quede bien',
      'Medí el diámetro interno en mm',
      'Buscá el diámetro en la tabla'
    ]
  }
];

const diameters = [
  { size: '10', diameter: '15,9', perimeter: '50' },
  { size: '12', diameter: '16,5', perimeter: '52' },
  { size: '14', diameter: '17,2', perimeter: '54' },
  { size: '16', diameter: '17,8', perimeter: '56' },
  { size: '20', diameter: '19,1', perimeter: '60' },
  { size: '23', diameter: '20,4', perimeter: '64' },
  { size: '25', diameter: '21,0', perimeter: '66' }
];

const RingSizeGuide: React.FC<RingSizeGuideProps> = ({ isOpen, onClose }) => {
  const [activeMethod, setActiveMethod] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);

  if (!isOpen) return null;

  const currentMethod = measurementMethods[activeMethod];

  const nextStep = () => {
    if (currentStep < currentMethod.steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const switchMethod = (methodIndex: number) => {
    setActiveMethod(methodIndex);
    setCurrentStep(0);
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-4 backdrop-blur-sm bg-black/70"
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="size-guide-title"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      <motion.div
        className="relative flex flex-col w-full max-w-md bg-white shadow-2xl sm:rounded-2xl sm:max-h-[85vh] max-h-screen overflow-hidden"
        onClick={e => e.stopPropagation()}
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.3 }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-secondary/20 sm:p-6">
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-accent/10">
              <Ruler className="w-4 h-4 text-accent" />
            </div>
            <h2 id="size-guide-title" className="text-lg font-semibold text-primary sm:text-xl">
              Guía de Tallas
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 transition-colors rounded-xl text-primary hover:text-accent hover:bg-gray-100"
            aria-label="Cerrar guía"
          >
            <X size={20} />
          </button>
        </div>

        {/* Method Tabs - Mobile optimized */}
        <div className="flex p-2 border-b border-secondary/20 bg-gray-50">
          {measurementMethods.map((method, idx) => (
            <button
              key={idx}
              onClick={() => switchMethod(idx)}
              className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                activeMethod === idx
                  ? 'bg-accent text-white shadow-sm'
                  : 'text-content hover:text-primary hover:bg-white/50'
              }`}
            >
              {method.title}
            </button>
          ))}
        </div>

        {/* Content - Scrollable */}
        <div className="flex-1 overflow-y-auto">
          {/* Step-by-step guide - Mobile optimized */}
          <div className="p-4 sm:p-6">
            <div className="mb-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-base font-semibold text-primary sm:text-lg">
                  {currentMethod.title}
                </h3>
                <span className="px-2 py-1 text-xs font-medium rounded-full bg-accent/10 text-accent">
                  {currentStep + 1} de {currentMethod.steps.length}
                </span>
              </div>

              {/* Progress bar */}
              <div className="w-full h-2 mb-4 overflow-hidden rounded-full bg-gray-200">
                <div 
                  className="h-full transition-all duration-300 rounded-full bg-accent"
                  style={{ width: `${((currentStep + 1) / currentMethod.steps.length) * 100}%` }}
                />
              </div>

              {/* Current step */}
              <div className="p-4 rounded-xl bg-accent/5 border border-accent/20">
                <p className="text-sm font-medium text-primary sm:text-base">
                  Paso {currentStep + 1}:
                </p>
                <p className="mt-1 text-sm text-content sm:text-base">
                  {currentMethod.steps[currentStep]}
                </p>
              </div>

              {/* Navigation buttons */}
              <div className="flex justify-between mt-4">
                <button
                  onClick={prevStep}
                  disabled={currentStep === 0}
                  className="flex items-center px-3 py-2 text-sm font-medium transition-colors rounded-lg text-content hover:text-primary hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft size={16} className="mr-1" />
                  Anterior
                </button>
                <button
                  onClick={nextStep}
                  disabled={currentStep === currentMethod.steps.length - 1}
                  className="flex items-center px-3 py-2 text-sm font-medium transition-colors rounded-lg text-content hover:text-primary hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Siguiente
                  <ChevronRight size={16} className="ml-1" />
                </button>
              </div>
            </div>

            {/* Size Table - Mobile optimized */}
            <div className="mt-6">
              <h4 className="mb-3 text-base font-semibold text-primary">Tabla de Tallas</h4>
              <div className="overflow-hidden border rounded-lg border-secondary/20">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-accent/10">
                      <th className="p-3 text-left font-semibold text-primary">Talla</th>
                      <th className="p-3 text-left font-semibold text-primary">Diámetro</th>
                      <th className="p-3 text-left font-semibold text-primary">Perímetro</th>
                    </tr>
                  </thead>
                  <tbody>
                    {diameters.map((row, i) => (
                      <tr key={i} className="border-t border-secondary/20 hover:bg-accent/5">
                        <td className="p-3 font-medium text-primary">{row.size}</td>
                        <td className="p-3 text-content">{row.diameter} mm</td>
                        <td className="p-3 text-content">{row.perimeter} mm</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="mt-3 text-xs text-gray-500 sm:text-sm">
                💡 Si tu medida está entre dos tallas, elegí la más grande para mayor comodidad.
              </p>
            </div>

            {/* Tips section */}
            <div className="p-4 mt-6 rounded-xl bg-blue-50 border border-blue-200">
              <h5 className="mb-2 text-sm font-semibold text-blue-800">Consejos útiles:</h5>
              <ul className="space-y-1 text-xs text-blue-700 sm:text-sm">
                <li>• Medí al final del día cuando tus dedos están más hinchados</li>
                <li>• Asegurate de que el papel no esté muy apretado ni muy suelto</li>
                <li>• Para mayor precisión, medí varias veces</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Footer - Fixed at bottom */}
        <div className="p-4 border-t border-secondary/20 bg-gray-50 sm:p-6">
          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-3 text-sm font-semibold text-white transition-colors rounded-xl bg-accent hover:bg-supporting sm:text-base"
            >
              Entendido
            </button>
            <a
              href="https://wa.me/541126720095?text=Hola%2C%20necesito%20ayuda%20con%20las%20tallas%20de%20anillos"
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 px-4 py-3 text-sm font-medium text-center transition-colors border rounded-xl border-accent text-accent hover:bg-accent/10 sm:text-base"
            >
              ¿Necesitás ayuda?
            </a>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default RingSizeGuide;
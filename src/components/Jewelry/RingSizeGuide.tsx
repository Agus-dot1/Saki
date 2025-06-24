import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Ruler } from 'lucide-react';

interface RingSizeGuideProps {
  isOpen: boolean;
  onClose: () => void;
}

const measurementMethods = [
    {
    title: 'Medir el Dedo con una Cinta',
    steps: [
      'Cortá una tira fina de papel o usá un hilo.',
      'Envolvé el papel o hilo alrededor de la base de tu dedo.',
      'Marcá el punto donde se superpone.',
      'Medí la longitud con una regla (en mm).',
      'Dividí la medida por 3.14 para obtener el diámetro aproximado.',
      'Buscá el diámetro en la tabla para conocer tu talla.'
    ]
  },
  {
    title: 'Usar un Anillo Existente',
    steps: [
      'Tomá un anillo que te quede bien en el dedo deseado.',
      'Medí el diámetro interno del anillo con una regla en milímetros.',
      'Buscá el diámetro en la tabla para conocer tu talla.'
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

  if (!isOpen) return null;

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center min-w-full min-h-screen p-2 overflow-hidden backdrop-blur-sm bg-black/70 sm:p-3"
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
        className="relative flex flex-col w-full max-w-lg bg-white shadow-2xl rounded-xl"
        onClick={e => e.stopPropagation()}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.2 }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-2 border-b border-secondary/20">
          <div className="flex items-center space-x-3">
            <Ruler className="text-accent" size={24} />
            <h2 id="size-guide-title" className="text-xl font-medium text-primary">
              Guía de Tallas de Anillos
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 transition-colors rounded-xl text-primary hover:text-accent"
            aria-label="Cerrar guía"
          >
            <X size={24} />
          </button>
        </div>

        {/* Method Tabs */}
        <div className="flex p-2 border-b border-secondary/20">
          {measurementMethods.map((method, idx) => (
            <button
              key={method.title}
              onClick={() => setActiveMethod(idx)}
              className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all duration-200 ${
                activeMethod === idx
                  ? 'bg-accent text-white shadow-md'
                  : 'text-content hover:text-primary hover:bg-secondary/50'
              }`}
            >
              {method.title}
            </button>
          ))}
        </div>

        {/* Steps */}
        <div className="p-4">
          <h3 className="mb-2 text-lg font-medium text-primary">
            {measurementMethods[activeMethod].title}
          </h3>
          <ol className="mb-3 space-y-2 list-decimal list-inside text-content">
            {measurementMethods[activeMethod].steps.map((step, i) => (
              <li key={i}>{step}</li>
            ))}
          </ol>

          {/* Size Table */}
          <h4 className="mt-4 mb-2 font-medium text-primary">Tabla de Tallas Disponibles</h4>
          <table className="w-full mb-2 text-sm border rounded-lg border-secondary/20">
            <thead>
              <tr className="bg-accent/10">
                <th className="p-2 text-left border-b border-secondary/20">Talla</th>
                <th className="p-2 text-left border-b border-secondary/20">Diámetro (mm)</th>
                <th className="p-2 text-left border-b border-secondary/20">Perímetro (mm)</th>
              </tr>
            </thead>
            <tbody>
              {diameters.map((row, i) => (
                <tr key={i} className="hover:bg-accent/5">
                  <td className="p-2 border-b border-secondary/20">{row.size}</td>
                  <td className="p-2 border-b border-secondary/20">{row.diameter}</td>
                  <td className="p-2 border-b border-secondary/20">{row.perimeter}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="text-xs text-gray-500">
            Si tu medida está entre dos tallas, elegí la más grande para mayor comodidad.
          </p>
        </div>

        {/* Footer */}
        <div className="flex justify-end p-2 border-t border-secondary/20">
          <button
            onClick={onClose}
            className="px-6 py-2 text-white transition-colors rounded-lg bg-accent hover:bg-supporting"
          >
            Cerrar Guía
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default RingSizeGuide;
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Download, Ruler, Info, ChevronLeft, ChevronRight } from 'lucide-react';
import { ringSizes, sizeGuideSteps } from '../../data/jewelryData';
import { RingSize, SizeGuideStep } from '../../types/jewelry';

interface RingSizeGuideProps {
  isOpen: boolean;
  onClose: () => void;
}

const RingSizeGuide: React.FC<RingSizeGuideProps> = ({ isOpen, onClose }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [selectedSize, setSelectedSize] = useState<RingSize | null>(null);
  const [showSizeChart, setShowSizeChart] = useState(false);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  const nextStep = () => {
    setActiveStep((prev) => Math.min(prev + 1, sizeGuideSteps.length - 1));
  };

  const prevStep = () => {
    setActiveStep((prev) => Math.max(prev - 1, 0));
  };

  const handlePrintGuide = () => {
    // Create a printable version
    const printContent = `
      <html>
        <head>
          <title>Guía de Tallas de Anillos - Saki</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            .size-chart { border-collapse: collapse; width: 100%; margin: 20px 0; }
            .size-chart th, .size-chart td { border: 1px solid #ddd; padding: 8px; text-align: center; }
            .size-chart th { background-color: #f2f2f2; }
            .ruler { border: 2px solid #000; height: 20px; margin: 20px 0; position: relative; }
            .ruler::after { content: 'Recortá esta regla y usala para medir'; position: absolute; top: -25px; left: 0; }
          </style>
        </head>
        <body>
          <h1>Guía de Tallas de Anillos - Saki</h1>
          <h2>Tabla de Conversión de Tallas</h2>
          <table class="size-chart">
            <thead>
              <tr>
                <th>Talla US</th>
                <th>Talla UK</th>
                <th>Talla EU</th>
                <th>Circunferencia</th>
                <th>Diámetro</th>
              </tr>
            </thead>
            <tbody>
              ${ringSizes.map(size => `
                <tr>
                  <td>${size.us}</td>
                  <td>${size.uk}</td>
                  <td>${size.eu}</td>
                  <td>${size.circumference}</td>
                  <td>${size.diameter}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          <h2>Regla de Medición</h2>
          <div class="ruler"></div>
          <p><strong>Instrucciones:</strong></p>
          <ol>
            <li>Recortá la regla de arriba</li>
            <li>Envolvé un hilo alrededor de tu dedo</li>
            <li>Marcá donde se superpone el hilo</li>
            <li>Medí la longitud con la regla</li>
            <li>Consultá la tabla para encontrar tu talla</li>
          </ol>
        </body>
      </html>
    `;

    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(printContent);
      printWindow.document.close();
      printWindow.print();
    }
  };

  if (!isOpen) return null;

  return (
    <motion.div 
      className="flex overflow-hidden fixed inset-0 z-50 justify-center items-center p-2 min-w-full min-h-screen backdrop-blur-sm bg-black/70 sm:p-4"
      onClick={handleBackdropClick}
      onKeyDown={handleKeyDown}
      role="dialog"
      aria-modal="true"
      aria-labelledby="size-guide-title"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      <motion.div 
        className="relative flex flex-col w-full max-w-4xl h-[95vh] overflow-hidden bg-white shadow-2xl rounded-xl lg:rounded-2xl"
        onClick={(e) => e.stopPropagation()}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.2 }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b lg:p-6 border-secondary/20">
          <div className="flex items-center space-x-3">
            <Ruler className="text-accent" size={24} />
            <h2 id="size-guide-title" className="text-xl font-medium lg:text-2xl text-primary">
              Guía de Tallas de Anillos
            </h2>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrintGuide}
              className="flex items-center space-x-2 px-3 py-2 text-sm font-medium transition-colors rounded-lg lg:px-4 lg:py-2 lg:text-base text-accent hover:bg-accent/10"
            >
              <Download size={16} />
              <span>Imprimir</span>
            </button>
            <button 
              onClick={onClose}
              className="p-2 transition-colors rounded-xl text-primary hover:text-accent lg:p-3"
              aria-label="Cerrar guía"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex p-2 border-b lg:p-4 border-secondary/20">
          <button
            onClick={() => setShowSizeChart(false)}
            className={`flex-1 py-2 px-4 lg:py-3 lg:px-6 rounded-lg text-sm lg:text-base font-medium transition-all duration-200 ${
              !showSizeChart
                ? 'bg-accent text-white shadow-md'
                : 'text-content hover:text-primary hover:bg-secondary/50'
            }`}
          >
            Cómo Medir
          </button>
          <button
            onClick={() => setShowSizeChart(true)}
            className={`flex-1 py-2 px-4 lg:py-3 lg:px-6 rounded-lg text-sm lg:text-base font-medium transition-all duration-200 ${
              showSizeChart
                ? 'bg-accent text-white shadow-md'
                : 'text-content hover:text-primary hover:bg-secondary/50'
            }`}
          >
            Tabla de Tallas
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          <AnimatePresence mode="wait">
            {!showSizeChart ? (
              <motion.div
                key="measurement-guide"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
                className="p-4 lg:p-6"
              >
                {/* Step Navigation */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex space-x-2">
                    {sizeGuideSteps.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setActiveStep(index)}
                        className={`w-3 h-3 rounded-full transition-all duration-200 ${
                          index === activeStep
                            ? 'bg-accent scale-125'
                            : index < activeStep
                            ? 'bg-accent/60'
                            : 'bg-secondary border border-accent/30'
                        }`}
                        aria-label={`Ir al paso ${index + 1}`}
                      />
                    ))}
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={prevStep}
                      disabled={activeStep === 0}
                      className="p-2 transition-colors rounded-lg disabled:opacity-50 disabled:cursor-not-allowed text-accent hover:bg-accent/10"
                    >
                      <ChevronLeft size={20} />
                    </button>
                    <button
                      onClick={nextStep}
                      disabled={activeStep === sizeGuideSteps.length - 1}
                      className="p-2 transition-colors rounded-lg disabled:opacity-50 disabled:cursor-not-allowed text-accent hover:bg-accent/10"
                    >
                      <ChevronRight size={20} />
                    </button>
                  </div>
                </div>

                {/* Step Content */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeStep}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-6"
                  >
                    <div className="text-center">
                      <h3 className="mb-2 text-lg font-medium lg:text-xl text-primary">
                        Paso {activeStep + 1}: {sizeGuideSteps[activeStep].title}
                      </h3>
                      <p className="text-base leading-relaxed lg:text-lg text-content">
                        {sizeGuideSteps[activeStep].description}
                      </p>
                    </div>

                    {/* Step Image */}
                    {sizeGuideSteps[activeStep].image && (
                      <div className="flex justify-center">
                        <div className="overflow-hidden w-full max-w-md rounded-xl shadow-lg aspect-video">
                          <img
                            src={sizeGuideSteps[activeStep].image}
                            alt={sizeGuideSteps[activeStep].title}
                            className="object-cover w-full h-full"
                          />
                        </div>
                      </div>
                    )}

                    {/* Step Tip */}
                    {sizeGuideSteps[activeStep].tip && (
                      <div className="p-4 rounded-lg bg-blue-50 lg:p-6">
                        <div className="flex items-start space-x-3">
                          <Info className="flex-shrink-0 mt-1 text-blue-600" size={20} />
                          <div>
                            <h4 className="mb-1 font-medium text-blue-800">Consejo:</h4>
                            <p className="text-sm text-blue-700 lg:text-base">
                              {sizeGuideSteps[activeStep].tip}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>

                {/* Navigation Buttons */}
                <div className="flex justify-between pt-6 mt-8 border-t border-secondary/20">
                  <button
                    onClick={prevStep}
                    disabled={activeStep === 0}
                    className="flex items-center space-x-2 px-4 py-2 text-sm font-medium transition-colors rounded-lg lg:px-6 lg:py-3 lg:text-base disabled:opacity-50 disabled:cursor-not-allowed text-content hover:text-primary hover:bg-secondary/50"
                  >
                    <ChevronLeft size={16} />
                    <span>Anterior</span>
                  </button>
                  <button
                    onClick={nextStep}
                    disabled={activeStep === sizeGuideSteps.length - 1}
                    className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-white transition-colors rounded-lg lg:px-6 lg:py-3 lg:text-base disabled:opacity-50 disabled:cursor-not-allowed bg-accent hover:bg-supporting"
                  >
                    <span>Siguiente</span>
                    <ChevronRight size={16} />
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="size-chart"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="p-4 lg:p-6"
              >
                <div className="mb-6 text-center">
                  <h3 className="mb-2 text-lg font-medium lg:text-xl text-primary">
                    Tabla de Conversión de Tallas
                  </h3>
                  <p className="text-base text-content lg:text-lg">
                    Encontrá tu talla perfecta con nuestra tabla de conversión internacional
                  </p>
                </div>

                {/* Size Chart Table */}
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse rounded-lg shadow-sm">
                    <thead>
                      <tr className="bg-accent/10">
                        <th className="p-3 text-left border lg:p-4 border-secondary/20 text-primary">Talla US</th>
                        <th className="p-3 text-left border lg:p-4 border-secondary/20 text-primary">Talla UK</th>
                        <th className="p-3 text-left border lg:p-4 border-secondary/20 text-primary">Talla EU</th>
                        <th className="p-3 text-left border lg:p-4 border-secondary/20 text-primary">Circunferencia</th>
                        <th className="p-3 text-left border lg:p-4 border-secondary/20 text-primary">Diámetro</th>
                      </tr>
                    </thead>
                    <tbody>
                      {ringSizes.map((size, index) => (
                        <tr
                          key={index}
                          className={`transition-colors hover:bg-accent/5 ${
                            selectedSize?.us === size.us ? 'bg-accent/10' : ''
                          }`}
                          onClick={() => setSelectedSize(size)}
                        >
                          <td className="p-3 border lg:p-4 border-secondary/20 text-content">{size.us}</td>
                          <td className="p-3 border lg:p-4 border-secondary/20 text-content">{size.uk}</td>
                          <td className="p-3 border lg:p-4 border-secondary/20 text-content">{size.eu}</td>
                          <td className="p-3 border lg:p-4 border-secondary/20 text-content">{size.circumference}</td>
                          <td className="p-3 border lg:p-4 border-secondary/20 text-content">{size.diameter}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Selected Size Info */}
                {selectedSize && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 mt-6 rounded-lg lg:p-6 bg-accent/10"
                  >
                    <h4 className="mb-2 font-medium text-primary">Talla Seleccionada:</h4>
                    <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
                      <div>
                        <span className="text-sm font-medium text-content">US:</span>
                        <p className="text-lg font-medium text-primary">{selectedSize.us}</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-content">UK:</span>
                        <p className="text-lg font-medium text-primary">{selectedSize.uk}</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-content">EU:</span>
                        <p className="text-lg font-medium text-primary">{selectedSize.eu}</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-content">Circunferencia:</span>
                        <p className="text-lg font-medium text-primary">{selectedSize.circumference}</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-content">Diámetro:</span>
                        <p className="text-lg font-medium text-primary">{selectedSize.diameter}</p>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Important Notes */}
                <div className="p-4 mt-6 rounded-lg lg:p-6 bg-yellow-50">
                  <h4 className="mb-3 font-medium text-yellow-800">Notas Importantes:</h4>
                  <ul className="space-y-2 text-sm text-yellow-700 lg:text-base">
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>Los dedos cambian de tamaño durante el día. Medí al final del día para mayor precisión.</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>Si estás entre dos tallas, elegí la más grande para mayor comodidad.</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>Los anillos anchos requieren una talla más grande que los anillos delgados.</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>Para mayor precisión, consultá con un joyero profesional.</span>
                    </li>
                  </ul>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div className="p-4 border-t lg:p-6 border-secondary/20">
          <div className="flex flex-col gap-3 lg:flex-row lg:justify-between lg:items-center">
            <p className="text-sm text-content lg:text-base">
              ¿Necesitás ayuda? Contactanos por WhatsApp para asesoramiento personalizado.
            </p>
            <button
              onClick={onClose}
              className="px-6 py-3 text-white transition-colors rounded-lg bg-accent hover:bg-supporting"
            >
              Cerrar Guía
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default RingSizeGuide;
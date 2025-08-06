import React from 'react';
import { motion } from 'framer-motion';
import { WIZARD_STEPS, WizardStep } from './constants';

interface KitBuilderProgressProps {
  step: WizardStep;
}

export const KitBuilderProgress: React.FC<KitBuilderProgressProps> = ({ step }) => {
  return (
    <motion.div
      className="absolute z-20 left-2 md:left-24 top-4 md:top-6"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      <div className="flex items-center px-4 py-2 space-x-2 text-xs rounded-full shadow-lg md:px-6 md:py-3 md:space-x-3 bg-white/80 backdrop-blur-sm md:text-base">
        {WIZARD_STEPS.map((stepName, index) => (
          <div key={stepName} className="flex items-center">
            <div
              className={`w-2 h-2 md:w-3 md:h-3 rounded-full transition-all duration-300 ${
                step === stepName
                  ? 'bg-accent scale-125'
                  : index < WIZARD_STEPS.indexOf(step)
                  ? 'bg-accent'
                  : 'bg-gray-200'
              }`}
            />
            {index < WIZARD_STEPS.length - 1 && (
              <div
                className={`w-4 h-0.5 md:w-8 mx-0.5 md:mx-1 transition-all duration-300 ${
                  index < WIZARD_STEPS.indexOf(step) ? 'bg-accent' : 'bg-gray-200'
                }`}
              />
            )}
          </div>
        ))}
      </div>
    </motion.div>
  );
};
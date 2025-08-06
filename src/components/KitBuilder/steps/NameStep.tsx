import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Shuffle, Sparkles } from 'lucide-react';
import { itemVariants, stepVariants } from '../constants';

interface NameStepProps {
  kitName: string;
  setKitName: (name: string) => void;
  generateRandomName: () => void;
  nextStep: () => void;
  canContinueFromName: boolean;
}

export const NameStep: React.FC<NameStepProps> = ({
  kitName,
  setKitName,
  generateRandomName,
  nextStep,
  canContinueFromName,
}) => {
  return (
    <motion.div
      key="step-name"
      variants={stepVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="text-center"
    >
      <motion.div variants={itemVariants} className="mb-6 md:mb-8">
        <div className="flex items-center justify-center mb-4 md:mb-6">
          <div className="p-3 rounded-full md:p-4 bg-gradient-to-br from-accent to-supporting">
            <Sparkles size={24} className="text-white" />
          </div>
        </div>
        <h1 className="mb-2 text-2xl font-bold md:mb-4 md:text-4xl lg:text-6xl text-primary">
          Nombrá tu Kit
        </h1>
        <p className="max-w-xs mx-auto text-base leading-relaxed md:max-w-2xl md:text-lg lg:text-xl text-content">
          Dale vida a tu rutina personalizada con un nombre único que refleje tu estilo y personalidad
        </p>
      </motion.div>

      <motion.div variants={itemVariants} className="max-w-xs mx-auto mb-6 md:max-w-md md:mb-8">
        <div className="relative">
          <input
            type="text"
            placeholder="Ej: Mi Rutina Matutina"
            value={kitName}
            onChange={(e) => setKitName(e.target.value)}
            className="w-full px-4 py-2 text-base text-center transition-all duration-200 border-2 md:px-6 md:py-4 md:text-xl border-accent/20 rounded-xl md:rounded-2xl focus:border-accent focus:ring-4 focus:ring-accent/20 bg-white/80 backdrop-blur-sm placeholder-content/60"
            maxLength={50}
          />
          <div className="absolute right-0 text-xs md:text-sm -bottom-5 md:-bottom-6 text-content/60">
            {kitName.length}/50
          </div>
        </div>
      </motion.div>

      <motion.div variants={itemVariants} className="mb-8 md:mb-12">
        <button
          type="button"
          onClick={generateRandomName}
          className="inline-flex items-center px-4 py-2 space-x-2 text-sm transition-colors duration-200 rounded-lg md:px-6 md:py-3 text-accent hover:text-supporting bg-accent/10 hover:bg-accent/20 md:rounded-xl md:text-base"
        >
          <Shuffle size={16} />
          <span>Generar nombre aleatorio</span>
        </button>
      </motion.div>

      <motion.div variants={itemVariants}>
        <button
          type="button"
          onClick={nextStep}
          disabled={!canContinueFromName}
          className="inline-flex items-center px-6 py-3 space-x-2 text-base font-medium text-white transition-all duration-300 transform md:px-8 md:py-4 md:space-x-3 md:text-lg bg-gradient-to-r from-accent to-supporting rounded-xl md:rounded-2xl hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none hover:scale-105"
        >
          <span>Comenzar a Armar</span>
          <ArrowRight size={18} />
        </button>
      </motion.div>
    </motion.div>
  );
};
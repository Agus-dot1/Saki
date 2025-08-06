import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import { KitBuilderModalProps } from '../../types/builder';
import { useKitBuilder } from '../../hooks/useKitBuilder';
import { wizardVariants, stepVariants, MAX_ITEMS } from './constants';
import { NameStep, SelectStep, CustomizeStep, SummaryStep } from './steps';
import { KitBuilderProgress } from './KitBuilderProgress';
import { KitSummaryBar } from './KitSummaryBar';

const KitBuilderModal: React.FC<KitBuilderModalProps> = ({ isOpen, onClose }) => {
  const {
    selectedItems,
    activeCategory,
    kitName,
    step,
    totalPrice,
    totalItems,
    hasDiscount,
    discountAmount,
    finalPrice,
    canOrder,
    progress,
    filteredItems,
    canContinueFromName,
    canContinueFromSelect,
    setActiveCategory,
    setKitName,
    generateRandomName,
    addItemToKit,
    updateItemQuantity,
    handleAddToCart,
    nextStep,
    prevStep,
  } = useKitBuilder(onClose);

  if (!isOpen) return null;

  const renderStep = () => {
    switch (step) {
      case 'name':
        return (
          <NameStep
            kitName={kitName}
            setKitName={setKitName}
            generateRandomName={generateRandomName}
            nextStep={nextStep}
            canContinueFromName={canContinueFromName}
          />
        );
      case 'select':
        return (
          <SelectStep
            kitName={kitName}
            activeCategory={activeCategory}
            setActiveCategory={setActiveCategory}
            filteredItems={filteredItems}
            selectedItems={selectedItems}
            addItemToKit={addItemToKit}
            updateItemQuantity={updateItemQuantity}
            totalItems={totalItems}
            MAX_ITEMS={MAX_ITEMS}
            finalPrice={finalPrice}
            progress={progress}
            prevStep={prevStep}
            nextStep={nextStep}
            canContinueFromSelect={canContinueFromSelect}
          />
        );
      case 'customize':
        return (
          <CustomizeStep
            kitName={kitName}
            setKitName={setKitName}
            selectedItems={selectedItems}
            updateItemQuantity={updateItemQuantity}
            totalItems={totalItems}
            MAX_ITEMS={MAX_ITEMS}
            prevStep={prevStep}
            nextStep={nextStep}
          />
        );
      case 'summary':
        return (
          <SummaryStep
            kitName={kitName}
            selectedItems={selectedItems}
            totalItems={totalItems}
            totalPrice={totalPrice}
            hasDiscount={hasDiscount}
            discountAmount={discountAmount}
            finalPrice={finalPrice}
            canOrder={canOrder}
            prevStep={prevStep}
            handleAddToCart={handleAddToCart}
          />
        );
      default:
        return null;
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 overflow-x-hidden overflow-y-auto py-14 bg-gradient-to-b from-white to-white/80 backdrop-blur-sm"
        variants={wizardVariants}
        initial="initial"
        animate="animate"
        exit="exit"
      >
        <motion.button
          onClick={onClose}
          className="absolute z-20 flex items-center justify-center p-2 transition-all duration-200 rounded-full shadow-lg md:p-3 top-2 right-2 md:top-6 md:right-6 bg-white/80 backdrop-blur-sm hover:bg-white hover:scale-110"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <X size={22} className="text-primary" />
        </motion.button>

        <KitBuilderProgress step={step} />

        <div className="flex items-center justify-center min-h-screen p-2 overflow-x-hidden md:p-6">
          <div className="w-full max-w-sm mx-auto md:max-w-4xl">
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                variants={stepVariants}
                initial="initial"
                animate="animate"
                exit="exit"
              >
                {renderStep()}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {step !== 'name' && (
          <KitSummaryBar
            totalItems={totalItems}
            finalPrice={finalPrice}
            hasDiscount={hasDiscount}
          />
        )}
      </motion.div>
    </AnimatePresence>
  );
};

export default KitBuilderModal;
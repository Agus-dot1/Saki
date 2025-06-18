import React, { useState } from 'react';
import JewelrySection from './JewelrySection';
import JewelryDialog from './JewelryDialog';
import RingSizeGuide from './RingSizeGuide';
import { JewelryItem } from '../../types/jewelry';

const JewelryContainer: React.FC = () => {
  const [selectedItem, setSelectedItem] = useState<JewelryItem | null>(null);
  const [showSizeGuide, setShowSizeGuide] = useState(false);

  const handleItemSelect = (item: JewelryItem) => {
    setSelectedItem(item);
  };

  const handleCloseDialog = () => {
    setSelectedItem(null);
  };

  // Handle cart opening after adding item
  const handleOpenCart = () => {
    document.dispatchEvent(new CustomEvent('requestOpenCart'));
  };

  // Handle ring size guide
  React.useEffect(() => {
    const handleOpenSizeGuide = () => {
      setShowSizeGuide(true);
    };

    document.addEventListener('openRingSizeGuide', handleOpenSizeGuide);
    return () => {
      document.removeEventListener('openRingSizeGuide', handleOpenSizeGuide);
    };
  }, []);

  return (
    <>
      <JewelrySection onItemSelect={handleItemSelect} />

      {selectedItem && (
        <JewelryDialog
          item={selectedItem}
          onClose={handleCloseDialog}
          onOpenCart={handleOpenCart}
        />
      )}

      <RingSizeGuide 
        isOpen={showSizeGuide}
        onClose={() => setShowSizeGuide(false)}
      />
    </>
  );
};

export default JewelryContainer;
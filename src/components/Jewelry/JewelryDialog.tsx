import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, ShoppingCart, Info, Package, ZoomIn } from 'lucide-react';
import { JewelryItem } from '../../types/jewelry';
import { useCart } from '../../hooks/useCart';
import { useToast } from '../../hooks/useToast';
import { mapJewelryToProduct } from '../../utils/mapJewelryToProduct';

interface JewelryDialogProps {
  item: JewelryItem;
  onClose: () => void;
  onOpenCart: () => void;
}

const JewelryDialog: React.FC<JewelryDialogProps> = ({ item, onClose, onOpenCart }) => {
  const { addToCart } = useCart();
  const { showSuccess } = useToast();
  const [selectedModel, setSelectedModel] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string | undefined>(
    item.availableSizes?.[0]
  );
  const [showImageModal, setShowImageModal] = useState(false);
  const [modalImageIndex, setModalImageIndex] = useState<number | null>(null);

  const handleAddToCart = () => {
    const productForCart = mapJewelryToProduct({
      ...item,
      modelNumber: selectedModel + 1,
      selectedSize: selectedSize,
    });

    addToCart(productForCart);
    // showSuccess('Producto Agregado', `${item.name} - Modelo ${selectedModel + 1} fue agregado al carrito`);
    onClose();
    onOpenCart();
  };


  const closeImageModal = () => {
    setShowImageModal(false);
    setModalImageIndex(null);
  };

  return (
    <motion.div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm bg-black/70"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div 
        className="relative w-full max-w-md bg-white shadow-2xl rounded-xl"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
      >
        {/* Close button */}
        <button 
          onClick={onClose}
          className="absolute p-2 rounded-full top-3 right-3 hover:bg-gray-100"
        >
          <X size={20} />
        </button>

        <div className="p-6">
          {/* Header */}
          <h2 className="mb-2 text-xl font-medium">{item.name}</h2>
          <p className="mb-4 text-sm text-gray-600">{item.description}</p>

          {/* Model Selection Text */}
          <p className="mb-2 text-sm font-medium text-accent">
            Modelo seleccionado: {selectedModel + 1}
          </p>

            {/* Models Grid */}
            <div className="flex flex-col items-center mb-4">
            {item.isGrid ? (
              <>
              <div className="relative w-full max-w-xs mb-2 aspect-square">
                <img
                src={item.images[selectedModel]}
                alt={`${item.name} modelo ${selectedModel + 1}`}
                className="object-cover w-full h-full rounded-lg shadow"
                />
                <button
                type="button"
                onClick={() => {
                  setModalImageIndex(selectedModel);
                  setShowImageModal(true);
                }}
                className="absolute flex items-center justify-center p-2 transition rounded-full shadow top-2 right-2 bg-white/80 hover:bg-white"
                aria-label="Ver grande"
                >
                <ZoomIn size={18} className="text-accent" />
                </button>
              </div>
              {/* Model Selector */}
              <div className="flex gap-2">
                {item.images.map((_, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => setSelectedModel(index)}
                  className={`w-8 h-8 rounded-full border-2 transition-all
                  ${selectedModel === index ? 'border-accent scale-110' : 'border-gray-200'}`}
                  aria-label={`Seleccionar modelo ${index + 1}`}
                >
                  <span className="block w-full h-full overflow-hidden bg-gray-200 rounded-full">
                  <img
                    src={item.images[index]}
                    alt={`Modelo ${index + 1}`}
                    className="object-cover w-full h-full"
                  />
                  </span>
                </button>
                ))}
              </div>
              </>
            ) : (
              <>
              <div className="relative w-full max-w-xs mb-2 aspect-square">
                <img
                src={item.images[0]}
                alt={`${item.name} modelo ${selectedModel + 1}`}
                className="object-cover w-full h-full rounded-lg shadow"
                />
                <button
                type="button"
                onClick={() => {
                  setModalImageIndex(0);
                  setShowImageModal(true);
                }}
                className="absolute flex items-center justify-center p-2 transition rounded-full shadow top-2 right-2 bg-white/80 hover:bg-white"
                aria-label="Ver grande"
                >
                <ZoomIn size={18} className="text-accent" />
                </button>
              </div>
              <div className="w-full mt-3">
                <label htmlFor="model-select" className="block mb-1 text-sm font-medium text-gray-700">
                Seleccionar modelo
                </label>
                <select
                id="model-select"
                value={selectedModel}
                onChange={(e) => setSelectedModel(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-accent focus:ring-1 focus:ring-accent"
                >
                {item.models?.map((modelName, idx) => (
                  <option key={idx} value={idx}>
                  {modelName}
                  </option>
                ))}
                </select>
              </div>
              </>
            )}
            <p className="mt-2 text-sm font-medium text-accent">
              Modelo seleccionado: {selectedModel + 1}
            </p>
            </div>

          {/* Image Modal */}
          {showImageModal && modalImageIndex !== null && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
              <div className="relative">
                <button
                  onClick={closeImageModal}
                  className="absolute flex items-center justify-center p-2 bg-white rounded-full shadow top-2 right-2 hover:bg-gray-200"
                >
                  <X size={24} />
                </button>
                <img
                  src={item.images[modalImageIndex]}
                  alt={`${item.name} modelo ${modalImageIndex + 1}`}
                  className="max-w-[90vw] max-h-[80vh] rounded-lg shadow-lg"
                />
              </div>
            </div>
          )}

          {/* Material Info */}
          <div className="flex items-center gap-2 mb-4 text-sm text-gray-600">
            <Info size={16} />
            <span>{item.material}</span>
          </div>

          {/* Size Selection for Rings */}
          {item.category === 'anillo' && item.availableSizes && (
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <label className="font-medium">Talla</label>
                <button
                  onClick={() => document.dispatchEvent(new CustomEvent('openRingSizeGuide'))}
                  className="text-sm text-accent hover:underline"
                >
                  Guía de tallas
                </button>
              </div>
              <select
                value={selectedSize}
                onChange={(e) => setSelectedSize(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-accent focus:ring-1 focus:ring-accent"
              >
                {item.availableSizes.map((size) => (
                  <option key={size} value={size}>
                    Talla {size}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Price and Stock */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-medium text-accent">
                ${item.price.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
              {item.oldPrice && (
                <span className="text-sm text-gray-400 line-through">
                  ${item.oldPrice.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              )}
            </div>
            <div className="px-3 py-1 text-sm bg-gray-100 rounded-full">
              <Package size={14} className="inline mr-1" />
              {item.stock > 10 ? 'En stock' : `${item.stock} disponibles`}
            </div>
          </div>

          {/* Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            disabled={item.stock <= 0}
            className="flex items-center justify-center w-full gap-2 px-6 py-3 text-white transition-all rounded-lg bg-accent hover:bg-supporting disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            <ShoppingCart size={20} />
            Agregar al Carrito
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default JewelryDialog;
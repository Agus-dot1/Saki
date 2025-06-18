import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, ShoppingCart, Info, Package } from 'lucide-react';
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

  const handleAddToCart = () => {
    const productForCart = mapJewelryToProduct({
      ...item,
      modelNumber: selectedModel + 1,
      selectedSize: selectedSize,
    });

    addToCart(productForCart);
    showSuccess('Producto Agregado', `${item.name} - Modelo ${selectedModel + 1} fue agregado al carrito`);
    onClose();
    onOpenCart();
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
          <div className="grid grid-cols-3 gap-3 mb-6">
            <button
              onClick={() => setSelectedModel(0)}
              className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all
                ${selectedModel === 0 ? 'border-accent scale-105' : 'border-transparent'}`}
            >
              <img 
                src={item.coverImage} 
                alt={`${item.name} imagen principal`}
                className="object-cover w-full h-full"
              />
            </button>
            {item.images.map((image, index) => (
              <button
                key={index}
                onClick={() => setSelectedModel(index + 1)}
                className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all
                  ${selectedModel === index + 1 ? 'border-accent scale-105' : 'border-transparent'}`}
              >
                <img 
                  src={image} 
                  alt={`${item.name} modelo ${index + 2}`}
                  className="object-cover w-full h-full"
                />
              </button>
            ))}
          </div>

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
                ${item.price}
              </span>
              {item.oldPrice && (
                <span className="text-sm text-gray-400 line-through">
                  ${item.oldPrice}
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
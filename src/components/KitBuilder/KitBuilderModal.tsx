import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Minus, ShoppingCart, Package, Star, Check } from 'lucide-react';
import { useCart } from '../../hooks/useCart';
import { useToast } from '../../hooks/useToast';

interface KitItem {
  id: number;
  name: string;
  price: number;
  image: string;
  category: 'limpieza' | 'hidratacion' | 'tratamiento' | 'accesorios';
  description: string;
  benefits: string[];
}

interface SelectedKitItem extends KitItem {
  quantity: number;
}

interface KitBuilderModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const KitBuilderModal: React.FC<KitBuilderModalProps> = ({ isOpen, onClose }) => {
  const { addToCart } = useCart();
  const { showSuccess, showError, showInfo } = useToast();
  
  const [selectedItems, setSelectedItems] = useState<SelectedKitItem[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('limpieza');
  const [kitName, setKitName] = useState('');
  const [step, setStep] = useState<'select' | 'customize' | 'summary'>('select');

  // Configuración del kit
  const MIN_ORDER_AMOUNT = 50;
  const MAX_ITEMS = 8;
  const DISCOUNT_THRESHOLD = 100;
  const DISCOUNT_PERCENTAGE = 15;

  // Productos disponibles para el kit
  const availableItems: KitItem[] = [
    // Limpieza
    {
      id: 101,
      name: 'Limpiador Facial Suave',
      price: 12,
      image: 'https://images.pexels.com/photos/4465821/pexels-photo-4465821.jpeg?auto=compress&cs=tinysrgb&w=400',
      category: 'limpieza',
      description: 'Limpiador suave para todo tipo de piel',
      benefits: ['Elimina impurezas', 'No reseca la piel', '100% natural']
    },
    {
      id: 102,
      name: 'Exfoliante Natural',
      price: 15,
      image: 'https://images.pexels.com/photos/5069605/pexels-photo-5069605.jpeg?auto=compress&cs=tinysrgb&w=400',
      category: 'limpieza',
      description: 'Exfoliante con ingredientes naturales',
      benefits: ['Remueve células muertas', 'Textura suave', 'Ingredientes orgánicos']
    },
    {
      id: 103,
      name: 'Tónico Equilibrante',
      price: 18,
      image: 'https://images.pexels.com/photos/3737605/pexels-photo-3737605.jpeg?auto=compress&cs=tinysrgb&w=400',
      category: 'limpieza',
      description: 'Tónico que equilibra el pH de la piel',
      benefits: ['Equilibra pH', 'Minimiza poros', 'Prepara la piel']
    },

    // Hidratación
    {
      id: 201,
      name: 'Sérum Hidratante',
      price: 25,
      image: 'https://images.pexels.com/photos/4041392/pexels-photo-4041392.jpeg?auto=compress&cs=tinysrgb&w=400',
      category: 'hidratacion',
      description: 'Sérum concentrado con ácido hialurónico',
      benefits: ['Hidratación profunda', 'Ácido hialurónico', 'Absorción rápida']
    },
    {
      id: 202,
      name: 'Crema Hidratante Día',
      price: 20,
      image: 'https://images.pexels.com/photos/6621339/pexels-photo-6621339.jpeg?auto=compress&cs=tinysrgb&w=400',
      category: 'hidratacion',
      description: 'Crema hidratante para uso diario',
      benefits: ['Hidratación 24h', 'Protección UV', 'Textura ligera']
    },
    {
      id: 203,
      name: 'Mascarilla Nutritiva',
      price: 22,
      image: 'https://images.pexels.com/photos/5069606/pexels-photo-5069606.jpeg?auto=compress&cs=tinysrgb&w=400',
      category: 'hidratacion',
      description: 'Mascarilla intensiva nutritiva',
      benefits: ['Nutrición intensa', 'Uso semanal', 'Ingredientes premium']
    },

    // Tratamiento
    {
      id: 301,
      name: 'Sérum Anti-edad',
      price: 35,
      image: 'https://images.pexels.com/photos/4465821/pexels-photo-4465821.jpeg?auto=compress&cs=tinysrgb&w=400',
      category: 'tratamiento',
      description: 'Sérum concentrado anti-edad',
      benefits: ['Reduce arrugas', 'Firmeza', 'Vitamina C']
    },
    {
      id: 302,
      name: 'Contorno de Ojos',
      price: 28,
      image: 'https://images.pexels.com/photos/5069605/pexels-photo-5069605.jpeg?auto=compress&cs=tinysrgb&w=400',
      category: 'tratamiento',
      description: 'Tratamiento específico para contorno de ojos',
      benefits: ['Reduce ojeras', 'Anti-bolsas', 'Hidratación específica']
    },

    // Accesorios
    {
      id: 401,
      name: 'Gua Sha Facial',
      price: 16,
      image: 'https://images.pexels.com/photos/3737605/pexels-photo-3737605.jpeg?auto=compress&cs=tinysrgb&w=400',
      category: 'accesorios',
      description: 'Herramienta de masaje facial Gua Sha',
      benefits: ['Mejora circulación', 'Reduce tensión', 'Cuarzo natural']
    },
    {
      id: 402,
      name: 'Vincha de Spa',
      price: 8,
      image: 'https://images.pexels.com/photos/4041392/pexels-photo-4041392.jpeg?auto=compress&cs=tinysrgb&w=400',
      category: 'accesorios',
      description: 'Vincha suave para rutina de cuidado',
      benefits: ['Material suave', 'Mantiene cabello', 'Lavable']
    },
    {
      id: 403,
      name: 'Toalla Facial',
      price: 12,
      image: 'https://images.pexels.com/photos/6621339/pexels-photo-6621339.jpeg?auto=compress&cs=tinysrgb&w=400',
      category: 'accesorios',
      description: 'Toalla facial de microfibra',
      benefits: ['Microfibra suave', 'Secado rápido', 'Antibacterial']
    }
  ];

  const categories = [
    { id: 'limpieza', name: 'Limpieza', icon: '🧼' },
    { id: 'hidratacion', name: 'Hidratación', icon: '💧' },
    { id: 'tratamiento', name: 'Tratamiento', icon: '✨' },
    { id: 'accesorios', name: 'Accesorios', icon: '🛍️' }
  ];

  const totalPrice = selectedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const totalItems = selectedItems.reduce((sum, item) => sum + item.quantity, 0);
  const hasDiscount = totalPrice >= DISCOUNT_THRESHOLD;
  const discountAmount = hasDiscount ? (totalPrice * DISCOUNT_PERCENTAGE) / 100 : 0;
  const finalPrice = totalPrice - discountAmount;
  const canOrder = finalPrice >= MIN_ORDER_AMOUNT;

  const filteredItems = availableItems.filter(item => item.category === activeCategory);

  const addItemToKit = (item: KitItem) => {
    if (totalItems >= MAX_ITEMS) {
      showError('Límite Alcanzado', `Máximo ${MAX_ITEMS} productos por kit`);
      return;
    }

    setSelectedItems(prev => {
      const existing = prev.find(selected => selected.id === item.id);
      if (existing) {
        return prev.map(selected =>
          selected.id === item.id
            ? { ...selected, quantity: selected.quantity + 1 }
            : selected
        );
      } else {
        return [...prev, { ...item, quantity: 1 }];
      }
    });
  };

  const removeItemFromKit = (itemId: number) => {
    setSelectedItems(prev => prev.filter(item => item.id !== itemId));
  };

  const updateItemQuantity = (itemId: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItemFromKit(itemId);
      return;
    }

    setSelectedItems(prev =>
      prev.map(item =>
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const handleAddToCart = () => {
    if (!canOrder) {
      showError('Monto Mínimo', `El monto mínimo para armar un kit es $${MIN_ORDER_AMOUNT}`);
      return;
    }

    if (!kitName.trim()) {
      showError('Nombre Requerido', 'Por favor ingresá un nombre para tu kit');
      return;
    }

    // Crear producto personalizado para el carrito
    const customKit = {
      id: Date.now(), // ID único temporal
      name: kitName || 'Mi Kit Personalizado',
      description: `Kit personalizado con ${totalItems} productos seleccionados`,
      shortDescription: `Kit personalizado - ${totalItems} productos`,
      price: finalPrice,
      contents: selectedItems.map(item => `${item.quantity}x ${item.name}`),
      images: [selectedItems[0]?.image || 'https://images.pexels.com/photos/4465821/pexels-photo-4465821.jpeg'],
      detailedDescription: `Kit personalizado creado por el usuario con los siguientes productos: ${selectedItems.map(item => `${item.quantity}x ${item.name}`).join(', ')}`,
      stock: 1,
      keyBenefits: ['Kit personalizado', 'Productos seleccionados por ti', 'Rutina completa'],
      featuredIngredients: ['Ingredientes naturales', 'Fórmulas premium'],
      discountPercentage: hasDiscount ? DISCOUNT_PERCENTAGE : 0,
      oldPrice: hasDiscount ? totalPrice : finalPrice,
      items: selectedItems.map(item => ({
        name: item.name,
        quantity: item.quantity
      }))
    };

    addToCart(customKit);
    showSuccess(
      'Kit Agregado',
      `${kitName} fue agregado al carrito con ${totalItems} productos`
    );
    
    // Reset y cerrar
    setSelectedItems([]);
    setKitName('');
    setStep('select');
    onClose();
  };

  const resetKit = () => {
    setSelectedItems([]);
    setKitName('');
    setStep('select');
  };

  if (!isOpen) return null;

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm bg-black/70"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="relative w-full max-w-6xl h-[90vh] bg-white rounded-2xl shadow-2xl overflow-hidden"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <Package className="text-accent" size={28} />
            <div>
              <h2 className="text-2xl font-medium text-primary">Arma tu Kit</h2>
              <p className="text-sm text-content">Creá tu rutina personalizada</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 transition-colors rounded-xl text-primary hover:text-accent"
          >
            <X size={24} />
          </button>
        </div>

        <div className="flex h-full">
          {/* Sidebar - Categories */}
          <div className="w-64 p-6 border-r border-gray-200 bg-gray-50">
            <h3 className="mb-4 font-medium text-primary">Categorías</h3>
            <div className="space-y-2">
              {categories.map(category => (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`w-full p-3 text-left rounded-lg transition-colors ${
                    activeCategory === category.id
                      ? 'bg-accent text-white'
                      : 'hover:bg-gray-200 text-content'
                  }`}
                >
                  <span className="mr-2">{category.icon}</span>
                  {category.name}
                </button>
              ))}
            </div>

            {/* Kit Summary */}
            <div className="mt-6 p-4 bg-white rounded-lg border">
              <h4 className="font-medium text-primary mb-2">Tu Kit</h4>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>Productos:</span>
                  <span>{totalItems}/{MAX_ITEMS}</span>
                </div>
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>${totalPrice}</span>
                </div>
                {hasDiscount && (
                  <div className="flex justify-between text-green-600">
                    <span>Descuento ({DISCOUNT_PERCENTAGE}%):</span>
                    <span>-${discountAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between font-medium text-accent border-t pt-1">
                  <span>Total:</span>
                  <span>${finalPrice.toFixed(2)}</span>
                </div>
              </div>
              
              {!canOrder && (
                <p className="mt-2 text-xs text-red-600">
                  Mínimo: ${MIN_ORDER_AMOUNT}
                </p>
              )}
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 flex flex-col">
            {/* Products Grid */}
            <div className="flex-1 p-6 overflow-y-auto">
              <div className="mb-4">
                <h3 className="text-lg font-medium text-primary">
                  {categories.find(c => c.id === activeCategory)?.name}
                </h3>
                <p className="text-sm text-content">
                  Seleccioná los productos para tu rutina personalizada
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredItems.map(item => {
                  const selectedItem = selectedItems.find(selected => selected.id === item.id);
                  const isSelected = !!selectedItem;
                  
                  return (
                    <motion.div
                      key={item.id}
                      className={`border rounded-lg p-4 transition-all ${
                        isSelected ? 'border-accent bg-accent/5' : 'border-gray-200 hover:border-accent/50'
                      }`}
                      whileHover={{ scale: 1.02 }}
                    >
                      <div className="relative mb-3">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-32 object-cover rounded-lg"
                        />
                        {isSelected && (
                          <div className="absolute top-2 right-2 bg-accent text-white rounded-full p-1">
                            <Check size={16} />
                          </div>
                        )}
                      </div>
                      
                      <h4 className="font-medium text-primary mb-1">{item.name}</h4>
                      <p className="text-sm text-content mb-2">{item.description}</p>
                      
                      <div className="mb-3">
                        <ul className="text-xs text-content space-y-1">
                          {item.benefits.slice(0, 2).map((benefit, idx) => (
                            <li key={idx} className="flex items-center">
                              <Star size={10} className="text-accent mr-1" />
                              {benefit}
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-accent">${item.price}</span>
                        
                        {isSelected ? (
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => updateItemQuantity(item.id, selectedItem.quantity - 1)}
                              className="p-1 rounded-full bg-gray-200 hover:bg-gray-300"
                            >
                              <Minus size={14} />
                            </button>
                            <span className="w-8 text-center">{selectedItem.quantity}</span>
                            <button
                              onClick={() => updateItemQuantity(item.id, selectedItem.quantity + 1)}
                              className="p-1 rounded-full bg-accent text-white hover:bg-supporting"
                              disabled={totalItems >= MAX_ITEMS}
                            >
                              <Plus size={14} />
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => addItemToKit(item)}
                            disabled={totalItems >= MAX_ITEMS}
                            className="px-3 py-1 bg-accent text-white rounded-lg hover:bg-supporting disabled:bg-gray-300 disabled:cursor-not-allowed"
                          >
                            <Plus size={16} />
                          </button>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-gray-200 bg-gray-50">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <input
                    type="text"
                    placeholder="Nombre de tu kit (ej: Mi Rutina Matutina)"
                    value={kitName}
                    onChange={(e) => setKitName(e.target.value)}
                    className="px-4 py-2 border border-gray-200 rounded-lg focus:border-accent focus:ring-1 focus:ring-accent"
                  />
                </div>
                
                <div className="flex space-x-3">
                  <button
                    onClick={resetKit}
                    className="px-4 py-2 border border-gray-300 text-content rounded-lg hover:bg-gray-100"
                  >
                    Limpiar
                  </button>
                  <button
                    onClick={handleAddToCart}
                    disabled={!canOrder || selectedItems.length === 0}
                    className="flex items-center space-x-2 px-6 py-2 bg-accent text-white rounded-lg hover:bg-supporting disabled:bg-gray-300 disabled:cursor-not-allowed"
                  >
                    <ShoppingCart size={18} />
                    <span>Agregar Kit (${finalPrice.toFixed(2)})</span>
                  </button>
                </div>
              </div>
              
              {hasDiscount && (
                <div className="text-center">
                  <p className="text-sm text-green-600 font-medium">
                    🎉 ¡Descuento del {DISCOUNT_PERCENTAGE}% aplicado! Ahorrás ${discountAmount.toFixed(2)}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default KitBuilderModal;
import { useState, useMemo } from 'react';
import { useCart } from './useCart';
import { useToast } from './useToast';
import { availableItems } from '../data/builderData';
import { KitItem, SelectedKitItem } from '../types/builder';
import {
  SUGGESTED_KIT_NAMES,
  MIN_ORDER_AMOUNT,
  MAX_ITEMS,
  DISCOUNT_THRESHOLD,
  DISCOUNT_PERCENTAGE,
  WizardStep,
} from '../components/KitBuilder/constants';

export const useKitBuilder = (onClose: () => void) => {
  const { addToCart } = useCart();
  const { showError } = useToast();

  const [selectedItems, setSelectedItems] = useState<SelectedKitItem[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('limpieza');
  const [kitName, setKitName] = useState('');
  const [step, setStep] = useState<WizardStep>('name');

  const totalPrice = useMemo(() => selectedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0), [selectedItems]);
  const totalItems = useMemo(() => selectedItems.reduce((sum, item) => sum + item.quantity, 0), [selectedItems]);
  const hasDiscount = useMemo(() => totalPrice >= DISCOUNT_THRESHOLD, [totalPrice]);
  const discountAmount = useMemo(() => (hasDiscount ? (totalPrice * DISCOUNT_PERCENTAGE) / 100 : 0), [hasDiscount, totalPrice]);
  const finalPrice = useMemo(() => totalPrice - discountAmount, [totalPrice, discountAmount]);
  const canOrder = useMemo(() => finalPrice >= MIN_ORDER_AMOUNT, [finalPrice]);
  const progress = useMemo(() => Math.min((finalPrice / MIN_ORDER_AMOUNT) * 100, 100), [finalPrice]);

  const filteredItems = useMemo(() => availableItems.filter(item => item.category === activeCategory), [activeCategory]);

  const generateRandomName = () => {
    const randomName = SUGGESTED_KIT_NAMES[Math.floor(Math.random() * SUGGESTED_KIT_NAMES.length)];
    setKitName(randomName);
  };

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

    if (totalItems >= MAX_ITEMS && newQuantity > (selectedItems.find(item => item.id === itemId)?.quantity || 0)) {
        showError('Límite Alcanzado', `Máximo ${MAX_ITEMS} productos por kit`);
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

    const customKit = {
      id: Date.now(),
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
    
    setSelectedItems([]);
    setKitName('');
    setStep('name');
    onClose();
  };

  const nextStep = () => {
    if (step === 'name') setStep('select');
    else if (step === 'select') setStep('customize');
    else if (step === 'customize') setStep('summary');
  };

  const prevStep = () => {
    if (step === 'summary') setStep('customize');
    else if (step === 'customize') setStep('select');
    else if (step === 'select') setStep('name');
  };

  const canContinueFromName = kitName.trim().length > 0;
  const canContinueFromSelect = selectedItems.length > 0 && finalPrice >= MIN_ORDER_AMOUNT;

  return {
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
  };
};
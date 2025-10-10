import { cubicBezier } from "framer-motion";
import { PreMadeKit, KitItem } from "../../types/builder";

export const SUGGESTED_KIT_NAMES = [
  'Mi Rutina Matutina',
  'Kit Glow-Up',
  'Ritual de Belleza',
  'Momento Zen',
  'Piel Radiante',
  'Cuidado Premium',
  'Ritual Nocturno',
  'Esencia Natural',
  'Brillo Interior',
  'Amor Propio',
  'Ritual Sagrado',
  'Piel de Seda',
  'Momento Mágico',
  'Cuidado Divino',
  'Ritual de Luz',
  'Glow Goals',
  'Self-Care Mode',
  'Beauty Vibes',
  'Skin Therapy',
  'Mi kit esencial',
  'Glow Session',
  'Ritual de Belleza',
  'Skin Love',
];

export type WizardStep = 'name' | 'select' | 'customize' | 'summary';

export const WIZARD_STEPS: WizardStep[] = ['name', 'select', 'customize', 'summary'];

// Kit configuration
export const MIN_ORDER_AMOUNT = 12000;
export const MAX_ITEMS = 8;
export const DISCOUNT_THRESHOLD = 20000;
export const DISCOUNT_PERCENTAGE = 10;

export const CATEGORIES = [
  { id: 'limpieza', name: 'Limpieza', icon: '🧼', color: 'bg-blue-50 text-blue-700 border-blue-200' },
  { id: 'hidratacion', name: 'Hidratación', icon: '💧', color: 'bg-cyan-50 text-cyan-700 border-cyan-200' },
  { id: 'tratamiento', name: 'Tratamiento', icon: '✨', color: 'bg-purple-50 text-purple-700 border-purple-200' },
  { id: 'accesorios', name: 'Accesorios', icon: '🛍️', color: 'bg-pink-50 text-pink-700 border-pink-200' }
];

// Full-screen wizard animations - faster and smoother
export const wizardVariants = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: {
      duration: 0.3,
      ease: cubicBezier(0.16, 1, 0.3, 1),
      staggerChildren: 0.05
    }
  },
  exit: {
    opacity: 0,
    transition: {
      duration: 0.2,
      ease: cubicBezier(0.16, 1, 0.3, 1)
    }
  },
};

export const stepVariants = {
  initial: { x: 40, scale: 0.96, opacity: 0 },
  animate: {
    x: 0,
    scale: 1,
    opacity: 1,
    transition: {
      duration: 0.4,
      ease: cubicBezier(0.16, 1, 0.3, 1),
      staggerChildren: 0.06
    }
  },
  exit: {
    opacity: 0,
    x: -40,
    scale: 0.96,
    transition: {
      duration: 0.25,
      ease: cubicBezier(0.16, 1, 0.3, 1)
    }
  },
};

export const itemVariants = {
  initial: { opacity: 0, y: 15 },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
      ease: cubicBezier(0.16, 1, 0.3, 1)
    }
  }
};

export const cardVariants = {
  initial: { opacity: 0, y: 30, scale: 0.96 },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.4,
      ease: cubicBezier(0.16, 1, 0.3, 1)
    }
  },
  hover: {
    y: -10,
    scale: 1.015,
    transition: {
      duration: 0.2,
      ease: cubicBezier(0.16, 1, 0.3, 1)
    }
  },
  tap: { scale: 0.985, transition: { duration: 0.1 } }
};

export const PREMADE_KITS: PreMadeKit[] = [
  {
    id: 'women-essentials',
    name: 'Kit Esencial Mujer',
    gender: 'women',
    description: 'Todo lo que necesitás para tu rutina diaria de cuidado facial',
    price: 12500,
    originalPrice: 15000,
    benefits: [
      'Limpieza profunda diaria',
      'Hidratación intensa 24h',
      'Tratamiento anti-edad',
      'Protección UV',
      'Resultados visibles en 2 semanas'
    ],
    image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?q=80&w=1000&auto=format&fit=crop',
    items: []
  },
  {
    id: 'men-essentials',
    name: 'Kit Esencial Hombre',
    gender: 'men',
    description: 'Cuidado masculino completo para una piel saludable y fresca',
    price: 11000,
    originalPrice: 13500,
    benefits: [
      'Limpieza profunda',
      'Hidratación sin brillo',
      'Post-afeitado reparador',
      'Protección diaria',
      'Fórmulas de rápida absorción'
    ],
    image: 'https://images.unsplash.com/photo-1617897903246-719242758050?q=80&w=1000&auto=format&fit=crop',
    items: []
  }
];
import { cubicBezier } from "framer-motion";

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
export const MIN_ORDER_AMOUNT = 10000;
export const MAX_ITEMS = 8;
export const DISCOUNT_THRESHOLD = 20000;
export const DISCOUNT_PERCENTAGE = 15;

export const CATEGORIES = [
  { id: 'limpieza', name: 'Limpieza', icon: '🧼', color: 'bg-blue-50 text-blue-700 border-blue-200' },
  { id: 'hidratacion', name: 'Hidratación', icon: '💧', color: 'bg-cyan-50 text-cyan-700 border-cyan-200' },
  { id: 'tratamiento', name: 'Tratamiento', icon: '✨', color: 'bg-purple-50 text-purple-700 border-purple-200' },
  { id: 'accesorios', name: 'Accesorios', icon: '🛍️', color: 'bg-pink-50 text-pink-700 border-pink-200' }
];

// Full-screen wizard animations
export const wizardVariants = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: { duration: 0.4, ease: cubicBezier(0.19, 1.12, 0.7, 0.97) }
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.3, ease: cubicBezier(0.19, 1.12, 0.7, 0.97) }
  },
};

export const stepVariants = {
  initial: { x: 60, scale: 0.98 },
  animate: {
    x: 0,
    scale: 1,
    transition: {
      duration: 0.5,
      delay: 0,
      ease: cubicBezier(0.19, 1.12, 0.7, 0.97),
      staggerChildren: 0.1
    }
  },
  exit: {
    opacity: 0,
    x: -60,
    scale: 0.98,
    transition: {
      duration: 0.3,
      ease: cubicBezier(0.19, 1.12, 0.7, 0.97)
    }
  },
};

export const itemVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 }
};
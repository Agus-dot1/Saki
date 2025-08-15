import { KitItem } from "../types/builder";


export const availableItems: KitItem[] = [

  {
    id: 101,
    name: 'Limpiador Facial Suave',
    price: 1400,
    image: 'https://images.unsplash.com/photo-1670201203150-bf8771401590?q=80&w=730&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    category: 'limpieza', 
    description: 'Limpiador suave para todo tipo de piel',
    benefits: ['Elimina impurezas', 'No reseca la piel', '100% natural']
  },
  {
    id: 102,
    name: 'Exfoliante Natural',
    price: 2000, 
    image: 'https://images.unsplash.com/photo-1708907916704-9e04be0a1f51?q=80&w=1467&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    category: 'limpieza',
    description: 'Exfoliante con ingredientes naturales',
    benefits: ['Remueve células muertas', 'Textura suave', 'Ingredientes orgánicos']
  },
  {
    id: 103,
    name: 'Tónico Equilibrante',
    price: 2600, 
    image: 'https://images.unsplash.com/photo-1625753783470-ec2ab4efeeec?q=80&w=764&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    category: 'limpieza',
    description: 'Tónico que equilibra el pH de la piel',
    benefits: ['Equilibra pH', 'Minimiza poros', 'Prepara la piel']
  },

  // Hidratación
  {
    id: 201,
    name: 'Sérum Hidratante',
    price: 4000, 
    image: 'https://images.unsplash.com/photo-1648712787778-1a521521bd1c?q=80&w=816&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    category: 'hidratacion',
    description: 'Sérum concentrado con ácido hialurónico',
    benefits: ['Hidratación profunda', 'Ácido hialurónico', 'Absorción rápida']
  },
  {
    id: 202,
    name: 'Crema Hidratante Día',
    price: 3000, 
    image: 'https://images.unsplash.com/photo-1670201202862-96b9c3d11375?q=80&w=768&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    category: 'hidratacion',
    description: 'Crema hidratante para uso diario',
    benefits: ['Hidratación 24h', 'Protección UV', 'Textura ligera']
  },
  {
    id: 203,
    name: 'Mascarilla Nutritiva',
    price: 3400, 
    image: 'https://images.unsplash.com/photo-1655357443031-d5e0354b56e1?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    category: 'hidratacion',
    description: 'Mascarilla intensiva nutritiva',
    benefits: ['Nutrición intensa', 'Uso semanal', 'Ingredientes premium']
  },

  // Tratamiento
  {
    id: 301,
    name: 'Sérum Anti-edad',
    price: 6000, 
    image: 'https://images.unsplash.com/photo-1729708273852-b63222c8b35d?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    category: 'tratamiento',
    description: 'Sérum concentrado anti-edad',
    benefits: ['Reduce arrugas', 'Firmeza', 'Vitamina C']
  },
  {
    id: 302,
    name: 'Contorno de Ojos',
    price: 4600, 
    image: 'https://images.unsplash.com/photo-1727060665042-ecdc2fea7f25?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    category: 'tratamiento',
    description: 'Tratamiento específico para contorno de ojos',
    benefits: ['Reduce ojeras', 'Anti-bolsas', 'Hidratación específica']
  },

  // Accesorios
  {
    id: 401,
    name: 'Gua Sha Facial',
    price: 2200, 
    image: 'https://images.unsplash.com/photo-1626897844962-a0ef7a37c7a0?q=80&w=735&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    category: 'accesorios',
    description: 'Herramienta de masaje facial Gua Sha',
    benefits: ['Mejora circulación', 'Reduce tensión', 'Cuarzo natural']
  },
  {
    id: 402,
    name: 'Vincha de Spa',
    price: 600, 
    image: 'https://images.unsplash.com/photo-1609357912334-e96886c0212b?q=80&w=764&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    category: 'accesorios',
    description: 'Vincha suave para rutina de cuidado',
    benefits: ['Material suave', 'Mantiene cabello', 'Lavable']
  },
  {
    id: 403,
    name: 'Toalla Facial',
    price: 1400, 
    image: 'https://images.unsplash.com/photo-1731514908704-43ce3a5de4e9?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    category: 'accesorios',
    description: 'Toalla facial de microfibra',
    benefits: ['Microfibra suave', 'Secado rápido', 'Antibacterial']
  }
];